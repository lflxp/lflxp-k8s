import { createLazyFileRoute } from '@tanstack/react-router'
import CronJob from '@/features/cronjobs'

export const Route = createLazyFileRoute('/_authenticated/cronjobs/')({
  component: CronJob,
})
