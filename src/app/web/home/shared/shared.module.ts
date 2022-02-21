import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CKEditorModule } from 'ckeditor4-angular';

import { SafeHtmlPipe } from './pipes/safe-html/safe-html.pipe';
import { FormatDatePipe } from './pipes/format-date/format-date.pipe';

import { ConfirmComponent } from './components/confirm/confirm.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChangeDefaultPasswordComponent } from './components/change-default-password/change-default-password.component';

@NgModule({
  declarations: [
    FormatDatePipe,
    ConfirmComponent,
    ProfileDetailsComponent,
    ChangePasswordComponent,
    ChangeDefaultPasswordComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CKEditorModule],
  exports: [FormsModule, ReactiveFormsModule, FormatDatePipe, CKEditorModule],
  providers: [SafeHtmlPipe, FormatDatePipe],
  entryComponents: [ConfirmComponent],
})
export class SharedModule {}
