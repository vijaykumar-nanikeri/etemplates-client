export interface UsersTh {
  code: string;
  name: string;
}

export const UsersThead: Array<UsersTh> = [
  {
    code: 'sno',
    name: 'S.No.',
  },
  {
    code: 'user',
    name: 'User',
  },
  {
    code: 'userCategory',
    name: 'User Category',
  },
  {
    code: 'mobileNo',
    name: 'Mobile No',
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
    code: 'templates',
    name: 'Templates',
  },
  {
    code: 'actions',
    name: 'Actions',
  },
];

export interface User {
  id: number;
  name: string;
  userCategoryId: number;
  userCategory: string;
  mobileNo: number;
  block: number;
  createdBy: string;
  createdOn: string;
  templates: number;
}

export interface UserCategory {
  id: number;
  name: string;
}
