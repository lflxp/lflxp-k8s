import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconCircle,
  IconCircleCheck,
  IconCircleX,
  IconExclamationCircle,
  IconStopwatch,
} from '@tabler/icons-react'

export const labels = [
  {
    value: 'Running',
    label: 'Running',
  },
  {
    value: 'Succeeded',
    label: 'Succeeded',
  },
  {
    value: 'Unknown',
    label: 'Unknown',
  },
  {
    value: 'Failed',
    label: 'Failed',
  },
  {
    value: 'Pending',
    label: 'Pending',
  },
]

export const statuses = [
  {
    value: 'Running',
    label: 'Running',
    icon: IconExclamationCircle,
  },
  {
    value: 'Succeeded',
    label: 'Succeeded',
    icon: IconCircle,
  },
  {
    value: 'Unknown',
    label: 'Unknown',
    icon: IconCircleX,
  },
  {
    value: 'Failed',
    label: 'Failed',
    icon: IconCircleCheck,
  },
  {
    value: 'Pending',
    label: 'Pending',
    icon: IconStopwatch,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: IconArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: IconArrowRight,
  },
  {
    label: 'High',
    value: 'high',
    icon: IconArrowUp,
  },
]
