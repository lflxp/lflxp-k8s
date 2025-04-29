import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const eventSchema = z.object({
  apiVersion: z.string(),
  kind: z.string().optional(),
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
  involvedObject: z.object({
    apiVersion: z.string(),
    kind: z.string(),
    name: z.string(),
    namespace: z.string().optional(),
    uid: z.string(),
  }),
  reason: z.string(),
  message: z.string(),
  source: z.object({
    component: z.string(),
    host: z.string().optional(),
  }),
  type: z.string(),
  eventTime: z.string().optional(),
  reportingComponent: z.string().optional(),
  reportingInstance: z.string().optional(),
  lastTimestamp: z.string().optional(),
  firstTimestamp: z.string().optional(),
  count: z.number().optional(),
});

export type Event = z.infer<typeof eventSchema>;

export interface ResourceResult {
  name: string; 
  kind: string; 
  namespaced: string; 
  singularName: string; 
  shortNames: string[]; 
  storageVersionHash: string;
  verbs: string[]; // Added verbs property
}

export interface ApiResource {
  groupVersion: string;
  apiVersion: string;
  kind: string;
  resources: ResourceResult[]; // Updated to use ResourceResult[]
}
// setEventsData(response.data.items);
export interface ApiResourceResult {
  group: string;
  version: string;
  kind: string;
  name: string;
  namespaced: string;
  singularName: string;
  shortNames?: string[];
  storageVersionHash?: string;
  verbs?: string[]; // Added verbs property
}

interface PreVersion {
  groupVersion: string;
  version: string;
}

export interface ApiGroup {
  name: string;
  versions: PreVersion[];
  preferredVersion: PreVersion;
}

export interface Crd {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace: string;
    labels: Record<string, string>;
    annotations: Record<string, string>;
    uid: string;
    creationTimestamp: string;
  };
}