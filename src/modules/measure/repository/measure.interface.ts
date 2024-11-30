export type Input = {
  metricId: number;
  dateTime: string | Date;
  value: number;
}[];

export interface IMeasureRepository {
  save(inputs: Input): Promise<void>;
}
