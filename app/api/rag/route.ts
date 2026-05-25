import fs from "node:fs/promises";
import path from "node:path";

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

type RetrievedChunk = RagChunk & {
  score: number;
  matchedKeywords: string[];
};

const RAG_INDEX_PATH = path.join(process.cwd(), "data", "rag-index.json");

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "is",
  "are",
  "was",
  "were",
  "to",
  "of",
  "in",
  "on",
  "for",
  "with",
  "by",
  "from",
  "as",
  "at",
  "this",
  "that",
  "these",
  "those",
  "how",
  "what",
  "why",
  "can",
  "could",
  "should",
  "would",
  "do",
  "does",
  "did",
  "be",
  "been",
  "being",
  "about",
  "into",
  "through",
  "paper",
  "papers",
  "research",
  "study",
  "system",
]);

async function loadRagIndex() {
  const file = await fs.readFile(RAG_INDEX_PATH, "utf-8");
  return JSON.parse(file) as RagIndex;
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function scoreChunk(queryTokens: string[], chunk: RagChunk) {
  const searchableText = [chunk.paperTitle, chunk.fileName, chunk.text]
    .join(" ")
    .toLowerCase();

  let score = 0;
  const matchedKeywords: string[] = [];

  for (const token of queryTokens) {
    const regex = new RegExp(`\\b${escapeRegExp(token)}\\b`, "g");
    const matches = searchableText.match(regex);

    if (matches) {
      score += matches.length;
      matchedKeywords.push(token);
    }

    if (chunk.paperTitle.toLowerCase().includes(token)) {
      score += 5;
    }

    if (chunk.fileName.toLowerCase().includes(token)) {
      score += 3;
    }
  }

  return {
    score,
    matchedKeywords: [...new Set(matchedKeywords)],
  };
}

function retrieveTopChunks(
  chunks: RagChunk[],
  query: string,
  limit = 6,
): RetrievedChunk[] {
  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    return [];
  }

  return chunks
    .map((chunk) => {
      const result = scoreChunk(queryTokens, chunk);

      return {
        ...chunk,
        score: result.score,
        matchedKeywords: result.matchedKeywords,
      };
    })
    .filter((chunk) => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function createExtractiveAnswer(query: string, chunks: RetrievedChunk[]) {
  if (chunks.length === 0) {
    return "No relevant text chunks were found in the uploaded papers. Try using keywords such as robotic monitoring, environmental sensing, temperature, humidity, pressure, IoT, wireless sensor networks, or habitat monitoring.";
  }

  const paperNames = [...new Set(chunks.map((chunk) => chunk.paperTitle))];

  const keywordList = [
    ...new Set(chunks.flatMap((chunk) => chunk.matchedKeywords)),
  ].slice(0, 10);

  return [
    `The search found relevant content for: "${query}".`,
    "",
    `The retrieved results come from ${paperNames.length} paper(s): ${paperNames.join(
      "; ",
    )}.`,
    "",
    `The strongest matching keywords were: ${keywordList.join(", ")}.`,
    "",
    "Based on the retrieved paper chunks, the selected papers are relevant to EcoSense Lab because they discuss sensor-based monitoring, environmental data collection, robotic monitoring, IoT systems, or measurement of abiotic conditions such as temperature, humidity, and pressure.",
    "",
    "Check the retrieved sources below to see the exact text chunks from the papers.",
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { question?: string };
    const question = body.question?.trim();

    if (!question) {
      return Response.json(
        { error: "Search query is required." },
        { status: 400 },
      );
    }

    const ragIndex = await loadRagIndex();

    if (!ragIndex.chunks.length) {
      return Response.json(
        { error: "Research index is empty. Run npm run build-rag first." },
        { status: 500 },
      );
    }

    const retrievedChunks = retrieveTopChunks(ragIndex.chunks, question, 6);
    const answer = createExtractiveAnswer(question, retrievedChunks);

    return Response.json({
      answer,
      sources: retrievedChunks.map((chunk) => ({
        id: chunk.id,
        paperTitle: chunk.paperTitle,
        fileName: chunk.fileName,
        chunkIndex: chunk.chunkIndex,
        score: chunk.score,
        matchedKeywords: chunk.matchedKeywords,
        preview: chunk.text.slice(0, 900),
      })),
    });
  } catch (error) {
    console.error("Keyword research API error:", error);

    return Response.json(
      {
        error:
          "Failed to run keyword research. Make sure data/rag-index.json exists. Run npm run build-rag first.",
      },
      { status: 500 },
    );
  }
}