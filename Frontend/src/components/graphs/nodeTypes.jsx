import { Handle, Position } from 'reactflow'
import { FiFileText, FiLayers } from 'react-icons/fi'

export function PaperNode({ data, selected }) {
  return (
    <div
      className={`w-[220px] rounded-xl border bg-white p-3 shadow-card transition-all duration-200 ${
        selected ? 'border-primary ring-4 ring-primary/10' : 'border-border'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-primary/40" />
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary">
          <FiFileText className="h-3.5 w-3.5" />
        </span>
        <p className="line-clamp-3 text-[11px] font-semibold leading-tight text-text">{data.title || data.label}</p>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary/40" />
    </div>
  )
}

export function ClusterNode({ data, selected }) {
  return (
    <div
      className={`rounded-2xl border-2 bg-gradient-to-br from-violet-50 to-white px-4 py-3 shadow-card transition-all duration-200 ${
        selected ? 'border-accent ring-4 ring-accent/10' : 'border-violet-200'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-accent/40" />
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <FiLayers className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-bold text-text">{data.label}</p>
          <p className="text-[10px] text-muted">{data.paper_count} papers</p>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-accent/40" />
    </div>
  )
}

export const nodeTypes = { paper: PaperNode, cluster: ClusterNode }
