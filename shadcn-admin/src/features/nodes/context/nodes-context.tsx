import React, { createContext, useContext, ReactNode } from 'react'
import { Node } from '../data/schema'

type NodesDiaglogType = 'create' | 'update' | 'delete' | 'import' | 'terminal' |'ssh' | 'detail'

interface NodeContextType {
  open: NodesDiaglogType | null,
  setOpen: (str: NodesDiaglogType | null) => void
  currentRow: Node | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Node | null>>
  nodeName: string | undefined
  setNodeName: React.Dispatch<React.SetStateAction<string | undefined>>
}

// interface NodesContextType {
//   nodes: Node[]
//   loading: boolean
//   error: string | null
// }

const NodesContext = createContext<NodeContextType | null>(null)

export default function NodesProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = React.useState<NodesDiaglogType | null>(null)
  const [currentRow, setCurrentRow] = React.useState<Node | null>(null)
  const [nodeName, setNodeName] = React.useState<string | undefined>(undefined)

  return (
    <NodesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow, nodeName, setNodeName }}>
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