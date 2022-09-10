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
  appendPlugins: [wrapPlugin, extendSchema],
  /**
   * 
   * Here we can add some object to use in our resolvers
   * 
   * @param req 
   * @param res 
   * @returns 
   */
  async additionalGraphQLContextFromRequest(req: Request, res: Response) {
    return {
      foo: "Bar",
    };
  },
});
