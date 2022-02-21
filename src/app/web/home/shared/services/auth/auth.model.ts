export interface App {
  id: number;
  name: string;
  acronym: string;
  version: string;
}

export interface User {
  id: number;
  name: string;
  userCategoryId: number;
  userCategory: string;
  mobileNo: number;
  defaultPath: string;
}
