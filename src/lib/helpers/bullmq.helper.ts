import { Queue, QueueEvents, Worker } from "bullmq";

import { redisConnection } from "../../redis.js";

const queueName = "createUser";

const createUserQueue = new Queue(queueName, {
  connection: redisConnection,
});

export async function addJobToQueue(
  jobName: string,
  data: Record<string, unknown>
) {
  return await createUserQueue.add(jobName, data, {
    removeOnComplete: {
      age: 60000 * 1, // 1 minuto
    },
    removeOnFail: {
      age: 60000 * 1440, // 1440 minutos -- 24 horas
    },
  });
}

export async function getJob(jobId: string) {
  return await createUserQueue.getJob(jobId);
}

// ==================== WORKERS
new Worker(
  queueName,
  async (job) => {
    return "User created successfully";
  },
  { connection: redisConnection }
);

// ==================== QUEUE EVENTS
const queueEvents = new QueueEvents(queueName);

queueEvents.on("waiting", ({ jobId }) => {
  console.log(`A job with ID ${jobId} is waiting`);
});

queueEvents.on("active", ({ jobId, prev }) => {
  console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});

queueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(`${jobId} has completed and returned ${returnvalue}`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`${jobId} has failed with reason ${failedReason}`);
});
