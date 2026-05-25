"use client";

import { useState } from "react";

type ResearchSource = {
  id: string;
  paperTitle: string;
  fileName: string;
  chunkIndex: number;
  score: number;
  matchedKeywords: string[];
  preview: string;
};

type ResearchResponse = {
  answer: string;
  sources: ResearchSource[];
};

export function ResearchRag() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<ResearchSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function searchPapers() {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setErrorMessage("Write a search query first.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setAnswer("");
      setSources([]);

      const response = await fetch("/api/rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuery,
        }),
      });

      const data = (await response.json()) as
        | ResearchResponse
        | { error: string };

      if (!response.ok) {
        throw new Error(
          "error" in data ? data.error : "Research search failed.",
        );
      }

      if ("answer" in data) {
        setAnswer(data.answer);
        setSources(data.sources);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while searching the papers.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function clearSearch() {
    setQuery("");
    setAnswer("");
    setSources([]);
    setErrorMessage("");
  }

  return (
    <section className="space-y-4">
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-emerald-500/10 to-slate-900 p-6 shadow-xl shadow-black/20">
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/5 blur-2xl" />

        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
            Keyword-Based Research Interface
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            Search Inside the Research Papers
          </h2>

          <p className="mt-4 max-w-4xl leading-7 text-slate-400">
            This tab searches inside the real PDF papers used for the project.
            The papers are extracted into text chunks, and the system retrieves
            the most relevant chunks using keyword matching.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <textarea
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Example: robotic monitoring environmental sensing temperature humidity pressure"
              className="min-h-28 resize-none rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500"
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={searchPapers}
                disabled={isLoading}
                className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Searching papers..." : "Search Papers"}
              </button>

              <button
                onClick={clearSearch}
                className="rounded-2xl border border-slate-800 bg-slate-900 px-6 py-3 text-sm font-bold text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </section>

      {errorMessage && (
        <section className="rounded-2xl border border-red-900/60 bg-gradient-to-br from-red-500/10 to-slate-900 p-5 shadow-xl shadow-black/20">
          <p className="font-semibold text-red-300">Error</p>
          <p className="mt-2 text-slate-300">{errorMessage}</p>
        </section>
      )}

      {answer && (
        <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-sky-500/10 to-slate-900 p-5 shadow-xl shadow-black/20">
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-300">
            Search Summary
          </p>

          <h3 className="mt-2 text-xl font-bold text-white">
            Result based on retrieved paper chunks
          </h3>

          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-300">
            {answer}
          </p>
        </section>
      )}

      {sources.length > 0 && (
        <section className="space-y-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
              Retrieved Sources
            </p>

            <h3 className="mt-2 text-xl font-bold text-white">
              Matching chunks from the papers
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {sources.map((source, index) => (
              <article
                key={source.id}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800/40 to-slate-900 p-5 shadow-xl shadow-black/20"
              >
                <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/5 blur-2xl" />

                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                        Source {index + 1}
                      </p>

                      <h4 className="mt-2 text-lg font-bold leading-7 text-white">
                        {source.paperTitle}
                      </h4>
                    </div>

                    <span className="rounded-full bg-slate-950/60 px-3 py-1 text-xs font-semibold text-slate-300 ring-1 ring-slate-800">
                      Score {source.score}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    {source.fileName} · chunk {source.chunkIndex}
                  </p>

                  {source.matchedKeywords.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {source.matchedKeywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/20"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-4 leading-7 text-slate-300">
                    {source.preview}...
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}