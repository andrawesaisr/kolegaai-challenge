import path from "path";
import documentService from "../services/documentService.js";

export class DocumentController {
  async uploadDocument(req, res) {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const ext = path.extname(file.originalname).toLowerCase();
      let text = "";

      if (ext === ".pdf") {
        text = await documentService.extractTextFromPDF(file.buffer);
      } else if (ext === ".docx") {
        text = await documentService.extractTextFromDOCX(file.buffer);
      } else {
        return res.status(400).json({ error: "Unsupported file format" });
      }

      const s3Url = await documentService.uploadToS3(file);
      const analysis = await documentService.analyzeDocument(text);

      const document = await documentService.createDocument({
        title: file.originalname,
        s3Url,
        category: analysis.category,
        summary: analysis.summary,
      });

      res.json(document);
    } catch (error) {
      console.error("Error processing file:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async getAllDocuments(req, res) {
    try {
      const documents = await documentService.getAllDocuments();
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteDocument(req, res) {
    try {
      const { id } = req.params;
      const deleted = await documentService.deleteDocument(id);

      if (!deleted) {
        return res.status(404).json({ error: "Document not found" });
      }

      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default new DocumentController();
