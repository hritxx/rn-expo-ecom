import express from "express";
import { ENV } from "./config/env.js";
import path from "path";

const app = express();
const PORT = ENV.PORT;
const NODE_ENV = ENV.NODE_ENV;

const __dirname = path.resolve();

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));
}

app.get("/{*any}", (req, res) => {
  if (NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, "admin", "dist", "index.html"));
  } else {
    res.status(404).json({ message: "Not Found" });
  }
});

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
