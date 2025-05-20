import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

import { userSchema } from "./lib/schemas/user.schema";

export type FastifyInstanceTypedZod = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export type FastifyRequestZod = FastifyRequest<{
  Body: typeof userSchema._type;
}>;
