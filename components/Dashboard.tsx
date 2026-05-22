"use client";

import { useMemo, useState } from "react";

import { DashboardTab, DashboardTabs } from "@/components/DashboardTabs";
import { SensorChart } from "@/components/SensorChart";
import { SensorMetricCard } from "@/components/SensorMetricCard";
import { SensorTable } from "@/components/SensorTable";
import { SmallChartButton } from "@/components/SmallChartButton";
import { StatCard } from "@/components/StatCard";
import { useMockLiveSensorData } from "@/hooks/useMockLiveSensorData";
import {
  average,
  createChartData,
  getSensorValues,
  latestValue,
  maximum,
  minimum,
} from "@/lib/sensor-data";
import type { SensorReading } from "@/types/sensor";

type DashboardProps = {
  initialRawMessageCount: number;
  initialSensorReadings: SensorReading[];
};

type SelectedChart = "pressure" | "humidity" | "temperature";

export function Dashboard({
  initialRawMessageCount,
  initialSensorReadings,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [selectedChart, setSelectedChart] =
    useState<SelectedChart>("pressure");

  const sensorReadings = useMockLiveSensorData(initialSensorReadings);

  const latestReadings = useMemo(() => {
    return sensorReadings.slice(-50).reverse();
  }, [sensorReadings]);

  const latestUpdateTime = latestReadings[0]?.time ?? "No readings yet";

  const temperatureValues = useMemo(() => {
    return getSensorValues(sensorReadings, "temperature");
  }, [sensorReadings]);

  const humidityValues = useMemo(() => {
    return getSensorValues(sensorReadings, "humidity");
  }, [sensorReadings]);

  const pressureValues = useMemo(() => {
    return getSensorValues(sensorReadings, "pressure");
  }, [sensorReadings]);

  const averageTemperature = average(temperatureValues);
  const averageHumidity = average(humidityValues);
  const averagePressure = average(pressureValues);

  const latestTemperature = latestValue(temperatureValues);
  const latestHumidity = latestValue(humidityValues);
  const latestPressure = latestValue(pressureValues);

  const minTemperature = minimum(temperatureValues);
  const maxTemperature = maximum(temperatureValues);

  const minHumidity = minimum(humidityValues);
  const maxHumidity = maximum(humidityValues);

  const minPressure = minimum(pressureValues);
  const maxPressure = maximum(pressureValues);

  const temperatureChartData = createChartData(sensorReadings, "temperature");
  const humidityChartData = createChartData(sensorReadings, "humidity");
  const pressureChartData = createChartData(sensorReadings, "pressure");

  const selectedChartConfig = {
    pressure: {
      title: "Pressure Trend",
      unit: "hPa",
      data: pressureChartData,
    },
    humidity: {
      title: "Humidity Trend",
      unit: "%",
      data: humidityChartData,
    },
    temperature: {
      title: "Temperature Trend",
      unit: "°C",
      data: temperatureChartData,
    },
  }[selectedChart];

  return (
    <div className="flex min-h-screen bg-slate-950">
      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="min-w-0 flex-1 p-4">
        {activeTab === "overview" && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard
                title="Live Session Messages"
                value={sensorReadings.length}
                subtitle="Readings currently used by the dashboard"
                accent="emerald"
              />

              <StatCard
                title="Sensors Found"
                value={
                  new Set(sensorReadings.map((reading) => reading.sensor)).size
                }
                subtitle="Pressure, humidity, and temperature"
                accent="sky"
              />

              <StatCard
                title="Latest Update"
                value={latestUpdateTime.split(" ")[1] ?? latestUpdateTime}
                subtitle={latestUpdateTime.split(" ")[0] ?? ""}
                accent="violet"
              />
            </div>

            <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-emerald-500/10 to-slate-900 p-6 shadow-xl shadow-black/20">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/5 blur-2xl" />

              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
                  Dashboard Status
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                  Robot Environmental Monitoring is Running
                </h2>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  The dashboard is currently using sensor data from the robot
                  file and mock live updates. New pressure, humidity, and
                  temperature readings are generated every few seconds to
                  simulate a live robot sensor stream.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                    <p className="text-sm text-slate-500">Pressure</p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {latestPressure.toFixed(1)} hPa
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                    <p className="text-sm text-slate-500">Humidity</p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {latestHumidity.toFixed(1)}%
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                    <p className="text-sm text-slate-500">Temperature</p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {latestTemperature.toFixed(1)}°C
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </section>
        )}

        {activeTab === "sensors" && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <SensorMetricCard
                title="Pressure"
                value={`${latestPressure.toFixed(1)} hPa`}
                average={`${averagePressure.toFixed(1)} hPa`}
                minimum={`${minPressure.toFixed(1)}`}
                maximum={`${maxPressure.toFixed(1)}`}
                accent="pressure"
              />

              <SensorMetricCard
                title="Humidity"
                value={`${latestHumidity.toFixed(1)}%`}
                average={`${averageHumidity.toFixed(1)}%`}
                minimum={`${minHumidity.toFixed(1)}`}
                maximum={`${maxHumidity.toFixed(1)}`}
                accent="humidity"
              />

              <SensorMetricCard
                title="Temperature"
                value={`${latestTemperature.toFixed(1)}°C`}
                average={`${averageTemperature.toFixed(1)}°C`}
                minimum={`${minTemperature.toFixed(1)}`}
                maximum={`${maxTemperature.toFixed(1)}`}
                accent="temperature"
              />
            </div>

            <SensorChart
              title={selectedChartConfig.title}
              data={selectedChartConfig.data}
              unit={selectedChartConfig.unit}
              accent={selectedChart}
            />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <SmallChartButton
                title="Pressure"
                value={`${latestPressure.toFixed(1)} hPa`}
                data={pressureChartData}
                isActive={selectedChart === "pressure"}
                onClick={() => setSelectedChart("pressure")}
                accent="pressure"
              />

              <SmallChartButton
                title="Humidity"
                value={`${latestHumidity.toFixed(1)}%`}
                data={humidityChartData}
                isActive={selectedChart === "humidity"}
                onClick={() => setSelectedChart("humidity")}
                accent="humidity"
              />

              <SmallChartButton
                title="Temperature"
                value={`${latestTemperature.toFixed(1)}°C`}
                data={temperatureChartData}
                isActive={selectedChart === "temperature"}
                onClick={() => setSelectedChart("temperature")}
                accent="temperature"
              />
            </div>
          </section>
        )}

        {activeTab === "data" && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard
                title="Initial Raw MQTT Messages"
                value={initialRawMessageCount}
                accent="violet"
              />

              <StatCard
                title="Live Session Messages"
                value={sensorReadings.length}
                accent="emerald"
              />

              <StatCard
                title="Sensors Found"
                value={
                  new Set(sensorReadings.map((reading) => reading.sensor)).size
                }
                accent="sky"
              />
            </div>

            <SensorTable readings={latestReadings} />
          </section>
        )}
      </main>
    </div>
  );
}