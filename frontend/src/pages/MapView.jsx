import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { generateMap, getBiomeColor } from '../utils/mapGenerator';
import '../styles/mapview.css';

export default function MapView() {
  const { id: projectId } = useParams();
  const { t } = useTranslation();
  const [seed, setSeed] = useState('');
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);
  const svgRef = useRef(null);

  // Load existing map on mount
  useEffect(() => {
    loadMap();
  }, [projectId]);

  async function loadMap() {
    try {
      setLoading(true);
      const res = await axios.get(`/api/projects/${projectId}/map`);
      if (res.data) {
        setSeed(res.data.seed);
        setMapData(res.data.data);
        setLastSaved(res.data.updated_at);
      }
    } catch (err) {
      console.error('Failed to load map:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    if (!seed.trim()) {
      setError(t('map.errors.generateFailed'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Generate large map with many cells for detailed zoom
      // Increased size: 2400x1600, increased cells: 1200 for detailed terrain
      const generated = generateMap(seed, 2400, 1600, 1200);
      setMapData(generated);

      // Auto-save
      await saveMap(generated);
    } catch (err) {
      console.error('Map generation failed:', err);
      setError(t('map.errors.generateFailed'));
    } finally {
      setLoading(false);
    }
  }

  async function saveMap(dataToSave = mapData) {
    if (!dataToSave) return;

    try {
      setSaving(true);
      await axios.post(`/api/projects/${projectId}/map`, {
        seed,
        width: dataToSave.width,
        height: dataToSave.height,
        num_cells: dataToSave.numCells,
        data: dataToSave
      });
      setLastSaved(new Date().toISOString());
    } catch (err) {
      console.error('Failed to save map:', err);
      setError(t('map.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  }

  function exportSVG() {
    if (!svgRef.current) return;

    const svgData = svgRef.current.outerHTML;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `map-${seed}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportJSON() {
    if (!mapData) return;

    const json = JSON.stringify(mapData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `map-${seed}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page-wrap map-page">
      {/* Left Sidebar - Controls */}
      <aside className="side">
        <div className="panel" style={{ marginBottom: '1rem' }}>
          <h3 className="panel-title">{t('map.generateNew')}</h3>

          <div className="form-group">
            <label className="label">{t('map.seedLabel')}</label>
            <input
              type="text"
              value={seed}
              onChange={e => setSeed(e.target.value)}
              placeholder={t('map.seedPlaceholder')}
              className="input"
            />
            <small className="hint">{t('map.seedHint')}</small>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !seed.trim()}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {loading ? t('map.generating') : t('map.generate')}
          </button>

          {error && <div className="error-message" style={{ marginTop: '0.5rem' }}>{error}</div>}
        </div>

        <div className="panel">
          <h3 className="panel-title">{t('map.export')}</h3>

          <button
            onClick={exportSVG}
            disabled={!mapData}
            className="btn btn-secondary"
            style={{ width: '100%', marginBottom: '0.5rem' }}
          >
            {t('map.exportSvg')}
          </button>

          <button
            onClick={exportJSON}
            disabled={!mapData}
            className="btn btn-secondary"
            style={{ width: '100%', marginBottom: '0.5rem' }}
          >
            {t('map.exportJson')}
          </button>

          <button
            onClick={() => saveMap()}
            disabled={!mapData || saving}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {saving ? t('map.saving') : t('map.save')}
          </button>

          {lastSaved && (
            <small className="hint" style={{ display: 'block', marginTop: '0.5rem' }}>
              {t('map.lastSaved', { time: new Date(lastSaved).toLocaleString() })}
            </small>
          )}
        </div>

        {/* States Legend */}
        {mapData && mapData.states && mapData.states.length > 0 && (
          <div className="panel" style={{ marginTop: '1rem' }}>
            <h3 className="panel-title">{t('map.states.title') || 'States'}</h3>
            <div className="biome-legend">
              {mapData.states.map(state => (
                <div key={state.id} className="biome-item">
                  <span
                    className="biome-color"
                    style={{ backgroundColor: state.color }}
                  ></span>
                  <span className="biome-label">{state.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content - Map Canvas */}
      <main className="main">
        <div className="panel map-canvas-container">
          {loading && !mapData && (
            <div className="map-placeholder">
              <div className="spinner"></div>
              <p>{t('map.generating')}</p>
            </div>
          )}

          {!loading && !mapData && (
            <div className="map-placeholder">
              <p>{t('map.noMap')}</p>
              <p>{t('map.generateFirst')}</p>
            </div>
          )}

          {mapData && (
            <MapRenderer mapData={mapData} ref={svgRef} />
          )}
        </div>
      </main>
    </div>
  );
}

// Helper function to extract and connect coastline edges into smooth paths
// Uses Azgaar's technique: adds intermediate points for natural coastlines
function extractCoastlines(cells) {
  const coastlineEdges = [];
  const edgeMap = new Map(); // Map from point to edges

  // Step 1: Collect all coastline edges (land-water boundaries) and add intermediate points
  cells.forEach(cell => {
    if (!cell.polygon || cell.isOcean || cell.isLake) return;

    for (let i = 0; i < cell.polygon.length; i++) {
      const p1 = cell.polygon[i];
      const p2 = cell.polygon[(i + 1) % cell.polygon.length];

      // Check if this edge borders water
      const bordersWater = cell.neighbors.some(nId => {
        const neighbor = cells[nId];
        if (!neighbor || !neighbor.polygon) return false;
        if (!neighbor.isOcean && !neighbor.isLake) return false;

        // Check if neighbor shares this edge
        return neighbor.polygon.some(np =>
          Math.abs(np[0] - p1[0]) < 0.1 && Math.abs(np[1] - p1[1]) < 0.1
        ) && neighbor.polygon.some(np =>
          Math.abs(np[0] - p2[0]) < 0.1 && Math.abs(np[1] - p2[1]) < 0.1
        );
      });

      if (bordersWater) {
        // Azgaar technique: Add intermediate points along coastline edges
        // Add 2-3 points between each edge for smoother curves
        const numIntermediatePoints = 2;
        const edgePoints = [p1];

        for (let j = 1; j <= numIntermediatePoints; j++) {
          const t = j / (numIntermediatePoints + 1);

          // Linear interpolation with small random swing for natural variation
          const randomSwing = (Math.random() - 0.5) * 5;
          const perpX = -(p2[1] - p1[1]);
          const perpY = p2[0] - p1[0];
          const perpLen = Math.sqrt(perpX * perpX + perpY * perpY);

          const intermediatePoint = [
            p1[0] * (1 - t) + p2[0] * t + (perpX / perpLen) * randomSwing,
            p1[1] * (1 - t) + p2[1] * t + (perpY / perpLen) * randomSwing
          ];

          edgePoints.push(intermediatePoint);
        }

        edgePoints.push(p2);

        // Add all segments between consecutive points
        for (let j = 0; j < edgePoints.length - 1; j++) {
          const seg1 = edgePoints[j];
          const seg2 = edgePoints[j + 1];

          coastlineEdges.push({ p1: seg1, p2: seg2 });

          // Build edge connectivity map
          const key1 = `${seg1[0].toFixed(1)},${seg1[1].toFixed(1)}`;
          const key2 = `${seg2[0].toFixed(1)},${seg2[1].toFixed(1)}`;

          if (!edgeMap.has(key1)) edgeMap.set(key1, []);
          if (!edgeMap.has(key2)) edgeMap.set(key2, []);

          edgeMap.get(key1).push({ point: seg2, edge: { p1: seg1, p2: seg2 } });
          edgeMap.get(key2).push({ point: seg1, edge: { p1: seg1, p2: seg2 } });
        }
      }
    }
  });

  // Step 2: Connect edges into continuous paths
  const coastlinePaths = [];
  const visitedEdges = new Set();

  coastlineEdges.forEach(startEdge => {
    const edgeKey = `${startEdge.p1[0]},${startEdge.p1[1]}-${startEdge.p2[0]},${startEdge.p2[1]}`;
    if (visitedEdges.has(edgeKey)) return;

    const path = [startEdge.p1, startEdge.p2];
    visitedEdges.add(edgeKey);

    let currentPoint = startEdge.p2;
    let found = true;

    // Follow the path until we can't find more connections
    while (found && path.length < 1000) {
      found = false;
      const key = `${currentPoint[0].toFixed(1)},${currentPoint[1].toFixed(1)}`;
      const connections = edgeMap.get(key) || [];

      for (const conn of connections) {
        const connEdgeKey = `${Math.min(currentPoint[0], conn.point[0])},${Math.min(currentPoint[1], conn.point[1])}-${Math.max(currentPoint[0], conn.point[0])},${Math.max(currentPoint[1], conn.point[1])}`;

        if (!visitedEdges.has(connEdgeKey)) {
          path.push(conn.point);
          visitedEdges.add(connEdgeKey);
          currentPoint = conn.point;
          found = true;
          break;
        }
      }
    }

    if (path.length > 2) {
      coastlinePaths.push(path);
    }
  });

  return coastlinePaths;
}

// Map Renderer Component with zoom/pan
const MapRenderer = React.forwardRef(({ mapData }, ref) => {
  if (!mapData || !mapData.cells) return null;

  const containerRef = useRef(null);
  // Start with 0.5 zoom for large map to fit in viewport
  const [zoom, setZoom] = useState(0.5);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { width, height, cells, rivers } = mapData;

  // Extract smooth coastline paths
  const coastlinePaths = React.useMemo(() => extractCoastlines(cells), [cells]);

  // Zoom with mouse wheel
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(Math.max(0.5, zoom + delta), 5);
    setZoom(newZoom);
  }, [zoom]);

  // Pan with mouse drag
  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Reset view to initial zoom for large map
  const handleReset = useCallback(() => {
    setZoom(0.5);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Separate cells by type for layered rendering
  const oceanCells = cells.filter(c => c.isOcean);
  const lakeCells = cells.filter(c => c.isLake);
  const coastCells = cells.filter(c => {
    if (c.isOcean || c.isLake) return false;
    return c.neighbors.some(nId => cells[nId].isOcean);
  });
  const mountainCells = cells.filter(c => c.isMountain);
  const landCells = cells.filter(c => !c.isOcean && !c.isLake);

  // Get states from mapData
  const { states = [] } = mapData;

  return (
    <div
      ref={containerRef}
      className="map-canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      {/* Zoom Controls */}
      <div className="map-controls">
        <button onClick={() => setZoom(Math.min(zoom + 0.2, 5))} title="Zoom In">+</button>
        <button onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))} title="Zoom Out">−</button>
        <button onClick={handleReset} title="Reset View">⟲</button>
        <span className="zoom-level">{Math.round(zoom * 100)}%</span>
      </div>

      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        className="fantasy-map"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <title>Fantasy Map</title>

      {/* Layer 1: Ocean (no visible cell borders) */}
      <g id="ocean" className="layer-ocean">
        {oceanCells.map(cell => {
          if (!cell.polygon) return null;
          const pathData = `M${cell.polygon.map(p => p.join(',')).join('L')}Z`;
          return (
            <path
              key={`ocean-${cell.id}`}
              d={pathData}
              fill={getBiomeColor('ocean')}
              stroke="none"
            />
          );
        })}
      </g>

      {/* Layer 2: Lakes */}
      <g id="lakes" className="layer-lakes">
        {lakeCells.map(cell => {
          if (!cell.polygon) return null;
          const pathData = `M${cell.polygon.map(p => p.join(',')).join('L')}Z`;
          return (
            <path
              key={`lake-${cell.id}`}
              d={pathData}
              fill={getBiomeColor('lake')}
              stroke="#3a3a3a"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
          );
        })}
      </g>

      {/* Layer 3: States (political territories) */}
      <g id="states" className="layer-states">
        {states.map(state => {
          // Render all cells belonging to this state
          return state.cells.map(cellId => {
            const cell = cells[cellId];
            if (!cell || !cell.polygon) return null;
            const pathData = `M${cell.polygon.map(p => p.join(',')).join('L')}Z`;
            return (
              <path
                key={`state-${state.id}-cell-${cellId}`}
                d={pathData}
                fill={state.color}
                stroke="none"
              />
            );
          });
        })}
      </g>

      {/* Layer 3b: State Borders (smooth curves between different states) */}
      <g id="state-borders" className="layer-state-borders">
        {states.map(state => {
          // Collect all border points in order
          const borderPoints = [];
          const visited = new Set();

          state.cells.forEach(cellId => {
            const cell = cells[cellId];
            if (!cell || !cell.polygon) return;

            // Check each edge of the polygon
            for (let i = 0; i < cell.polygon.length; i++) {
              const p1 = cell.polygon[i];
              const p2 = cell.polygon[(i + 1) % cell.polygon.length];

              // Find which neighbor shares this edge
              const neighborId = cell.neighbors.find(nId => {
                const neighbor = cells[nId];
                if (!neighbor || !neighbor.polygon) return false;

                // Check if neighbor's polygon contains both points
                return neighbor.polygon.some(np =>
                  Math.abs(np[0] - p1[0]) < 0.1 && Math.abs(np[1] - p1[1]) < 0.1
                ) && neighbor.polygon.some(np =>
                  Math.abs(np[0] - p2[0]) < 0.1 && Math.abs(np[1] - p2[1]) < 0.1
                );
              });

              const neighbor = neighborId !== undefined ? cells[neighborId] : null;

              // Only draw border if neighbor is different state or water
              if (!neighbor || neighbor.isOcean || neighbor.isLake || neighbor.stateId !== state.id) {
                const key = `${Math.min(p1[0], p2[0])},${Math.min(p1[1], p2[1])}-${Math.max(p1[0], p2[0])},${Math.max(p1[1], p2[1])}`;
                if (!visited.has(key)) {
                  visited.add(key);
                  borderPoints.push(p1, p2);
                }
              }
            }
          });

          // Create smooth path from border points (simplified - no full path tracing)
          if (borderPoints.length < 4) return null;

          // Sample every few points to create a simpler path
          const sampledPoints = [];
          for (let i = 0; i < borderPoints.length; i += 2) {
            sampledPoints.push(borderPoints[i]);
          }

          if (sampledPoints.length < 2) return null;

          // Create smooth curve using quadratic bezier
          let pathData = `M${sampledPoints[0][0]},${sampledPoints[0][1]}`;

          for (let i = 1; i < sampledPoints.length - 1; i++) {
            const prev = sampledPoints[i - 1];
            const curr = sampledPoints[i];
            const next = sampledPoints[i + 1];

            // Control point is the current point
            const cpx = curr[0];
            const cpy = curr[1];

            pathData += ` Q${cpx},${cpy} ${(curr[0] + next[0]) / 2},${(curr[1] + next[1]) / 2}`;
          }

          // Line to last point
          const last = sampledPoints[sampledPoints.length - 1];
          pathData += ` L${last[0]},${last[1]}`;

          return (
            <path
              key={`border-${state.id}`}
              d={pathData}
              stroke="#4a4a4a"
              strokeWidth="2"
              strokeOpacity="0.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5,3"
            />
          );
        })}
      </g>

      {/* Layer 4: Smooth Coastlines */}
      <g id="coast" className="layer-coast">
        {coastlinePaths.map((path, idx) => {
          if (path.length < 3) return null;

          // Create smooth curve using Catmull-Rom interpolation
          let pathData = `M${path[0][0]},${path[0][1]}`;

          for (let i = 1; i < path.length - 1; i++) {
            const p0 = path[Math.max(0, i - 1)];
            const p1 = path[i];
            const p2 = path[i + 1];
            const p3 = path[Math.min(path.length - 1, i + 2)];

            // Catmull-Rom to Bezier conversion
            const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
            const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
            const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
            const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

            pathData += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
          }

          // Check if path is closed (start and end are close)
          const start = path[0];
          const end = path[path.length - 1];
          const isClosed = Math.abs(start[0] - end[0]) < 1 && Math.abs(start[1] - end[1]) < 1;

          if (isClosed) {
            pathData += ' Z';
          }

          return (
            <path
              key={`coastline-${idx}`}
              d={pathData}
              stroke="#2a5a8a"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
      </g>

      {/* Layer 5: Rivers */}
      <g id="rivers" className="layer-rivers">
        {rivers && rivers.map((river, idx) => {
          const riverPoints = river.path.map(cellId => {
            const cell = cells[cellId];
            return [cell.x, cell.y];
          });

          if (riverPoints.length < 2) return null;

          const pathData = `M${riverPoints.map(p => p.join(',')).join('L')}`;

          return (
            <path
              key={`river-${idx}`}
              d={pathData}
              stroke="#3b8fc4"
              strokeWidth={river.delta ? "3" : "2"}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
      </g>

      {/* Layer 6: Mountains (overlay) */}
      <g id="mountains" className="layer-mountains">
        {mountainCells.map(cell => {
          if (!cell.polygon) return null;
          const pathData = `M${cell.polygon.map(p => p.join(',')).join('L')}Z`;
          return (
            <path
              key={`mountain-${cell.id}`}
              d={pathData}
              fill="none"
              stroke="rgba(100,80,60,0.3)"
              strokeWidth="1"
            />
          );
        })}
      </g>

      {/* Layer 7: State Labels */}
      <g id="state-labels" className="layer-labels">
        {states.map(state => {
          // Calculate centroid of state
          if (state.cells.length === 0) return null;

          let sumX = 0, sumY = 0;
          state.cells.forEach(cellId => {
            const cell = cells[cellId];
            if (cell) {
              sumX += cell.x;
              sumY += cell.y;
            }
          });

          const centroidX = sumX / state.cells.length;
          const centroidY = sumY / state.cells.length;

          return (
            <text
              key={`label-${state.id}`}
              x={centroidX}
              y={centroidY}
              textAnchor="middle"
              fill="#1a1a1a"
              fontSize="16"
              fontWeight="600"
              fontFamily="serif"
              stroke="#ffffff"
              strokeWidth="3"
              paintOrder="stroke"
              style={{ pointerEvents: 'none' }}
            >
              {state.name}
            </text>
          );
        })}
      </g>
    </svg>
    </div>
  );
});
