import React, { useCallback } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Beziehungstypen-Konstanten
const RECIPROCAL = {
  'Freund': 'Freund',
  'Feind': 'Feind',
  'Rivale': 'Rivale',
  'Partner': 'Partner',
  'Ehepartner': 'Ehepartner',
  'Geschwister': 'Geschwister',
  'Zwilling': 'Zwilling'
};

const DIRECTED = {
  'Vater': 'Kind',
  'Mutter': 'Kind',
  'Mentor': 'Schüler',
  'Vorgesetzter': 'Untergebener',
  'Anführer': 'Gefolgsmann'
};

// Style-Konstanten
const NODE_STYLES = {
  default: {
    style: {
      background: '#16a34a',
      color: '#ffffff',
      border: '1px solid #0f172a',
      width: 180,
    },
  },
  selected: {
    style: {
      background: '#15803d',
      border: '2px solid #0f172a',
      boxShadow: '0 0 0 2px rgba(22, 163, 74, 0.3)',
    },
  },
};

const EDGE_STYLES = {
  default: {
    style: {
      stroke: '#64748b',
    },
  },
  bidirectional: {
    type: 'bidirectional',
    markerEnd: { type: MarkerType.Arrow },
    markerStart: { type: MarkerType.Arrow },
    style: { stroke: '#64748b' },
  },
};

export default function RelationsGraph({ characters, selectedCharacter, onCharacterSelect }) {
  // Konvertiere Charaktere in Nodes für ReactFlow
  const initialNodes = characters.map(char => ({
    id: char.id.toString(),
    type: 'default',
    data: { 
      label: char.name,
      character: char
    },
    position: { x: Math.random() * 500, y: Math.random() * 500 },
    ...NODE_STYLES.default
  }));

  // Erstelle Kanten aus den Beziehungen
  const initialEdges = characters.flatMap(char => 
    (char.links || []).map(link => ({
      id: `${char.id}-${link.targetId}`,
      source: char.id.toString(),
      target: link.targetId.toString(),
      label: link.type,
      type: RECIPROCAL[link.type] ? 'bidirectional' : 'default',
      ...EDGE_STYLES.default
    }))
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Node-Auswahl behandeln
  const onNodeClick = useCallback((event, node) => {
    const character = node.data.character;
    if (character) {
      onCharacterSelect(character);
    }
  }, [onCharacterSelect]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}