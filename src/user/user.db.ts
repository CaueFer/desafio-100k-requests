import { QueryResult } from "pg";

import app from "../server.js";
import { type UserSchema } from "../lib/schemas/user.schema.js";

export async function saveUsersDb(newUsers: UserSchema[]) {
  const usersIds = await saveUser(newUsers);

  if (usersIds.length < 1) return "Users already added.";

  const addedUsers = newUsers.filter((u) => usersIds.includes(u.id));
  const teams = addedUsers.map((u) => ({ ...u.team, userId: u.id }));

  const teamIds = await saveTeams(teams);

  const teamProjects = teams.flatMap((t, i) =>
    t.projects.map((p) => ({ ...p, teamId: teamIds[i] }))
  );

  const projectsIds = await saveProjects(teamProjects);

  const logsWithUserId = addedUsers.flatMap((u) =>
    u.logs.map((log) => ({ ...log, userId: u.id }))
  );

  const logsIds = await saveLogs(logsWithUserId);

  return `
  Users added successfully.

  Added User: ${usersIds.length}
  Added Teams: ${teamIds.length}
  Added Projeccts: ${projectsIds.length}
  Added Logs: ${logsIds.length}
  `;
}

async function saveTeams(
  teams: {
    userId: string;
    name: string;
    leader: boolean;
    projects: {
      name: string;
      completed: boolean;
      id?: number | undefined;
    }[];
    id?: number | undefined;
  }[]
): Promise<number[]> {
  try {
    const teamPlaceholder = teams
      .map((_, i) => {
        const fields = 3;
        return `($${i * fields + 1}, $${i * fields + 2}, $${i * fields + 3})`;
      })
      .join(", ");

    const flatTeams = teams.flatMap((t) => [t.name, t.leader, t.userId]);

    const createQuery: QueryResult = await app.pg.query(
      `
          INSERT INTO team
              (name, leader, user_id)
          VALUES
              ${teamPlaceholder}
          ON CONFLICT (name, user_id)
          DO UPDATE SET leader = EXCLUDED.leader
          returning id
    `,
      [...flatTeams]
    );

    return createQuery.rows.map((r) => r.id);
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
): Promise<number[]> {
  try {
    const projectsPlaceholder = projects
      .map((_, i) => {
        const fields = 3;

        return `($${i * fields + 1}, $${i * fields + 2}, $${i * fields + 3})`;
      })
      .join(", ");

    const flatProjects = projects.flatMap((p) => [
      p.name,
      p.completed,
      p.teamId,
    ]);

    const query = await app.pg.query(
      `
        INSERT INTO project
          (name, completed, team_id)
        VALUES
          ${projectsPlaceholder}
        returning id
      `,
      [...flatProjects]
    );

    return query.rows.map((r) => r.id);
  } catch (err) {
    console.error("Error ao salvar Projetos", err);
    throw err;
  }
}

async function saveUser(newUsers: UserSchema[]): Promise<string[]> {
  try {
    const valuesPlaceholder = newUsers
      .map((_, j) => {
        const userFields = 6;
        let placeholder: string[] = [];
        for (let i = 1; i <= userFields; i++) {
          placeholder.push(`$${j * userFields + i}`);
        }
        return `(${placeholder.join(", ")})`;
      })
      .join(", ");

    const flatedUsers = newUsers.flatMap((u) => [
      u.id,
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
            (id, name, age, country, score, active)
        VALUES
            ${valuesPlaceholder}
        ON CONFLICT (id)
        DO NOTHING
        returning id
        `,
      flatedUsers
    );

    return insertUserQuery.rows.map((r) => r.id);
  } catch (err) {
    console.error("[Error on func saveUser]", err);
    throw new Error("Error saving user");
  }
}

async function saveLogs(
  logs: {
    userId: string;
    date: string;
    action: "login" | "logout";
    id?: number | undefined;
  }[]
): Promise<number[]> {
  try {
    const logsPlaceholder = logs.map((_, i) => {
      const fields = 3;

      return `($${i * fields + 1}::uuid, $${i * fields + 2}, $${
        i * fields + 3
      })`;
    });

    const flatLog = logs.flatMap((log) => [log.userId, log.action, log.date]);

    const insertLogsQuery = await app.pg.query(
      `
      INSERT INTO
        log (user_id, action, date)
      VALUES
        ${logsPlaceholder}
      returning id
      `,
      [...flatLog]
    );

    return insertLogsQuery.rows.map((r) => r.id);
  } catch (err) {
    console.error("Error save logs", err);
    throw new Error("Erro saveLogs");
  }
}
