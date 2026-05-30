"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardTab, DashboardTabs } from "@/components/DashboardTabs";
import { ResearchRag } from "@/components/ResearchRag";
import { SensorChart } from "@/components/SensorChart";
import { SensorTable } from "@/components/SensorTable";
import { SmallChartButton } from "@/components/SmallChartButton";
import { StatCard } from "@/components/StatCard";
import {
  average,
  createChartData,
  extractMessages,
  getSensorValues,
  latestValue,
  maximum,
  minimum,
  parseSensorMessages,
} from "@/lib/sensor-data";
import type { SensorReading } from "@/types/sensor";

type SelectedChart = "pressure" | "humidity" | "temperature";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [selectedChart, setSelectedChart] =
    useState<SelectedChart>("pressure");

  const [rawMessageCount, setRawMessageCount] = useState(0);
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSensorData() {
      try {
        setIsLoadingData(true);

        const response = await fetch("/data/sensor_data.json");

        if (!response.ok) {
          throw new Error("Could not load sensor data file");
        }

        const data = await response.json();
        const messages = extractMessages(data);
        const readings = parseSensorMessages(messages);

        setRawMessageCount(messages.length);
        setSensorReadings(readings);
        setDataError(null);
      } catch (error) {
        console.error(error);
        setDataError("Failed to load sensor data");
      } finally {
        setIsLoadingData(false);
      }
    }

    loadSensorData();
  }, []);

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

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-slate-950">
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="mx-auto max-w-7xl p-4">
          <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-emerald-500/10 to-slate-900 p-6 shadow-xl shadow-black/20">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
              Loading
            </p>

            <h1 className="mt-3 text-3xl font-bold text-white">
              Loading sensor data...
            </h1>

            <p className="mt-4 text-slate-400">
              The dashboard is reading the robot sensor data file.
            </p>
          </section>
        </main>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-slate-950">
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="mx-auto max-w-7xl p-4">
          <section className="rounded-2xl border border-red-900/60 bg-gradient-to-br from-red-500/10 to-slate-900 p-6 shadow-xl shadow-black/20">
            <p className="text-sm font-semibold uppercase tracking-wider text-red-300">
              Error
            </p>

            <h1 className="mt-3 text-3xl font-bold text-white">
              Sensor data could not be loaded
            </h1>

            <p className="mt-4 text-slate-400">{dataError}</p>

            <p className="mt-4 text-sm text-slate-500">
              Make sure the file exists at{" "}
              <code className="rounded bg-slate-950 px-2 py-1 text-slate-300">
                public/data/sensor_data.json
              </code>
            </p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-7xl p-4">
      {activeTab === "overview" && (
  <section className="space-y-5">
    <section
      dir="rtl"
      className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 text-right shadow-xl shadow-black/20"
    >
      <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative space-y-6">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">
            Ecological Research Context
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-white">
            ניטור תנאים א־ביוטיים באמצעות רובוט וחיישנים
          </h2>

          <p className="mt-4 max-w-3xl leading-8 text-slate-400">
            פרויקט EcoSense Lab עוסק בניטור וניתוח תנאים סביבתיים
            א־ביוטיים בסביבת מעבדה מבוקרת של Industry 4.0. במסגרת
            הפרויקט נעשה שימוש ברובוט נע שעליו מותקנת יד רובוטית עם
            חיישנים סביבתיים. החיישנים מודדים טמפרטורה, לחות יחסית
            ולחץ אוויר — מדדים הנחשבים לגורמים א־ביוטיים, כלומר גורמים
          פיזיקליים שאינם חיים אך משפיעים על תנאי הסביבה.
          </p>

          <p className="mt-3 max-w-3xl leading-8 text-slate-400">
            מכיוון שהחיישנים מותקנים על היד הרובוטית, ניתן לבצע דגימה
            בגבהים שונים ולבדוק האם קיימת שונות אנכית במדדים הסביבתיים.
            כלומר, הפרויקט בודק האם מדידה בגובה נמוך, בינוני וגבוה
            נותנת ערכים שונים של טמפרטורה, לחות ולחץ.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
            <p className="text-sm font-semibold text-emerald-300">
              שאלת המחקר
            </p>

            <h3 className="mt-3 text-xl font-bold leading-8 text-white">
              האם קיימת שונות אנכית במדדי טמפרטורה, לחות ולחץ בסביבת
              מעבדה מבוקרת, כפי שהיא נמדדת באמצעות חיישנים המותקנים על
              יד רובוטית בגבהים שונים?
            </h3>
          </div>

          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-5">
            <p className="text-sm font-semibold text-sky-300">
              מטרת המחקר
            </p>

            <p className="mt-3 leading-8 text-slate-300">
              מטרת המחקר היא לבדוק האם שינוי בגובה הדגימה של היד
              הרובוטית מוביל לשינוי במדדים סביבתיים א־ביוטיים. תוצאות
              המחקר יכולות לעזור להבין האם קיימים הבדלים סביבתיים בין
              גבהים שונים במרחב המעבדה.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
              X
            </div>

            <h3 className="text-lg font-bold text-white">
              משתנה בלתי תלוי
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              גובה הדגימה של היד הרובוטית. לדוגמה: גובה נמוך, גובה
              בינוני וגובה גבוה. זהו המשתנה שלפיו משווים את המדידות.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
              Y
            </div>

            <h3 className="text-lg font-bold text-white">
              משתנים תלויים
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              טמפרטורה, לחות יחסית ולחץ אוויר. אלו המדדים שהחיישנים
              מודדים, ואותם נבדוק כדי לראות האם הם משתנים בין גבהי
              הדגימה השונים.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
              !
            </div>

            <h3 className="text-lg font-bold text-white">משתני בקרה</h3>

            <p className="mt-3 leading-7 text-slate-400">
              מיקום הרובוט, זמן המדידה, תנאי אוורור, פעילות אנשים או
              מכונות במעבדה ודיוק החיישנים. משתנים אלו יכולים להשפיע על
              המדידות ולכן חשוב לתעד אותם.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
            <p className="text-sm font-semibold text-slate-500">
              שלב 1
            </p>

            <h3 className="mt-2 text-lg font-bold text-white">
              סטטיסטיקה תיאורית
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              לפני ביצוע מבחן סטטיסטי יש לתאר את הנתונים. עבור כל גובה
              ועבור כל מדד סביבתי יש לחשב ממוצע, חציון, סטיית תקן, ערך
              מינימלי, ערך מקסימלי וטווח. כך ניתן להבין האם קיימים
              הבדלים ראשוניים בין הגבהים.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
            <p className="text-sm font-semibold text-slate-500">
              שלב 2
            </p>

            <h3 className="mt-2 text-lg font-bold text-white">
              בדיקת השערות
            </h3>

            <p className="mt-3 leading-7 text-slate-400">
              השערת האפס היא שלא קיימים הבדלים מובהקים במדדי טמפרטורה,
              לחות ולחץ בין גבהי הדגימה השונים. השערת המחקר היא שקיים
              הבדל מובהק לפחות באחד מהמדדים בין הגבהים.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-slate-950 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Statistical Test
              </p>

              <h3 className="mt-2 text-xl font-bold text-white">
                המבחן הסטטיסטי המתאים
              </h3>
            </div>

            <span className="w-fit rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/20">
              Repeated Measures ANOVA
            </span>
          </div>

          <p className="mt-4 leading-8 text-slate-300">
            המבחן המרכזי המתאים לפרויקט הוא Repeated Measures ANOVA,
            מכיוון שהמחקר בודק האם קיימים הבדלים מובהקים במדדים כמותיים
            רציפים — טמפרטורה, לחות ולחץ — בין כמה גבהים שונים של אותה
            מערכת מדידה. אם הנתונים אינם עומדים בהנחות המבחן, או אם
            מספר המדידות קטן, ניתן להשתמש ב־Friedman Test כחלופה
            לא־פרמטרית. אם קיימים רק שני גבהים בלבד, ניתן להשתמש
            ב־Paired Samples t-test.
          </p>
        </div>
      </div>
    </section>
  </section>
)}

        {activeTab === "sensors" && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <SmallChartButton
                title="Pressure"
                value={`${latestPressure.toFixed(1)} hPa`}
                average={`${averagePressure.toFixed(1)} hPa`}
                minimum={`${minPressure.toFixed(1)}`}
                maximum={`${maxPressure.toFixed(1)}`}
                data={pressureChartData}
                isActive={selectedChart === "pressure"}
                onClick={() => setSelectedChart("pressure")}
                accent="pressure"
              />

              <SmallChartButton
                title="Humidity"
                value={`${latestHumidity.toFixed(1)}%`}
                average={`${averageHumidity.toFixed(1)}%`}
                minimum={`${minHumidity.toFixed(1)}`}
                maximum={`${maxHumidity.toFixed(1)}`}
                data={humidityChartData}
                isActive={selectedChart === "humidity"}
                onClick={() => setSelectedChart("humidity")}
                accent="humidity"
              />

              <SmallChartButton
                title="Temperature"
                value={`${latestTemperature.toFixed(1)}°C`}
                average={`${averageTemperature.toFixed(1)}°C`}
                minimum={`${minTemperature.toFixed(1)}`}
                maximum={`${maxTemperature.toFixed(1)}`}
                data={temperatureChartData}
                isActive={selectedChart === "temperature"}
                onClick={() => setSelectedChart("temperature")}
                accent="temperature"
              />
            </div>

            <SensorChart
              title={selectedChartConfig.title}
              data={selectedChartConfig.data}
              unit={selectedChartConfig.unit}
              accent={selectedChart}
            />
          </section>
        )}

        {activeTab === "data" && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard
                title="Source File Messages"
                value={rawMessageCount}
                accent="violet"
              />

              <StatCard
                title="Sensor Messages"
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

        {activeTab === "research" && <ResearchRag />}
      </main>
    </div>
  );
}