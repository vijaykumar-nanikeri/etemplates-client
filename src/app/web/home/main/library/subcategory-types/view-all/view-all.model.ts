export interface SubcategoryTypesTh {
  code: string;
  name: string;
}

export const SubcategoryTypesThead: Array<SubcategoryTypesTh> = [
  {
    code: 'sno',
    name: 'S.No.',
  },
  {
    code: 'subcategoryType',
    name: 'Subcategory Type',
  },
  {
    code: 'subcategoryTypeValues',
    name: 'Subcategory Type Values',
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

export interface SubcategoryType {
  id: number;
  name: string;
  subcategoryTypeValues: number;
  createdBy: string;
  createdOn: string;
}
