import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SubcategoryTypesComponent } from './subcategory-types.component';

import { ViewAllComponent } from './view-all/view-all.component';
import { ViewComponent } from './view/view.component';

const adminDetailsRoutes: Routes = [
  {
    path: '',
    component: SubcategoryTypesComponent,
    children: [
      {
        path: 'view-all',
        component: ViewAllComponent,
      },
      {
        path: 'view/:id',
        component: ViewComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(adminDetailsRoutes)],
  exports: [RouterModule],
})
export class SubcategoryTypesRoutingModule {}
