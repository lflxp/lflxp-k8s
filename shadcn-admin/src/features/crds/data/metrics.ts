import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const metricsSchema = z.object({
  apiVersion: z.string(),
  kind: z.string().regex(/^Pod$/),
  metadata: z.object({
    name: z.string(),
    namespace: z.string().optional(),
    labels: z.record(z.string(), z.string()).optional(),
    annotations: z.record(z.string(), z.string()).optional(),
    uid: z.string(),
    creationTimestamp: z.string().optional(),
    ownerReferences: z.array(z.object({
      apiVersion: z.string(),
      kind: z.string(),
      name: z.string(),
      uid: z.string(),
      controller: z.boolean().optional(),
      blockOwnerDeletion: z.boolean().optional()
    })).optional(),
  }),
  usage: z.object({
    cpu: z.string(),
    memory: z.string(),
  }).optional(),
  window: z.string().optional(),
});

export type Metrics = z.infer<typeof metricsSchema>;
