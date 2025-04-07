import { createLazyFileRoute } from '@tanstack/react-router'
import Nodes from '@/features/nodes'

export const Route = createLazyFileRoute('/_authenticated/nodes/')({
  component: Nodes,
})
