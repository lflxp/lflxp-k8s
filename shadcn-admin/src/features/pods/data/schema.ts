import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const podSchema = z.object({
  apiVersion: z.string(),
  kind: z.string().regex(/^Pod$/),
  metadata: z.object({
    name: z.string(),
    namespace: z.string().optional(),
    labels: z.record(z.string(), z.string()).optional(),
    annotations: z.record(z.string(), z.string()).optional()
  }),
  spec: z.object({
    containers: z.array(z.object({
      name: z.string(),
      image: z.string(),
      ports: z.array(z.object({
        containerPort: z.number()
      })).optional(),
      env: z.array(z.object({
        name: z.string(),
        value: z.string()
      })).optional()
    })),
    restartPolicy: z.enum(['Always', 'OnFailure', 'Never']).optional(),
    terminationGracePeriodSeconds: z.number().optional()
  }),
  status: z.object({
    phase: z.enum(['Pending', 'Running', 'Succeeded', 'Failed', 'Unknown']).optional()
  }).optional()
});

export type Pod = z.infer<typeof podSchema>;
