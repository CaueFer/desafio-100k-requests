import { Queue, QueueEvents, Worker } from "bullmq";

import { redisConnection } from "../../redis";

const queueName = "createUser";

const createUserQueue = new Queue(queueName, {
  connection: redisConnection,
});

export async function addJobToQueue(jobName: string, data: Record<string, unknown>) {
  await createUserQueue.add(jobName, data);
}

// ==================== WORKERS
const worker = new Worker(
  queueName,
  async (job) => {
    console.log("[DATA]: ", job.data);
  },
  { connection: redisConnection }
);

// ==================== QUEUE EVENTS
const queueEvents = new QueueEvents("my-queue-name");

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
