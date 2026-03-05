import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from 'reactflow';
import { useStore } from '../store/useStore';

export default function LineageEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}: EdgeProps) {
  const { toggleEdgeSelection, theme } = useStore();
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleEdgeSelection(id);
  };

  const isHighlighted = data?.isHighlighted || selected;

  return (
    <g onClick={onEdgeClick}>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ 
          ...style, 
          strokeWidth: isHighlighted ? 4 : 3, 
          stroke: theme === 'dark' ? '#3b82f6' : '#2563eb', 
          opacity: isHighlighted ? 1 : (theme === 'dark' ? 0.4 : 0.3),
          strokeDasharray: '8,4', // Always dashed
          cursor: 'pointer'
        }} 
        interactionWidth={20}
      />
    </g>
  );
}
