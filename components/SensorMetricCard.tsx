type SensorMetricCardProps = {
    title: string;
    value: string;
    average: string;
    minimum: string;
    maximum: string;
    accent: "pressure" | "humidity" | "temperature";
  };
  
  const accentStyles = {
    pressure: {
      label: "bg-violet-500/15 text-violet-300 ring-violet-500/20",
      dot: "bg-violet-400",
      gradient: "from-violet-500/10",
    },
    humidity: {
      label: "bg-sky-500/15 text-sky-300 ring-sky-500/20",
      dot: "bg-sky-400",
      gradient: "from-sky-500/10",
    },
    temperature: {
      label: "bg-amber-500/15 text-amber-300 ring-amber-500/20",
      dot: "bg-amber-400",
      gradient: "from-amber-500/10",
    },
  };
  
  export function SensorMetricCard({
    title,
    value,
    average,
    minimum,
    maximum,
    accent,
  }: SensorMetricCardProps) {
    const styles = accentStyles[accent];
  
    return (
      <section
        className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br ${styles.gradient} to-slate-900 p-4 shadow-xl shadow-black/20`}
      >
        <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/5 blur-2xl" />
  
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-400">{title}</p>
  
            <p className="mt-2 text-3xl font-bold tracking-tight text-white">
              {value}
            </p>
          </div>
  
          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${styles.label}`}
          >
            Live
          </div>
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
      </section>
    );
  }