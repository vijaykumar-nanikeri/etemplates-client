import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { TemplatesComponent } from './templates.component';

import { ViewAllComponent } from './view-all/view-all.component';
import { ComposeTemplateComponent } from './compose-template/compose-template.component';

const templatesRoutes: Routes = [
  {
    path: '',
    component: TemplatesComponent,
    children: [
      {
        path: 'view-all',
        component: ViewAllComponent,
      },
      {
        path: ':id',
        component: ComposeTemplateComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(templatesRoutes)],
  exports: [RouterModule],
})
export class TemplatesRoutingModule {}
