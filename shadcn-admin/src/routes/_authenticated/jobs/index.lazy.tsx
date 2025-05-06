import { createLazyFileRoute } from '@tanstack/react-router'
import Job from '@/features/jobs'

export const Route = createLazyFileRoute('/_authenticated/jobs/')({
  component: Job,
})
