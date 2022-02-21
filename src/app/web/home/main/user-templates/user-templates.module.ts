import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { UserTemplatesRoutingModule } from './user-templates-routing.module';

import { UserTemplatesComponent } from './user-templates.component';

import { ViewAllComponent } from './view-all/view-all.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [UserTemplatesComponent, ViewAllComponent, ViewComponent],
  imports: [CommonModule, UserTemplatesRoutingModule, SharedModule],
})
export class UserTemplatesModule {}
