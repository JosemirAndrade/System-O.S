export interface Part {
  description: string;
  value: number;
}

export interface ServiceOrder {
  technician: string;
  client: string;
  equipment: string;
  model: string;
  serialNumber: string;
  defect: string;
  solution: string;
  observations?: string;
  parts: Part[];
  serviceValue: number;
  entryDate: string;
  exitDate?: string;
}