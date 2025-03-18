import { createLazyFileRoute } from '@tanstack/react-router'
import Pods from '@/features/pods'

export const Route = createLazyFileRoute('/_authenticated/pods/')({
  component: Pods,
})
