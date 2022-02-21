export interface CategoriesTh {
  code: string;
  name: string;
}

export const CategoriesThead: Array<CategoriesTh> = [
  {
    code: 'sno',
    name: 'S.No.',
  },
  {
    code: 'category',
    name: 'Category',
  },
  {
    code: 'subcategories',
    name: 'Subcategories',
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

export interface Category {
  id: number;
  name: string;
  subcategories: number;
  createdBy: string;
  createdOn: string;
}
