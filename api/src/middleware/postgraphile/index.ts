// /src/middleware/postgraphile.ts
import { Request, Response } from "express";
import { postgraphile } from "postgraphile";
import { getDbPool } from "../../db";
import config from "../../config";

import extendSchema from "./plugins/extendSchema";
import wrapPlugin from "./plugins/wrapPlugin";

const pool = getDbPool();

export default postgraphile(pool, "public", {
  ...config.postgraphile,
  /**
   *
   * additionalGraphQLContextFromRequest let us add some information to postgraphile
   * context, this object will be available in all our resolvers
   *
   * @param req
   * @param res
   * @returns object
   */
  async additionalGraphQLContextFromRequest(req: Request, res: Response) {
    return {
      account: req.account,
      firebase: req.firebase,
      logger: req.logger,
    } as PostGraphileContext;
  },
  pgSettings: async ({ account, session }: Request) => {
    return {
      role: "editor",
      "app.current_account_uuid": account?.uuid,
      "app.current_account_email": account?.email || session?.email,
    };
  },
  appendPlugins: [wrapPlugin, extendSchema],
});
