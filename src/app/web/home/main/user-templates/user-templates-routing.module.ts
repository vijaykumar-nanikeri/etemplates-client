import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UserTemplatesComponent } from './user-templates.component';

import { ViewAllComponent } from './view-all/view-all.component';
import { ViewComponent } from './view/view.component';

const userTemplatesRoutes: Routes = [
  {
    path: '',
    component: UserTemplatesComponent,
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
  imports: [CommonModule, RouterModule.forChild(userTemplatesRoutes)],
  exports: [RouterModule],
})
export class UserTemplatesRoutingModule {}
