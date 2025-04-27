import React, { createContext, useContext, ReactNode } from 'react'
import { ApiResourceResult } from '../data/schema'

type CRDDiaglogType = 'create' | 'update' | 'delete' | 'import' | 'terminal' |'ssh' | 'detail'

interface CRDContextType {
  open: CRDDiaglogType | null,
  setOpen: (str: CRDDiaglogType | null) => void
  currentRow: ApiResourceResult | null
  setCurrentRow: React.Dispatch<React.SetStateAction<ApiResourceResult | null>>
  CRDName: string | undefined
  setCRDName: React.Dispatch<React.SetStateAction<string | undefined>>
}

// interface CRDsContextType {
//   CRDs: CRD[]
//   loading: boolean
//   error: string | null
// }

const CRDsContext = createContext<CRDContextType | null>(null)

export default function CRDsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = React.useState<CRDDiaglogType | null>(null)
  const [currentRow, setCurrentRow] = React.useState<ApiResourceResult | null>(null)
  const [CRDName, setCRDName] = React.useState<string | undefined>(undefined)

  return (
    <CRDsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow, CRDName, setCRDName }}>
      {children}
    </CRDsContext.Provider>
  )
}

export const useCRDs = () => {
  const cc = useContext(CRDsContext)
  if (!cc) {
    throw new Error('useCRDs must be used within a CRDsProvider')
  }

  return cc
}