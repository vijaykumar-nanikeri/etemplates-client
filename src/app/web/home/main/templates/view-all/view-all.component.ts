import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  ADD_TEMPLATE_MODAL_LABELS,
  EDIT_TEMPLATE_MODAL_LABELS,
  DELETE_TEMPLATE_MODAL_LABELS,
} from './view-all.enum';

import { User } from 'src/app/web/home/shared/services/auth/auth.model';
import { Category } from '../../categories/view-all/view-all.model';
import { Subcategory } from '../../categories/subcategories/subcategories.model';
import { TemplatesTh, TemplatesThead, Template } from './view-all.model';

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

  addTemplateModalLabels: any;
  editTemplateModalLabels: any;
  deleteTemplateModalLabels: any;

  templatesThead: TemplatesTh[] = [];
  templates: Template[] = [];

  searchModel = '';
  searchModelChanged: Subject<string> = new Subject<string>();

  addTemplateForm!: FormGroup;
  editTemplateForm!: FormGroup;

  userDetails!: User | null;

  constructor(
    private router: Router,
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
        this.getTemplates();
      });
  }

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails();

    this.homeLabels = HOME_LABELS;
    this.labels = LABELS;

    this.addTemplateModalLabels = ADD_TEMPLATE_MODAL_LABELS;
    this.editTemplateModalLabels = EDIT_TEMPLATE_MODAL_LABELS;
    this.deleteTemplateModalLabels = DELETE_TEMPLATE_MODAL_LABELS;

    this.templatesThead = TemplatesThead;

    this.getCategories();

    this.addTemplateForm = this.fb.group({
      templateName: ['', [Validators.required]],
    });

    this.editTemplateForm = this.fb.group({
      templateId: [null, [Validators.required]],
      templateName: ['', [Validators.required]],
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
    this.templates = [];
    this.subcategoryModel = subcategoryId;
    this.isGetClicked = false;
  }

  onSearchModelChange(model = '') {
    this.searchModelChanged.next(model);
  }

  // Templates START >>
  getTemplates() {
    this.isGetClicked = true;
    this.templates = [];

    if (this.subcategoryModel) {
      let observable = null;

      if (this.searchModel) {
        const requestJson = {
          searchText: this.searchModel,
        };

        observable = this.httpService.post(
          `${URLS.Subcategories}/${this.subcategoryModel}/${URLS.SearchTemplates}`,
          requestJson
        );
      } else {
        observable = this.httpService.get(
          `${URLS.Subcategories}/${this.subcategoryModel}/${URLS.Templates}`
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

  openAddTemplateModal(addTemplateModalTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(addTemplateModalTemplate, {
      class: 'modal-dialog-centered',
    });
  }

  cancelAddTemplateModal(): void {
    this.modalRef?.hide();
    this.addTemplateForm.reset();
  }

  closeAddTemplateModal(): void {
    this.modalRef?.hide();
    this.addTemplateForm.reset();
  }

  addTemplate() {
    const requestJson = {
      userId: this.userDetails?.id,
      subcategoryId: this.subcategoryModel,
      name: this.addTemplateForm.controls['templateName'].value,
    };

    this.httpService.post(URLS.Templates, requestJson).subscribe(
      (data: any) => {
        if (data?.message) {
          this.toastService.success(data?.message);
        }
        this.getTemplates();
      },
      (error: any) => {
        console.log(error);
      },
      () => {
        this.modalRef?.hide();
        this.addTemplateForm.reset();
      }
    );
  }

  openEditTemplateModal(
    editTemplateModalTemplate: TemplateRef<any>,
    template: Template
  ) {
    this.editTemplateForm.controls['templateName'].setValue(template?.name);
    this.editTemplateForm.controls['templateId'].setValue(template?.id);

    this.modalRef = this.modalService.show(editTemplateModalTemplate, {
      class: 'modal-dialog-centered',
    });
  }

  cancelEditTemplateModal(): void {
    this.modalRef?.hide();
    this.editTemplateForm.reset();
  }

  closeEditTemplateModal(): void {
    this.modalRef?.hide();
    this.editTemplateForm.reset();
  }

  editTemplate() {
    const requestJson = {
      userId: this.userDetails?.id,
      id: this.editTemplateForm.controls['templateId'].value,
      name: this.editTemplateForm.controls['templateName'].value,
    };

    this.httpService.put(`${URLS.Templates}`, requestJson).subscribe(
      (data: any) => {
        if (data?.message) {
          this.toastService.success(data?.message);
        }
        this.getTemplates();
      },
      (error: any) => {
        console.log(error);
      },
      () => {
        this.modalRef?.hide();
        this.editTemplateForm.reset();
      }
    );
  }

  openDeleteTemplateModal(template: Template) {
    const initialState: ModalOptions = {
      initialState: {
        title: this.deleteTemplateModalLabels.Title,
        text: `Are you sure you want to delete${
          template?.name && ' <strong>' + template?.name + '</strong>'
        }?`,
        cancelButton: this.deleteTemplateModalLabels.CancelButton,
        confirmButton: this.deleteTemplateModalLabels.ConfirmButton,
        confirmButtonClass: 'btn-danger',
      },
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(ConfirmComponent, initialState);
    this.modalRef.content.outputEmitter
      .pipe(take(1))
      .subscribe((value: any) => {
        if (value) {
          this.deleteTemplate(template);
        }
      });
  }

  deleteTemplate(template: Template) {
    const id = template?.id;

    if (id) {
      this.httpService.delete(`${URLS.Templates}/${id}`).subscribe(
        (data: any) => {
          if (data?.message) {
            this.toastService.success(data?.message);
          }
          this.getTemplates();
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
  // << END Templates

  composeTemplate(template: Template) {
    this.router.navigate(['/home/templates', template.id]);
  }
}
