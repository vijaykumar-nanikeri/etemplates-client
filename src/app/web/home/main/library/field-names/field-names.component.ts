import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';

import { HttpService } from 'src/app/web/home/shared/services/http/http.service';
import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';

import { ConfirmComponent } from 'src/app/web/home/shared/components/confirm/confirm.component';

import { HOME_LABELS } from 'src/app/web/home/shared/enums/home.enum';
import { URLS } from 'src/app/web/home/shared/enums/urls.enum';
import {
  LABELS,
  ADD_FIELD_NAME_MODAL_LABELS,
  EDIT_FIELD_NAME_MODAL_LABELS,
  DELETE_FIELD_NAME_MODAL_LABELS,
} from './field-names.enum';

import { User } from 'src/app/web/home/shared/services/auth/auth.model';
import { FieldNamesTh, FieldNamesThead, FieldName } from './field-names.model';

@Component({
  selector: 'app-field-names',
  templateUrl: './field-names.component.html',
  styleUrls: ['./field-names.component.scss'],
})
export class FieldNamesComponent implements OnInit {
  modalRef?: BsModalRef;

  homeLabels: any;
  labels: any;

  addFieldNameModalLabels: any;
  editFieldNameModalLabels: any;
  deleteFieldNameModalLabels: any;

  fieldNamesThead: FieldNamesTh[] = [];
  fieldNames: FieldName[] = [];

  searchModel = '';
  searchModelChanged: Subject<string> = new Subject<string>();

  addFieldNameForm!: FormGroup;
  editFieldNameForm!: FormGroup;

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
        this.getFieldNames();
      });
  }

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails();

    this.homeLabels = HOME_LABELS;
    this.labels = LABELS;

    this.addFieldNameModalLabels = ADD_FIELD_NAME_MODAL_LABELS;
    this.editFieldNameModalLabels = EDIT_FIELD_NAME_MODAL_LABELS;
    this.deleteFieldNameModalLabels = DELETE_FIELD_NAME_MODAL_LABELS;

    this.fieldNamesThead = FieldNamesThead;

    this.getFieldNames();

    this.addFieldNameForm = this.fb.group({
      fieldNameName: ['', [Validators.required]],
    });

    this.editFieldNameForm = this.fb.group({
      fieldNameId: [null, [Validators.required]],
      fieldNameName: ['', [Validators.required]],
    });
  }

  onSearchModelChange(model = '') {
    this.searchModelChanged.next(model);
  }

  getFieldNames() {
    let observable = null;

    if (this.searchModel) {
      const requestJson = {
        searchText: this.searchModel,
      };

      observable = this.httpService.post(URLS.SearchFieldNames, requestJson);
    } else {
      observable = this.httpService.get(URLS.FieldNames);
    }

    if (observable) {
      observable.subscribe(
        (data: any) => {
          this.fieldNames = data?.data;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  openAddFieldNameModal(addFieldNameModalTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(addFieldNameModalTemplate, {
      class: 'modal-dialog-centered',
    });
  }

  cancelAddFieldNameModal(): void {
    this.modalRef?.hide();
    this.addFieldNameForm.reset();
  }

  closeAddFieldNameModal(): void {
    this.modalRef?.hide();
    this.addFieldNameForm.reset();
  }

  addFieldName() {
    const requestJson = {
      userId: this.userDetails?.id,
      name: this.addFieldNameForm.controls['fieldNameName'].value,
    };

    this.httpService.post(URLS.FieldNames, requestJson).subscribe(
      (data: any) => {
        if (data?.message) {
          this.toastService.success(data?.message);
        }
        this.getFieldNames();
      },
      (error: any) => {
        console.log(error);
      },
      () => {
        this.modalRef?.hide();
        this.addFieldNameForm.reset();
      }
    );
  }

  openEditFieldNameModal(
    editFieldNameModalTemplate: TemplateRef<any>,
    fieldName: FieldName
  ) {
    this.editFieldNameForm.controls['fieldNameName'].setValue(fieldName?.name);
    this.editFieldNameForm.controls['fieldNameId'].setValue(fieldName?.id);

    this.modalRef = this.modalService.show(editFieldNameModalTemplate, {
      class: 'modal-dialog-centered',
    });
  }

  cancelEditFieldNameModal(): void {
    this.modalRef?.hide();
    this.editFieldNameForm.reset();
  }

  closeEditFieldNameModal(): void {
    this.modalRef?.hide();
    this.editFieldNameForm.reset();
  }

  editFieldName() {
    const requestJson = {
      userId: this.userDetails?.id,
      id: this.editFieldNameForm.controls['fieldNameId'].value,
      name: this.editFieldNameForm.controls['fieldNameName'].value,
    };

    this.httpService.put(URLS.FieldNames, requestJson).subscribe(
      (data: any) => {
        if (data?.message) {
          this.toastService.success(data?.message);
        }
        this.getFieldNames();
      },
      (error: any) => {
        console.log(error);
      },
      () => {
        this.modalRef?.hide();
        this.editFieldNameForm.reset();
      }
    );
  }

  openDeleteFieldNameModal(fieldName: FieldName) {
    const initialState: ModalOptions = {
      initialState: {
        title: this.deleteFieldNameModalLabels.Title,
        text: `Are you sure you want to delete${
          fieldName?.name && ' <strong>' + fieldName?.name + '</strong>'
        }?`,
        cancelButton: this.deleteFieldNameModalLabels.CancelButton,
        confirmButton: this.deleteFieldNameModalLabels.ConfirmButton,
        confirmButtonClass: 'btn-danger',
      },
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(ConfirmComponent, initialState);
    this.modalRef.content.outputEmitter
      .pipe(take(1))
      .subscribe((value: any) => {
        if (value) {
          this.deleteFieldName(fieldName);
        }
      });
  }

  deleteFieldName(fieldName: FieldName) {
    const id = fieldName?.id;

    if (id) {
      this.httpService.delete(`${URLS.FieldNames}/${id}`).subscribe(
        (data: any) => {
          if (data?.message) {
            this.toastService.success(data?.message);
          }
          this.getFieldNames();
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
