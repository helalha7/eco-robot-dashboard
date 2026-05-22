import rawData from "../sensor_data.json";

import { Dashboard } from "@/components/Dashboard";
import { extractMessages, parseSensorMessages } from "@/lib/sensor-data";

export default function Home() {
  const messages = extractMessages(rawData);
  const sensorReadings = parseSensorMessages(messages);

  return (
    <Dashboard
      initialRawMessageCount={messages.length}
      initialSensorReadings={sensorReadings}
    />
  );
}