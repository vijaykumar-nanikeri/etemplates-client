export interface Menu {
  id: number;
  name: string;
  basePath: string;
  path: string;
  displayOrder: number;
  classNames: string;
  icon: string;
}

export interface UserMenu {
  id: number;
  code: string;
  name: string;
  displayOrder: number;
  classNames: string;
  icon: string;
}
