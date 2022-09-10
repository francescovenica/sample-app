import { PoolConfig, Pool } from "pg";

let pool: Pool;

export const getDbPool = () => {
  if (!pool) {
    const { PG_USER, PG_DATABASE, PG_PORT, PG_PASSWORD, PG_HOST } = process.env;

    const dbConfig: PoolConfig = {
      host: PG_HOST,
      port: parseInt(PG_PORT || "5432"),
      user: PG_USER,
      database: PG_DATABASE,
      password: PG_PASSWORD,
    };

    pool = new Pool(dbConfig);
  }

  return pool;
};
