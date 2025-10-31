// Fantasy Map Generator - Realistic Geography Edition
// Strict rules: latitude-based climate, proper water topology, mountain ranges, rain shadow

import { Delaunay } from 'd3-delaunay';
import { createNoise2D } from 'simplex-noise';

/**
 * Generate a realistic fantasy map from a seed
 */
export function generateMap(seed, width = 1200, height = 800, numCells = 800) {
  const random = seededRandom(hashCode(String(seed)));

  // Initialize multiple noise octaves for more natural terrain
  const elevationNoise = createNoise2D(() => random());
  const moistureNoise = createNoise2D(() => random());
  const mountainNoise = createNoise2D(() => random());
  const detailNoise = createNoise2D(() => random());

  // Generate Voronoi points with better distribution (relaxed)
  const points = generateRelaxedPoints(numCells, width, height, random);

  const delaunay = Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, width, height]);

  // STEP 1: Generate base elevation with more natural island bias
  const cells = [];
  for (let i = 0; i < numCells; i++) {
    const [x, y] = points[i];

    // More natural island bias with irregular coastlines
    const nx = x / width - 0.5;
    const ny = y / height - 0.5;
    const distanceFromCenter = Math.sqrt(nx * nx + ny * ny);

    // Use noise to make irregular coastlines instead of perfect circle
    const coastalNoise = elevationNoise(nx * 3, ny * 3) * 0.3;
    const islandBias = Math.pow(distanceFromCenter * 1.8, 1.5) - coastalNoise;

    // Multi-octave elevation with better scaling
    const elevation = (
      elevationNoise(x * 0.0015, y * 0.0015) * 0.4 +      // Large features (continents)
      elevationNoise(x * 0.005, y * 0.005) * 0.25 +        // Medium features (regions)
      elevationNoise(x * 0.015, y * 0.015) * 0.15 +        // Small features (hills)
      detailNoise(x * 0.04, y * 0.04) * 0.1 +              // Fine details
      detailNoise(x * 0.08, y * 0.08) * 0.05               // Very fine details
    ) - islandBias * 0.7;

    const polygon = voronoi.cellPolygon(i);

    cells.push({
      id: i,
      x, y,
      elevation,
      temperature: 0, // Will calculate based on latitude
      moisture: 0,    // Will calculate based on water proximity
      biome: 'ocean',
      isOcean: false,
      isLake: false,
      isMountain: false,
      polygon,
      neighbors: Array.from(delaunay.neighbors(i))
    });
  }

  // STEP 2: Identify ocean vs land
  const waterLevel = -0.05;
  cells.forEach(cell => {
    cell.isOcean = cell.elevation < waterLevel;
  });

  // STEP 3: Remove single-cell islands (too small)
  cells.forEach(cell => {
    if (!cell.isOcean) {
      const landNeighbors = cell.neighbors.filter(nId => !cells[nId].isOcean);
      if (landNeighbors.length === 0) {
        cell.isOcean = true; // Convert isolated land to ocean
        cell.elevation = waterLevel - 0.1;
      }
    }
  });

  // STEP 4: Identify lakes (water surrounded by land, not touching ocean)
  cells.forEach(cell => {
    if (cell.elevation < 0 && cell.elevation >= waterLevel && !cell.isOcean) {
      // Check if completely landlocked
      const touchesOcean = cell.neighbors.some(nId => cells[nId].isOcean);
      if (!touchesOcean) {
        cell.isLake = true;
      } else {
        // If touches ocean, convert to land (prevent lake-ocean connection)
        cell.elevation = 0.02;
      }
    }
  });

  // STEP 5: Create mountain ranges (connected high elevation areas)
  const mountainThreshold = 0.4;
  cells.forEach(cell => {
    if (cell.isOcean || cell.isLake) return;

    const mountainValue = (
      mountainNoise(cell.x * 0.005, cell.y * 0.005) * 0.7 +
      mountainNoise(cell.x * 0.015, cell.y * 0.015) * 0.3
    );

    if (cell.elevation > mountainThreshold && mountainValue > 0.3) {
      cell.isMountain = true;
      cell.elevation = Math.max(cell.elevation, 0.6);
    }
  });

  // Expand mountains to create ranges (connected groups)
  for (let pass = 0; pass < 2; pass++) {
    cells.forEach(cell => {
      if (cell.isOcean || cell.isLake || cell.isMountain) return;
      const mountainNeighbors = cell.neighbors.filter(nId => cells[nId].isMountain).length;
      if (mountainNeighbors >= 2 && cell.elevation > 0.35) {
        cell.isMountain = true;
        cell.elevation = Math.max(cell.elevation, 0.5);
      }
    });
  }

  // STEP 6: Calculate temperature based on latitude (y-position)
  // North (y=0) = cold, South (y=height) = warm
  cells.forEach(cell => {
    const latitude = cell.y / height; // 0 (north) to 1 (south)

    // Base temperature: -1 (arctic north) to +1 (tropical south)
    let temp = -1 + latitude * 2;

    // Elevation reduces temperature (-0.15 per elevation unit)
    temp -= cell.elevation * 0.15;

    // Mountains are colder
    if (cell.isMountain) temp -= 0.3;

    cell.temperature = temp;
  });

  // STEP 7: Calculate moisture
  // High near coast/lakes/rivers, low inland and in rain shadow
  cells.forEach(cell => {
    let moisture = moistureNoise(cell.x * 0.004, cell.y * 0.004);

    // Coastal moisture boost
    const coastalDistance = getDistanceToCoast(cell, cells);
    if (coastalDistance < 5) {
      moisture += 0.5 - coastalDistance * 0.1;
    }

    // Lake moisture boost
    const hasLakeNeighbor = cell.neighbors.some(nId => cells[nId].isLake);
    if (hasLakeNeighbor) moisture += 0.3;

    cell.moisture = moisture;
  });

  // STEP 8: Apply rain shadow (reduce moisture behind mountains)
  // Prevailing wind from west (left to right)
  cells.forEach(cell => {
    if (cell.isOcean || cell.isLake) return;

    // Check if there's a mountain to the west (upwind)
    const westNeighbors = cell.neighbors.filter(nId => {
      const n = cells[nId];
      return n.x < cell.x && n.isMountain;
    });

    if (westNeighbors.length > 0) {
      cell.moisture -= 0.4; // Rain shadow effect
    }
  });

  // STEP 9: Generate rivers (merge, flow to ocean, deltas)
  const rivers = generateRealisticRivers(cells, random);

  // River moisture boost
  rivers.forEach(river => {
    river.path.forEach(cellId => {
      if (cells[cellId]) cells[cellId].moisture += 0.2;
    });
  });

  // STEP 10: Assign biomes based on temperature × moisture matrix
  cells.forEach(cell => {
    cell.biome = getBiomeRealistic(cell);
  });

  // STEP 11: Smooth biome transitions (avoid hard jumps)
  for (let pass = 0; pass < 2; pass++) {
    cells.forEach(cell => {
      if (cell.isOcean || cell.isLake) return;

      const neighborBiomes = cell.neighbors.map(nId => cells[nId].biome);
      const incompatible = checkIncompatibleBiomes(cell.biome, neighborBiomes);

      if (incompatible) {
        // Smooth to intermediate biome
        cell.biome = getIntermediateBiome(cell.temperature, cell.moisture);
      }
    });
  }

  // STEP 12: Add beaches only at shallow coasts
  cells.forEach(cell => {
    if (cell.isOcean || cell.isLake) return;

    const touchesOcean = cell.neighbors.some(nId => cells[nId].isOcean);
    if (touchesOcean && cell.elevation < 0.1 && cell.temperature > -0.3) {
      cell.biome = 'beach';
    }
  });

  return {
    width,
    height,
    numCells,
    seed,
    cells,
    rivers,
    voronoi: {
      points,
      delaunay: {
        points: delaunay.points,
        halfedges: delaunay.halfedges,
        hull: delaunay.hull,
        triangles: delaunay.triangles
      }
    }
  };
}

/**
 * Get distance to nearest coast (in cell hops)
 */
function getDistanceToCoast(cell, cells) {
  const queue = [cell.id];
  const visited = new Set([cell.id]);
  let distance = 0;

  while (queue.length > 0 && distance < 10) {
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const currentId = queue.shift();
      const current = cells[currentId];

      // Check if coastal
      const touchesOcean = current.neighbors.some(nId => cells[nId].isOcean);
      if (touchesOcean) return distance;

      // Add neighbors
      current.neighbors.forEach(nId => {
        if (!visited.has(nId) && !cells[nId].isOcean) {
          visited.add(nId);
          queue.push(nId);
        }
      });
    }

    distance++;
  }

  return 10; // Max distance
}

/**
 * Generate realistic rivers with merging and deltas
 */
function generateRealisticRivers(cells, random, numRivers = 20) {
  const rivers = [];

  // Find mountain/highland sources
  const sources = cells
    .filter(c => !c.isOcean && !c.isLake && c.elevation > 0.5)
    .sort((a, b) => b.elevation - a.elevation)
    .slice(0, numRivers * 2); // More sources than final rivers

  const riverMap = new Map(); // cellId -> riverId

  sources.forEach((source, idx) => {
    const river = { id: idx, path: [source.id], delta: false };
    let current = source;
    const visited = new Set([source.id]);

    for (let step = 0; step < 300; step++) {
      // Check if reached ocean or existing river
      if (current.isOcean) {
        river.delta = true; // River ends at ocean
        rivers.push(river);
        river.path.forEach(cId => riverMap.set(cId, river.id));
        break;
      }

      // Check if merged with existing river
      if (riverMap.has(current.id)) {
        const existingRiverId = riverMap.get(current.id);
        const existingRiver = rivers.find(r => r.id === existingRiverId);
        if (existingRiver) {
          // Merge into existing river (don't create separate)
          break;
        }
      }

      // Find lowest neighbor
      const validNeighbors = current.neighbors
        .filter(nId => !visited.has(nId))
        .map(nId => cells[nId]);

      if (validNeighbors.length === 0) break;

      const next = validNeighbors.reduce((lowest, n) =>
        n.elevation < lowest.elevation ? n : lowest
      );

      // Rivers don't flow uphill (check for local minima)
      if (next.elevation >= current.elevation && !next.isOcean) {
        break;
      }

      river.path.push(next.id);
      visited.add(next.id);
      current = next;
    }

    // Only keep rivers that reach ocean and are long enough
    if (river.delta && river.path.length > 8) {
      rivers.push(river);
      river.path.forEach(cId => riverMap.set(cId, river.id));
    }
  });

  // Remove duplicate rivers, keep longest
  return rivers.filter((r, idx) => rivers.findIndex(r2 => r2.id === r.id) === idx);
}

/**
 * Realistic biome assignment based on temperature × moisture
 */
function getBiomeRealistic(cell) {
  if (cell.isOcean) return 'ocean';
  if (cell.isLake) return 'lake';

  const t = cell.temperature;
  const m = cell.moisture;

  // Snow/Ice (very cold)
  if (t < -0.7) return 'snow';

  // Tundra (cold, any moisture)
  if (t < -0.3) return 'tundra';

  // Taiga (cold to cool, moderate moisture)
  if (t < 0.0) {
    if (m < -0.2) return 'tundra';
    return 'taiga';
  }

  // Mountain (high elevation, cool)
  if (cell.isMountain) {
    if (t < -0.2) return 'snow';
    if (t < 0.3) return 'mountain';
    return 'mountain';
  }

  // Temperate zone
  if (t < 0.5) {
    if (m < -0.4) return 'desert';
    if (m < -0.1) return 'grassland';
    if (m < 0.3) return 'grassland';
    return 'forest';
  }

  // Warm/Tropical zone
  if (m < -0.3) return 'desert';
  if (m < 0.0) return 'grassland';
  return 'forest';
}

/**
 * Get intermediate biome for smooth transitions
 */
function getIntermediateBiome(temp, moisture) {
  // Default to grassland as neutral biome
  if (temp < -0.5) return 'tundra';
  if (temp < 0.0) return 'taiga';
  if (moisture < -0.2) return 'grassland';
  return 'grassland';
}

/**
 * Check if biome has incompatible neighbors (avoid hard jumps)
 */
function checkIncompatibleBiomes(biome, neighborBiomes) {
  const incompatible = {
    'snow': ['desert', 'forest', 'grassland'],
    'desert': ['snow', 'tundra', 'taiga'],
    'tundra': ['desert', 'forest'],
  };

  if (!incompatible[biome]) return false;

  return neighborBiomes.some(nb => incompatible[biome].includes(nb));
}

/**
 * Generate relaxed Voronoi points (Lloyd's algorithm)
 * Makes cells more uniform in size - looks more natural
 */
function generateRelaxedPoints(numCells, width, height, random, relaxIterations = 2) {
  // Start with random points
  let points = [];
  for (let i = 0; i < numCells; i++) {
    points.push([random() * width, random() * height]);
  }

  // Lloyd relaxation: move points to centroids
  for (let iter = 0; iter < relaxIterations; iter++) {
    const delaunay = Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    const newPoints = [];
    for (let i = 0; i < numCells; i++) {
      const polygon = voronoi.cellPolygon(i);
      if (!polygon) {
        newPoints.push(points[i]);
        continue;
      }

      // Calculate centroid
      let cx = 0, cy = 0;
      for (let j = 0; j < polygon.length; j++) {
        cx += polygon[j][0];
        cy += polygon[j][1];
      }
      cx /= polygon.length;
      cy /= polygon.length;

      // Clamp to bounds
      cx = Math.max(0, Math.min(width, cx));
      cy = Math.max(0, Math.min(height, cy));

      newPoints.push([cx, cy]);
    }

    points = newPoints;
  }

  return points;
}

/**
 * Seeded random (Mulberry32)
 */
function seededRandom(seed) {
  return function() {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Hash string to number
 */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Biome colors (Azgaar-inspired - natural, muted tones)
 */
export function getBiomeColor(biome) {
  const colors = {
    ocean: '#85b3d1',      // Soft ocean blue
    lake: '#a3c4d9',       // Calm lake blue
    beach: '#eddcbb',      // Natural sand
    desert: '#e0c9a0',     // Warm desert tan
    grassland: '#c5d99e',  // Fresh grassland green
    forest: '#8ba888',     // Rich forest green
    taiga: '#9ba896',      // Cool taiga grey-green
    tundra: '#bac4ba',     // Cold tundra grey
    snow: '#f0f0f0',       // Pure snow white
    mountain: '#b5a895'    // Rocky mountain grey-brown
  };
  return colors[biome] || '#d0d0d0';
}
