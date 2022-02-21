import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { StatusCodes as HttpStatusCodes } from 'http-status-codes';
import { HotToastService } from '@ngneat/hot-toast';

import { ConfirmComponent } from 'src/app/web/home/shared/components/confirm/confirm.component';

import { HttpService } from 'src/app/web/home/shared/services/http/http.service';
import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';

import { HOME_LABELS } from 'src/app/web/home/shared/enums/home.enum';
import { URLS } from 'src/app/web/home/shared/enums/urls.enum';
import {
  LABELS,
  ADD_USER_MODAL_LABELS,
  EDIT_USER_MODAL_LABELS,
  BLOCK_USER_MODAL_LABELS,
  UNBLOCK_USER_MODAL_LABELS,
  RESET_PASSWORD_MODAL_LABELS,
  DELETE_USER_MODAL_LABELS,
} from './users.enum';

import { User } from 'src/app/web/home/shared/services/auth/auth.model';
import {
  UsersTh,
  UsersThead,
  User as EachUser,
  UserCategory,
} from './users.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  modalRef?: BsModalRef;

  homeLabels: any;
  labels: any;

  addUserModalLabels: any;
  editUserModalLabels: any;
  blockUserModalLabels: any;
  unblockUserModalLabels: any;
  resetPasswordModalLabels: any;
  deleteUserModalLabels: any;

  usersThead: UsersTh[] = [];
  users: EachUser[] = [];
  userCategories: UserCategory[] = [];

  searchModel = '';
  searchModelChanged: Subject<string> = new Subject<string>();

  addUserForm!: FormGroup;
  editUserForm!: FormGroup;

  userDetails!: User | null;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastService: HotToastService,
    private httpService: HttpService,
    private authService: AuthService
  ) {
    this.searchModelChanged
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((model) => {
        this.searchModel = model;
        this.getUsers();
      });
  }

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails();

    this.homeLabels = HOME_LABELS;
    this.labels = LABELS;

    this.addUserModalLabels = ADD_USER_MODAL_LABELS;
    this.editUserModalLabels = EDIT_USER_MODAL_LABELS;
    this.blockUserModalLabels = BLOCK_USER_MODAL_LABELS;
    this.unblockUserModalLabels = UNBLOCK_USER_MODAL_LABELS;
    this.resetPasswordModalLabels = RESET_PASSWORD_MODAL_LABELS;
    this.deleteUserModalLabels = DELETE_USER_MODAL_LABELS;

    this.usersThead = UsersThead;

    this.getUsers();
    this.getUserCategories();

    this.addUserForm = this.fb.group({
      userCategoryId: ['', [Validators.required]],
      name: [null, [Validators.required]],
      mobileNo: [null, [Validators.required]],
    });

    this.editUserForm = this.fb.group({
      userId: ['', [Validators.required]],
      userCategoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      mobileNo: [null, [Validators.required]],
    });
  }

  onSearchModelChange(model = '') {
    this.searchModelChanged.next(model);
  }

  getUsers() {
    let observable = null;

    if (this.searchModel) {
      const requestJson = {
        searchText: this.searchModel,
      };

      observable = this.httpService.post(URLS.SearchUsers, requestJson);
    } else {
      observable = this.httpService.get(URLS.Users);
    }

    if (observable) {
      observable.subscribe(
        (data: any) => {
          this.users = data?.data;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  getUserCategories() {
    this.httpService.get(URLS.UserCategories).subscribe(
      (data: any) => {
        this.userCategories = data?.data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  openAddUserModal(addUserModalTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(addUserModalTemplate, {
      class: 'modal-dialog-centered',
    });
  }

  cancelAddUserModal(): void {
    this.modalRef?.hide();
    this.addUserForm.reset();
  }

  closeAddUserModal(): void {
    this.modalRef?.hide();
    this.addUserForm.reset();
  }

  addUser() {
    const requestJson = {
      userId: this.userDetails?.id,
      userCategoryId: this.addUserForm.controls['userCategoryId'].value,
      name: this.addUserForm.controls['name'].value,
      mobileNo: this.addUserForm.controls['mobileNo'].value,
    };

    this.httpService.post(URLS.Users, requestJson).subscribe(
      (data: any) => {
        if (data?.statusCode === HttpStatusCodes.CONFLICT) {
          this.toastService.error(data?.message);
        } else if (data?.message) {
          this.toastService.success(data?.message);
        }
        this.getUsers();
      },
      (error: any) => {
        console.log(error);
      },
      () => {
        this.modalRef?.hide();
        this.addUserForm.reset();
      }
    );
  }

  openEditUserModal(editUserModalTemplate: TemplateRef<any>, user: EachUser) {
    this.editUserForm.controls['userId'].setValue(user?.id);
    this.editUserForm.controls['userCategoryId'].setValue(user?.userCategoryId);
    this.editUserForm.controls['name'].setValue(user?.name);
    this.editUserForm.controls['mobileNo'].setValue(user?.mobileNo);

    this.modalRef = this.modalService.show(editUserModalTemplate, {
      class: 'modal-dialog-centered',
    });
  }

  cancelEditUserModal(): void {
    this.modalRef?.hide();
    this.editUserForm.reset();
  }

  closeEditUserModal(): void {
    this.modalRef?.hide();
    this.editUserForm.reset();
  }

  editUser() {
    const requestJson = {
      userId: this.userDetails?.id,
      id: this.editUserForm.controls['userId'].value,
      userCategoryId: this.editUserForm.controls['userCategoryId'].value,
      name: this.editUserForm.controls['name'].value,
      mobileNo: this.editUserForm.controls['mobileNo'].value,
    };

    this.httpService.put(`${URLS.Users}`, requestJson).subscribe(
      (data: any) => {
        if (data?.message) {
          this.toastService.success(data?.message);
        }
        this.getUsers();
      },
      (error: any) => {
        console.log(error);
      },
      () => {
        this.modalRef?.hide();
        this.editUserForm.reset();
      }
    );
  }

  openBlockUserModal(user: EachUser) {
    const initialState: ModalOptions = {
      initialState: {
        title: this.blockUserModalLabels.Title,
        text: `Are you sure you want to block${
          user?.name && ' <strong>' + user?.name + '</strong>'
        }?`,
        cancelButton: this.blockUserModalLabels.CancelButton,
        confirmButton: this.blockUserModalLabels.ConfirmButton,
        confirmButtonClass: 'btn-danger',
      },
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(ConfirmComponent, initialState);
    this.modalRef.content.outputEmitter
      .pipe(take(1))
      .subscribe((value: any) => {
        if (value) {
          this.blockUser(user);
        }
      });
  }

  blockUser(user: EachUser) {
    const id = user?.id;

    if (id) {
      this.httpService.put(`${URLS.Users}/${id}/block`).subscribe(
        (data: any) => {
          if (data?.message) {
            this.toastService.success(data?.message);
          }
          this.getUsers();
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

  openUnblockUserModal(user: EachUser) {
    const initialState: ModalOptions = {
      initialState: {
        title: this.unblockUserModalLabels.Title,
        text: `Are you sure you want to unblock${
          user?.name && ' <strong>' + user?.name + '</strong>'
        }?`,
        cancelButton: this.unblockUserModalLabels.CancelButton,
        confirmButton: this.unblockUserModalLabels.ConfirmButton,
        confirmButtonClass: 'btn-success',
      },
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(ConfirmComponent, initialState);
    this.modalRef.content.outputEmitter
      .pipe(take(1))
      .subscribe((value: any) => {
        if (value) {
          this.unblockUser(user);
        }
      });
  }

  unblockUser(user: EachUser) {
    const id = user?.id;

    if (id) {
      this.httpService.put(`${URLS.Users}/${id}/unblock`).subscribe(
        (data: any) => {
          if (data?.message) {
            this.toastService.success(data?.message);
          }
          this.getUsers();
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

  openResetPasswordModal(user: EachUser) {
    const initialState: ModalOptions = {
      initialState: {
        title: this.resetPasswordModalLabels.Title,
        text: `Are you sure you want to reset password for${
          user?.name && ' <strong>' + user?.name + '</strong>'
        }?`,
        cancelButton: this.resetPasswordModalLabels.CancelButton,
        confirmButton: this.resetPasswordModalLabels.ConfirmButton,
        confirmButtonClass: 'btn-warning',
      },
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(ConfirmComponent, initialState);
    this.modalRef.content.outputEmitter
      .pipe(take(1))
      .subscribe((value: any) => {
        if (value) {
          this.resetPassword(user);
        }
      });
  }

  resetPassword(user: EachUser) {
    const id = user?.id;

    if (id) {
      this.httpService.put(`${URLS.Users}/${id}/resetPassword`).subscribe(
        (data: any) => {
          if (data?.message) {
            this.toastService.success(data?.message);
          }
          this.getUsers();
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

  openDeleteUserModal(user: EachUser) {
    const initialState: ModalOptions = {
      initialState: {
        title: this.deleteUserModalLabels.Title,
        text: `Are you sure you want to delete${
          user?.name && ' <strong>' + user?.name + '</strong>'
        }?`,
        cancelButton: this.deleteUserModalLabels.CancelButton,
        confirmButton: this.deleteUserModalLabels.ConfirmButton,
        confirmButtonClass: 'btn-danger',
      },
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(ConfirmComponent, initialState);
    this.modalRef.content.outputEmitter
      .pipe(take(1))
      .subscribe((value: any) => {
        if (value) {
          this.deleteUser(user);
        }
      });
  }

  deleteUser(user: EachUser) {
    const id = user?.id;

    if (id) {
      this.httpService.delete(`${URLS.Users}/${id}`).subscribe(
        (data: any) => {
          if (data?.message) {
            this.toastService.success(data?.message);
          }
          this.getUsers();
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
}
