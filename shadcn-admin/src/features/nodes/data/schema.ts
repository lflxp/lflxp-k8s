import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const nodeSchema = z.object({
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
  spec: z.object({
    podCIDR: z.string().optional(),
    podCIDRs: z.array(z.string()).optional(),
    providerID: z.string().optional(),
    unschedulable: z.boolean().optional(),
    taints: z.array(z.object({
      key: z.string(),
      value: z.string(),
      effect: z.string().optional(),
    })).optional(),
  }),
  status: z.object({
    addresses: z.array(z.object({
      type: z.string(),
      address: z.string(),
    })).optional(),
    conditions: z.array(z.object({
      type: z.string(),
      status: z.string(),
      lastProbeTime: z.string().optional(),
      lastTransitionTime: z.string().optional(),
      message: z.string().optional(),
      reason: z.string().optional(),
    })).optional(),
    images: z.array(z.object({
      names: z.array(z.string()),
      sizeBytes: z.number().optional(),
    })).optional(),
    nodeInfo: z.object({
      architecture: z.string(),
      bootID: z.string().optional(),
      containerRuntimeVersion: z.string().optional(),
      kernelVersion: z.string().optional(),
      kubeProxyVersion: z.string().optional(),
      kubeletVersion: z.string().optional(),
      machineID: z.string().optional(),
      operatingSystem: z.string().optional(),
      osImage: z.string().optional(),
      systemUUID: z.string().optional(),
    }),
    allocatable: z.object({
      cpu: z.string(),
      memory: z.string(),
      pods: z.string(),
      "ephemeral-storage": z.string(),
      "hugepages-1Gi": z.string().optional(),
      "hugepages-2Mi": z.string().optional(),
    }).optional(),
    capacity: z.object({
      cpu: z.string(),
      memory: z.string(),
      pods: z.string(),
      "ephemeral-storage": z.string(),
      "hugepages-1Gi": z.string().optional(),
      "hugepages-2Mi": z.string().optional(),
    }).optional()
  }).optional(),
  metrics: z.object({
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
    timestamp: z.string(),
    window: z.string(),
    usage: z.object({
      cpu: z.string(),
      memory: z.string(),
    })
  })
});

export type Node = z.infer<typeof nodeSchema>;
