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
    code: 'uuid',
    name: 'UUID',
  },
  {
    code: 'filename',
    name: 'File Name',
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
  filename: string;
  createdOn: string;
}
