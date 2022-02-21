import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { StatusCodes as HttpStatusCodes } from 'http-status-codes';
import { HotToastService } from '@ngneat/hot-toast';

import { HttpService } from 'src/app/web/home/shared/services/http/http.service';
import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';

import { URLS } from 'src/app/web/home/shared/enums/urls.enum';
import {
  CHANGE_PASSWORD_MODAL_LABELS,
  PASSWORD_FORM_CONTROL_LABELS,
} from './change-password.enum';

import { User } from 'src/app/web/home/shared/services/auth/auth.model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordModalLabels: any;
  passwordFormControlLabels: any;

  changePasswordForm!: FormGroup;
  isChangePasswordFormSubmitted = false;

  userDetails!: User | null;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private toastService: HotToastService,
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.changePasswordModalLabels = CHANGE_PASSWORD_MODAL_LABELS;
    this.passwordFormControlLabels = PASSWORD_FORM_CONTROL_LABELS;

    this.userDetails = this.authService.getUserDetails();

    this.changePasswordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
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

  get oldPassword() {
    return this.changePasswordForm?.get('oldPassword');
  }

  get newPassword() {
    return this.changePasswordForm?.get('newPassword');
  }

  get confirmPassword() {
    return this.changePasswordForm?.get('confirmPassword');
  }

  cancelChangePasswordModal(): void {
    this.modalRef?.hide();
    this.changePasswordForm.reset();
  }

  closeChangePasswordModal(): void {
    this.modalRef?.hide();
    this.changePasswordForm.reset();
  }

  changePassword() {
    this.isChangePasswordFormSubmitted = true;

    if (this.changePasswordForm.valid) {
      const requestJson = {
        userId: this.userDetails?.id,
        oldPassword: this.changePasswordForm.controls['oldPassword'].value,
        newPassword: this.changePasswordForm.controls['newPassword'].value,
      };

      this.httpService
        .put(`${URLS.Users}/changePassword`, requestJson)
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
            this.isChangePasswordFormSubmitted = false;
            this.changePasswordForm.reset();
          }
        );
    }
  }
}
