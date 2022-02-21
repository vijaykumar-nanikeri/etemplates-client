import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';

import { AsideComponent } from './aside/aside.component';

@NgModule({
  declarations: [HomeComponent, AsideComponent],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
