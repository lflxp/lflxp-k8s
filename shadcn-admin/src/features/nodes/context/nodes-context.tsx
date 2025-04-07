import React, { createContext, useContext, ReactNode } from 'react'
import { Metrics } from '../data/metrics'

interface NodeContextType {
  metrics: Metrics | null
  setMetrics: React.Dispatch<React.SetStateAction<Metrics | null>>
}

// interface NodesContextType {
//   nodes: Node[]
//   loading: boolean
//   error: string | null
// }

const NodesContext = createContext<NodeContextType | null>(null)

export default function NodesProvider({ children }: { children: ReactNode }) {
  // TODO: 从API获取节点数据
  // const nodes: Metrics[] = []
  // const loading = false
  // const error = null
  const [metrics, setMetrics] = React.useState<Metrics | null>(null)

  return (
    <NodesContext.Provider value={{ metrics, setMetrics }}>
      {children}
    </NodesContext.Provider>
  )
}

export const useNodes = () => {
  const cc = useContext(NodesContext)
  if (!cc) {
    throw new Error('useNodes must be used within a NodesProvider')
  }

  return cc
}