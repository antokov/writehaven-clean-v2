// Heightmap-based Fantasy Map Generator
// More natural looking than Voronoi cells - uses elevation data and smooth gradients

import { createNoise2D } from 'simplex-noise';

/**
 * Generate a heightmap-based fantasy map
 */
export function generateHeightmap(seed, width = 1200, height = 800) {
  const random = seededRandom(hashCode(String(seed)));

  // Create noise functions
  const elevationNoise = createNoise2D(() => random());
  const moistureNoise = createNoise2D(() => random());
  const temperatureNoise = createNoise2D(() => random());

  // Generate heightmap (2D array of elevation values)
  const resolution = 2; // pixels per sample point (lower = higher detail)
  const mapWidth = Math.floor(width / resolution);
  const mapHeight = Math.floor(height / resolution);

  const heightmap = [];
  const moisturemap = [];
  const temperaturemap = [];

  for (let y = 0; y < mapHeight; y++) {
    const heightRow = [];
    const moistureRow = [];
    const tempRow = [];

    for (let x = 0; x < mapWidth; x++) {
      // Normalize coordinates
      const nx = x / mapWidth;
      const ny = y / mapHeight;

      // Island shape (circular falloff from center)
      const dx = nx - 0.5;
      const dy = ny - 0.5;
      const distFromCenter = Math.sqrt(dx * dx + dy * dy) * 2;

      // Multi-octave noise for natural terrain
      let elevation = 0;
      elevation += elevationNoise(nx * 3, ny * 3) * 0.5;        // Continents
      elevation += elevationNoise(nx * 6, ny * 6) * 0.25;       // Regions
      elevation += elevationNoise(nx * 12, ny * 12) * 0.125;    // Hills
      elevation += elevationNoise(nx * 24, ny * 24) * 0.0625;   // Details

      // Apply island falloff with some noise for irregular coasts
      const coastalNoise = elevationNoise(nx * 5, ny * 5) * 0.2;
      elevation -= Math.pow(distFromCenter, 2.5) * 0.8 - coastalNoise;

      heightRow.push(elevation);

      // Moisture (high near coasts, low inland)
      let moisture = moistureNoise(nx * 8, ny * 8);
      moistureRow.push(moisture);

      // Temperature (based on latitude - warmer at equator)
      const latitude = Math.abs(ny - 0.5) * 2; // 0 at equator, 1 at poles
      let temp = 1 - latitude + temperatureNoise(nx * 6, ny * 6) * 0.3;
      tempRow.push(temp);
    }

    heightmap.push(heightRow);
    moisturemap.push(moistureRow);
    temperaturemap.push(tempRow);
  }

  // Post-process: detect water level
  const waterLevel = 0.0;

  // Generate states using flood-fill on land areas
  const states = generateStatesFromHeightmap(heightmap, waterLevel, random, 8, 15);

  return {
    width,
    height,
    resolution,
    mapWidth,
    mapHeight,
    heightmap,
    moisturemap,
    temperaturemap,
    waterLevel,
    states,
    seed
  };
}

/**
 * Generate states by flood-filling land regions
 */
function generateStatesFromHeightmap(heightmap, waterLevel, random, minStates = 8, maxStates = 15) {
  const height = heightmap.length;
  const width = heightmap[0].length;

  const numStates = Math.floor(random() * (maxStates - minStates + 1)) + minStates;

  // Find land pixels
  const landPixels = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (heightmap[y][x] > waterLevel) {
        landPixels.push({ x, y });
      }
    }
  }

  if (landPixels.length === 0) return [];

  // Pick random capitals
  const capitals = [];
  for (let i = 0; i < numStates && landPixels.length > 0; i++) {
    const idx = Math.floor(random() * landPixels.length);
    capitals.push(landPixels[idx]);
    landPixels.splice(idx, 1);
  }

  // Create state map (which state owns each pixel)
  const stateMap = Array(height).fill(null).map(() => Array(width).fill(-1));

  // Initialize with capitals
  capitals.forEach((capital, stateId) => {
    stateMap[capital.y][capital.x] = stateId;
  });

  // Flood fill with randomness for organic borders
  const queue = capitals.map((capital, stateId) => ({ ...capital, stateId }));

  while (queue.length > 0) {
    const { x, y, stateId } = queue.shift();

    // Check 4 neighbors
    const neighbors = [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 }
    ];

    for (const n of neighbors) {
      if (n.x < 0 || n.x >= width || n.y < 0 || n.y >= height) continue;
      if (heightmap[n.y][n.x] <= waterLevel) continue; // Skip water
      if (stateMap[n.y][n.x] !== -1) continue; // Already claimed

      // 75% chance to expand (creates irregular borders)
      if (random() < 0.75) {
        stateMap[n.y][n.x] = stateId;
        queue.push({ x: n.x, y: n.y, stateId });
      }
    }
  }

  // Fill remaining unclaimed land pixels (assign to nearest state)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (heightmap[y][x] > waterLevel && stateMap[y][x] === -1) {
        // Find nearest claimed pixel via BFS
        const visited = new Set();
        const q = [{ x, y }];
        visited.add(`${x},${y}`);

        while (q.length > 0) {
          const current = q.shift();

          const neighbors = [
            { x: current.x - 1, y: current.y },
            { x: current.x + 1, y: current.y },
            { x: current.x, y: current.y - 1 },
            { x: current.x, y: current.y + 1 }
          ];

          for (const n of neighbors) {
            if (n.x < 0 || n.x >= width || n.y < 0 || n.y >= height) continue;

            const key = `${n.x},${n.y}`;
            if (visited.has(key)) continue;

            if (stateMap[n.y][n.x] !== -1) {
              stateMap[y][x] = stateMap[n.y][n.x];
              q.length = 0; // Clear queue
              break;
            }

            visited.add(key);
            q.push(n);
          }
        }
      }
    }
  }

  // Build state objects
  const states = [];
  for (let i = 0; i < numStates; i++) {
    const color = getStateColor(i, random);
    const name = generateStateName(i, random);

    states.push({
      id: i,
      name,
      color,
      capital: capitals[i]
    });
  }

  return states;
}

/**
 * Generate state name
 */
function generateStateName(id, random) {
  const prefixes = ['North', 'South', 'East', 'West', 'New', 'Old', 'Great', 'High'];
  const roots = ['Aria', 'Thal', 'Dor', 'Kal', 'Mer', 'Val', 'Tor', 'Lan', 'Fel', 'Bor', 'Eth', 'Mor'];
  const suffixes = ['ia', 'and', 'or', 'en', 'is', 'os', 'um', 'ar', 'ia', 'land'];

  const usePrefix = random() < 0.3;
  const root = roots[Math.floor(random() * roots.length)];
  const suffix = suffixes[Math.floor(random() * suffixes.length)];

  if (usePrefix) {
    const prefix = prefixes[Math.floor(random() * prefixes.length)];
    return `${prefix} ${root}${suffix}`;
  }

  return `${root}${suffix}`;
}

/**
 * Generate distinct state colors
 */
function getStateColor(id, random) {
  const hue = (id * 137.5 + random() * 30) % 360;
  const saturation = 50 + random() * 20;
  const lightness = 55 + random() * 15;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Get terrain color based on elevation, moisture, temperature
 */
export function getTerrainColor(elevation, moisture, temperature, waterLevel) {
  // Water
  if (elevation <= waterLevel) {
    const depth = waterLevel - elevation;
    if (depth > 0.3) return '#3a5f7d'; // Deep ocean
    if (depth > 0.15) return '#4a7ba7'; // Ocean
    return '#5a8db8'; // Shallow water
  }

  // Land
  const height = elevation - waterLevel;

  // Snow (very high or very cold)
  if (height > 0.6 || (temperature < 0.2 && height > 0.3)) {
    return '#f0f0f0';
  }

  // Mountains
  if (height > 0.45) {
    return '#8b7355';
  }

  // Based on temperature and moisture
  if (temperature < 0.3) {
    // Cold regions
    if (moisture > 0.3) return '#a8b5a5'; // Taiga
    return '#bac4ba'; // Tundra
  }

  if (temperature < 0.6) {
    // Temperate
    if (moisture > 0.4) return '#7a9b6f'; // Forest
    if (moisture > 0) return '#b8c795'; // Grassland
    return '#d4c4a0'; // Dry plains
  }

  // Warm/tropical
  if (moisture > 0.5) return '#6b8e5f'; // Jungle
  if (moisture > 0.1) return '#a8b878'; // Savanna
  return '#d4b896'; // Desert
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
