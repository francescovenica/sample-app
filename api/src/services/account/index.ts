import { MutationCreateAccountArgs } from "../../generated/types";
import { isEmail } from "../../utils";

export const createAccount = async (
  resolve: any,
  source: any,
  args: MutationCreateAccountArgs,
  context: PostGraphileContext,
  resolveInfo: any
) => {
  /**
   * Let's check if the email has the right format
   */
  if (!isEmail(args.input.account.email)) {
    throw new Error("The email doesn't have the right format");
  }

  return resolve(source, args, context, resolveInfo);
};
