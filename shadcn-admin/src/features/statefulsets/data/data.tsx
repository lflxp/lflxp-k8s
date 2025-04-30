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
  "kind": "StatefulSet",
  "metadata": {
      "annotations": {
          "meta.helm.sh/release-name": "mysql",
          "meta.helm.sh/release-namespace": "middleware"
      },
      "creationTimestamp": "2024-10-21T13:28:02Z",
      "generation": 1,
      "labels": {
          "app.kubernetes.io/component": "primary",
          "app.kubernetes.io/instance": "mysql",
          "app.kubernetes.io/managed-by": "Helm",
          "app.kubernetes.io/name": "mysql",
          "app.kubernetes.io/version": "8.0.35",
          "helm.sh/chart": "mysql-9.14.3"
      },
      "name": "demo-sts",
      "namespace": "default",
  },
  "spec": {
      "podManagementPolicy": "OrderedReady",
      "replicas": 1,
      "revisionHistoryLimit": 10,
      "selector": {
          "matchLabels": {
              "app.kubernetes.io/component": "primary",
              "app.kubernetes.io/instance": "mysql",
              "app.kubernetes.io/name": "mysql"
          }
      },
      "serviceName": "mysql",
      "template": {
          "metadata": {
              "annotations": {
                  "checksum/configuration": "8b84a6c1ac6d4dc81899efc7d112ac5b0df91b510eb06345a0b7fbb076f92416"
              },
              "creationTimestamp": null,
              "labels": {
                  "app.kubernetes.io/component": "primary",
                  "app.kubernetes.io/instance": "mysql",
                  "app.kubernetes.io/managed-by": "Helm",
                  "app.kubernetes.io/name": "mysql",
                  "app.kubernetes.io/version": "8.0.35",
                  "helm.sh/chart": "mysql-9.14.3"
              }
          },
          "spec": {
              "affinity": {
                  "podAntiAffinity": {
                      "preferredDuringSchedulingIgnoredDuringExecution": [
                          {
                              "podAffinityTerm": {
                                  "labelSelector": {
                                      "matchLabels": {
                                          "app.kubernetes.io/instance": "mysql",
                                          "app.kubernetes.io/name": "mysql"
                                      }
                                  },
                                  "topologyKey": "kubernetes.io/hostname"
                              },
                              "weight": 1
                          }
                      ]
                  }
              },
              "containers": [
                  {
                      "env": [
                          {
                              "name": "BITNAMI_DEBUG",
                              "value": "false"
                          },
                          {
                              "name": "MYSQL_ROOT_PASSWORD",
                              "valueFrom": {
                                  "secretKeyRef": {
                                      "key": "mysql-root-password",
                                      "name": "mysql"
                                  }
                              }
                          },
                          {
                              "name": "MYSQL_DATABASE",
                              "value": "my_database"
                          }
                      ],
                      "image": "docker.io/bitnami/mysql:8.0.35-debian-11-r0",
                      "imagePullPolicy": "IfNotPresent",
                      "livenessProbe": {
                          "exec": {
                              "command": [
                                  "/bin/bash",
                                  "-ec",
                                  "password_aux=\"${MYSQL_ROOT_PASSWORD:-}\"\nif [[ -f \"${MYSQL_ROOT_PASSWORD_FILE:-}\" ]]; then\n    password_aux=$(cat \"$MYSQL_ROOT_PASSWORD_FILE\")\nfi\nmysqladmin status -uroot -p\"${password_aux}\"\n"
                              ]
                          },
                          "failureThreshold": 3,
                          "initialDelaySeconds": 5,
                          "periodSeconds": 10,
                          "successThreshold": 1,
                          "timeoutSeconds": 1
                      },
                      "name": "mysql",
                      "ports": [
                          {
                              "containerPort": 3306,
                              "name": "mysql",
                              "protocol": "TCP"
                          }
                      ],
                      "readinessProbe": {
                          "exec": {
                              "command": [
                                  "/bin/bash",
                                  "-ec",
                                  "password_aux=\"${MYSQL_ROOT_PASSWORD:-}\"\nif [[ -f \"${MYSQL_ROOT_PASSWORD_FILE:-}\" ]]; then\n    password_aux=$(cat \"$MYSQL_ROOT_PASSWORD_FILE\")\nfi\nmysqladmin status -uroot -p\"${password_aux}\"\n"
                              ]
                          },
                          "failureThreshold": 3,
                          "initialDelaySeconds": 5,
                          "periodSeconds": 10,
                          "successThreshold": 1,
                          "timeoutSeconds": 1
                      },
                      "resources": {},
                      "securityContext": {
                          "allowPrivilegeEscalation": false,
                          "capabilities": {
                              "drop": [
                                  "ALL"
                              ]
                          },
                          "runAsNonRoot": true,
                          "runAsUser": 1001,
                          "seccompProfile": {
                              "type": "RuntimeDefault"
                          }
                      },
                      "startupProbe": {
                          "exec": {
                              "command": [
                                  "/bin/bash",
                                  "-ec",
                                  "password_aux=\"${MYSQL_ROOT_PASSWORD:-}\"\nif [[ -f \"${MYSQL_ROOT_PASSWORD_FILE:-}\" ]]; then\n    password_aux=$(cat \"$MYSQL_ROOT_PASSWORD_FILE\")\nfi\nmysqladmin status -uroot -p\"${password_aux}\"\n"
                              ]
                          },
                          "failureThreshold": 10,
                          "initialDelaySeconds": 15,
                          "periodSeconds": 10,
                          "successThreshold": 1,
                          "timeoutSeconds": 1
                      },
                      "terminationMessagePath": "/dev/termination-log",
                      "terminationMessagePolicy": "File",
                      "volumeMounts": [
                          {
                              "mountPath": "/bitnami/mysql",
                              "name": "data"
                          },
                          {
                              "mountPath": "/opt/bitnami/mysql/conf/my.cnf",
                              "name": "config",
                              "subPath": "my.cnf"
                          }
                      ]
                  }
              ],
              "dnsPolicy": "ClusterFirst",
              "nodeSelector": {
                  "app": "middleware",
                  "soa/region": "middleware"
              },
              "restartPolicy": "Always",
              "schedulerName": "default-scheduler",
              "securityContext": {
                  "fsGroup": 1001
              },
              "serviceAccount": "mysql",
              "serviceAccountName": "mysql",
              "terminationGracePeriodSeconds": 30,
              "tolerations": [
                  {
                      "effect": "NoSchedule",
                      "key": "soa/region",
                      "operator": "Equal",
                      "value": "middleware"
                  }
              ],
              "volumes": [
                  {
                      "configMap": {
                          "defaultMode": 420,
                          "name": "mysql"
                      },
                      "name": "config"
                  }
              ]
          }
      },
      "updateStrategy": {
          "type": "RollingUpdate"
      },
      "volumeClaimTemplates": [
          {
              "apiVersion": "v1",
              "kind": "PersistentVolumeClaim",
              "metadata": {
                  "creationTimestamp": null,
                  "labels": {
                      "app.kubernetes.io/component": "primary",
                      "app.kubernetes.io/instance": "mysql",
                      "app.kubernetes.io/name": "mysql"
                  },
                  "name": "data"
              },
              "spec": {
                  "accessModes": [
                      "ReadWriteOnce"
                  ],
                  "resources": {
                      "requests": {
                          "storage": "8Gi"
                      }
                  },
                  "volumeMode": "Filesystem"
              },
              "status": {
                  "phase": "Pending"
              }
          }
      ]
  },
  "status": {
      "availableReplicas": 1,
      "collisionCount": 0,
      "currentReplicas": 1,
      "currentRevision": "mysql-85d55d8f6c",
      "observedGeneration": 1,
      "readyReplicas": 1,
      "replicas": 1,
      "updateRevision": "mysql-85d55d8f6c",
      "updatedReplicas": 1
  }
}