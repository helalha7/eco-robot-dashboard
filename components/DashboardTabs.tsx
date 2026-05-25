"use client";

export type DashboardTab = "overview" | "sensors" | "data" | "research";

type DashboardTabsProps = {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
};

const tabs: { id: DashboardTab; label: string; icon: string }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: "⌁",
  },
  {
    id: "sensors",
    label: "Sensors",
    icon: "◌",
  },
  {
    id: "data",
    label: "Data",
    icon: "▦",
  },
  {
    id: "research",
    label: "Research",
    icon: "◇",
  },
];

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/80 px-4 py-4 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-3 justify-self-start">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
            E
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              EcoSense<span className="text-emerald-400">Lab</span>
            </h1>

            <p className="-mt-1 text-xs text-slate-500">
              Sensor Dashboard
            </p>
          </div>
        </div>

        <nav className="justify-self-center">
          <div className="flex items-center gap-1 rounded-2xl border border-slate-800 bg-slate-900/70 p-1.5 shadow-xl shadow-black/20">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "border border-emerald-400/40 bg-slate-800 text-white shadow-[0_0_0_2px_rgba(16,185,129,0.18)]"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <span
                    className={`text-lg ${
                      isActive ? "text-emerald-400" : "text-slate-500"
                    }`}
                  >
                    {tab.icon}
                  </span>

                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="justify-self-end">
          <button className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400">
            Static Data
          </button>
        </div>
      </div>
    </header>
  );
}