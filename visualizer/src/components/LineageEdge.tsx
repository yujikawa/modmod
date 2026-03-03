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
  const { toggleEdgeSelection } = useStore();
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
          stroke: '#3b82f6', 
          opacity: isHighlighted ? 1 : 0.4,
          strokeDasharray: '8,4', // Always dashed
          cursor: 'pointer'
        }} 
        interactionWidth={20}
      />
    </g>
  );
}
