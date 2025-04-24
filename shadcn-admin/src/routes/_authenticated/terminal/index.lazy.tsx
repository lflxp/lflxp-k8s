import { createLazyFileRoute } from '@tanstack/react-router'
import TTY from '@/features/terminal'

export const Route = createLazyFileRoute('/_authenticated/terminal/')({
  component: TTY,
})
