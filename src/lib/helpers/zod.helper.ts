import { z } from "zod/v4";

export const userSchema = z.object({
  name: z.string(),
  age: z.string(),
  score: z.string(),
  active: z.string(),
  country: z.string(),
  team: z.object({
    name: z.string(),
    leader: z.string(),
    projects: z.array(
      z.object({
        name: z.string(),
        completed: z.string(),
      })
    ),
  }),
  logs: z.array(
    z.object({
      data: z.string(),
      action: z.enum(["login", "logout"]),
    })
  ),
});
