import { createLazyFileRoute } from '@tanstack/react-router'
import Secret from '@/features/secrets'

export const Route = createLazyFileRoute('/_authenticated/secrets/')({
  component: Secret,
})
