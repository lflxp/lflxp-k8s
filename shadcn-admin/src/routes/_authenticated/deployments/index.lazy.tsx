import { createLazyFileRoute } from '@tanstack/react-router'
import Deployment from '@/features/deployments'

export const Route = createLazyFileRoute('/_authenticated/deployments/')({
  component: Deployment,
})
