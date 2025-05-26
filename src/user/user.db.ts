import { QueryResult } from "pg";

import app from "../server.js";
import { type UserSchema } from "../lib/schemas/user.schema.js";

export async function saveUsersDb(newUsers: UserSchema[]) {
  const teams = newUsers.map((u) => u.team);

  const teamIds = await saveTeams(teams);
  console.log("Teamids", teamIds);

  // const projects = newUsers.flatMap((u, i) =>
  //   u.team.projects.map((p) => ({ ...p, teamId: teamIds[i] }))
  // );

  // await saveProjects(projects);

  // const usersIds = await saveUser(newUsers);

  // adicionar logs com id do usuario

  return "Todos os usuários foram adicionados com sucesso.";
}

async function saveTeams(teams: UserSchema["team"][]): Promise<number[]> {
  try {
    let count = 0;
    const teamPlaceholder = teams
      .map((_, i) => {
        const fields = 2;

        count = i * fields + 2;
        return `($${i * fields + 1}, $${i * fields + 2})`;
      })
      .join(", ");
    const flatTeams = teams.flatMap((t) => [t.name, t.leader]);

    const teamNamesPlaceholders = teams
      .map((_, i) => `($${i + 1 + count})`)
      .join(", ");
    const teamNames = teams.flatMap((t) => [t.name]);

    const createQuery: QueryResult = await app.pg.query(
      `
        WITH updated_teams AS (
          INSERT INTO team
              (name, leader)
          VALUES
              ${teamPlaceholder}
          ON CONFLICT (name)
          DO UPDATE
            SET leader = EXCLUDED.leader
          RETURNING name
        ),
        team_names AS (
          select * from (
            VALUES
              ${teamNamesPlaceholders}
          ) AS v(name)
        )
        select
          id
        from team
        where
          name IN (SELECT name FROM team_names)
    `,
      [...flatTeams, ...teamNames]
    );

    return createQuery.rows;
  } catch (err) {
    console.error("Erro ao criar time: ", err);
    throw err;
  }
}

async function saveProjects(
  projects: {
    teamId: number;
    name: string;
    completed: boolean;
  }[]
) {
  try {
    const projectsPlaceholder = projects
      .map((_, i) => {
        const fields = 3;

        return `$${i * fields + 1}, $${i * fields + 2}, $${i * fields + 3}`;
      })
      .join(", ");

    const flatProjects = projects.flatMap((p) => [p.name, p.completed, teamId]);

    await app.pg.query(
      `
        INSERT INTO project
          (name, completed, team_id)
        VALUES
          (${projectsPlaceholder})
      `,
      [...flatProjects]
    );
  } catch (err) {
    console.error("Error ao salvar Projeto", err);
    throw err;
  }
}

async function saveUser(newUsers: UserSchema[]): Promise<number[]> {
  try {
    const valuesPlaceholder = newUsers
      .map((_, j) => {
        const userFields = 5;
        let placeholder: string[] = [];
        for (let i = 1; i <= userFields; i++) {
          placeholder.push(`$${j * userFields + i}`);
        }
        return `(${placeholder.join(", ")})`;
      })
      .join(", ");

    const flatedUsers = newUsers.flatMap((u) => [
      u.name,
      u.age,
      u.country,
      u.score,
      u.active,
      // u.team,
      // u.logs,
    ]);

    const insertUserQuery = await app.pg.query(
      `
        INSERT INTO "user"
            (name, age, country, score, active)
        VALUES
            ${valuesPlaceholder}
        returning id
        `,
      flatedUsers
    );

    return insertUserQuery.rows;
  } catch (err) {
    console.error(err);
    throw new Error("Error save user");
  }
}

async function saveLogs(logs: UserSchema["logs"], userId: number) {}
