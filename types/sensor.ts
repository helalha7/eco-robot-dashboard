export type RawSensorMessage = {
  id: string;
  createAt: string;
  payload: string;
  topic: string;
};

export type SensorReading = {
  id: string;
  time: string;
  sensor: string;
  value: number;
  topic: string;
};

export type ChartPoint = {
  time: string;
  value: number;
};
