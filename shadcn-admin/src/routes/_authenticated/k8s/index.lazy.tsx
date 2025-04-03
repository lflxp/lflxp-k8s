import { createLazyFileRoute } from '@tanstack/react-router'
import K8S from '@/features/k8s'

export const Route = createLazyFileRoute('/_authenticated/k8s/')({
  component: K8S,
})
