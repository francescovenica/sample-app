import { v4 } from "uuid";
import { NextApiResponse, NextApiRequest } from "next";
import { createProxyMiddleware } from "http-proxy-middleware";
import { parse } from "cookie";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

/**
 * This is a proxy to our api
 */

const { GRAPHQL_URL } = process.env;

/**
 * This is the proxy
 */
const proxy = createProxyMiddleware({
  target: GRAPHQL_URL,
  changeOrigin: true,
  secure: false,
  headers: {
    Connection: "keep-alive",
  },
  pathRewrite: {
    "^/api/graphql": "/graphql",
  },
  xfwd: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader("cid", v4());

      if (!req.headers.authorization) {
        const { session } = parse(req.headers.cookie);

        proxyReq.setHeader("authorization", `Bearer ${session}`);

        delete req.headers.cookie;
      }
    },
  },
});

const handler = async function (req: NextApiRequest, res: NextApiResponse) {
  return proxy(req, res, () => (result: unknown) => {
    if (result instanceof Error) {
      throw result;
    }
  });
};

export default handler;
