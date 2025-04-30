import { createLazyFileRoute } from '@tanstack/react-router'
import Daemonsets from '@/features/daemonsets'

export const Route = createLazyFileRoute('/_authenticated/daemonsets/')({
  component: Daemonsets,
})
