import IORedis from "ioredis";

export const redisConnection = new IORedis({ maxRetriesPerRequest: null }); // DEFAULT localhost:6379
