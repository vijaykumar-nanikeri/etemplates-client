import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { ConfirmComponent } from 'src/app/web/home/shared/components/confirm/confirm.component';

import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';

import { LOGOUT_CONFIRM_MODAL_LABELS } from './logout.enum';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  modalRef?: BsModalRef;

  logoutConfirmModalLabels: any;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private authService: AuthService
  ) {
    this.logoutConfirmModalLabels = LOGOUT_CONFIRM_MODAL_LABELS;
  }

  logout() {
    const initialState: ModalOptions = {
      initialState: {
        title: this.logoutConfirmModalLabels.Title,
        text: this.logoutConfirmModalLabels.Text,
        cancelButton: this.logoutConfirmModalLabels.CancelButton,
        confirmButton: this.logoutConfirmModalLabels.ConfirmButton,
      },
      class: 'modal-sm modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(ConfirmComponent, initialState);
    this.modalRef.content.outputEmitter
      .pipe(take(1))
      .subscribe((value: any) => {
        if (value) {
          this.processLogout();
        }
      });
  }

  processLogout() {
    this.authService.removeAppDetails();
    this.authService.removeAuthToken();
    this.authService.removeUserDetails();

    this.modalRef?.hide();

    this.router.navigate(['/login']);
  }
}
