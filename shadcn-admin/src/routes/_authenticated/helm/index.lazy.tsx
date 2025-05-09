import { createLazyFileRoute } from '@tanstack/react-router'
import Helm from '@/features/helm'

export const Route = createLazyFileRoute('/_authenticated/helm/')({
  component: Helm,
})
