export interface FieldNamesTh {
  code: string;
  name: string;
}

export const FieldNamesThead: Array<FieldNamesTh> = [
  {
    code: 'sno',
    name: 'S.No.',
  },
  {
    code: 'fieldName',
    name: 'Field Name',
  },
  {
    code: 'createdBy',
    name: 'Created by',
  },
  {
    code: 'createdOn',
    name: 'Created on',
  },
  {
    code: 'actions',
    name: 'Actions',
  },
];

export interface FieldName {
  id: number;
  name: string;
  createdBy: string;
  createdOn: string;
}
