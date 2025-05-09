import { createLazyFileRoute } from '@tanstack/react-router'
import HelmInstall from '@/features/helminstall'

export const Route = createLazyFileRoute('/_authenticated/helminstall/')({
  component: HelmInstall,
})
