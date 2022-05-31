import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { HotToastModule, ToastConfig } from '@ngneat/hot-toast';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { AuthInterceptor } from './web/home/shared/interceptors/auth/auth.interceptor';

const hotToastConfig: any = {
  theme: 'snackbar',
  reverseOrder: true,
  dismissible: true,
  autoClose: true,
  position: 'bottom-center',
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    HotToastModule.forRoot(hotToastConfig),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class AppModule {}
