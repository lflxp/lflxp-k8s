"use client"

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
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Bar, BarChart } from "recharts"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

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

export const namespaces = [
  {
    label: 'KUBE-SYSTEM',
    value: 'kube-system',
    icon: IconArrowDown,
  },
  {
    label: 'ECLIPSE-CHE',
    value: 'eclipse-che',
    icon: IconArrowRight,
  },
  {
    label: 'DEFAULT',
    value: 'default',
    icon: IconArrowUp,
  }, 
]

export const callTypes = new Map<string, string>([
  ['Running', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['Failed', 'bg-neutral-300/40 border-neutral-300'],
  ['Unknown', 'bg-sky-200/40 text-sky-900 dark:text-sky-100 border-sky-300'],
  [
    'Successed',
    'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/10',
  ],
  ['Pending', 'bg-purple-200/40 text-purple-900 dark:text-purple-100 border-purple-300'],
])

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  }
} satisfies ChartConfig

export function CCComponent() {
  return (
    <>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
      <Card className="h-full border rounded-md">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Deploy your new project in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Name of your project" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Framework</Label>
                <Select>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="next">Next.js</SelectItem>
                    <SelectItem value="sveltekit">SvelteKit</SelectItem>
                    <SelectItem value="astro">Astro</SelectItem>
                    <SelectItem value="nuxt">Nuxt.js</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    </>
  )
}

export const poddemo = {
  "apiVersion": "batch/v1",
  "kind": "CronJob",
  "metadata": {
      "annotations": {
          "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"batch/v1\",\"kind\":\"CronJob\",\"metadata\":{\"annotations\":{},\"name\":\"hello-cronjob2\",\"namespace\":\"default\"},\"spec\":{\"jobTemplate\":{\"spec\":{\"template\":{\"spec\":{\"containers\":[{\"args\":[\"/bin/sh\",\"-c\",\"date; echo Hello from the Kubernetes cluster\"],\"image\":\"busybox:1.28\",\"name\":\"hello\"}],\"restartPolicy\":\"OnFailure\"}}}},\"schedule\":\"*/5 * * * *\"}}\n"
      },
      "creationTimestamp": "2025-05-06T06:48:12Z",
      "generation": 1,
      "name": "hello-cronjob2",
      "namespace": "default",
  },
  "spec": {
      "concurrencyPolicy": "Allow",
      "failedJobsHistoryLimit": 1,
      "jobTemplate": {
          "metadata": {
              "creationTimestamp": null
          },
          "spec": {
              "template": {
                  "metadata": {
                      "creationTimestamp": null
                  },
                  "spec": {
                      "containers": [
                          {
                              "args": [
                                  "/bin/sh",
                                  "-c",
                                  "date; echo Hello from the Kubernetes cluster"
                              ],
                              "image": "busybox:1.28",
                              "imagePullPolicy": "IfNotPresent",
                              "name": "hello",
                              "resources": {},
                              "terminationMessagePath": "/dev/termination-log",
                              "terminationMessagePolicy": "File"
                          }
                      ],
                      "dnsPolicy": "ClusterFirst",
                      "restartPolicy": "OnFailure",
                      "schedulerName": "default-scheduler",
                      "securityContext": {},
                      "terminationGracePeriodSeconds": 30
                  }
              }
          }
      },
      "schedule": "*/5 * * * *",
      "successfulJobsHistoryLimit": 3,
      "suspend": false
  },
  "status": {
      "active": [
          {
              "apiVersion": "batch/v1",
              "kind": "Job",
              "name": "hello-cronjob2-29108570",
              "namespace": "default",
              "resourceVersion": "104114300",
              "uid": "9b866810-4400-419a-85df-f29ec590c62d"
          }
      ],
      "lastScheduleTime": "2025-05-06T06:50:00Z"
  }
}