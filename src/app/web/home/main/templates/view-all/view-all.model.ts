export interface TemplatesTh {
  code: string;
  name: string;
}

export const TemplatesThead: Array<TemplatesTh> = [
  {
    code: 'sno',
    name: 'S.No.',
  },
  {
    code: 'template',
    name: 'Template',
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
  {
    code: 'compose',
    name: 'Compose',
  },
];

export interface Template {
  id: number;
  name: string;
  createdBy: string;
  createdOn: string;
}
