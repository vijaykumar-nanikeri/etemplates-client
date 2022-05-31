import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';

import { ConfirmComponent } from 'src/app/web/home/shared/components/confirm/confirm.component';

import { HttpService } from 'src/app/web/home/shared/services/http/http.service';
import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';
import { Ckeditor4AngularService } from 'src/app/web/home/shared/services/ckeditor4-angular/ckeditor4-angular.service';

import { HOME_LABELS } from 'src/app/web/home/shared/enums/home.enum';
import { URLS } from 'src/app/web/home/shared/enums/urls.enum';
import {
  ADD_SUBCATEGORY_TYPE_VALUE_MODAL_LABELS,
  EDIT_SUBCATEGORY_TYPE_VALUE_MODAL_LABELS,
  DELETE_SUBCATEGORY_TYPE_VALUE_MODAL_LABELS,
} from './view.enum';

import { User } from 'src/app/web/home/shared/services/auth/auth.model';
import {
  SubcategoryTypeValuesTh,
  SubcategoryTypeValuesThead,
  SubcategoryTypeValue,
} from './view.model';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  modalRef?: BsModalRef;

  addSubcategoryTypeValueEditorConfig: any;
  editSubcategoryTypeValueEditorConfig: any;

  subcategoryTypeId = 0;
  subcategoryTypeName = '';

  homeLabels: any;

  addSubcategoryTypeValueModalLabels: any;
  editSubcategoryTypeValueModalLabels: any;
  deleteSubcategoryTypeValueModalLabels: any;

  subcategoryTypeValuesThead: SubcategoryTypeValuesTh[] = [];
  subcategoryTypeValues: SubcategoryTypeValue[] = [];

  addSubcategoryTypeValueForm!: FormGroup;
  editSubcategoryTypeValueForm!: FormGroup;

  userDetails!: User | null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastService: HotToastService,
    private httpService: HttpService,
    private authService: AuthService,
    private ckeditor4AngularService: Ckeditor4AngularService
  ) {
    this.route.params.subscribe((params) => {
      this.subcategoryTypeId = +params['id'];

      if (this.subcategoryTypeId) {
        this.getSubcategoryType();
        this.getSubcategoryTypeValues();
      }
    });
  }

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails();

    this.addSubcategoryTypeValueEditorConfig =
      this.ckeditor4AngularService.getConfig();

    this.editSubcategoryTypeValueEditorConfig =
      this.ckeditor4AngularService.getConfig();

    this.homeLabels = HOME_LABELS;

    this.addSubcategoryTypeValueModalLabels =
      ADD_SUBCATEGORY_TYPE_VALUE_MODAL_LABELS;
    this.editSubcategoryTypeValueModalLabels =
      EDIT_SUBCATEGORY_TYPE_VALUE_MODAL_LABELS;
    this.deleteSubcategoryTypeValueModalLabels =
      DELETE_SUBCATEGORY_TYPE_VALUE_MODAL_LABELS;

    this.subcategoryTypeValuesThead = SubcategoryTypeValuesThead;

    this.addSubcategoryTypeValueForm = this.fb.group({
      subcategoryTypeValueName: ['', [Validators.required]],
    });

    this.editSubcategoryTypeValueForm = this.fb.group({
      subcategoryTypeValueId: [null, [Validators.required]],
      subcategoryTypeValueName: ['', [Validators.required]],
    });
  }

  getSubcategoryType() {
    this.httpService
      .get(`${URLS.SubcategoryTypes}/${this.subcategoryTypeId}`)
      .subscribe(
        (data: any) => {
          this.subcategoryTypeName = data?.data[0].name;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  // Subcategory Types START >>
  getSubcategoryTypeValues() {
    this.subcategoryTypeValues = [];

    this.httpService
      .get(`${URLS.SubcategoryTypes}/${this.subcategoryTypeId}/values`)
      .subscribe(
        (data: any) => {
          this.subcategoryTypeValues = data?.data;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  openAddSubcategoryTypeValueModal(
    addSubcategoryTypeValueModalTemplate: TemplateRef<any>
  ) {
    this.modalRef = this.modalService.show(
      addSubcategoryTypeValueModalTemplate,
      {
        class: 'modal-lg',
      }
    );
  }

  cancelAddSubcategoryTypeValueModal(): void {
    this.modalRef?.hide();
    this.addSubcategoryTypeValueForm.reset();
  }

  closeAddSubcategoryTypeValueModal(): void {
    this.modalRef?.hide();
    this.addSubcategoryTypeValueForm.reset();
  }

  addSubcategoryTypeValue() {
    const requestJson = {
      userId: this.userDetails?.id,
      subcategoryTypeId: this.subcategoryTypeId,
      name: this.addSubcategoryTypeValueForm.controls[
        'subcategoryTypeValueName'
      ].value,
    };

    this.httpService
      .post(`${URLS.SubcategoryTypes}/values`, requestJson)
      .subscribe(
        (data: any) => {
          if (data?.message) {
            this.toastService.success(data?.message);
          }
          this.getSubcategoryTypeValues();
        },
        (error: any) => {
          console.log(error);
        },
        () => {
          this.modalRef?.hide();
          this.addSubcategoryTypeValueForm.reset();
        }
      );
  }

  openEditSubcategoryTypeValueModal(
    editSubcategoryTypeValueModalTemplate: TemplateRef<any>,
    subcategoryTypeValue: SubcategoryTypeValue
  ) {
    this.editSubcategoryTypeValueForm.controls[
      'subcategoryTypeValueName'
    ].setValue(subcategoryTypeValue?.name);
    this.editSubcategoryTypeValueForm.controls[
      'subcategoryTypeValueId'
    ].setValue(subcategoryTypeValue?.id);

    this.modalRef = this.modalService.show(
      editSubcategoryTypeValueModalTemplate,
      {
        class: 'modal-lg',
      }
    );
  }

  cancelEditSubcategoryTypeValueModal(): void {
    this.modalRef?.hide();
    this.editSubcategoryTypeValueForm.reset();
  }

  closeEditSubcategoryTypeValueModal(): void {
    this.modalRef?.hide();
    this.editSubcategoryTypeValueForm.reset();
  }

  editSubcategoryTypeValue() {
    const requestJson = {
      userId: this.userDetails?.id,
      id: this.editSubcategoryTypeValueForm.controls['subcategoryTypeValueId']
        .value,
      name: this.editSubcategoryTypeValueForm.controls[
        'subcategoryTypeValueName'
      ].value,
    };

    this.httpService
      .put(`${URLS.SubcategoryTypes}/values`, requestJson)
      .subscribe(
        (data: any) => {
          if (data?.message) {
            this.toastService.success(data?.message);
          }
          this.getSubcategoryTypeValues();
        },
        (error: any) => {
          console.log(error);
        },
        () => {
          this.modalRef?.hide();
          this.editSubcategoryTypeValueForm.reset();
        }
      );
  }

  openDeleteSubcategoryTypeValueModal(
    subcategoryTypeValue: SubcategoryTypeValue,
    serialNumber: number
  ) {
    const initialState: ModalOptions = {
      initialState: {
        title: this.deleteSubcategoryTypeValueModalLabels.Title,
        text: `Are you sure you want to delete the Subcategory Type Value at${
          '<strong> S.No. ' + serialNumber + '</strong>'
        }?`,
        cancelButton: this.deleteSubcategoryTypeValueModalLabels.CancelButton,
        confirmButton: this.deleteSubcategoryTypeValueModalLabels.ConfirmButton,
        confirmButtonClass: 'btn-danger',
      },
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(ConfirmComponent, initialState);
    this.modalRef.content.outputEmitter
      .pipe(take(1))
      .subscribe((value: any) => {
        if (value) {
          this.deleteSubcategoryTypeValue(subcategoryTypeValue);
        }
      });
  }

  deleteSubcategoryTypeValue(subcategoryTypeValue: SubcategoryTypeValue) {
    const id = subcategoryTypeValue?.id;

    if (id) {
      this.httpService
        .delete(`${URLS.SubcategoryTypes}/values/${id}`)
        .subscribe(
          (data: any) => {
            if (data?.message) {
              this.toastService.success(data?.message);
            }
            this.getSubcategoryTypeValues();
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
  // << END Subcategory Types
}
