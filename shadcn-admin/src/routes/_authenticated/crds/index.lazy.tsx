import { createLazyFileRoute } from '@tanstack/react-router'
import CRDS from '@/features/crds'

export const Route = createLazyFileRoute('/_authenticated/crds/')({
  component: CRDS,
})
