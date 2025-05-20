import { FastifyInstance } from "fastify";

import {
  getSuperUsersController,
  saveUserController,
} from "./lib/user/user.controller";

export function Router(app: FastifyInstance) {
  app.get("/superusers", getSuperUsersController);

  app.post("/users", saveUserController);
}
