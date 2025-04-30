import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Pod } from '../data/schema'

type PodsDialogType = 'create' | 'update' | 'delete' | 'import' | 'terminal' | 'ssh' | 'detail'

interface PodsContextType {
  open: PodsDialogType | null
  setOpen: (str: PodsDialogType | null) => void
  currentRow: Pod | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Pod | null>>
  containerName: string | undefined
  setContainerName: React.Dispatch<React.SetStateAction<string | undefined>>
}

const PodsContext = React.createContext<PodsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function TasksProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<PodsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Pod | null>(null)
  const [containerName, setContainerName] = useState<string | undefined>(undefined)
  return (
    <PodsContext value={{ open, setOpen, currentRow, setCurrentRow, containerName, setContainerName }}>
      {children}
    </PodsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = React.useContext(PodsContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <PodsContext>')
  }

  return tasksContext
}
