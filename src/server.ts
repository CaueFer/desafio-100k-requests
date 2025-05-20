import fastify from "fastify";

import { Router } from "./router";

const app = fastify();

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
