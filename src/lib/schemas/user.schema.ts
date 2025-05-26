import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  age: z.number(),
  score: z.number(),
  active: z.boolean(),
  country: z.string(),
  team: z.object({
    id: z.number().optional(),
    name: z.string(),
    leader: z.boolean(),
    projects: z.array(
      z.object({
        id: z.number().optional(),
        name: z.string(),
        completed: z.boolean(),
      })
    ),
  }),
  logs: z.array(
    z.object({
      id: z.number().optional(),
      date: z.string(),
      action: z.enum(["login", "logout"]),
    })
  ),
});

export type UserSchema = z.infer<typeof userSchema>;
