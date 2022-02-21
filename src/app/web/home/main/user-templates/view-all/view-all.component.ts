import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';

import { ConfirmComponent } from 'src/app/web/home/shared/components/confirm/confirm.component';

import { HttpService } from 'src/app/web/home/shared/services/http/http.service';
import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';

import { HOME_LABELS } from 'src/app/web/home/shared/enums/home.enum';
import { URLS } from 'src/app/web/home/shared/enums/urls.enum';
import { DELETE_USER_TEMPLATE_MODAL_LABELS } from './view-all.enum';

import { User } from 'src/app/web/home/shared/services/auth/auth.model';
import {
  UserTemplatesTh,
  UserTemplatesThead,
  UserTemplate,
} from './view-all.model';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.scss'],
})
export class ViewAllComponent implements OnInit {
  modalRef?: BsModalRef;

  homeLabels: any;
  labels: any;

  deleteUserTemplateModalLabels: any;

  userTemplatesThead: UserTemplatesTh[] = [];
  userTemplates: UserTemplate[] = [];

  userDetails!: User | null;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private toastService: HotToastService,
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails();

    this.homeLabels = HOME_LABELS;

    this.deleteUserTemplateModalLabels = DELETE_USER_TEMPLATE_MODAL_LABELS;

    this.userTemplatesThead = UserTemplatesThead;

    this.getUserTemplates();
  }

  getUserTemplates() {
    const userId = this.userDetails?.id;

    this.httpService.get(`${URLS.UserTemplates}/${userId}/all`).subscribe(
      (data: any) => {
        this.userTemplates = data?.data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  openDeleteUserTemplateModal(userTemplate: UserTemplate) {
    const initialState: ModalOptions = {
      initialState: {
        title: this.deleteUserTemplateModalLabels.Title,
        text: `Are you sure you want to delete<br />${
          userTemplate?.uuid && ' <strong>' + userTemplate?.uuid + '</strong>'
        }?`,
        cancelButton: this.deleteUserTemplateModalLabels.CancelButton,
        confirmButton: this.deleteUserTemplateModalLabels.ConfirmButton,
        confirmButtonClass: 'btn-danger',
      },
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(ConfirmComponent, initialState);
    this.modalRef.content.outputEmitter
      .pipe(take(1))
      .subscribe((value: any) => {
        if (value) {
          this.deleteUserTemplate(userTemplate);
        }
      });
  }

  deleteUserTemplate(userTemplate: UserTemplate) {
    const id = userTemplate?.id;

    if (id) {
      this.httpService.delete(`${URLS.UserTemplates}/${id}`).subscribe(
        (data: any) => {
          if (data?.message) {
            this.toastService.success(data?.message);
          }
          this.getUserTemplates();
        },
        (error: any) => {
          console.log(error);
        },
        () => {
          this.modalRef?.hide();
        }
      );
    }
  }

  view(userTemplate: UserTemplate) {
    this.router.navigate(['/home/user-templates', userTemplate.id]);
  }
}
