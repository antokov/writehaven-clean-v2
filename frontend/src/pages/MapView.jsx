import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { generateHeightmap, getTerrainColor } from '../utils/heightmapGenerator';
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

      // Generate heightmap-based map for natural terrain
      const generated = generateHeightmap(seed, 1200, 800);
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
        resolution: dataToSave.resolution,
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

  function exportPNG() {
    if (!svgRef.current) return;

    const canvas = svgRef.current;
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `map-${seed}.png`;
      link.click();
      URL.revokeObjectURL(url);
    });
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
            onClick={exportPNG}
            disabled={!mapData}
            className="btn btn-secondary"
            style={{ width: '100%', marginBottom: '0.5rem' }}
          >
            {t('map.exportPng') || 'Export PNG'}
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

// Canvas-based Heightmap Renderer with zoom/pan
const MapRenderer = React.forwardRef(({ mapData }, ref) => {
  if (!mapData || !mapData.heightmap) return null;

  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { width, height, heightmap, moisturemap, temperaturemap, waterLevel, states, resolution, mapWidth, mapHeight } = mapData;

  // Render heightmap to canvas
  useEffect(() => {
    if (!ref || !mapData) return;

    const canvas = ref;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Create image data
    const imageData = ctx.createImageData(width, height);
    const pixels = imageData.data;

    // Render each pixel based on heightmap
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const mapX = Math.min(Math.floor(x / resolution), mapWidth - 1);
        const mapY = Math.min(Math.floor(y / resolution), mapHeight - 1);

        const elevation = heightmap[mapY][mapX];
        const moisture = moisturemap[mapY][mapX];
        const temperature = temperaturemap[mapY][mapX];

        const color = getTerrainColor(elevation, moisture, temperature, waterLevel);
        const rgb = hexToRgb(color);

        const idx = (y * width + x) * 4;
        pixels[idx] = rgb.r;
        pixels[idx + 1] = rgb.g;
        pixels[idx + 2] = rgb.b;
        pixels[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw state borders
    drawStateBorders(ctx, mapData);
  }, [mapData, ref]);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const drawStateBorders = (ctx, data) => {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 3;

    // Create state map for quick lookup
    const stateMap = Array(data.mapHeight).fill(null).map(() => Array(data.mapWidth).fill(-1));

    // Build state ownership map using flood-fill from capitals
    data.states.forEach((state) => {
      const queue = [state.capital];
      stateMap[state.capital.y][state.capital.x] = state.id;

      while (queue.length > 0) {
        const { x, y } = queue.shift();

        const neighbors = [
          { x: x - 1, y },
          { x: x + 1, y },
          { x, y: y - 1 },
          { x, y: y + 1 }
        ];

        for (const n of neighbors) {
          if (n.x < 0 || n.x >= data.mapWidth || n.y < 0 || n.y >= data.mapHeight) continue;
          if (data.heightmap[n.y][n.x] <= data.waterLevel) continue;
          if (stateMap[n.y][n.x] !== -1) continue;

          stateMap[n.y][n.x] = state.id;
          queue.push(n);
        }
      }
    });

    // Draw borders where states meet
    for (let y = 0; y < data.mapHeight; y++) {
      for (let x = 0; x < data.mapWidth; x++) {
        const currentState = stateMap[y][x];
        if (currentState === -1) continue;

        // Check right neighbor
        if (x < data.mapWidth - 1 && stateMap[y][x + 1] !== -1 && stateMap[y][x + 1] !== currentState) {
          ctx.beginPath();
          ctx.moveTo((x + 1) * data.resolution, y * data.resolution);
          ctx.lineTo((x + 1) * data.resolution, (y + 1) * data.resolution);
          ctx.stroke();
        }

        // Check bottom neighbor
        if (y < data.mapHeight - 1 && stateMap[y + 1][x] !== -1 && stateMap[y + 1][x] !== currentState) {
          ctx.beginPath();
          ctx.moveTo(x * data.resolution, (y + 1) * data.resolution);
          ctx.lineTo((x + 1) * data.resolution, (y + 1) * data.resolution);
          ctx.stroke();
        }
      }
    }

    // Draw state labels
    ctx.shadowBlur = 0;
    ctx.font = 'bold 20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    data.states.forEach((state) => {
      const x = state.capital.x * data.resolution;
      const y = state.capital.y * data.resolution;

      // White outline
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.strokeText(state.name, x, y);

      // Black text
      ctx.fillStyle = '#000000';
      ctx.fillText(state.name, x, y);
    });
  };

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

      <canvas
        ref={ref}
        className="fantasy-map"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          imageRendering: 'pixelated'
        }}
      />
    </div>
  );
});
