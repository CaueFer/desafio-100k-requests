import { z } from "zod";

import {
  getUserJobStatusController,
  saveUserController,
} from "./user/user.controller.js";

import { userSchema } from "./lib/schemas/user.schema.js";
import { FastifyInstanceTypedZod } from "./global.types.js";

export function Router(app: FastifyInstanceTypedZod) {
  app.get(
    "/user/:id",
    {
      schema: {
        tags: ["user"],
        description:
          "Return user status, polling every 10 seconds to check the status of a createUserJob",
        params: z.object({
          id: z.string(),
        }),
      },
    },
    getUserJobStatusController
  );

  app.post(
    "/user",
    {
      schema: {
        tags: ["user"],
        description: "Create a createUserJob and enqueue it in the Jobs queue",
        body: userSchema,
      },
    },
    saveUserController
  );
}
