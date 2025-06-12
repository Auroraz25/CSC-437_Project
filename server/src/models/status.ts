export type StatusType = 'read' | 'reading' | 'to-read';

export interface Status {
  id: string;
  name: string;
  type: StatusType;
  description: string;
}