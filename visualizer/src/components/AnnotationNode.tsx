import { memo, useState, useEffect } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import type { Annotation } from '../types/schema'
import { useStore } from '../store/useStore'
import { Trash2 } from 'lucide-react'

const AnnotationNode = ({ id, data, selected }: NodeProps<{ annotation: Annotation }>) => {
  const { annotation } = data
  const { updateAnnotation, removeAnnotation, theme } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(annotation.text)

  useEffect(() => {
    setText(annotation.text)
  }, [annotation.text])

  const handleBlur = () => {
    setIsEditing(false)
    if (text !== annotation.text) {
      updateAnnotation(annotation.id, { text })
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeAnnotation(annotation.id)
  }

  const isCallout = annotation.type === 'callout'
  const bgColor = annotation.color || (theme === 'dark' ? '#334155' : '#fef3c7')
  const textColor = theme === 'dark' ? '#f1f5f9' : '#92400e'

  return (
    <div 
      className={`relative group ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      style={{
        padding: '12px',
        backgroundColor: bgColor,
        borderRadius: isCallout ? '16px' : '2px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        minWidth: '120px',
        maxWidth: '250px',
        transition: 'all 0.2s ease-in-out',
        cursor: 'default',
        color: textColor
      }}
      onDoubleClick={() => setIsEditing(true)}
    >
      {/* Connector Handle for Callouts */}
      {isCallout && (
        <Handle
          type="source"
          position={Position.Top}
          id={`${id}-source`}
          style={{ background: 'transparent', border: 'none', top: '50%', left: '50%' }}
        />
      )}

      {/* Toolbar (Delete) */}
      <div className="absolute -top-8 right-0 hidden group-hover:flex gap-1 bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 rounded-md p-1 z-10">
        <button 
          onClick={handleDelete}
          className="p-1 hover:bg-red-50 text-red-500 rounded transition-colors"
          title="Delete Annotation"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {isEditing ? (
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          className="w-full bg-transparent border-none outline-none resize-none font-sans text-sm leading-relaxed"
          style={{ height: 'auto', minHeight: '60px' }}
        />
      ) : (
        <div className="font-sans text-sm leading-relaxed whitespace-pre-wrap break-words">
          {annotation.text || <span className="opacity-40 italic">Double-click to edit...</span>}
        </div>
      )}

      {/* Visual Indicator for Sticky Style (Optional dog-ear effect) */}
      {!isCallout && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4"
          style={{
            background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.1) 50%)`,
          }}
        />
      )}
    </div>
  )
}

export default memo(AnnotationNode)
