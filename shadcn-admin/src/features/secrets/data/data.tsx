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
  "apiVersion": "v1",
  "kind": "Secret",
  "metadata": {
      "annotations": {
          "cni.projectcalico.org/containerID": "6952a74e0b1c95f958e0e40eb2c8a8d93430112f2fc1860f2e81aa4d439d48e2",
          "cni.projectcalico.org/podIP": "10.42.153.106/32",
          "cni.projectcalico.org/podIPs": "10.42.153.106/32"
      },
      "creationTimestamp": "2025-03-25T14:09:59Z",
      "generateName": "demo-7fdf7d479b-",
      "labels": {
          "aa": "bbcd",
          "app.kubernetes.io/instance": "demo",
          "app.kubernetes.io/managed-by": "Helm",
          "app.kubernetes.io/name": "demo",
          "app.kubernetes.io/version": "1.16.0",
          "helm.sh/chart": "demo-0.1.0",
          "pod-template-hash": "7fdf7d479b"
      },
      "name": "demo-7fdf7d479b-g52kv",
      "namespace": "default"
  },
  "data": {
      "ca.crt": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUU5RENDQXR5Z0F3SUJBZ0lVS3NVcjFOM2R0WFVwTjhoSVF0Y2dtNEN2azdNd0RRWUpLb1pJaHZjTkFRRUwKQlFBd0l6RWhNQjhHQTFVRUF3d1lURzlqWVd3Z1JXTnNhWEJ6WlNCRGFHVWdVMmxuYm1WeU1CNFhEVEkwTVRBeQpNVEV6TXpZd05sb1hEVEkzTURneE1URXpNell3Tmxvd0l6RWhNQjhHQTFVRUF3d1lURzlqWVd3Z1JXTnNhWEJ6ClpTQkRhR1VnVTJsbmJtVnlNSUlDSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQWc4QU1JSUNDZ0tDQWdFQXJMK0EKazF6a1pFbGFUdmo2OVhoeDFPQ2RHeVJDcGJjZUljVElIOWQyY0RMVC9FZmJxVUpLY09JRnFZcDBRdEs5aVhheAoxQW00aEpvZm9CNG8rYjUwZ0k3Y0F2MTEwMzYvdWNoOGNHMlUwOEVobVJ4VzVpRGgwZXV2Q0NiQ0FtWFlsWFFZCkFtV05QNFQ5MWU3d2l5ZDdYV1gydTlJM2FuVWk4Nk9tMkxCaEJhZUZIODcwYXpaWmluWVBFRnVlNUE2ZHA2b2oKLzIvZ1pMYy82RTNNWjNRRzJoSnc5bExSakhTUlNTS0Z3ckdpZDJmRmx0SzV3Rmp3a1lRSWE0ZnBaSW9NbUxCdApTYWs4dGpKVHgvem42amllWUc3S2RWa2RZOWVwTjBKbkJKdUFKc0xlaEFVQm8vekVzaFdtclQ2VlpucGd4aGxKCmNaNFBDM0FsMDliRGxDVEVwMDAySkY1dnZCVy9zZmtpUmVRR3NoQ2JkUURONmJETFNXN3ExT3V0RHJKU1R5U3cKZ0Eydjk1dmJoWU90SEY0bG5QOWhiUytpQ1hwMmc2aFgrb3p0M0JrWVVBcURqRFNtK1pONGsxNXR4RnNnakVVVApDSk84QnVKSkloQVFQYnFKdkFWQ2lmaXgwTHVOL2RLR09hNWlmL2o0WmRTVnI5QzVja09XZlVpL2JFUVF1MzFWClFtZGZ6RENwQm1IYXRDU0N3THAvb2xLOWdzZWRsTHhpMXNmY0F4UzdXbWJXaXowUXJnSy9xVVRPWU5EOHNNTXcKNzhBUDFmMmVMNnlxK253VWh5NWJzSlBZYTFLYjMyMCtCTER5V1MwbWs5TUtiOGVlU2orSUR0MTByeFk2Q1MxMApEWjBFbGdLL3dIdzdhVGdCVU5WUnVLZXhLYU9Hb0l3b2dUbHh6V1VDQXdFQUFhTWdNQjR3RHdZRFZSMFRBUUgvCkJBVXdBd0VCL3pBTEJnTlZIUThFQkFNQ0FZWXdEUVlKS29aSWh2Y05BUUVMQlFBRGdnSUJBRWNqa0plOGxKNTkKR3B0U1VxVWJ3Q01VWVQvdnBsazJvdHlQZmZmWko2YUxSNG5KWHpwdVZQVy9NNTllblFxV0Vscjk0WG12dXdudAp2M01veDBXSWpKZGR1aHMvNmtVNloyMDcrd1RSMURYcUJ3SmZCYmxpVTV6dHFaMC8zUVpOSVJuaDU1UW8yQmRrCm9jdkdsTlNCcE1zVkF1RUxjRS9UalZFY0FmSElSNmN2bmdBOUtML0xCRndzZitNZC9VeTAvSCtKTUQyb2QzS3MKTHRjTHVBc1R0UnE5VFlGVzVzcy9XU2wrL3hVdlRMSkpTZGM3RDVQS2l1UWYxS0VwSFM4eXNHaWJsVU5DWnBmbAoyNlNxY2hidzhHcHZkb0xlSzExeGVOMzh4UUZKdzBVY2hyU3o2VmtTNzFkMUMyOTkrbE1wUFlJQUE0aVo5emdpCmdldmIvQVgzSGhhbDVkaHB3QkZWcTVEeGVFVDFTMnR2Y01xRXl4dXJXNG9VY3Q3cGpNeUd3WE84d1g0bnVWREQKanltQUUvZ1dWUkJMRVovalo4OENhbVYwUjZWT3RwRzRaRWVBT0g0R0VMc21ENW1HUnR2WkVQVWVadWNzbkFMaQpPdzZuSjRBZ0FSeThxZnJUSmJJMXd2RjZuSFIrZGxrOVI2SnlBVnp3WXNhSUVhcFM3Y01DWUJTR3hBeWlBc2ZhCnd2dUcrR1dqQ1hSbHRoTEJnQ2tzZEhwUXlJTjg3ZzVXTkFBSVpiMDE0U2hqb1BXdTBPOXlZV2tDV1BMNWVYYkIKNEZERFQ3YjY3ZXErT3pQTXlDam9BUUg5azZYSnNhNnM2b1d2RmpSb1Y3NGU4Q09wM1pBTk1Yd3FlZEpLVGRuRwo1MEtBeWFnZjJkdWJZejlBRTJjSjZhbkVDYVFSaUJtWQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==" 
  }
}