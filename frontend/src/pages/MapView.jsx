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
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [placesInRegion, setPlacesInRegion] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]); // All places with regionIds for map markers
  const svgRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Load existing map on mount
  useEffect(() => {
    loadMap();
    loadAllPlaces();
  }, [projectId]);

  // Load all places for displaying markers on the map
  async function loadAllPlaces() {
    try {
      const res = await axios.get(`/api/projects/${projectId}/world`);
      const places = res.data || [];
      // Only keep places that have a regionId
      const placesWithRegions = places.filter(p => p.regionId != null);
      setAllPlaces(placesWithRegions);
    } catch (err) {
      console.error('Failed to load places:', err);
      setAllPlaces([]);
    }
  }

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
      // Azgaar-style: Much smaller cells for detailed, realistic geography
      // Size: 4000x2400, cells: 4000 (similar to Azgaar's detail level)
      const generated = generateMap(seed, 4000, 2400, 4000);
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

  // Handle state property updates and auto-save with debouncing
  function handleStateUpdate(updatedState) {
    setSelectedState(updatedState);

    // Update in mapData
    const updatedMapData = {
      ...mapData,
      states: mapData.states.map(s => s.id === updatedState.id ? updatedState : s)
    };
    setMapData(updatedMapData);

    // Debounce auto-save: wait 1 second after last change before saving
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveMap(updatedMapData);
    }, 1000);
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Load places for selected region
  useEffect(() => {
    let cancel = false;
    async function loadPlaces() {
      if (!selectedState) {
        setPlacesInRegion([]);
        return;
      }

      try {
        const res = await axios.get(`/api/projects/${projectId}/world`);
        if (cancel) return;
        const allPlaces = res.data || [];
        const placesForRegion = allPlaces.filter(place => place.regionId === selectedState.id);
        setPlacesInRegion(placesForRegion);
      } catch (err) {
        console.error('Failed to load places:', err);
        setPlacesInRegion([]);
      }
    }

    loadPlaces();
    return () => { cancel = true; };
  }, [selectedState, projectId]);

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
        <div className="panel">
          <h3 className="panel-title">{t('map.generateNew')}</h3>

          <div className="form-group">
            <label className="label">{t('map.seedLabel')}</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={seed}
                onChange={e => setSeed(e.target.value)}
                placeholder={t('map.seedPlaceholder')}
                className="input"
                style={{ flex: 1 }}
              />
              <button
                onClick={() => setSeed(Math.random().toString(36).substring(2, 15))}
                className="btn btn-secondary"
                style={{ padding: '0 1rem' }}
                title="Generate random seed"
              >
                🎲
              </button>
            </div>
            <small className="hint">{t('map.seedHint')}</small>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !seed.trim()}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? t('map.generating') : t('map.generate')}
          </button>

          {error && <div className="error-message" style={{ marginTop: '0.5rem' }}>{error}</div>}
        </div>
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
            <MapRenderer
              mapData={mapData}
              ref={svgRef}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              hoveredState={hoveredState}
              setHoveredState={setHoveredState}
              allPlaces={allPlaces}
              projectId={projectId}
            />
          )}
        </div>
      </main>

      {/* Right Sidebar - State Details */}
      {selectedState && (
        <aside className="side" style={{ borderLeft: '1px solid var(--border)' }}>
          <div className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 className="panel-title">State Details</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {saving && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Saving...</span>}
                {!saving && lastSaved && <span style={{ fontSize: '0.875rem', color: 'var(--success)' }}>✓ Saved</span>}
                <button
                  onClick={() => setSelectedState(null)}
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Name</label>
              <input
                type="text"
                value={selectedState.name}
                onChange={(e) => {
                  const updatedState = { ...selectedState, name: e.target.value };
                  handleStateUpdate(updatedState);
                }}
                className="input"
                placeholder="Enter state name"
              />
            </div>

            <div className="form-group">
              <label className="label">Color</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={selectedState.color}
                  onChange={(e) => {
                    const updatedState = { ...selectedState, color: e.target.value };
                    handleStateUpdate(updatedState);
                  }}
                  style={{ width: '50px', height: '36px', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}
                />
                <span className="hint" style={{ flex: 1 }}>{selectedState.color}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Description</label>
              <textarea
                value={selectedState.description || ''}
                onChange={(e) => {
                  const updatedState = { ...selectedState, description: e.target.value };
                  handleStateUpdate(updatedState);
                }}
                className="input"
                placeholder="Add description..."
                rows="4"
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            <div className="form-group">
              <label className="label">Stats</label>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  <strong>Cells:</strong> {selectedState.cells.length}
                </div>
                <div>
                  <strong>ID:</strong> {selectedState.id}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Places in this Region ({placesInRegion.length})</label>
              {placesInRegion.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.5rem' }}>
                  {placesInRegion.map(place => (
                    <div
                      key={place.id}
                      style={{
                        padding: '0.75rem',
                        background: '#f8fafc',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--hover-bg, #f1f5f9)';
                        e.currentTarget.style.borderColor = 'var(--brand, #6366f1)';
                        e.currentTarget.style.transform = 'translateX(2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                      onClick={() => {
                        window.location.href = `/app/project/${projectId}/world`;
                      }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1.25rem',
                        flexShrink: 0
                      }}>
                        {place.icon || '🏰'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: '#1e293b',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {place.title || 'Unnamed Place'}
                        </div>
                        {place.kind && (
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#64748b',
                            marginTop: '2px'
                          }}>
                            {place.kind}
                          </div>
                        )}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--brand, #6366f1)',
                        fontWeight: 500,
                        flexShrink: 0
                      }}>
                        →
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '1rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                  background: 'var(--bg-secondary, #f8fafc)',
                  borderRadius: '6px',
                  border: '1px dashed var(--border, #e5e7eb)',
                  marginTop: '0.5rem'
                }}>
                  No places linked yet. Go to World section to link places.
                </div>
              )}
            </div>
          </div>
        </aside>
      )}
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

// Helper function to trace state boundaries as continuous paths
function traceStateBoundaries(state, cells, states) {
  const edges = [];
  const edgeMap = new Map();

  // Step 1: Collect all boundary edges (edges that border different states)
  state.cells.forEach(cellId => {
    const cell = cells[cellId];
    if (!cell || !cell.polygon || !cell.neighbors) return;

    cell.neighbors.forEach((neighborId, idx) => {
      const neighbor = cells[neighborId];
      if (!neighbor) return;

      // Check if this edge is a state boundary
      const neighborState = states.find(s => s.cells.includes(neighborId));
      const isBoundary = !neighborState || neighborState.id !== state.id;

      if (isBoundary) {
        const p1 = cell.polygon[idx];
        const p2 = cell.polygon[(idx + 1) % cell.polygon.length];

        if (!p1 || !p2 || !Array.isArray(p1) || !Array.isArray(p2)) return;
        if (isNaN(p1[0]) || isNaN(p1[1]) || isNaN(p2[0]) || isNaN(p2[1])) return;

        const edge = { p1, p2 };
        edges.push(edge);

        // Build connectivity map for path tracing
        const key1 = `${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
        const key2 = `${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;

        if (!edgeMap.has(key1)) edgeMap.set(key1, []);
        if (!edgeMap.has(key2)) edgeMap.set(key2, []);

        edgeMap.get(key1).push({ point: p2, edge });
        edgeMap.get(key2).push({ point: p1, edge });
      }
    });
  });

  // Step 2: Trace edges into continuous boundary paths
  const boundaryPaths = [];
  const visitedEdges = new Set();

  edges.forEach(startEdge => {
    const edgeKey = `${startEdge.p1[0].toFixed(1)},${startEdge.p1[1].toFixed(1)}-${startEdge.p2[0].toFixed(1)},${startEdge.p2[1].toFixed(1)}`;
    if (visitedEdges.has(edgeKey)) return;

    const path = [startEdge.p1];
    let currentPoint = startEdge.p2;
    visitedEdges.add(edgeKey);

    let iterations = 0;
    const maxIterations = 10000;

    // Follow the boundary until we return to start or can't continue
    while (iterations < maxIterations) {
      iterations++;
      path.push(currentPoint);

      // Check if we've closed the loop
      const distToStart = Math.sqrt(
        Math.pow(currentPoint[0] - path[0][0], 2) +
        Math.pow(currentPoint[1] - path[0][1], 2)
      );

      if (path.length > 2 && distToStart < 1) {
        // Closed path found
        boundaryPaths.push(path);
        break;
      }

      // Find next connected edge
      const key = `${currentPoint[0].toFixed(1)},${currentPoint[1].toFixed(1)}`;
      const connections = edgeMap.get(key) || [];

      let foundNext = false;
      for (const conn of connections) {
        const connEdgeKey1 = `${currentPoint[0].toFixed(1)},${currentPoint[1].toFixed(1)}-${conn.point[0].toFixed(1)},${conn.point[1].toFixed(1)}`;
        const connEdgeKey2 = `${conn.point[0].toFixed(1)},${conn.point[1].toFixed(1)}-${currentPoint[0].toFixed(1)},${currentPoint[1].toFixed(1)}`;

        if (!visitedEdges.has(connEdgeKey1) && !visitedEdges.has(connEdgeKey2)) {
          visitedEdges.add(connEdgeKey1);
          visitedEdges.add(connEdgeKey2);
          currentPoint = conn.point;
          foundNext = true;
          break;
        }
      }

      if (!foundNext) {
        // Dead end - save path if it's significant
        if (path.length > 5) {
          boundaryPaths.push(path);
        }
        break;
      }
    }
  });

  return boundaryPaths;
}

// Map Renderer Component with zoom/pan
const MapRenderer = React.forwardRef(({ mapData, selectedState, setSelectedState, hoveredState, setHoveredState, allPlaces, projectId }, ref) => {
  if (!mapData || !mapData.cells) return null;

  const containerRef = useRef(null);
  // Start with 1.0 zoom - SVG preserveAspectRatio handles initial fit
  const [zoom, setZoom] = useState(1);
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

  // Reset view to initial zoom
  const handleReset = useCallback(() => {
    setZoom(1);
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
        preserveAspectRatio="xMidYMid meet"
        className="fantasy-map"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          width: '100%',
          height: '100%'
        }}
      >
        <title>Fantasy Map</title>

      {/* Layer 1: Ocean (no visible cell borders) */}
      <g id="ocean" className="layer-ocean">
        {oceanCells.map(cell => {
          if (!cell.polygon || !Array.isArray(cell.polygon)) return null;
          const validPolygon = cell.polygon.filter(p => Array.isArray(p) && !isNaN(p[0]) && !isNaN(p[1]));
          if (validPolygon.length < 3) return null;
          const pathData = `M${validPolygon.map(p => p.join(',')).join('L')}Z`;
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
          if (!cell.polygon || !Array.isArray(cell.polygon)) return null;
          const validPolygon = cell.polygon.filter(p => Array.isArray(p) && !isNaN(p[0]) && !isNaN(p[1]));
          if (validPolygon.length < 3) return null;
          const pathData = `M${validPolygon.map(p => p.join(',')).join('L')}Z`;
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

      {/* Layer 3: Land Biomes (all non-ocean/non-lake cells) */}
      <g id="biomes" className="layer-biomes">
        {cells.map(cell => {
          // Render all land cells with their biome colors
          if (cell.isOcean || cell.isLake) return null;
          if (!cell.polygon || !Array.isArray(cell.polygon)) return null;
          const validPolygon = cell.polygon.filter(p => Array.isArray(p) && !isNaN(p[0]) && !isNaN(p[1]));
          if (validPolygon.length < 3) return null;
          const pathData = `M${validPolygon.map(p => p.join(',')).join('L')}Z`;
          return (
            <path
              key={`biome-${cell.id}`}
              d={pathData}
              fill={getBiomeColor(cell.biome)}
              stroke="none"
            />
          );
        })}
      </g>

      {/* Layer 4: States (political territories with solid colors) */}
      <g id="states" className="layer-states">
        {states.map(state => {
          const isHovered = hoveredState === state.id;
          const isSelected = selectedState?.id === state.id;

          // Render all cells belonging to this state with solid color
          return state.cells.map(cellId => {
            const cell = cells[cellId];
            if (!cell || !cell.polygon || !Array.isArray(cell.polygon)) return null;
            const validPolygon = cell.polygon.filter(p => Array.isArray(p) && !isNaN(p[0]) && !isNaN(p[1]));
            if (validPolygon.length < 3) return null;
            const pathData = `M${validPolygon.map(p => p.join(',')).join('L')}Z`;

            // Slightly darken on hover/select for visual feedback
            const brightness = isHovered ? 0.9 : isSelected ? 0.95 : 1.0;

            return (
              <path
                key={`state-${state.id}-cell-${cellId}`}
                d={pathData}
                fill={state.color}
                fillOpacity="1.0"
                stroke="none"
                style={{
                  cursor: 'pointer',
                  transition: 'filter 0.2s ease',
                  filter: `brightness(${brightness})`
                }}
                onMouseEnter={() => setHoveredState(state.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => setSelectedState(state)}
              />
            );
          });
        })}
      </g>

      {/* Layer 6: Smooth Coastlines */}
      <g id="coast" className="layer-coast">
        {coastlinePaths.map((path, idx) => {
          // Validate all points in path
          const validPath = path.filter(p => Array.isArray(p) && !isNaN(p[0]) && !isNaN(p[1]));
          if (validPath.length < 3) return null;

          // Create smooth curve using Catmull-Rom interpolation
          const firstPoint = validPath[0];
          if (!firstPoint || isNaN(firstPoint[0]) || isNaN(firstPoint[1])) return null;

          let pathData = `M${firstPoint[0]},${firstPoint[1]}`;

          for (let i = 1; i < validPath.length - 1; i++) {
            const p0 = validPath[Math.max(0, i - 1)];
            const p1 = validPath[i];
            const p2 = validPath[i + 1];
            const p3 = validPath[Math.min(validPath.length - 1, i + 2)];

            // Validate all points
            if (!p0 || !p1 || !p2 || !p3) continue;
            if (isNaN(p0[0]) || isNaN(p0[1]) || isNaN(p1[0]) || isNaN(p1[1]) ||
                isNaN(p2[0]) || isNaN(p2[1]) || isNaN(p3[0]) || isNaN(p3[1])) continue;

            // Catmull-Rom to Bezier conversion
            const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
            const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
            const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
            const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

            if (isNaN(cp1x) || isNaN(cp1y) || isNaN(cp2x) || isNaN(cp2y)) continue;

            pathData += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
          }

          // Check if path is closed (start and end are close)
          const start = validPath[0];
          const end = validPath[validPath.length - 1];
          if (start && end && !isNaN(start[0]) && !isNaN(start[1]) && !isNaN(end[0]) && !isNaN(end[1])) {
            const isClosed = Math.abs(start[0] - end[0]) < 1 && Math.abs(start[1] - end[1]) < 1;
            if (isClosed) {
              pathData += ' Z';
            }
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

      {/* Layer 7: Mountains (overlay) */}
      <g id="mountains" className="layer-mountains">
        {mountainCells.map(cell => {
          if (!cell.polygon || !Array.isArray(cell.polygon)) return null;
          const validPolygon = cell.polygon.filter(p => Array.isArray(p) && !isNaN(p[0]) && !isNaN(p[1]));
          if (validPolygon.length < 3) return null;
          const pathData = `M${validPolygon.map(p => p.join(',')).join('L')}Z`;
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

      {/* Layer 8: State Labels */}
      <g id="labels" className="layer-labels">
        {states.map(state => {
          // Calculate center of state by averaging cell centers
          const stateCells = state.cells.map(id => cells[id]).filter(Boolean);
          if (stateCells.length === 0) return null;

          const centerX = stateCells.reduce((sum, cell) => sum + cell.x, 0) / stateCells.length;
          const centerY = stateCells.reduce((sum, cell) => sum + cell.y, 0) / stateCells.length;

          if (isNaN(centerX) || isNaN(centerY)) return null;

          return (
            <text
              key={`label-${state.id}`}
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                fill: '#2a2a2a',
                stroke: '#ffffff',
                strokeWidth: '3px',
                paintOrder: 'stroke',
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            >
              {state.name}
            </text>
          );
        })}
      </g>

      {/* Layer 9: Place Markers */}
      <g id="place-markers" className="layer-place-markers">
        {allPlaces && allPlaces.map(place => {
          // Find the state/region this place belongs to
          const state = states.find(s => s.id === place.regionId);
          if (!state || !state.cells || state.cells.length === 0) return null;

          // Calculate a position for this place within its region
          // We'll use the center of the region with a small random offset for variety
          const stateCells = state.cells.map(id => cells[id]).filter(Boolean);
          if (stateCells.length === 0) return null;

          const centerX = stateCells.reduce((sum, cell) => sum + cell.x, 0) / stateCells.length;
          const centerY = stateCells.reduce((sum, cell) => sum + cell.y, 0) / stateCells.length;

          if (isNaN(centerX) || isNaN(centerY)) return null;

          // Add a small deterministic offset based on place ID to spread out multiple places
          const offsetX = ((place.id * 37) % 100 - 50) * 2;
          const offsetY = ((place.id * 73) % 100 - 50) * 2;
          const placeX = centerX + offsetX;
          const placeY = centerY + offsetY;

          // Determine marker style based on place kind
          const markerSize = 12;
          const iconSize = 18;

          return (
            <g
              key={`place-marker-${place.id}`}
              transform={`translate(${placeX}, ${placeY})`}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                window.location.href = `/app/project/${projectId}/world`;
              }}
            >
              {/* Marker background circle */}
              <circle
                cx="0"
                cy="0"
                r={markerSize}
                fill="#ffffff"
                stroke="#2a2a2a"
                strokeWidth="2"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}
              />
              {/* Place icon/emoji */}
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fontSize: `${iconSize}px`,
                  pointerEvents: 'none',
                  userSelect: 'none'
                }}
              >
                {place.icon || '🏰'}
              </text>
              {/* Tooltip on hover - place name */}
              <title>{place.title || 'Unnamed Place'}</title>
            </g>
          );
        })}
      </g>
    </svg>
    </div>
  );
});
