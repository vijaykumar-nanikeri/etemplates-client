import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MainRoutingModule } from './main-routing.module';

import { MainComponent } from './main.component';

import { SafeHtmlPipe } from 'src/app/web/home/shared/pipes/safe-html/safe-html.pipe';

import { DraftTemplateComponent } from './draft-template/draft-template.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [
    MainComponent,
    SafeHtmlPipe,
    DraftTemplateComponent,
    UsersComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MainRoutingModule],
})
export class MainModule {}
