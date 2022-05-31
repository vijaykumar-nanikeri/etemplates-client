export interface Tab {
  code: string;
  name: string;
  basePath: string;
  link: string;
}

export const LibraryTabs: Array<Tab> = [
  {
    code: 'subcategoryTypes',
    name: 'Subcategory Types',
    basePath: '/home/library/subcategory-types',
    link: '/view-all',
  },
  {
    code: 'fieldNames',
    name: 'Field Names',
    basePath: '/home/library/field-names',
    link: '',
  },
];
