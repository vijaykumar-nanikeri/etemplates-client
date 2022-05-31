import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  ADD_SUBCATEGORY_MODAL_LABELS,
  EDIT_SUBCATEGORY_MODAL_LABELS,
  DELETE_SUBCATEGORY_MODAL_LABELS,
  TEMPLATES_MODAL_LABELS,
} from './view.enum';

import { User } from 'src/app/web/home/shared/services/auth/auth.model';
import {
  SubcategoriesTh,
  SubcategoriesThead,
  Subcategory,
  TemplatesTh,
  TemplatesThead,
  Template,
} from './view.model';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  modalRef?: BsModalRef;

  categoryId = 0;
  categoryName = '';

  subcategoryId = 0;
  subcategoryName = '';

  homeLabels: any;
  labels: any;

  addSubcategoryModalLabels: any;
  editSubcategoryModalLabels: any;
  deleteSubcategoryModalLabels: any;
  templatesModalLabels: any;

  subcategoriesThead: SubcategoriesTh[] = [];
  subcategories: Subcategory[] = [];

  templatesThead: TemplatesTh[] = [];
  templates: Template[] = [];

  searchModel = '';
  searchModelChanged: Subject<string> = new Subject<string>();

  addSubcategoryForm!: FormGroup;
  editSubcategoryForm!: FormGroup;

  templateSearchModel = '';
  templateSearchModelChanged: Subject<string> = new Subject<string>();

  userDetails!: User | null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastService: HotToastService,
    private httpService: HttpService,
    private authService: AuthService
  ) {
    this.route.params.subscribe((params) => {
      this.categoryId = +params['id'];

      if (this.categoryId) {
        this.getCategory();
        this.getSubcategories();
      }
    });

    this.searchModelChanged
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((model) => {
        this.searchModel = model;
        this.getSubcategories();
      });

    this.templateSearchModelChanged
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((model) => {
        this.templateSearchModel = model;
        this.getTemplates();
      });
  }

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails();

    this.homeLabels = HOME_LABELS;
    this.labels = LABELS;

    this.addSubcategoryModalLabels = ADD_SUBCATEGORY_MODAL_LABELS;
    this.editSubcategoryModalLabels = EDIT_SUBCATEGORY_MODAL_LABELS;
    this.deleteSubcategoryModalLabels = DELETE_SUBCATEGORY_MODAL_LABELS;
    this.templatesModalLabels = TEMPLATES_MODAL_LABELS;

    this.subcategoriesThead = SubcategoriesThead;
    this.templatesThead = TemplatesThead;

    this.addSubcategoryForm = this.fb.group({
      subcategoryName: ['', [Validators.required]],
    });

    this.editSubcategoryForm = this.fb.group({
      subcategoryId: [null, [Validators.required]],
      subcategoryName: ['', [Validators.required]],
    });
  }

  onSearchModelChange(model = '') {
    this.searchModelChanged.next(model);
  }

  onTemplateSearchModelChange(model = '') {
    this.templateSearchModelChanged.next(model);
  }

  getCategory() {
    this.httpService.get(`${URLS.Categories}/${this.categoryId}`).subscribe(
      (data: any) => {
        this.categoryName = data?.data[0].name;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getSubcategories() {
    let observable = null;

    if (this.searchModel) {
      const requestJson = {
        searchText: this.searchModel,
      };

      observable = this.httpService.post(
        `${URLS.Categories}/${this.categoryId}/${URLS.SearchSubcategories}`,
        requestJson
      );
    } else {
      observable = this.httpService.get(
        `${URLS.Categories}/${this.categoryId}/${URLS.Subcategories}`
      );
    }

    if (observable) {
      observable.subscribe(
        (data: any) => {
          this.subcategories = data?.data;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  openAddSubcategoryModal(addSubcategoryModalTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(addSubcategoryModalTemplate, {
      class: 'modal-dialog-centered',
    });
  }

  cancelAddSubcategoryModal(): void {
    this.modalRef?.hide();
    this.addSubcategoryForm.reset();
  }

  closeAddSubcategoryModal(): void {
    this.modalRef?.hide();
    this.addSubcategoryForm.reset();
  }

  addSubcategory() {
    const requestJson = {
      userId: this.userDetails?.id,
      categoryId: this.categoryId,
      name: this.addSubcategoryForm.controls['subcategoryName'].value,
    };

    this.httpService.post(URLS.Subcategories, requestJson).subscribe(
      (data: any) => {
        if (data?.message) {
          this.toastService.success(data?.message);
        }
        this.getSubcategories();
      },
      (error: any) => {
        console.log(error);
      },
      () => {
        this.modalRef?.hide();
        this.addSubcategoryForm.reset();
      }
    );
  }

  openEditSubcategoryModal(
    editSubcategoryModalTemplate: TemplateRef<any>,
    subcategory: Subcategory
  ) {
    this.editSubcategoryForm.controls['subcategoryName'].setValue(
      subcategory?.name
    );
    this.editSubcategoryForm.controls['subcategoryId'].setValue(
      subcategory?.id
    );

    this.modalRef = this.modalService.show(editSubcategoryModalTemplate, {
      class: 'modal-dialog-centered',
    });
  }

  cancelEditSubcategoryModal(): void {
    this.modalRef?.hide();
    this.editSubcategoryForm.reset();
  }

  closeEditSubcategoryModal(): void {
    this.modalRef?.hide();
    this.editSubcategoryForm.reset();
  }

  editSubcategory() {
    const requestJson = {
      userId: this.userDetails?.id,
      id: this.editSubcategoryForm.controls['subcategoryId'].value,
      name: this.editSubcategoryForm.controls['subcategoryName'].value,
    };

    this.httpService.put(`${URLS.Subcategories}`, requestJson).subscribe(
      (data: any) => {
        if (data?.message) {
          this.toastService.success(data?.message);
        }
        this.getSubcategories();
      },
      (error: any) => {
        console.log(error);
      },
      () => {
        this.modalRef?.hide();
        this.editSubcategoryForm.reset();
      }
    );
  }

  openDeleteSubcategoryModal(subcategory: Subcategory) {
    const initialState: ModalOptions = {
      initialState: {
        title: this.deleteSubcategoryModalLabels.Title,
        text: `Are you sure you want to delete${
          subcategory?.name && ' <strong>' + subcategory?.name + '</strong>'
        }?`,
        cancelButton: this.deleteSubcategoryModalLabels.CancelButton,
        confirmButton: this.deleteSubcategoryModalLabels.ConfirmButton,
        confirmButtonClass: 'btn-danger',
      },
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(ConfirmComponent, initialState);
    this.modalRef.content.outputEmitter
      .pipe(take(1))
      .subscribe((value: any) => {
        if (value) {
          this.deleteSubcategory(subcategory);
        }
      });
  }

  deleteSubcategory(subcategory: Subcategory) {
    const id = subcategory?.id;

    if (id) {
      this.httpService.delete(`${URLS.Subcategories}/${id}`).subscribe(
        (data: any) => {
          if (data?.message) {
            this.toastService.success(data?.message);
          }
          this.getSubcategories();
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

  openTemplatesModal(
    editSubcategoryModalTemplate: TemplateRef<any>,
    subcategory: Subcategory
  ) {
    this.subcategoryId = subcategory.id;
    this.subcategoryName = subcategory.name;

    this.modalRef = this.modalService.show(editSubcategoryModalTemplate, {
      class: 'modal-lg',
    });

    this.getTemplates();
  }

  closeTemplatesModal(): void {
    this.subcategoryId = 0;
    this.subcategoryName = '';

    this.modalRef?.hide();
    this.editSubcategoryForm.reset();
  }

  getTemplates() {
    this.templates = [];
    let observable = null;

    if (this.templateSearchModel) {
      const requestJson = {
        searchText: this.templateSearchModel,
        userId: this.userDetails?.id,
      };

      observable = this.httpService.post(
        `${URLS.Subcategories}/${this.subcategoryId}/${URLS.SearchTemplates}`,
        requestJson
      );
    } else {
      const requestJson = {
        userId: this.userDetails?.id,
      };

      observable = this.httpService.post(
        `${URLS.Subcategories}/${this.subcategoryId}/${URLS.Templates}`,
        requestJson
      );
    }

    if (observable) {
      observable.subscribe(
        (data: any) => {
          this.templates = data?.data;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }
}
