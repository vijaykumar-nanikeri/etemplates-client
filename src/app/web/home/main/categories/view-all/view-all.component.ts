import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  ADD_CATEGORY_MODAL_LABELS,
  EDIT_CATEGORY_MODAL_LABELS,
  DELETE_CATEGORY_MODAL_LABELS,
} from './view-all.enum';

import { User } from 'src/app/web/home/shared/services/auth/auth.model';
import { CategoriesTh, CategoriesThead, Category } from './view-all.model';

@Component({
  selector: 'app-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.scss'],
})
export class ViewAllComponent implements OnInit {
  modalRef?: BsModalRef;

  homeLabels: any;
  labels: any;

  addCategoryModalLabels: any;
  editCategoryModalLabels: any;
  deleteCategoryModalLabels: any;

  categoriesThead: CategoriesTh[] = [];
  categories: Category[] = [];

  searchModel = '';
  searchModelChanged: Subject<string> = new Subject<string>();

  addCategoryForm!: FormGroup;
  editCategoryForm!: FormGroup;

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
        this.getCategories();
      });
  }

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails();

    this.homeLabels = HOME_LABELS;
    this.labels = LABELS;

    this.addCategoryModalLabels = ADD_CATEGORY_MODAL_LABELS;
    this.editCategoryModalLabels = EDIT_CATEGORY_MODAL_LABELS;
    this.deleteCategoryModalLabels = DELETE_CATEGORY_MODAL_LABELS;

    this.categoriesThead = CategoriesThead;

    this.getCategories();

    this.addCategoryForm = this.fb.group({
      categoryName: ['', [Validators.required]],
    });

    this.editCategoryForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      categoryName: ['', [Validators.required]],
    });
  }

  onSearchModelChange(model = '') {
    this.searchModelChanged.next(model);
  }

  getCategories() {
    let observable = null;

    if (this.searchModel) {
      const requestJson = {
        searchText: this.searchModel,
      };

      observable = this.httpService.post(URLS.SearchCategories, requestJson);
    } else {
      observable = this.httpService.get(URLS.Categories);
    }

    if (observable) {
      observable.subscribe(
        (data: any) => {
          this.categories = data?.data;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  openAddCategoryModal(addCategoryModalTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(addCategoryModalTemplate, {
      class: 'modal-dialog-centered',
    });
  }

  cancelAddCategoryModal(): void {
    this.modalRef?.hide();
    this.addCategoryForm.reset();
  }

  closeAddCategoryModal(): void {
    this.modalRef?.hide();
    this.addCategoryForm.reset();
  }

  addCategory() {
    const requestJson = {
      userId: this.userDetails?.id,
      name: this.addCategoryForm.controls['categoryName'].value,
    };

    this.httpService.post(URLS.Categories, requestJson).subscribe(
      (data: any) => {
        if (data?.message) {
          this.toastService.success(data?.message);
        }
        this.getCategories();
      },
      (error: any) => {
        console.log(error);
      },
      () => {
        this.modalRef?.hide();
        this.addCategoryForm.reset();
      }
    );
  }

  openEditCategoryModal(
    editCategoryModalTemplate: TemplateRef<any>,
    category: Category
  ) {
    this.editCategoryForm.controls['categoryName'].setValue(category?.name);
    this.editCategoryForm.controls['categoryId'].setValue(category?.id);

    this.modalRef = this.modalService.show(editCategoryModalTemplate, {
      class: 'modal-dialog-centered',
    });
  }

  cancelEditCategoryModal(): void {
    this.modalRef?.hide();
    this.editCategoryForm.reset();
  }

  closeEditCategoryModal(): void {
    this.modalRef?.hide();
    this.editCategoryForm.reset();
  }

  editCategory() {
    const requestJson = {
      userId: this.userDetails?.id,
      id: this.editCategoryForm.controls['categoryId'].value,
      name: this.editCategoryForm.controls['categoryName'].value,
    };

    this.httpService.put(URLS.Categories, requestJson).subscribe(
      (data: any) => {
        if (data?.message) {
          this.toastService.success(data?.message);
        }
        this.getCategories();
      },
      (error: any) => {
        console.log(error);
      },
      () => {
        this.modalRef?.hide();
        this.editCategoryForm.reset();
      }
    );
  }

  openDeleteCategoryModal(category: Category) {
    const initialState: ModalOptions = {
      initialState: {
        title: this.deleteCategoryModalLabels.Title,
        text: `Are you sure you want to delete${
          category?.name && ' <strong>' + category?.name + '</strong>'
        }?`,
        cancelButton: this.deleteCategoryModalLabels.CancelButton,
        confirmButton: this.deleteCategoryModalLabels.ConfirmButton,
        confirmButtonClass: 'btn-danger',
      },
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(ConfirmComponent, initialState);
    this.modalRef.content.outputEmitter
      .pipe(take(1))
      .subscribe((value: any) => {
        if (value) {
          this.deleteCategory(category);
        }
      });
  }

  deleteCategory(category: Category) {
    const id = category?.id;

    if (id) {
      this.httpService.delete(`${URLS.Categories}/${id}`).subscribe(
        (data: any) => {
          if (data?.message) {
            this.toastService.success(data?.message);
          }
          this.getCategories();
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

  viewSubcategories(category: Category) {
    this.router.navigate(['/home/categories', category.id]);
  }
}
