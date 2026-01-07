import express from "express";
import { ENV } from "./config/env.js";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./config/inngest.js";

import adminRoutes from "./routes/admin.route.js";

import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = ENV.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(clerkMiddleware()); // adds auth object in (req)

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

const adminDistPath = process.env.VERCEL
  ? path.join(process.cwd(), "admin", "dist")
  : path.join(__dirname, "..", "..", "admin", "dist");

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

app.use("/api/admin", adminRoutes);

app.use(express.static(adminDistPath));

app.get("/*splat", (req, res) => {
  const indexPath = path.join(adminDistPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res
        .status(404)
        .send(
          "Frontend build not found. Ensure 'npm run build' completed successfully."
        );
    }
  });
});

connectDB().catch(console.error);

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server is rinning on http://localhost:${PORT}`);
  });
}

export default app;
