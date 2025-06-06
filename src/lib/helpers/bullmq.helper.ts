import { delay, Job, Queue, QueueEvents, Worker } from "bullmq";

import { UserSchema } from "../schemas/user.schema.js";
import { redisConnection } from "../../config/redis.js";
import { saveUsersDb } from "../../user/user.db.js";
import { hrtime } from "node:process";

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
    const start = hrtime();

    const newUsers: UserSchema[] = job.data;

    // VALIDAR COMO O  JOB ENTENDE Q NAO FUNCIONOU
    const response = await saveUsersDb(newUsers);

    const end = hrtime(start);
    const finalTIme = end[0] * 1000 + end[1] / 1e6;
    return `${response}
     Timer: ${finalTIme.toFixed(2)} ms`;
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
    `[COMPLETED] ✅ JOB:${jobId} has completed and returned ${returnvalue}`
  );
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`[FAILED] ❌ ${jobId} has failed with reason ${failedReason}`);
});
