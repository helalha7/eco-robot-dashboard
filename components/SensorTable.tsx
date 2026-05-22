import type { SensorReading } from "@/types/sensor";

type SensorTableProps = {
  readings: SensorReading[];
};

export function SensorTable({ readings }: SensorTableProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800/40 to-slate-900 p-5 shadow-xl shadow-black/20">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/5 blur-2xl" />

      <h2 className="relative text-base font-semibold text-white">
        Latest Sensor Readings
      </h2>

      <div className="relative mt-4 max-h-[520px] overflow-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-slate-900">
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="p-3">Time</th>
              <th className="p-3">Sensor</th>
              <th className="p-3">Value</th>
              <th className="p-3">Topic</th>
            </tr>
          </thead>

          <tbody>
            {readings.map((reading) => (
              <tr
                key={reading.id}
                className="border-b border-slate-800 text-slate-300"
              >
                <td className="p-3">{reading.time}</td>
                <td className="p-3 font-medium text-white">
                  {reading.sensor}
                </td>
                <td className="p-3">{reading.value}</td>
                <td className="p-3 text-slate-500">{reading.topic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}