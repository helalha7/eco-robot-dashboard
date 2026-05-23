"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartPoint } from "@/types/sensor";

type SmallChartButtonProps = {
  title: string;
  value: string;
  average: string;
  minimum: string;
  maximum: string;
  data: ChartPoint[];
  isActive: boolean;
  onClick: () => void;
  accent: "pressure" | "humidity" | "temperature";
};

const accentStyles = {
  pressure: {
    activeBorder: "border-violet-500",
    activeGradient: "from-violet-500/15",
    line: "#a78bfa",
    dot: "bg-violet-400",
  },
  humidity: {
    activeBorder: "border-sky-500",
    activeGradient: "from-sky-500/15",
    line: "#38bdf8",
    dot: "bg-sky-400",
  },
  temperature: {
    activeBorder: "border-amber-500",
    activeGradient: "from-amber-500/15",
    line: "#fbbf24",
    dot: "bg-amber-400",
  },
};

export function SmallChartButton({
  title,
  value,
  average,
  minimum,
  maximum,
  data,
  isActive,
  onClick,
  accent,
}: SmallChartButtonProps) {
  const styles = accentStyles[accent];

  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-4 text-left shadow-xl shadow-black/20 transition ${
        isActive
          ? `${styles.activeBorder} ${styles.activeGradient} to-slate-900`
          : "border-slate-800 from-slate-800/40 to-slate-900 hover:border-slate-700"
      }`}
    >
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/5 blur-2xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>
        </div>

        {isActive && (
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
            Active
          </span>
        )}
      </div>

      <div className="relative mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
            <p className="text-xs text-slate-500">Average</p>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-200">
            {average}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
            <p className="text-xs text-slate-500">Range</p>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-200">
            {minimum} - {maximum}
          </p>
        </div>
      </div>

      <div className="relative mt-4 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis domain={["auto", "auto"]} hide />
            <Line
              type="monotone"
              dataKey="value"
              stroke={isActive ? styles.line : "#64748b"}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </button>
  );
}