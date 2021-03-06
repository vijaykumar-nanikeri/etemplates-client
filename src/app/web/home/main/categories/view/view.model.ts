export interface SubcategoriesTh {
  code: string;
  name: string;
}

export const SubcategoriesThead: Array<SubcategoriesTh> = [
  {
    code: 'sno',
    name: 'S.No.',
  },
  {
    code: 'subcategory',
    name: 'Subcategory',
  },
  {
    code: 'types',
    name: 'Types',
  },
  {
    code: 'templates',
    name: 'Templates',
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

export interface Subcategory {
  id: number;
  name: string;
  types: number;
  templates: number;
  createdBy: string;
  createdOn: string;
}

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
];

export interface Template {
  id: number;
  name: string;
  createdBy: string;
  createdOn: string;
}
