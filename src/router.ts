import { z } from "zod";

import {
  getUserJobStatusController,
  getSuperUsersController,
  saveUserController,
} from "./user/user.controller.js";

import { userSchema } from "./lib/schemas/user.schema.js";
import { FastifyInstanceTypedZod } from "./global.types.js";

export function Router(app: FastifyInstanceTypedZod) {
  app.get("/superusers", {}, getSuperUsersController);

  app.get(
    "/user/:id",
    {
      schema: {
        tags: ["user"],
        description: "Get user status",
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
        description: "Create a new user",
        body: userSchema,
      },
    },
    saveUserController
  );
}
