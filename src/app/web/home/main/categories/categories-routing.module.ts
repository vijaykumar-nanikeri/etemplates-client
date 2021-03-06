import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CategoriesComponent } from './categories.component';

import { ViewAllComponent } from './view-all/view-all.component';
import { ViewComponent } from './view/view.component';

const categoriesRoutes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    children: [
      {
        path: 'view-all',
        component: ViewAllComponent,
      },
      {
        path: ':id',
        component: ViewComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(categoriesRoutes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}
