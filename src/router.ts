import {
  getSuperUsersController,
  saveUserController,
} from "./user/user.controller";

import { userSchema } from "./lib/helpers/zod.helper";
import { FastifyInstanceTypedZod } from "./global.types";

export function Router(app: FastifyInstanceTypedZod) {
  app.get("/superusers", {}, getSuperUsersController);

  app.post(
    "/users",
    {
      schema: {
        description: "Create new user",
        body: userSchema,
      },
    },
    saveUserController
  );
}
