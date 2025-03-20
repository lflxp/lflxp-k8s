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
    annotations: z.record(z.string(), z.string()).optional(),
    uid: z.string(),
    creationTimestamp: z.string().optional(),
  }),
  spec: z.object({
    containers: z.array(z.object({
      name: z.string(),
      image: z.string(),
      ports: z.array(z.object({
        containerPort: z.number()
      })).optional(),
    })),
    restartPolicy: z.enum(['Always', 'OnFailure', 'Never']).optional(),
    terminationGracePeriodSeconds: z.number().optional()
  }),
  status: z.object({
    phase: z.enum(['Pending', 'Running', 'Succeeded', 'Failed', 'Unknown']).optional(),
    conditions: z.array(z.object({
      type: z.string(),
      status: z.string(),
      lastProbeTime: z.string().nullable().optional(),
      lastTransitionTime: z.string().optional(),
      reason: z.string().optional(),
    })).optional(),
    hostIP: z.string().optional(),
    podIP: z.string().optional(),
    startTime: z.string().optional(),
    containerStatuses: z.array(z.object({
      name: z.string(),
      state: z.object({
        running: z.object({
          startedAt: z.string().optional()
        }).optional(),
        waiting: z.object({
          reason: z.string().optional(),
          message: z.string().optional()
        }).optional(),
        terminated: z.object({
          exitCode: z.number(),
          reason: z.string().optional(),
          message: z.string().optional(),
          startedAt: z.string().optional(),
          finishedAt: z.string().optional()
        }).optional()
      }).optional(),
      lastState: z.object({
        running: z.object({
          startedAt: z.string().optional()
        }).optional(),
        waiting: z.object({
          reason: z.string().optional(),
          message: z.string().optional()
        }).optional(),
        terminated: z.object({
          exitCode: z.number(),
          reason: z.string().optional(),
          message: z.string().optional(),
          startedAt: z.string().optional(),
          finishedAt: z.string().optional()
        }).optional()
      }).optional(),
      ready: z.boolean(),
      restartCount: z.number(),
      image: z.string(),
      imageID: z.string(),
      containerID: z.string().optional()
    })).optional()
  }).optional()
});

export const newSchema = z.object({
  id: z.number(),
  hostip: z.string(),
  name: z.string(),
  namespace: z.string(),
  podip: z.string(),
  restart: z.number(),
  status: z.string(),
  statuss: z.object({
    phase: z.enum(['Pending', 'Running', 'Succeeded', 'Failed', 'Unknown']).optional(),
    conditions: z.array(z.object({
      type: z.string(),
      status: z.string(),
      lastProbeTime: z.string().nullable().optional(),
      lastTransitionTime: z.string().optional(),
      reason: z.string().optional(),
    })).optional(),
    hostIP: z.string().optional(),
    podIP: z.string().optional(),
    startTime: z.string().optional(),
    qosClass: z.string().optional(),
    containerStatuses: z.array(z.object({
      name: z.string(),
      state: z.object({
        running: z.object({
          startedAt: z.string().optional()
        }).optional(),
        waiting: z.object({
          reason: z.string().optional(),
          message: z.string().optional()
        }).optional(),
        terminated: z.object({
          exitCode: z.number(),
          reason: z.string().optional(),
          message: z.string().optional(),
          startedAt: z.string().optional(),
          finishedAt: z.string().optional()
        }).optional()
      }).optional(),
      lastState: z.object({
        running: z.object({
          startedAt: z.string().optional()
        }).optional(),
        waiting: z.object({
          reason: z.string().optional(),
          message: z.string().optional()
        }).optional(),
        terminated: z.object({
          exitCode: z.number(),
          reason: z.string().optional(),
          message: z.string().optional(),
          startedAt: z.string().optional(),
          finishedAt: z.string().optional()
        }).optional()
      }).optional(),
      ready: z.boolean(),
      restartCount: z.number(),
      image: z.string(),
      imageID: z.string(),
      containerID: z.string().optional()
    })).optional()
  }).optional(), 
  createtime: z.string(),
  containerStatuses: z.array(z.object({
    name: z.string(),
    state: z.object({
      running: z.object({
        startedAt: z.string().optional()
      }).optional(),
      waiting: z.object({
        reason: z.string().optional(),
        message: z.string().optional()
      }).optional(),
      terminated: z.object({
        exitCode: z.number(),
        reason: z.string().optional(),
        message: z.string().optional(),
        finishedAt: z.string().optional()
      }).optional()
    }).optional(),
    ready: z.boolean(),
    restartCount: z.number(),
    image: z.string(),
    imageID: z.string(),
    containerID: z.string().optional()
  })).optional(),
  controller: z.array(z.object({
    apiVersion: z.string(),
    blockOwnerDeletion: z.boolean().optional(),
    controller: z.boolean().optional(),
    name: z.string(),
    kind: z.string(),
    uid: z.string()
  })).optional()
})

export type Pod = z.infer<typeof newSchema>;
