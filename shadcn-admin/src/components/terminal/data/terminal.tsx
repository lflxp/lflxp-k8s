import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const terminalSchema = z.object({
  kind: z.string().optional(),
  data: z.object({
    url: z.string().optional(),
    name: z.string().optional(),
    namespace: z.string().optional(),
    container: z.string().optional(),
    image: z.string().optional(),
    command: z.string().optional(),
    args: z.array(z.string()).optional(),
    env: z.array(z.object({
      name: z.string(),
      value: z.string()
    })).optional(),
  }).optional()
});


export type TerminalData = z.infer<typeof terminalSchema>;
