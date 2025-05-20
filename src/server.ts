import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";
import fastifyCors from "@fastify/cors";

import { Router } from "./router";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Desafio - API 100k request",
      description:
        "Desenvolvedor uma API que suporte 100k request ao mesmo tempo",
      version: "1.0.0",
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(Router, { prefix: "/api" });

async function run() {
  await app.ready();

  const port = 5000;
  await app.listen({
    port,
  });

  console.log(`Server is running on Port ${port}`);
}
run();
