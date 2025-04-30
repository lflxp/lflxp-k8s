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
  "apiVersion": "apps/v1",
  "kind": "Deployment",
  "metadata": {
      "annotations": {
          "deployment.kubernetes.io/revision": "2",
          "meta.helm.sh/release-name": "qhx",
          "meta.helm.sh/release-namespace": "default"
      },
      "creationTimestamp": "2025-03-05T06:25:09Z",
      "generation": 8,
      "labels": {
          "app.kubernetes.io/instance": "qhx",
          "app.kubernetes.io/managed-by": "Helm",
          "app.kubernetes.io/name": "qhx",
          "app.kubernetes.io/version": "1.16.0",
          "helm.sh/chart": "qhx-0.1.0"
      },
      "name": "demo-hello",
      "namespace": "default"
  },
  "spec": {
      "progressDeadlineSeconds": 600,
      "replicas": 3,
      "revisionHistoryLimit": 10,
      "selector": {
          "matchLabels": {
              "app.kubernetes.io/instance": "qhx",
              "app.kubernetes.io/name": "qhx"
          }
      },
      "strategy": {
          "rollingUpdate": {
              "maxSurge": "25%",
              "maxUnavailable": "25%"
          },
          "type": "RollingUpdate"
      },
      "template": {
          "metadata": {
              "creationTimestamp": null,
              "labels": {
                  "app.kubernetes.io/instance": "qhx",
                  "app.kubernetes.io/name": "qhx"
              }
          },
          "spec": {
              "affinity": {
                  "nodeAffinity": {
                      "requiredDuringSchedulingIgnoredDuringExecution": {
                          "nodeSelectorTerms": [
                              {
                                  "matchExpressions": [
                                      {
                                          "key": "app",
                                          "operator": "In",
                                          "values": [
                                              "soamaster"
                                          ]
                                      }
                                  ]
                              }
                          ]
                      }
                  }
              },
              "containers": [
                  {
                      "image": "harbor.ks.x/eclipse-che/nginx:1.21.5",
                      "imagePullPolicy": "IfNotPresent",
                      "livenessProbe": {
                          "failureThreshold": 3,
                          "httpGet": {
                              "path": "/",
                              "port": "http",
                              "scheme": "HTTP"
                          },
                          "periodSeconds": 10,
                          "successThreshold": 1,
                          "timeoutSeconds": 1
                      },
                      "name": "qhx",
                      "ports": [
                          {
                              "containerPort": 80,
                              "name": "http",
                              "protocol": "TCP"
                          }
                      ],
                      "readinessProbe": {
                          "failureThreshold": 3,
                          "httpGet": {
                              "path": "/",
                              "port": "http",
                              "scheme": "HTTP"
                          },
                          "periodSeconds": 10,
                          "successThreshold": 1,
                          "timeoutSeconds": 1
                      },
                      "resources": {},
                      "securityContext": {},
                      "terminationMessagePath": "/dev/termination-log",
                      "terminationMessagePolicy": "File"
                  }
              ],
              "dnsPolicy": "ClusterFirst",
              "restartPolicy": "Always",
              "schedulerName": "default-scheduler",
              "securityContext": {},
              "serviceAccount": "qhx",
              "serviceAccountName": "qhx",
              "terminationGracePeriodSeconds": 30,
              "tolerations": [
                  {
                      "effect": "NoSchedule",
                      "key": "app",
                      "operator": "Equal",
                      "value": "soamaster"
                  }
              ]
          }
      }
  },
  "status": {
      "availableReplicas": 3,
      "conditions": [
          {
              "lastTransitionTime": "2025-03-05T06:25:09Z",
              "lastUpdateTime": "2025-03-05T06:26:30Z",
              "message": "ReplicaSet \"qhx-748f58787f\" has successfully progressed.",
              "reason": "NewReplicaSetAvailable",
              "status": "True",
              "type": "Progressing"
          },
          {
              "lastTransitionTime": "2025-03-05T06:31:53Z",
              "lastUpdateTime": "2025-03-05T06:31:53Z",
              "message": "Deployment has minimum availability.",
              "reason": "MinimumReplicasAvailable",
              "status": "True",
              "type": "Available"
          }
      ],
      "observedGeneration": 8,
      "readyReplicas": 3,
      "replicas": 3,
      "updatedReplicas": 3
  }
}
