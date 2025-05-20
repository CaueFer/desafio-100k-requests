import { FastifyReply, FastifyRequest } from "fastify";
import { IUser } from "../global.types";

export async function saveUserController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const newUser: IUser = req.body;

  // VALIDAR USUARIO E JOGAR PRO BULLMQ

  // RECEBE E ARMAZENA USUARIO NO BANCO
}

export async function getSuperUsersController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  // Filtro: score >= 900 e active = true
  // Retorna os dados e o tempo de processamento da requisição.
}
