"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartPoint } from "@/types/sensor";

type SensorChartProps = {
  title: string;
  data: ChartPoint[];
  unit?: string;
  accent?: "pressure" | "humidity" | "temperature";
};

const accentStyles = {
  pressure: {
    gradient: "from-violet-500/10",
    line: "#a78bfa",
    badge: "bg-violet-500/15 text-violet-300 ring-violet-500/20",
  },
  humidity: {
    gradient: "from-sky-500/10",
    line: "#38bdf8",
    badge: "bg-sky-500/15 text-sky-300 ring-sky-500/20",
  },
  temperature: {
    gradient: "from-amber-500/10",
    line: "#fbbf24",
    badge: "bg-amber-500/15 text-amber-300 ring-amber-500/20",
  },
};

export function SensorChart({
  title,
  data,
  unit,
  accent = "pressure",
}: SensorChartProps) {
  const styles = accentStyles[accent];

  return (
    <section
      className={`relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br ${styles.gradient} to-slate-900 p-4 shadow-xl shadow-black/20`}
    >
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/5 blur-2xl" />

      <div className="relative flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <p className="mt-1 text-xs text-slate-500">Live sensor trend</p>
        </div>

        {unit && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles.badge}`}
          >
            {unit}
          </span>
        )}
      </div>

      <div className="relative mt-4 h-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            <XAxis
              dataKey="time"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={{ stroke: "#334155" }}
            />

            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              axisLine={{ stroke: "#334155" }}
              tickLine={{ stroke: "#334155" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                color: "#e2e8f0",
              }}
              labelStyle={{ color: "#94a3b8" }}
              itemStyle={{ color: styles.line }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke={styles.line}
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}