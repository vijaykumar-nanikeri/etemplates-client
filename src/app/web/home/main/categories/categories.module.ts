import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';

import { CategoriesRoutingModule } from './categories-routing.module';

import { CategoriesComponent } from './categories.component';

import { ViewAllComponent } from './view-all/view-all.component';
import { SubcategoriesComponent } from './subcategories/subcategories.component';

@NgModule({
  declarations: [CategoriesComponent, ViewAllComponent, SubcategoriesComponent],
  imports: [CommonModule, CategoriesRoutingModule, SharedModule],
})
export class CategoriesModule {}
