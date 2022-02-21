export interface UserTemplatesTh {
  code: string;
  name: string;
}

export const UserTemplatesThead: Array<UserTemplatesTh> = [
  {
    code: 'sno',
    name: 'S.No.',
  },
  {
    code: 'userTemplate',
    name: 'User Template',
  },
  {
    code: 'createdOn',
    name: 'Created on',
  },
  {
    code: 'action',
    name: 'Action',
  },
];

export interface UserTemplate {
  id: number;
  uuid: string;
  createdOn: string;
}
