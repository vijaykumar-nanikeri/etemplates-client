import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/web/home/shared/shared.module';

import { CategoriesRoutingModule } from './categories-routing.module';

import { CategoriesComponent } from './categories.component';

import { ViewAllComponent } from './view-all/view-all.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [CategoriesComponent, ViewAllComponent, ViewComponent],
  imports: [CommonModule, CategoriesRoutingModule, SharedModule],
})
export class CategoriesModule {}
