export type Input = {
  headers: string[];
  separator: string;
  buffer: Buffer;
};

export interface ICSVProvider {
  parse(input: Input): Promise<Record<string, any>[]>;
}
