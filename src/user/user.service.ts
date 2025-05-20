import { addJobToQueue } from "../lib/helpers/bullmq.helper";
import { type UserSchema } from "../lib/schemas/user.schema";

export async function saveUserService(newUser: UserSchema) {
  await addJobToQueue("saveUser", newUser);

  return { status: 200, response: { message: "User created successfully" } };
}
