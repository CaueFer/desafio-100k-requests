import fs from "node:fs";

const jsonString = fs.readFileSync("./100k-usuarios.json", "utf-8");
const data = JSON.parse(jsonString);

const LIMIT = 500; // LIMITAR A QUANTIDADE DE REQUESTS

for (let i = 0; i < Math.min(LIMIT, data.length); i++) {
  console.log("Sended ", i);
  createUser(data[i]);
}

async function createUser(user) {
  fetch("http://localhost:5000/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
}
