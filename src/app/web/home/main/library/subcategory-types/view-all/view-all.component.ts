import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { HotToastService } from '@ngneat/hot-toast';

import { ConfirmComponent } from 'src/app/web/home/shared/components/confirm/confirm.component';

import { HttpService } from 'src/app/web/home/shared/services/http/http.service';
import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';

import { HOME_LABELS } from 'src/app/web/home/shared/enums/home.enum';
import { URLS } from 'src/app/web/home/shared/enums/urls.enum';
import {
  LABELS,
  ADD_SUBCATEGORY_TYPE_MODAL_LABELS,
  EDIT_SUBCATEGORY_TYPE_MODAL_LABELS,
  DELETE_SUBCATEGORY_TYPE_MODAL_LABELS,
} from './view-all.enum';

import { User } from 'src/app/web/home/shared/services/auth/auth.model';
import { Category } from 'src/app/web/home/main/categories/view-all/view-all.model';
import { Subcategory } from 'src/app/web/home/main/categories/view/view.model';
import {
  SubcategoryTypesTh,
  SubcategoryTypesThead,
  SubcategoryType,
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

  categories: Category[] = [];
  subcategories: Subcategory[] = [];

  categoryModel = 0;
  subcategoryModel = 0;
  isGetClicked = false;

  addSubcategoryTypeModalLabels: any;
  editSubcategoryTypeModalLabels: any;
  deleteSubcategoryTypeModalLabels: any;

  subcategoryTypesThead: SubcategoryTypesTh[] = [];
  subcategoryTypes: SubcategoryType[] = [];

  searchModel = '';
  searchModelChanged: Subject<string> = new Subject<string>();

  addSubcategoryTypeForm!: FormGroup;
  editSubcategoryTypeForm!: FormGroup;

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
        this.getSubcategoryTypes();
      });
  }

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails();

    this.homeLabels = HOME_LABELS;
    this.labels = LABELS;

    this.addSubcategoryTypeModalLabels = ADD_SUBCATEGORY_TYPE_MODAL_LABELS;
    this.editSubcategoryTypeModalLabels = EDIT_SUBCATEGORY_TYPE_MODAL_LABELS;
    this.deleteSubcategoryTypeModalLabels =
      DELETE_SUBCATEGORY_TYPE_MODAL_LABELS;

    this.subcategoryTypesThead = SubcategoryTypesThead;

    this.getCategories();

    this.addSubcategoryTypeForm = this.fb.group({
      subcategoryTypeName: ['', [Validators.required]],
    });

    this.editSubcategoryTypeForm = this.fb.group({
      subcategoryTypeId: [null, [Validators.required]],
      subcategoryTypeName: ['', [Validators.required]],
    });
  }

  getCategories() {
    this.httpService.get(URLS.Categories).subscribe(
      (data: any) => {
        this.categories = data?.data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onCategoryModelChange(categoryId: number) {
    this.subcategoryModel = 0;
    this.subcategories = [];

    if (categoryId) {
      this.getSubcategories(categoryId);
    }
  }

  getSubcategories(categoryId: number) {
    this.httpService
      .get(`${URLS.Categories}/${categoryId}/${URLS.Subcategories}`)
      .subscribe(
        (data: any) => {
          this.subcategories = data?.data;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  onSubcategoryModelChange(subcategoryId: number) {
    this.subcategoryTypes = [];
    this.subcategoryModel = subcategoryId;
    this.isGetClicked = false;
  }

  onSearchModelChange(model = '') {
    this.searchModelChanged.next(model);
  }

  // Subcategory Types START >>
  getSubcategoryTypes() {
    this.isGetClicked = true;
    this.subcategoryTypes = [];

    if (this.subcategoryModel) {
      let observable = null;

      if (this.searchModel) {
        const requestJson = {
          searchText: this.searchModel,
        };

        observable = this.httpService.post(
          `${URLS.Subcategories}/${this.subcategoryModel}/${URLS.SearchSubcategoryTypes}`,
          requestJson
        );
      } else {
        observable = this.httpService.get(
          `${URLS.Subcategories}/${this.subcategoryModel}/${URLS.SubcategoryTypes}`
        );
      }

      if (observable) {
        observable.subscribe(
          (data: any) => {
            this.subcategoryTypes = data?.data;
          },
          (error: any) => {
            console.log(error);
          }
        );
      }
    }
  }

  openAddSubcategoryTypeModal(
    addSubcategoryTypeModalTemplate: TemplateRef<any>
  ) {
    this.modalRef = this.modalService.show(addSubcategoryTypeModalTemplate, {
      class: 'modal-dialog-centered',
    });
  }

  cancelAddSubcategoryTypeModal(): void {
    this.modalRef?.hide();
    this.addSubcategoryTypeForm.reset();
  }

  closeAddSubcategoryTypeModal(): void {
    this.modalRef?.hide();
    this.addSubcategoryTypeForm.reset();
  }

  addSubcategoryType() {
    const requestJson = {
      userId: this.userDetails?.id,
      subcategoryId: this.subcategoryModel,
      name: this.addSubcategoryTypeForm.controls['subcategoryTypeName'].value,
    };

    this.httpService.post(URLS.SubcategoryTypes, requestJson).subscribe(
      (data: any) => {
        if (data?.message) {
          this.toastService.success(data?.message);
        }
        this.getSubcategoryTypes();
      },
      (error: any) => {
        console.log(error);
      },
      () => {
        this.modalRef?.hide();
        this.addSubcategoryTypeForm.reset();
      }
    );
  }

  openEditSubcategoryTypeModal(
    editSubcategoryTypeModalTemplate: TemplateRef<any>,
    subcategoryType: SubcategoryType
  ) {
    this.editSubcategoryTypeForm.controls['subcategoryTypeName'].setValue(
      subcategoryType?.name
    );
    this.editSubcategoryTypeForm.controls['subcategoryTypeId'].setValue(
      subcategoryType?.id
    );

    this.modalRef = this.modalService.show(editSubcategoryTypeModalTemplate, {
      class: 'modal-dialog-centered',
    });
  }

  cancelEditSubcategoryTypeModal(): void {
    this.modalRef?.hide();
    this.editSubcategoryTypeForm.reset();
  }

  closeEditSubcategoryTypeModal(): void {
    this.modalRef?.hide();
    this.editSubcategoryTypeForm.reset();
  }

  editSubcategoryType() {
    const requestJson = {
      userId: this.userDetails?.id,
      id: this.editSubcategoryTypeForm.controls['subcategoryTypeId'].value,
      name: this.editSubcategoryTypeForm.controls['subcategoryTypeName'].value,
    };

    this.httpService.put(`${URLS.SubcategoryTypes}`, requestJson).subscribe(
      (data: any) => {
        if (data?.message) {
          this.toastService.success(data?.message);
        }
        this.getSubcategoryTypes();
      },
      (error: any) => {
        console.log(error);
      },
      () => {
        this.modalRef?.hide();
        this.editSubcategoryTypeForm.reset();
      }
    );
  }

  openDeleteSubcategoryTypeModal(subcategoryType: SubcategoryType) {
    const initialState: ModalOptions = {
      initialState: {
        title: this.deleteSubcategoryTypeModalLabels.Title,
        text: `Are you sure you want to delete${
          subcategoryType?.name &&
          ' <strong>' + subcategoryType?.name + '</strong>'
        }?`,
        cancelButton: this.deleteSubcategoryTypeModalLabels.CancelButton,
        confirmButton: this.deleteSubcategoryTypeModalLabels.ConfirmButton,
        confirmButtonClass: 'btn-danger',
      },
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(ConfirmComponent, initialState);
    this.modalRef.content.outputEmitter
      .pipe(take(1))
      .subscribe((value: any) => {
        if (value) {
          this.deleteSubcategoryType(subcategoryType);
        }
      });
  }

  deleteSubcategoryType(subcategoryType: SubcategoryType) {
    const id = subcategoryType?.id;

    if (id) {
      this.httpService.delete(`${URLS.SubcategoryTypes}/${id}`).subscribe(
        (data: any) => {
          if (data?.message) {
            this.toastService.success(data?.message);
          }
          this.getSubcategoryTypes();
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
