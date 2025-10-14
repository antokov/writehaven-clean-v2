import React, { useEffect, useState, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MarkerType,
  Position 
} from 'reactflow';
import 'reactflow/dist/style.css';

// Benutzerdefinierte Knotentypen
const CircleNode = ({ data }) => (
  <div style={{
    background: data.background || '#fff',
    border: data.border || '1px solid #777',
    borderRadius: '50%',
    width: data.width || '40px',
    height: data.height || '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '10px',
    padding: '4px',
    cursor: 'pointer'
  }}>
    {data.label}
  </div>
);

const nodeTypes = {
  circleNode: CircleNode,
};

export function RelationsGraph({ 
  open, 
  activeId, 
  profile, 
  allCharacters, 
  onNodeClick,
  graphConstants,
  relationTypes 
}) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const wrapRef = useRef(null);

  // Graph-Daten aufbereiten
  useEffect(() => {
    if (!open) return;
    const nameOf = (id) => allCharacters.find(c => c.id === id)?.name || `#${id}`;

    // Zentraler Knoten
    const centerNode = {
      id: activeId,
      type: 'circleNode',
      data: { 
        label: nameOf(activeId),
        background: graphConstants.NODE.COLOR,
        border: `2px solid ${graphConstants.NODE.STROKE}`,
        width: 40,
        height: 40
      },
      position: { x: 0, y: 0 }
    };

    const newNodes = [centerNode];
    const newEdges = [];
    const rels = profile?.links?.connections || [];

    // Nachbarknoten im Kreis anordnen
    rels.forEach((r, idx) => {
      const angle = (2 * Math.PI * idx) / Math.max(1, rels.length);
      const radius = 200;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      // Nachbarknoten
      newNodes.push({
        id: r.target_id,
        type: 'circleNode',
        data: { 
          label: nameOf(r.target_id),
          background: graphConstants.NODE.INACTIVE_COLOR,
          border: `2px solid ${graphConstants.NODE.STROKE}`,
          width: 32,
          height: 32
        },
        position: { x, y }
      });

      // Kanten basierend auf Beziehungstyp
      const isSym = (relationTypes.RECIPROCAL[r.type] || r.type) === r.type;
      const reverseType = relationTypes.DIRECTED[r.type];

      if (isSym) {
        // Symmetrische Beziehung (z.B. "Freund von")
        newEdges.push({
          id: `e${activeId}-${r.target_id}`,
          source: activeId,
          target: r.target_id,
          label: r.type,
          type: 'smoothstep',
          markerEnd: MarkerType.ArrowClosed,
          markerStart: MarkerType.ArrowClosed,
          labelStyle: { fill: graphConstants.LINK.LABEL_COLOR },
          style: { stroke: graphConstants.LINK.COLOR }
        });
      } else if (reverseType) {
        // Gerichtete Beziehung mit Rückrichtung (z.B. "Vater von" -> "Kind von")
        newEdges.push({
          id: `e${activeId}-${r.target_id}`,
          source: activeId,
          target: r.target_id,
          label: r.type,
          type: 'smoothstep',
          markerEnd: MarkerType.ArrowClosed,
          labelStyle: { fill: graphConstants.LINK.LABEL_COLOR },
          style: { stroke: graphConstants.LINK.COLOR }
        });
        newEdges.push({
          id: `e${r.target_id}-${activeId}`,
          source: r.target_id,
          target: activeId,
          label: reverseType,
          type: 'smoothstep',
          markerEnd: MarkerType.ArrowClosed,
          labelStyle: { fill: graphConstants.LINK.LABEL_COLOR },
          style: { stroke: graphConstants.LINK.COLOR }
        });
      } else {
        // Einfache gerichtete Beziehung
        newEdges.push({
          id: `e${activeId}-${r.target_id}`,
          source: activeId,
          target: r.target_id,
          label: r.type,
          type: 'smoothstep',
          markerEnd: MarkerType.ArrowClosed,
          labelStyle: { fill: graphConstants.LINK.LABEL_COLOR },
          style: { stroke: graphConstants.LINK.COLOR }
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [open, activeId, profile, allCharacters, graphConstants, relationTypes]);

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick?.(node.id)}
        fitView
        minZoom={0.5}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}