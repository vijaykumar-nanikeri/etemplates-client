export interface Field {
  id: number;
  name: string;
  notes: string;
  size: number;
}

export interface FieldSize {
  code: string;
  name: string;
  value: number;
}

export const FieldSizes: Array<FieldSize> = [
  {
    code: 'normal',
    name: 'Normal',
    value: 0,
  },
  {
    code: 'large',
    name: 'Large',
    value: 1,
  },
];
