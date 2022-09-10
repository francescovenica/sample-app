import http from "http";
import dotenv from "dotenv";

dotenv.config();

import app from "./app";

const PORT: number = parseInt(process.env.PORT || "3001");

const server: http.Server = http.createServer(app);
server.listen(PORT);
server.on("listening", () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
