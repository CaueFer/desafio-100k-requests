import fs from "node:fs";
import { fetch, Agent } from "undici";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const jsonString = fs.readFileSync("./100k-usuarios.json", "utf-8");
const data = JSON.parse(jsonString);

let MAX_LIMIT = 5000; // LIMITAR A QUANTIDADE DE REQUESTS - CUIDADO COM A QUANTIDADE!!!

const rl = readline.createInterface({ input, output });
const LIMIT = await rl.question("Quantidade de requests (MAX 5000): ");
rl.close();

const agent = new Agent({
  keepAliveTimeout: 60_000,
  keepAliveMaxTimeout: 300_000,
});

for (let i = 0; i < Math.min(data.length, LIMIT, MAX_LIMIT); i++) {
  console.log("Sended ", i + 1);
  createUser(data[i]);
}

async function createUser(user) {
  fetch("http://localhost:5000/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
    dispatcher: agent,
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
}
