import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { StatusCodes as HttpStatusCodes } from 'http-status-codes';
import { HotToastService } from '@ngneat/hot-toast';

import { HttpService } from 'src/app/web/home/shared/services/http/http.service';
import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';

import { URLS } from 'src/app/web/home/shared/enums/urls.enum';
import {
  LABELS,
  CHANGE_DEFAULT_PASSWORD_MODAL_LABELS,
  PASSWORD_FORM_CONTROL_LABELS,
} from './change-default-password.enum';

import { App } from 'src/app/web/home/shared/services/auth/auth.model';
import { User } from 'src/app/web/home/shared/services/auth/auth.model';

@Component({
  selector: 'app-change-default-password',
  templateUrl: './change-default-password.component.html',
  styleUrls: ['./change-default-password.component.scss'],
})
export class ChangeDefaultPasswordComponent implements OnInit {
  userId?: number;
  name?: string;

  labels: any;
  changeDefaultPasswordModalLabels: any;
  passwordFormControlLabels: any;

  changeDefaultPasswordForm!: FormGroup;
  isChangeDefaultPasswordFormSubmitted = false;

  appDetails!: App | null;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private toastService: HotToastService,
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.appDetails = this.authService.getAppDetails();

    this.labels = LABELS;
    this.changeDefaultPasswordModalLabels =
      CHANGE_DEFAULT_PASSWORD_MODAL_LABELS;
    this.passwordFormControlLabels = PASSWORD_FORM_CONTROL_LABELS;

    this.changeDefaultPasswordForm = this.fb.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(this.passwordFormControlLabels.MinLength),
            Validators.maxLength(this.passwordFormControlLabels.MaxLength),
            Validators.pattern(this.passwordFormControlLabels.Pattern),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(this.passwordFormControlLabels.MinLength),
            Validators.maxLength(this.passwordFormControlLabels.MaxLength),
            Validators.pattern(this.passwordFormControlLabels.Pattern),
          ],
        ],
      },
      {
        validator: this.passwordsMatchValidator(),
      }
    );
  }

  passwordsMatchValidator() {
    return () => {
      if (
        this.confirmPassword?.errors &&
        !this.confirmPassword.errors!['passwordsMismatch']
      ) {
        return;
      }
      if (this.newPassword?.value !== this.confirmPassword?.value) {
        this.confirmPassword?.setErrors({ passwordsMismatch: true });
      } else {
        this.confirmPassword?.setErrors(null);
      }
    };
  }

  get newPassword() {
    return this.changeDefaultPasswordForm?.get('newPassword');
  }

  get confirmPassword() {
    return this.changeDefaultPasswordForm?.get('confirmPassword');
  }

  cancelChangeDefaultPasswordModal(): void {
    this.modalRef?.hide();
    this.changeDefaultPasswordForm.reset();
  }

  closeChangeDefaultPasswordModal(): void {
    this.modalRef?.hide();
    this.changeDefaultPasswordForm.reset();
  }

  changeDefaultPassword() {
    this.isChangeDefaultPasswordFormSubmitted = true;

    if (this.changeDefaultPasswordForm.valid) {
      const requestJson = {
        userId: this.userId,
        newPassword:
          this.changeDefaultPasswordForm.controls['newPassword'].value,
      };

      this.httpService
        .put(`${URLS.Users}/changeDefaultPassword`, requestJson)
        .subscribe(
          (data: any) => {
            if (data?.statusCode === HttpStatusCodes.UNAUTHORIZED) {
              this.toastService.error(data?.statusMessage);
            } else if (data?.message) {
              this.toastService.success(data?.message);
            }
          },
          (error: any) => {
            console.log(error);
          },
          () => {
            this.modalRef?.hide();
            this.isChangeDefaultPasswordFormSubmitted = false;
            this.changeDefaultPasswordForm.reset();
          }
        );
    }
  }
}
