export type Input = {
  metricId: number;
  dateTime: string | Date;
  value: number;
}[];

export type Output = {
  date: string | Date;
  value: number;
};

export type InputGetAll = {
  metricId: number;
  aggType: 'day' | 'month' | 'year';
  initialDate: Date;
  finalDate: Date;
};

export type InputExport = {
  metricId: number;
  initialDate: Date;
  finalDate: Date;
};

export type OutputExport = {
  metricId: number;
  dateTime: string;
  aggDay: number;
  aggMonth: number;
  aggYear: number;
};

export interface IMeasureRepository {
  save(inputs: Input): Promise<void>;
  getAll(data: InputGetAll): Promise<Output[]>;
  toExport(data: InputExport): Promise<OutputExport[]>;
}
