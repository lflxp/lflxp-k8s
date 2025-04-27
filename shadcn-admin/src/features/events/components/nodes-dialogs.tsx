import { useEvents } from '../context/context'
import { EventDetail } from './events-mutate-drawer'

export function EventsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow, setEventName } = useEvents()

  return (
    <>
      {currentRow && (<EventDetail
        key='event-detail'
        open={open === 'detail'}
        onOpenChange={() => {
          setOpen(null)
          setEventName(undefined)
          setTimeout(() => {
            setCurrentRow(null)
          }, 500)
        }}
        EventName={currentRow?.metadata.name}
      />)}
    </>
  )
}
