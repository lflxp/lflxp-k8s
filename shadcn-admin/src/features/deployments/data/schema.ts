import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const deploymentSchema = z.object({
  apiVersion: z.string(),
  kind: z.string(),
  metadata: z.object({
    name: z.string(),
    namespace: z.string().optional(),
    labels: z.record(z.string(), z.string()).optional(),
    annotations: z.record(z.string(), z.string()).optional(),
    creationTimestamp: z.string().optional(),
    resourceVersion: z.string().optional(),
    uid: z.string().optional(),
  }).optional(),
  spec: z.object({
    replicas: z.number().optional(),
    selector: z.object({
      matchLabels: z.record(z.string(), z.string()).optional(),
      matchExpressions: z.array(z.object({
        key: z.string(),
        operator: z.enum(['In', 'NotIn', 'Exists', 'DoesNotExist']),
        values: z.array(z.string()).optional(),
      })).optional(),
    }).optional(),
    template: z.object({
      metadata: z.object({
        labels: z.record(z.string(), z.string()).optional(),
        annotations: z.record(z.string(), z.string()).optional(),
      }).optional(),
      spec: z.object({
        containers: z.array(z.object({
          name: z.string(),
          image: z.string(),
          ports: z.array(z.object({
            containerPort: z.number(),
            protocol: z.string().optional(),
          })).optional(),
          env: z.array(z.object({
            name: z.string(),
            value: z.string().optional(),
            valueFrom: z.object({
              fieldRef: z.object({
                fieldPath: z.string(),
              }).optional(),
              secretKeyRef: z.object({
                name: z.string(),
                key: z.string(),
              }).optional(),
              configMapKeyRef: z.object({
                name: z.string(),
                key: z.string(),
              }).optional(),
            }).optional(),
          })).optional(),
          resources: z.object({
            limits: z.record(z.string(), z.string()).optional(),
            requests: z.record(z.string(), z.string()).optional(),
          }).optional(),
        })),
        restartPolicy: z.string().optional(),
        nodeSelector: z.record(z.string(), z.string()).optional(),
        serviceAccountName: z.string().optional(),
        affinity: z.object({
          nodeAffinity: z.object({
            requiredDuringSchedulingIgnoredDuringExecution: z.object({
              nodeSelectorTerms: z.array(z.object({
                matchExpressions: z.array(z.object({
                  key: z.string(),
                  operator: z.enum(['In', 'NotIn', 'Exists', 'DoesNotExist', 'Gt', 'Lt']),
                  values: z.array(z.string()).optional(),
                })),
              })),
            }).optional(),
          }).optional(),
        }).optional(),
      }).optional(),
    }).optional(),
  }).optional(),
  status: z.object({
    availableReplicas: z.number().optional(),
    unavailableReplicas: z.number().optional(),
    readyReplicas: z.number().optional(),
    updatedReplicas: z.number().optional(),
    replicas: z.number().optional(),
    observedGeneration: z.number().optional(),
    conditions: z.array(z.object({
      type: z.string(),
      status: z.string(),
      lastUpdateTime: z.string().optional(),
      lastTransitionTime: z.string().optional(),
      reason: z.string().optional(),
      message: z.string().optional(),
    })).optional(),
  }).optional(),
});

export const newSchema = z.object({
  name: z.string(),
  namespace: z.string(),
  crd: deploymentSchema,
  status: z.object({
    availableReplicas: z.number().optional(),
    unavailableReplicas: z.number().optional(),
    readyReplicas: z.number().optional(),
    updatedReplicas: z.number().optional(),
    replicas: z.number().optional(),
    observedGeneration: z.number().optional(),
    conditions: z.array(z.object({
      type: z.string(),
      status: z.string(),
      lastUpdateTime: z.string().optional(),
      lastTransitionTime: z.string().optional(),
      reason: z.string().optional(),
      message: z.string().optional(),
    })).optional(),
  }).optional(), 
})

export interface ContainerStatus {
  name: string
  state?: {
    running?: { startedAt?: string }
    waiting?: { reason?: string; message?: string }
    terminated?: { exitCode: number; reason?: string; message?: string; finishedAt?: string }
  }
  ready: boolean
  restartCount: number
  image: string
  imageID: string
  containerID?: string
}

// export type Pod = {
//   id: number
//   hostip: string
//   name: string
//   namespace: string
//   podip: string
//   restart: number
//   status: string
//   createtime: string
//   raw: Record<string, unknown>
//   containerStatuses?: ContainerStatus[]
// }

export type Pod = z.infer<typeof deploymentSchema>;
