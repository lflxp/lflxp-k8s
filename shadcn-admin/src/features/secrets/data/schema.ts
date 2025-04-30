import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const secretSchema = z.object({
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
  data: z.record(z.string(), z.string()).optional(),
  stringData: z.record(z.string(), z.string()).optional(),
  immutable: z.boolean().optional(),
});

export const newSchema = z.object({
  name: z.string(),
  namespace: z.string(),
  crd: secretSchema,
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
