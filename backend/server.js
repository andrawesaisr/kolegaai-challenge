import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { initDatabase } from "./config/database.js";
import documentController from "./controllers/documentController.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://d2em15x0n3x3rk.cloudfront.net/",
    methods: "GET,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
});

// Initialize database
initDatabase().catch(console.error);

// Routes
app.post(
  "/api/upload",
  upload.single("document"),
  documentController.uploadDocument
);
app.get("/api/documents", documentController.getAllDocuments);
app.delete("/api/documents/:id", documentController.deleteDocument);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
