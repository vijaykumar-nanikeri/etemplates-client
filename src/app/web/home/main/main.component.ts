import { Component, OnInit } from '@angular/core';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { ProfileDetailsComponent } from 'src/app/web/home/shared/components/profile-details/profile-details.component';
import { ChangePasswordComponent } from 'src/app/web/home/shared/components/change-password/change-password.component';

import { LogoutService } from 'src/app/web/home/shared/services/logout/logout.service';

import { LABELS } from './main.enum';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  labels: any;

  constructor(
    private modalService: BsModalService,
    private logoutService: LogoutService
  ) {}

  ngOnInit(): void {
    this.labels = LABELS;
  }

  profileDetails() {
    const initialState: ModalOptions = {
      class: 'modal-dialog-centered',
    };

    this.modalService.show(ProfileDetailsComponent, initialState);
  }

  changePassword() {
    this.modalService.show(ChangePasswordComponent);
  }

  logout() {
    this.logoutService.logout();
  }
}
