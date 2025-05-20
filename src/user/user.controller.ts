import { FastifyReply, FastifyRequest } from "fastify";

import { getSaveUserStatusService, saveUserService } from "./user.service";
import { FastifyRequestZod } from "../global.types";

export async function saveUserController(
  req: FastifyRequestZod,
  reply: FastifyReply
) {
  const newUser = req.body;

  if (!newUser) reply.status(400).send({ message: "Dados inválidos" });

  const { status, response } = await saveUserService(newUser);

  reply.status(status).send(response);
}

export async function getSaveUserStatusController(
  req: FastifyRequestZod,
  reply: FastifyReply
) {
  const { id } = req.params as { id: string };

  if (!id) reply.status(400).send({ message: "Dados inválidos" });

  const { status, response } = await getSaveUserStatusService(id);

  reply.status(status).send(response);
}

export async function getSuperUsersController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  // Filtro: score >= 900 e active = true
  // Retorna os dados e o tempo de processamento da requisição.
}
