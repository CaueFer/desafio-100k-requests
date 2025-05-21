import { delay, Job, Queue, QueueEvents, Worker } from "bullmq";

import { UserSchema } from "../schemas/user.schema.js";
import { redisConnection } from "../../config/redis.js";

const queueName = "createUser";

const createUserQueue = new Queue(queueName, {
  connection: redisConnection,
});

// ==================== BATCH
let timeout: NodeJS.Timeout | null = null;
let batch: UserSchema[] = [];
export async function saveBatches(newUser: UserSchema) {
  batch.push(newUser);

  if (timeout) clearTimeout(timeout);

  if (batch.length >= 500) {
    console.log("[BATCH]", batch.length);
    const batchToSave = [...batch];
    batch = [];

    const job = await addJobToQueue("saveUser", batchToSave);

    return job;
  }

  return new Promise<Job<any, any, string>>((resolve) => {
    timeout = setTimeout(async () => {
      if (batch.length > 0) {
        console.log("[BATCH]", batch.length);
        const batchToSave = [...batch];
        batch = [];
        const job = await addJobToQueue("saveUser", batchToSave);

        resolve(job);
      }
    }, 1000); // 1 segundo
  });
}

// ==================== JOBS
export async function addJobToQueue(jobName: string, data: UserSchema[]) {
  return await createUserQueue.add(jobName, data, {
    removeOnComplete: {
      age: 60 * 1, // 1 minuto
    },
    removeOnFail: {
      age: 60 * 1440, // 1440 minutos -- 24 horas
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
    await delay(5000); // 5 sec fake delay

    return "User created successfully";
  },
  { connection: redisConnection }
);

// ==================== QUEUE EVENTS
const queueEvents = new QueueEvents(queueName);

// queueEvents.on("waiting", ({ jobId }) => {
//   console.log(`A job with ID ${jobId} is waiting`);
// });

// queueEvents.on("active", ({ jobId, prev }) => {
//   console.log(`Job ${jobId} is now active; previous status was ${prev}`);
// });

queueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(
    `[COMPLETED] ✅ ${jobId} has completed and returned ${returnvalue}`
  );
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`[FAILED] ❌ ${jobId} has failed with reason ${failedReason}`);
});
