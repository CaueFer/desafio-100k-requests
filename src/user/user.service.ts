import { getJob, saveBatches } from "../lib/helpers/bullmq.helper.js";
import { type UserSchema } from "../lib/schemas/user.schema.js";
import { DefaultResponse } from "../global.types.js";

export async function saveUserService(
  newUser: UserSchema
): Promise<{ status: number; response: DefaultResponse }> {
  const job = await saveBatches(newUser);

  if (!job) {
    console.error("Failed to create a job");
    return {
      status: 500,
      response: {
        message: "Failed to insert a new user into queue, try again.",
      },
    };
  }

  return {
    status: 202,
    response: {
      message: "User add to queue successfully, wait for the result.",
      job: job.id,
    },
  };
}

export async function getSaveUserStatusService(
  id: string
): Promise<{ status: number; response: Record<string, unknown> }> {
  const job = await getJob(id);

  if (!job)
    return {
      status: 400,
      response: { message: "Invalid job id" },
    };

  const status = await job.getState();

  let message = "";

  switch (status) {
    case "completed":
      message = "User created sucessfully";
      break;

    case "failed":
      message = "Failed to create user";
      console.error("[JOB ERROR]:", job.failedReason);
      break;

    case "active":
      message = "User is being created...";
      console.error("[JOB ERROR]:", job.failedReason);
      break;

    default:
      message = "User not created yet...";
      break;
  }

  return {
    status: 200,
    response: { status, message },
  };
}
