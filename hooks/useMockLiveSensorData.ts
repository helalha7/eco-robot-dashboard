"use client";

import { useEffect, useState } from "react";

import type { SensorReading } from "@/types/sensor";

type SensorName = "temperature" | "humidity" | "pressure";

function formatTime(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getLastValue(readings: SensorReading[], sensor: SensorName) {
  const lastReading = readings
    .filter((reading) => reading.sensor === sensor)
    .at(-1);

  if (lastReading) {
    return lastReading.value;
  }

  if (sensor === "temperature") return 23.3;
  if (sensor === "humidity") return 60.6;
  return 982.8;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createNextValue(previousValue: number, sensor: SensorName) {
  if (sensor === "temperature") {
    return clamp(previousValue + (Math.random() - 0.5) * 0.12, 22.8, 24.2);
  }

  if (sensor === "humidity") {
    return clamp(previousValue + (Math.random() - 0.5) * 0.4, 58, 63);
  }

  return clamp(previousValue + (Math.random() - 0.5) * 0.12, 982.4, 983.1);
}

function createMockReading(
  readings: SensorReading[],
  sensor: SensorName
): SensorReading {
  const previousValue = getLastValue(readings, sensor);
  const nextValue = createNextValue(previousValue, sensor);

  return {
    id: `mock_${sensor}_${Date.now()}_${Math.random()}`,
    time: formatTime(new Date()),
    sensor,
    value: Number(nextValue.toFixed(2)),
    topic: `braude/team1/${sensor}`,
  };
}

export function useMockLiveSensorData(initialReadings: SensorReading[]) {
  const [readings, setReadings] = useState<SensorReading[]>(initialReadings);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setReadings((currentReadings) => {
        const newReadings: SensorReading[] = [
          createMockReading(currentReadings, "temperature"),
          createMockReading(currentReadings, "humidity"),
          createMockReading(currentReadings, "pressure"),
        ];

        return [...currentReadings, ...newReadings].slice(-8000);
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return readings;
}