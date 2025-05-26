import {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export type FastifyInstanceTypedZod = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export interface DefaultResponse {
  message?: string;
  id?: string;
  job?: string;
}
