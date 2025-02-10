import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { OpenAI } from "openai";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import documentRepository from "../repositories/documentRepository.js";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class DocumentService {
  async extractTextFromPDF(buffer) {
    const data = await pdfParse(buffer);
    return data.text;
  }

  async extractTextFromDOCX(buffer) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  async uploadToS3(file) {
    const fileKey = `${Date.now()}-${file.originalname}`;
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(s3Params));
    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  }

  async analyzeDocument(text) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Analyze the following document and provide: 1) A category (invoice, contract, report, etc.) 2) A one-sentence summary",
        },
        {
          role: "user",
          content: text.substring(0, 1000),
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const analysis = completion?.choices[0]?.message?.content?.trim() || "";
    const categoryMatch = analysis.match(/Category:\s*(.+)/i);
    const summaryMatch = analysis.match(/Summary:\s*(.+)/i);

    return {
      category: categoryMatch ? categoryMatch[1].trim() : "Unknown",
      summary: summaryMatch ? summaryMatch[1].trim() : "No summary available",
    };
  }

  async getAllDocuments() {
    return await documentRepository.findAll();
  }

  async createDocument(documentData) {
    return await documentRepository.create(documentData);
  }

  async deleteDocument(id) {
    try {
      const document = await documentRepository.findById(id);

      if (!document) {
        return false;
      }

      const fileKey = document.s3Url.split("/").pop();
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileKey,
        })
      );

      await documentRepository.delete(id);
      return true;
    } catch (error) {
      console.error("Error in deleteDocument service:", error);
      throw error;
    }
  }
}

export default new DocumentService();
