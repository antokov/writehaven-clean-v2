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

      // Generate map with political states (reduced cell count for larger territories)
      const generated = generateMap(seed, 1200, 800, 400);
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

// Map Renderer Component with zoom/pan
const MapRenderer = React.forwardRef(({ mapData }, ref) => {
  if (!mapData || !mapData.cells) return null;

  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { width, height, cells, rivers } = mapData;

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

  // Reset view
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

      {/* Layer 3b: State Borders */}
      <g id="state-borders" className="layer-state-borders">
        {states.map(state => {
          // Find border edges for this state
          const borderEdges = new Set();
          state.cells.forEach(cellId => {
            const cell = cells[cellId];
            if (!cell) return;

            cell.neighbors.forEach(nId => {
              const neighbor = cells[nId];
              if (!neighbor) return;

              // If neighbor is different state or ocean, this is a border
              if (neighbor.isOcean || neighbor.isLake || neighbor.stateId !== state.id) {
                // Add edge between cell and neighbor
                const edgeKey = [cellId, nId].sort().join('-');
                borderEdges.add(edgeKey);
              }
            });
          });

          // Draw borders
          return Array.from(borderEdges).map(edgeKey => {
            const [id1, id2] = edgeKey.split('-').map(Number);
            const cell1 = cells[id1];
            const cell2 = cells[id2];
            if (!cell1 || !cell2) return null;

            return (
              <line
                key={`border-${state.id}-${edgeKey}`}
                x1={cell1.x}
                y1={cell1.y}
                x2={cell2.x}
                y2={cell2.y}
                stroke="#2a2a2a"
                strokeWidth="2"
                strokeOpacity="0.6"
              />
            );
          });
        })}
      </g>

      {/* Layer 4: Coasts (borders) */}
      <g id="coast" className="layer-coast">
        {coastCells.map(cell => {
          if (!cell.polygon) return null;
          const pathData = `M${cell.polygon.map(p => p.join(',')).join('L')}Z`;
          return (
            <path
              key={`coast-${cell.id}`}
              d={pathData}
              fill="none"
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="1.5"
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
