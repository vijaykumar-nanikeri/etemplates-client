import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/web/home/shared/shared.module';

import { SubcategoryTypesRoutingModule } from './subcategory-types-routing.module';

import { SubcategoryTypesComponent } from '../subcategory-types/subcategory-types.component';

import { ViewAllComponent } from './view-all/view-all.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [SubcategoryTypesComponent, ViewAllComponent, ViewComponent],
  imports: [CommonModule, SubcategoryTypesRoutingModule, SharedModule],
})
export class SubcategoryTypesModule {}
