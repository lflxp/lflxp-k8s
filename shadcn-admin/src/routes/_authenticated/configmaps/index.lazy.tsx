import { createLazyFileRoute } from '@tanstack/react-router'
import ConfigMap from '@/features/configmaps'

export const Route = createLazyFileRoute('/_authenticated/configmaps/')({
  component: ConfigMap,
})
