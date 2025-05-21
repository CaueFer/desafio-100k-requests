import { Redis } from "ioredis";

export const redisConnection = new Redis({ maxRetriesPerRequest: null }); // DEFAULT localhost:6379
