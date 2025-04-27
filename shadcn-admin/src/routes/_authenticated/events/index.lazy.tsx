import { createLazyFileRoute } from '@tanstack/react-router'
import Events from '@/features/events'

export const Route = createLazyFileRoute('/_authenticated/events/')({
  component: Events,
})
