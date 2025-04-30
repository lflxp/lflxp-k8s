import { createLazyFileRoute } from '@tanstack/react-router'
import StatefulSet from '@/features/statefulsets'

export const Route = createLazyFileRoute('/_authenticated/statefulsets/')({
  component: StatefulSet,
})
