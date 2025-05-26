import dotenv from "dotenv";
import fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { Router } from "./router.js";
import fastifyPostgres from "@fastify/postgres";

dotenv.config();

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// =============== CORS
app.register(fastifyCors, { origin: "*" });

// =============== POSTGRES
app.register(fastifyPostgres, {
  connectionString: process.env.POSTGRES_URL,
});

// =============== SWAGGER
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

// =============== ROUTES
app.register(Router, { prefix: "/api" });

// =============== APP
async function run() {
  await app.ready();

  const port = Number(process.env.PORT) || 5000;
  await app.listen({
    port: port,
  });

  console.log(`Server is running on Port ${port}`);
}
run();

await app.ready();
export default app;
