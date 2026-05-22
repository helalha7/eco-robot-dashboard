"use client";

import { useEffect, useState } from "react";

import type { SensorReading } from "@/types/sensor";

function formatTime(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function useReplaySensorData(sourceReadings: SensorReading[]) {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (sourceReadings.length === 0) {
      setReadings([]);
      setCurrentIndex(0);
      return;
    }

    const initialWindow = sourceReadings.slice(0, 30);

    setReadings(initialWindow);
    setCurrentIndex(initialWindow.length);
  }, [sourceReadings]);

  useEffect(() => {
    if (sourceReadings.length === 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setReadings((currentReadings) => {
        const nextReadings: SensorReading[] = [];
        const batchSize = 3;

        for (let i = 0; i < batchSize; i++) {
          const index = (currentIndex + i) % sourceReadings.length;
          const sourceReading = sourceReadings[index];

          nextReadings.push({
            ...sourceReading,
            id: `replay_${sourceReading.id}_${Date.now()}_${i}`,
            time: formatTime(new Date()),
          });
        }

        return [...currentReadings, ...nextReadings].slice(-300);
      });

      setCurrentIndex((previousIndex) => {
        return (previousIndex + 3) % sourceReadings.length;
      });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [sourceReadings, currentIndex]);

  return readings;
}