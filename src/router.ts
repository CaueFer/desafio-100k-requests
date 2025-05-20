import { z } from "zod";

import {
  getSaveUserStatusController,
  getSuperUsersController,
  saveUserController,
} from "./user/user.controller";
import { userSchema } from "./lib/schemas/user.schema";
import { FastifyInstanceTypedZod } from "./global.types";

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
    getSaveUserStatusController
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
