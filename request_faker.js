import fs from "node:fs";
import { fetch, Agent } from "undici";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import pLimit from "p-limit";

const jsonString = fs.readFileSync("./100k-usuarios.json", "utf-8");
const data = JSON.parse(jsonString);

const MAX_LIMIT = 50000; // Limite total de segurança

const rl = readline.createInterface({ input, output });
const LIMIT_INPUT = await rl.question("Quantidade de requests (MAX 100.000): ");
rl.close();

const LIMIT = Math.min(Number(LIMIT_INPUT), MAX_LIMIT);

const agent = new Agent({
  keepAliveTimeout: 60_000,
  keepAliveMaxTimeout: 300_000,
});

const limit = pLimit(10000);

console.log(`Sending ${LIMIT} requests`);

const tasks = data.slice(0, LIMIT).map((user, index) =>
  limit(() => {
    console.log("Sended", index + 1);
    return createUser(user);
  })
);

await Promise.all(tasks);

async function createUser(user) {
  try {
    const res = await fetch("http://localhost:5000/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      dispatcher: agent,
    });

    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error("Erro ao criar usuário:", err.message);
  }
}
