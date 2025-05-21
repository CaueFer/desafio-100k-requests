import { FastifyReply, FastifyRequest } from "fastify";

import {
  getSaveUserStatusService as getUserJobStatusService,
  saveUserService,
} from "./user.service.js";
import { userSchema } from "../lib/schemas/user.schema.js";

export async function saveUserController(
  req: FastifyRequest<{ Body: typeof userSchema._type }>,
  reply: FastifyReply
) {
  const newUser = req.body;

  if (!newUser) reply.status(400).send({ message: "Dados inválidos" });

  const { status, response } = await saveUserService(newUser);

  reply.status(status).send(response);
}

export async function getUserJobStatusController(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = req.params as { id: string };

  if (!id) reply.status(400).send({ message: "Dados inválidos" });

  const { status, response } = await getUserJobStatusService(id);

  reply.status(status).send(response);
}

export async function getSuperUsersController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  // Filtro: score >= 900 e active = true
  // Retorna os dados e o tempo de processamento da requisição.
}
