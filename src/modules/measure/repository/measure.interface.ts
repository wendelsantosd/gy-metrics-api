export type InputSave = {
  metricId: number;
  dateTime: string | Date;
  value: number;
}[];

export type OutputGetAll = {
  created_at: Date;
  value: number;
};

export type InputGetAll = {
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
  save(inputs: InputSave): Promise<void>;
  getAll(data: InputGetAll): Promise<OutputGetAll[]>;
}
