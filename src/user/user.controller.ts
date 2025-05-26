import { FastifyReply, FastifyRequest } from "fastify";

import {
  getSaveUserStatusService as getUserJobStatusService,
  saveUserService,
} from "./user.service.js";
import { userSchema } from "../lib/schemas/user.schema.js";
import { hrtime } from "node:process";

export async function saveUserController(
  req: FastifyRequest<{ Body: typeof userSchema._type }>,
  reply: FastifyReply
) {
  try {
    const newUser = req.body;

    if (!newUser) reply.status(400).send({ message: "Dados inválidos" });

    const { status, response } = await saveUserService(newUser);

    reply.status(status).send(response);
  } catch (err) {
    console.log("[Error saveUserController]: ", err);

    reply.status(500).send({ message: "Ocorreu um erro, tenta novamente." });
  }
}

export async function getUserJobStatusController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const start = hrtime();
    const { id } = req.params as { id: string };

    if (!id) reply.status(400).send({ message: "Dados inválidos" });

    const { status, response } = await getUserJobStatusService(id);

    const [seconds, nanosec] = hrtime(start);
    const finalTimer = seconds * 1000 + nanosec / 1e6;

    reply.status(status).send({ ...response, timer: finalTimer });
  } catch (err) {
    console.log("[Error getUserJobStatusController]: ", err);

    reply.status(500).send({ message: "Ocorreu um erro, tenta novamente." });
  }
}
