import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PublicRoutingModule } from './public-routing.module';

import { PublicComponent } from './public.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [PublicComponent, LoginComponent],
  imports: [CommonModule, ReactiveFormsModule, PublicRoutingModule],
})
export class PublicModule {}
