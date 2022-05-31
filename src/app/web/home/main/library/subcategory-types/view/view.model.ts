export interface SubcategoryTypeValuesTh {
  code: string;
  name: string;
}

export const SubcategoryTypeValuesThead: Array<SubcategoryTypeValuesTh> = [
  {
    code: 'sno',
    name: 'S.No.',
  },
  {
    code: 'subcategoryTypeValue',
    name: 'Subcategory Type Value',
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

export interface SubcategoryTypeValue {
  id: number;
  name: string;
  createdBy: string;
  createdOn: string;
}
