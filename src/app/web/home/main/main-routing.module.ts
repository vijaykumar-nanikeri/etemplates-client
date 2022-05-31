import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main.component';

import { DraftTemplateComponent } from './draft-template/draft-template.component';
import { UsersComponent } from './users/users.component';

const mainRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'categories',
        loadChildren: () =>
          import('./categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
      {
        path: 'library',
        loadChildren: () =>
          import('./library/library.module').then((m) => m.LibraryModule),
      },
      {
        path: 'templates',
        loadChildren: () =>
          import('./templates/templates.module').then((m) => m.TemplatesModule),
      },
      {
        path: 'draft-template',
        component: DraftTemplateComponent,
      },
      {
        path: 'user-templates',
        loadChildren: () =>
          import('./user-templates/user-templates.module').then(
            (m) => m.UserTemplatesModule
          ),
      },
      {
        path: 'users',
        component: UsersComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(mainRoutes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
