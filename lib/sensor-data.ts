import type {
  RawSensorMessage,
  SensorReading,
  ChartPoint,
} from "@/types/sensor";

export function extractMessages(data: unknown): RawSensorMessage[] {
  if (Array.isArray(data)) {
    if (data.length > 0 && "messages" in data[0]) {
      return data.flatMap((item) => item.messages ?? []);
    }

    return data as RawSensorMessage[];
  }

  if (data && typeof data === "object" && "messages" in data) {
    return (data as { messages: RawSensorMessage[] }).messages;
  }

  return [];
}

function removeMilliseconds(time: string) {
    const parts = time.split(":");
  
    if (parts.length <= 3) {
      return time;
    }
  
    return parts.slice(0, 3).join(":");
  }

export function getSensorName(topic: string) {
  return topic.split("/").pop() ?? topic;
}

export function parseSensorMessages(
  messages: RawSensorMessage[]
): SensorReading[] {
  return messages
    .filter((message) =>
      ["temperature", "humidity", "pressure"].includes(
        getSensorName(message.topic)
      )
    )
    .map((message) => ({
      id: message.id,
      time: removeMilliseconds(message.createAt),
      sensor: getSensorName(message.topic),
      value: Number(message.payload),
      topic: message.topic,
    }));
}

export function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  const sum = values.reduce((total, value) => total + value, 0);
  return sum / values.length;
}

export function getSensorValues(
  readings: SensorReading[],
  sensorName: string
): number[] {
  return readings
    .filter((reading) => reading.sensor === sensorName)
    .map((reading) => reading.value);
}

export function createChartData(
  readings: SensorReading[],
  sensorName: string
): ChartPoint[] {
  return readings
    .filter((reading) => reading.sensor === sensorName)
    .slice(-50)
    .map((reading) => ({
      time: reading.time.split(" ")[1],
      value: reading.value,
    }));
}

export function minimum(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Math.min(...values);
}

export function maximum(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Math.max(...values);
}

export function latestValue(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values[values.length - 1];
}
