import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { StatusCodes as HttpStatusCodes } from 'http-status-codes';
import { HotToastService } from '@ngneat/hot-toast';

import { HttpService } from 'src/app/web/public/shared/services/http/http.service';
import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';

import { ChangeDefaultPasswordComponent } from 'src/app/web/home/shared/components/change-default-password/change-default-password.component';

import { URLS } from 'src/app/web/public/shared/enums/urls';
import {
  LABELS,
  MOBILE_NO_FORM_CONTROL_LABELS,
  PASSWORD_FORM_CONTROL_LABELS,
} from './login.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  labels: any;
  mobileNoFormControlLabels: any;
  passwordFormControlLabels: any;

  loginForm!: FormGroup;
  isLoginFormSubmitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastService: HotToastService,
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.labels = LABELS;
    this.mobileNoFormControlLabels = MOBILE_NO_FORM_CONTROL_LABELS;
    this.passwordFormControlLabels = PASSWORD_FORM_CONTROL_LABELS;

    this.loginForm = this.fb.group({
      mobileNo: [
        '',
        [
          Validators.required,
          Validators.minLength(this.mobileNoFormControlLabels.Length),
          Validators.maxLength(this.mobileNoFormControlLabels.Length),
          Validators.pattern(this.mobileNoFormControlLabels.Pattern),
        ],
      ],
      password: ['', [Validators.required]],
    });
  }

  get mobileNo() {
    return this.loginForm?.get('mobileNo');
  }

  get password() {
    return this.loginForm?.get('password');
  }

  loginFormSubmit(loginForm: FormGroup) {
    this.isLoginFormSubmitted = true;

    if (this.loginForm.valid) {
      const requestJson = {
        mobileNo: loginForm.value.mobileNo,
        password: loginForm.value.password,
      };

      this.httpService.post(URLS.Login, requestJson).subscribe(
        (data: any) => {
          if (data?.statusCode === HttpStatusCodes.RESET_CONTENT) {
            const initialState: ModalOptions = {
              initialState: {
                userId: data?.data[0]?.userId,
                name: data?.data[0]?.name,
              },
            };

            this.modalService.show(
              ChangeDefaultPasswordComponent,
              initialState
            );
          } else {
            this.authService.setAuthToken(data?.authToken);
            this.authService.setUserDetails(data?.data[0]);

            const defaultPath = data?.data[0]?.defaultPath;
            if (defaultPath) {
              this.router.navigate([defaultPath]);
            }
          }
        },
        (error: any) => {
          this.toastService.error(error?.statusText);
        },
        () => {
          this.isLoginFormSubmitted = false;
          this.loginForm.reset();
        }
      );
    }
  }
}
