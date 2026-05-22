type StatCardProps = {
    title: string;
    value: string | number;
    subtitle?: string;
    accent?: "emerald" | "sky" | "violet" | "amber";
  };
  
  const accentStyles = {
    emerald: {
      gradient: "from-emerald-500/10",
      dot: "bg-emerald-400",
    },
    sky: {
      gradient: "from-sky-500/10",
      dot: "bg-sky-400",
    },
    violet: {
      gradient: "from-violet-500/10",
      dot: "bg-violet-400",
    },
    amber: {
      gradient: "from-amber-500/10",
      dot: "bg-amber-400",
    },
  };
  
  export function StatCard({
    title,
    value,
    subtitle,
    accent = "emerald",
  }: StatCardProps) {
    const styles = accentStyles[accent];
  
    return (
      <section
        className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br ${styles.gradient} to-slate-900 p-4 shadow-xl shadow-black/20`}
      >
        <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/5 blur-2xl" />
  
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
            <p className="text-sm font-medium text-slate-400">{title}</p>
          </div>
  
          <p className="mt-3 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>
  
          {subtitle && <p className="mt-2 text-xs text-slate-500">{subtitle}</p>}
        </div>
      </section>
    );
  }