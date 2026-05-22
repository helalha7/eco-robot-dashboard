"use client";

export type DashboardTab = "overview" | "sensors" | "data";

type DashboardTabsProps = {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
};

const tabs: { id: DashboardTab; label: string; description: string }[] = [
  {
    id: "overview",
    label: "Overview",
    description: "System summary",
  },
  {
    id: "sensors",
    label: "Sensors",
    description: "Live sensor dashboard",
  },
  {
    id: "data",
    label: "Data",
    description: "Latest sensor readings",
  },
];

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <aside className="sticky top-0 h-screen w-52 shrink-0 border-r border-slate-800 bg-slate-950 p-3">
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-emerald-500/10 to-slate-900 p-4 shadow-xl shadow-black/20">
        <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/5 blur-2xl" />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Live Mock
          </p>

          <h1 className="mt-2 text-lg font-bold text-white">Eco Robot</h1>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Environmental sensor dashboard
          </p>
        </div>
      </div>

      <nav className="mt-4 space-y-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative w-full overflow-hidden rounded-2xl border bg-gradient-to-br p-3 text-left shadow-xl shadow-black/20 transition ${
                isActive
                  ? "border-emerald-500 from-emerald-500/15 to-slate-900"
                  : "border-slate-800 from-slate-800/40 to-slate-900 hover:border-slate-700"
              }`}
            >
              <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-white/5 blur-2xl" />

              <div className="relative flex items-start gap-3">
                <span
                  className={`mt-1 h-2.5 w-2.5 rounded-full ${
                    isActive ? "bg-emerald-400" : "bg-slate-600"
                  }`}
                />

                <div>
                  <p
                    className={`text-sm font-semibold ${
                      isActive ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {tab.label}
                  </p>

                  <p
                    className={`mt-1 text-xs leading-5 ${
                      isActive ? "text-emerald-200/80" : "text-slate-500"
                    }`}
                  >
                    {tab.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}