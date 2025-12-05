import { z } from "zod";

export const LogEntrySchema = z
  .object({
    _time: z.number().transform((val) => new Date(val).toISOString()),
    cid: z.string().optional(),
    channel: z.string().optional(),
    level: z.string().optional(),
    message: z.string().optional(),
    context: z.string().optional(),
  })
  .catchall(z.unknown());

export type LogEntry = z.infer<typeof LogEntrySchema>;
