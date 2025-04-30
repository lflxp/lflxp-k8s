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
  "kind": "DaemonSet",
  "metadata": {
      "annotations": {
          "deprecated.daemonset.template.generation": "1",
          "kubectl.kubernetes.io/last-applied-configuration": "{\"apiVersion\":\"apps/v1\",\"kind\":\"DaemonSet\",\"metadata\":{\"annotations\":{},\"labels\":{\"app.kubernetes.io/component\":\"exporter\",\"app.kubernetes.io/name\":\"node-exporter\",\"app.kubernetes.io/part-of\":\"kube-prometheus\",\"app.kubernetes.io/version\":\"1.5.0\"},\"name\":\"node-exporter\",\"namespace\":\"monitoring\"},\"spec\":{\"selector\":{\"matchLabels\":{\"app.kubernetes.io/component\":\"exporter\",\"app.kubernetes.io/name\":\"node-exporter\",\"app.kubernetes.io/part-of\":\"kube-prometheus\"}},\"template\":{\"metadata\":{\"annotations\":{\"kubectl.kubernetes.io/default-container\":\"node-exporter\"},\"labels\":{\"app.kubernetes.io/component\":\"exporter\",\"app.kubernetes.io/name\":\"node-exporter\",\"app.kubernetes.io/part-of\":\"kube-prometheus\",\"app.kubernetes.io/version\":\"1.5.0\"}},\"spec\":{\"automountServiceAccountToken\":true,\"containers\":[{\"args\":[\"--web.listen-address=127.0.0.1:9100\",\"--path.sysfs=/host/sys\",\"--path.rootfs=/host/root\",\"--path.udev.data=/host/root/run/udev/data\",\"--no-collector.wifi\",\"--no-collector.hwmon\",\"--collector.filesystem.mount-points-exclude=^/(dev|proc|sys|run/k3s/containerd/.+|var/lib/docker/.+|var/lib/kubelet/pods/.+)($|/)\",\"--collector.netclass.ignored-devices=^(veth.*|[a-f0-9]{15})$\",\"--collector.netdev.device-exclude=^(veth.*|[a-f0-9]{15})$\"],\"image\":\"quay.io/prometheus/node-exporter:v1.5.0\",\"name\":\"node-exporter\",\"resources\":{\"limits\":{\"cpu\":\"250m\",\"memory\":\"180Mi\"},\"requests\":{\"cpu\":\"102m\",\"memory\":\"180Mi\"}},\"securityContext\":{\"allowPrivilegeEscalation\":false,\"capabilities\":{\"add\":[\"SYS_TIME\"],\"drop\":[\"ALL\"]},\"readOnlyRootFilesystem\":true},\"volumeMounts\":[{\"mountPath\":\"/host/sys\",\"mountPropagation\":\"HostToContainer\",\"name\":\"sys\",\"readOnly\":true},{\"mountPath\":\"/host/root\",\"mountPropagation\":\"HostToContainer\",\"name\":\"root\",\"readOnly\":true}]},{\"args\":[\"--logtostderr\",\"--secure-listen-address=[$(IP)]:9100\",\"--tls-cipher-suites=TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305\",\"--upstream=http://127.0.0.1:9100/\"],\"env\":[{\"name\":\"IP\",\"valueFrom\":{\"fieldRef\":{\"fieldPath\":\"status.podIP\"}}}],\"image\":\"quay.io/brancz/kube-rbac-proxy:v0.14.0\",\"name\":\"kube-rbac-proxy\",\"ports\":[{\"containerPort\":9100,\"hostPort\":9100,\"name\":\"https\"}],\"resources\":{\"limits\":{\"cpu\":\"20m\",\"memory\":\"40Mi\"},\"requests\":{\"cpu\":\"10m\",\"memory\":\"20Mi\"}},\"securityContext\":{\"allowPrivilegeEscalation\":false,\"capabilities\":{\"drop\":[\"ALL\"]},\"readOnlyRootFilesystem\":true,\"runAsGroup\":65532,\"runAsNonRoot\":true,\"runAsUser\":65532}}],\"hostNetwork\":true,\"hostPID\":true,\"nodeSelector\":{\"kubernetes.io/os\":\"linux\"},\"priorityClassName\":\"system-cluster-critical\",\"securityContext\":{\"runAsNonRoot\":true,\"runAsUser\":65534},\"serviceAccountName\":\"node-exporter\",\"tolerations\":[{\"operator\":\"Exists\"}],\"volumes\":[{\"hostPath\":{\"path\":\"/sys\"},\"name\":\"sys\"},{\"hostPath\":{\"path\":\"/\"},\"name\":\"root\"}]}},\"updateStrategy\":{\"rollingUpdate\":{\"maxUnavailable\":\"10%\"},\"type\":\"RollingUpdate\"}}}\n"
      },
      "creationTimestamp": "2025-02-17T10:01:28Z",
      "generation": 1,
      "labels": {
          "app.kubernetes.io/component": "exporter",
          "app.kubernetes.io/name": "node-exporter",
          "app.kubernetes.io/part-of": "kube-prometheus",
          "app.kubernetes.io/version": "1.5.0"
      },
      "name": "demo-exporter",
      "namespace": "default",
  },
  "spec": {
      "revisionHistoryLimit": 10,
      "selector": {
          "matchLabels": {
              "app.kubernetes.io/component": "exporter",
              "app.kubernetes.io/name": "node-exporter",
              "app.kubernetes.io/part-of": "kube-prometheus"
          }
      },
      "template": {
          "metadata": {
              "annotations": {
                  "kubectl.kubernetes.io/default-container": "node-exporter"
              },
              "creationTimestamp": null,
              "labels": {
                  "app.kubernetes.io/component": "exporter",
                  "app.kubernetes.io/name": "node-exporter",
                  "app.kubernetes.io/part-of": "kube-prometheus",
                  "app.kubernetes.io/version": "1.5.0"
              }
          },
          "spec": {
              "automountServiceAccountToken": true,
              "containers": [
                  {
                      "args": [
                          "--web.listen-address=127.0.0.1:9100",
                          "--path.sysfs=/host/sys",
                          "--path.rootfs=/host/root",
                          "--path.udev.data=/host/root/run/udev/data",
                          "--no-collector.wifi",
                          "--no-collector.hwmon",
                          "--collector.filesystem.mount-points-exclude=^/(dev|proc|sys|run/k3s/containerd/.+|var/lib/docker/.+|var/lib/kubelet/pods/.+)($|/)",
                          "--collector.netclass.ignored-devices=^(veth.*|[a-f0-9]{15})$",
                          "--collector.netdev.device-exclude=^(veth.*|[a-f0-9]{15})$"
                      ],
                      "image": "quay.io/prometheus/node-exporter:v1.5.0",
                      "imagePullPolicy": "IfNotPresent",
                      "name": "node-exporter",
                      "resources": {
                          "limits": {
                              "cpu": "250m",
                              "memory": "180Mi"
                          },
                          "requests": {
                              "cpu": "102m",
                              "memory": "180Mi"
                          }
                      },
                      "securityContext": {
                          "allowPrivilegeEscalation": false,
                          "capabilities": {
                              "add": [
                                  "SYS_TIME"
                              ],
                              "drop": [
                                  "ALL"
                              ]
                          },
                          "readOnlyRootFilesystem": true
                      },
                      "terminationMessagePath": "/dev/termination-log",
                      "terminationMessagePolicy": "File",
                      "volumeMounts": [
                          {
                              "mountPath": "/host/sys",
                              "mountPropagation": "HostToContainer",
                              "name": "sys",
                              "readOnly": true
                          },
                          {
                              "mountPath": "/host/root",
                              "mountPropagation": "HostToContainer",
                              "name": "root",
                              "readOnly": true
                          }
                      ]
                  },
                  {
                      "args": [
                          "--logtostderr",
                          "--secure-listen-address=[$(IP)]:9100",
                          "--tls-cipher-suites=TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
                          "--upstream=http://127.0.0.1:9100/"
                      ],
                      "env": [
                          {
                              "name": "IP",
                              "valueFrom": {
                                  "fieldRef": {
                                      "apiVersion": "v1",
                                      "fieldPath": "status.podIP"
                                  }
                              }
                          }
                      ],
                      "image": "quay.io/brancz/kube-rbac-proxy:v0.14.0",
                      "imagePullPolicy": "IfNotPresent",
                      "name": "kube-rbac-proxy",
                      "ports": [
                          {
                              "containerPort": 9100,
                              "hostPort": 9100,
                              "name": "https",
                              "protocol": "TCP"
                          }
                      ],
                      "resources": {
                          "limits": {
                              "cpu": "20m",
                              "memory": "40Mi"
                          },
                          "requests": {
                              "cpu": "10m",
                              "memory": "20Mi"
                          }
                      },
                      "securityContext": {
                          "allowPrivilegeEscalation": false,
                          "capabilities": {
                              "drop": [
                                  "ALL"
                              ]
                          },
                          "readOnlyRootFilesystem": true,
                          "runAsGroup": 65532,
                          "runAsNonRoot": true,
                          "runAsUser": 65532
                      },
                      "terminationMessagePath": "/dev/termination-log",
                      "terminationMessagePolicy": "File"
                  }
              ],
              "dnsPolicy": "ClusterFirst",
              "hostNetwork": true,
              "hostPID": true,
              "nodeSelector": {
                  "kubernetes.io/os": "linux"
              },
              "priorityClassName": "system-cluster-critical",
              "restartPolicy": "Always",
              "schedulerName": "default-scheduler",
              "securityContext": {
                  "runAsNonRoot": true,
                  "runAsUser": 65534
              },
              "serviceAccount": "node-exporter",
              "serviceAccountName": "node-exporter",
              "terminationGracePeriodSeconds": 30,
              "tolerations": [
                  {
                      "operator": "Exists"
                  }
              ],
              "volumes": [
                  {
                      "hostPath": {
                          "path": "/sys",
                          "type": ""
                      },
                      "name": "sys"
                  },
                  {
                      "hostPath": {
                          "path": "/",
                          "type": ""
                      },
                      "name": "root"
                  }
              ]
          }
      },
      "updateStrategy": {
          "rollingUpdate": {
              "maxSurge": 0,
              "maxUnavailable": "10%"
          },
          "type": "RollingUpdate"
      }
  },
  "status": {
      "currentNumberScheduled": 5,
      "desiredNumberScheduled": 5,
      "numberAvailable": 5,
      "numberMisscheduled": 0,
      "numberReady": 5,
      "observedGeneration": 1,
      "updatedNumberScheduled": 5
  }
}