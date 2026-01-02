import express from "express";
import { ENV } from "./config/env.js";
import path from "path";

const __dirname = path.resolve();

const app = express();
const PORT = ENV.PORT;
const NODE_ENV = ENV.NODE_ENV;

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));
}

app.get("/{*any}", (req, res) => {
  res.sendFile(__dirname, "../admin/dist", "index.js");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
