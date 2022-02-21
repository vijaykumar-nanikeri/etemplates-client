import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { TemplatesRoutingModule } from './templates-routing.module';

import { TemplatesComponent } from './templates.component';

import { ViewAllComponent } from './view-all/view-all.component';
import { ComposeTemplateComponent } from './compose-template/compose-template.component';

@NgModule({
  declarations: [
    TemplatesComponent,
    ViewAllComponent,
    ComposeTemplateComponent,
  ],
  imports: [CommonModule, TemplatesRoutingModule, SharedModule],
})
export class TemplatesModule {}
