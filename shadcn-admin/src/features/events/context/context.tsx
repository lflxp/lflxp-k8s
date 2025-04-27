import React, { createContext, useContext, ReactNode } from 'react'
import { Event } from '../data/schema'

type EventDiaglogType = 'create' | 'update' | 'delete' | 'import' | 'terminal' |'ssh' | 'detail'

interface EventContextType {
  open: EventDiaglogType | null,
  setOpen: (str: EventDiaglogType | null) => void
  currentRow: Event | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Event | null>>
  EventName: string | undefined
  setEventName: React.Dispatch<React.SetStateAction<string | undefined>>
}

// interface EventsContextType {
//   Events: Event[]
//   loading: boolean
//   error: string | null
// }

const EventsContext = createContext<EventContextType | null>(null)

export default function EventsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = React.useState<EventDiaglogType | null>(null)
  const [currentRow, setCurrentRow] = React.useState<Event | null>(null)
  const [EventName, setEventName] = React.useState<string | undefined>(undefined)

  return (
    <EventsContext.Provider value={{ open, setOpen, currentRow, setCurrentRow, EventName, setEventName }}>
      {children}
    </EventsContext.Provider>
  )
}

export const useEvents = () => {
  const cc = useContext(EventsContext)
  if (!cc) {
    throw new Error('useEvents must be used within a EventsProvider')
  }

  return cc
}