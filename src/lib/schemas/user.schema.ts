import { z } from "zod";

export const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  score: z.number(),
  active: z.boolean(),
  country: z.string(),
  team: z.object({
    name: z.string(),
    leader: z.boolean(),
    projects: z.array(
      z.object({
        name: z.string(),
        completed: z.boolean(),
      })
    ),
  }),
  logs: z.array(
    z.object({
      date: z.string(),
      action: z.enum(["login", "logout"]),
    })
  ),
});

export type UserSchema = z.infer<typeof userSchema>;
