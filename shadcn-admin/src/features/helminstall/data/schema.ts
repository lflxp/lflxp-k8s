import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const repoSchema = z.object({
  apiVersion: z.string(),
  entries: z.record(
    z.string(),
    z.array(
      z.object({
        name: z.string(),
        version: z.string(),
        appVersion: z.string().optional(),
        description: z.string().optional(),
        urls: z.array(z.string()).optional(),
        digest: z.string().optional(),
        created: z.string().optional(),
        icon: z.string().optional(),
        sources: z.array(z.string()).optional(),
        home: z.string().optional(),
        keywords: z.array(z.string()).optional(),
        deprecated: z.boolean().optional(),
        maintainers: z.array(
            z.object({
              name: z.string(),
              email: z.string().optional(),
              url: z.string().optional(),
              homepage: z.string().optional(),
            })
          )
          .optional(),
        annotations: z.record(z.string(), z.string()).optional(),
      })
    )
  ),
});

export type Repo = z.infer<typeof repoSchema>;
