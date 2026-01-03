import express from "express";
import { ENV } from "./config/env.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = ENV.PORT;
const NODE_ENV = ENV.NODE_ENV;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Path to admin/dist relative to backend/src/server.js
const adminDistPath = path.join(__dirname, "..", "..", "admin", "dist");

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

if (NODE_ENV === "production") {
  app.use(express.static(adminDistPath));
}

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(adminDistPath, "index.html"));
});

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
