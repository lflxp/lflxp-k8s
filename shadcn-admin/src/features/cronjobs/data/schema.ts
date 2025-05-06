import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const cronjobSchema = z.object({
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
    schedule: z.string().optional(),
    concurrencyPolicy: z.enum(['Allow', 'Forbid', 'Replace']).optional(),
    suspend: z.boolean().optional(),
    successfulJobsHistoryLimit: z.number().optional(),
    failedJobsHistoryLimit: z.number().optional(),
    jobTemplate: z.object({
      apiVersion: z.string().optional(),
      kind: z.string().optional(),
      metadata: z.object({
        name: z.string().optional(),
        namespace: z.string().optional(),
        labels: z.record(z.string(), z.string()).optional(),
        annotations: z.record(z.string(), z.string()).optional(),
      }).optional(),
      spec: z.object({
        template: z.object({
          spec: z.object({
            containers: z.array(z.object({
              name: z.string(),
              image: z.string(),
              command: z.array(z.string()).optional(),
              args: z.array(z.string()).optional(),
              env: z.array(z.object({
                name: z.string(),
                value: z.string().optional(),
                valueFrom: z.object({
                  fieldRef: z.object({
                    fieldPath: z.string()
                  }).optional()
                }).optional()
              })).optional()
            })).optional()
          }).optional()
        }).optional()
      }).optional()
    }).optional()
  }).optional(),
  status: z.object({
    active: z.array(z.object({
      name: z.string(),
      namespace: z.string(),
      uid: z.string(),
      resourceVersion: z.string(),
      kind: z.string(),
    })).optional(),
    lastScheduleTime: z.string().optional(),
    conditions: z.array(z.object({
      type: z.string(),
      status: z.string(),
      lastUpdateTime: z.string().optional(),
      lastTransitionTime: z.string().optional(),
      reason: z.string().optional(),
      message: z.string().optional()
    })).optional()
  }).optional(),
});

export const newSchema = z.object({
  name: z.string(),
  namespace: z.string(),
  crd: cronjobSchema,
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

export type Pod = z.infer<typeof newSchema>;
