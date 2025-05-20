export interface IUser {
  id: string;
  name: string;
  age: string;
  score: string;
  active: string;
  country: string;
  team: Team;
  logs: Log[];
}

export interface Team {
  name: string;
  leader: string;
  projects: Project[];
}

export interface Project {
  name: string;
  completed: string;
}

export interface Log {
  date: string;
  action: Action;
}

export type Action = "login" | "logout";
