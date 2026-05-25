import fs from "node:fs/promises";
import path from "node:path";

import { PDFParse } from "pdf-parse";

type RagChunk = {
  id: string;
  paperTitle: string;
  fileName: string;
  chunkIndex: number;
  text: string;
};

type RagIndex = {
  createdAt: string;
  retrievalMethod: "keyword";
  chunks: RagChunk[];
};

const PAPERS_DIR = path.join(process.cwd(), "papers");
const OUTPUT_PATH = path.join(process.cwd(), "data", "rag-index.json");

function cleanText(text: string) {
  return text.replace(/\s+/g, " ").replace(/-\s+/g, "").trim();
}

function createPaperTitleFromFileName(fileName: string) {
  return fileName
    .replace(/\.pdf$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitIntoChunks(text: string, chunkSize = 1600, overlap = 250) {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();

    if (chunk.length > 200) {
      chunks.push(chunk);
    }

    start += chunkSize - overlap;
  }

  return chunks;
}

async function extractPdfText(fileBuffer: Buffer) {
  const parser = new PDFParse({
    data: fileBuffer,
  });

  try {
    const result = await parser.getText();
    return cleanText(result.text);
  } finally {
    await parser.destroy();
  }
}

async function main() {
  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });

  const files = await fs.readdir(PAPERS_DIR);
  const pdfFiles = files.filter((file) => file.toLowerCase().endsWith(".pdf"));

  if (pdfFiles.length === 0) {
    throw new Error("No PDF files found in /papers");
  }

  console.log(`Found ${pdfFiles.length} PDF files.`);
  console.log("Building keyword research index...");

  const chunks: RagChunk[] = [];

  for (const fileName of pdfFiles) {
    const filePath = path.join(PAPERS_DIR, fileName);
    const fileBuffer = await fs.readFile(filePath);

    console.log("");
    console.log(`Reading: ${fileName}`);

    const text = await extractPdfText(fileBuffer);

    if (!text) {
      console.warn(`No text extracted from: ${fileName}`);
      continue;
    }

    const paperTitle = createPaperTitleFromFileName(fileName);
    const textChunks = splitIntoChunks(text);

    console.log(`Created ${textChunks.length} chunks from ${fileName}`);

    for (let i = 0; i < textChunks.length; i++) {
      chunks.push({
        id: `${fileName}-${i}`,
        paperTitle,
        fileName,
        chunkIndex: i,
        text: textChunks[i],
      });
    }
  }

  const ragIndex: RagIndex = {
    createdAt: new Date().toISOString(),
    retrievalMethod: "keyword",
    chunks,
  };

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(ragIndex, null, 2), "utf-8");

  console.log("");
  console.log("Keyword research index created successfully.");
  console.log(`Saved to: ${OUTPUT_PATH}`);
  console.log(`Total chunks: ${chunks.length}`);
}

main().catch((error) => {
  console.error("");
  console.error("Failed to build keyword research index:");
  console.error(error);
  process.exit(1);
});