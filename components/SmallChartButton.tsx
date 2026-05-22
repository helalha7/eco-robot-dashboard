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
  },
  humidity: {
    activeBorder: "border-sky-500",
    activeGradient: "from-sky-500/15",
    line: "#38bdf8",
  },
  temperature: {
    activeBorder: "border-amber-500",
    activeGradient: "from-amber-500/15",
    line: "#fbbf24",
  },
};

export function SmallChartButton({
  title,
  value,
  data,
  isActive,
  onClick,
  accent,
}: SmallChartButtonProps) {
  const styles = accentStyles[accent];

  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-3 text-left shadow-xl shadow-black/20 transition ${
        isActive
          ? `${styles.activeBorder} ${styles.activeGradient} to-slate-900`
          : "border-slate-800 from-slate-800/40 to-slate-900 hover:border-slate-700"
      }`}
    >
      <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-white/5 blur-2xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-1 text-lg font-bold text-white">{value}</p>
        </div>

        {isActive && (
          <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-white">
            Active
          </span>
        )}
      </div>

      <div className="relative mt-2 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis domain={["auto", "auto"]} hide />

            <Line
              type="monotone"
              dataKey="value"
              stroke={isActive ? styles.line : "#64748b"}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </button>
  );
}