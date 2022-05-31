import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/web/home/shared/shared.module';

import { LibraryRoutingModule } from './library-routing.module';

import { LibraryComponent } from './library.component';

import { FieldNamesComponent } from './field-names/field-names.component';

@NgModule({
  declarations: [LibraryComponent, FieldNamesComponent],
  imports: [CommonModule, LibraryRoutingModule, SharedModule],
})
export class LibraryModule {}
