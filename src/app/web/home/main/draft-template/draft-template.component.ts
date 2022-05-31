import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';

import { HttpService } from 'src/app/web/home/shared/services/http/http.service';
import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';
import { DownloadTemplateService } from 'src/app/web/home/shared/services/download-template/download-template.service';

import { HOME_LABELS } from 'src/app/web/home/shared/enums/home.enum';
import { URLS } from 'src/app/web/home/shared/enums/urls.enum';
import { LABELS, SUBCATEGORY_TYPES_MODAL_LABELS } from './draft-template.enum';

import { User } from 'src/app/web/home/shared/services/auth/auth.model';
import { Category } from '../categories/view-all/view-all.model';
import { Subcategory } from '../categories/view/view.model';
import { SubcategoryType } from '../library/subcategory-types/view-all/view-all.model';
import { Template } from '../templates/view-all/view-all.model';
import { SubcategoryTypeValue } from '../library/subcategory-types/view/view.model';
import { Field } from '../templates/compose-template/compose-template.model';

@Component({
  selector: 'app-draft-template',
  templateUrl: './draft-template.component.html',
  styleUrls: ['./draft-template.component.scss'],
})
export class DraftTemplateComponent implements OnInit, OnDestroy {
  modalRef?: BsModalRef;
  modalServiceOnShownSubscription?: Subscription;

  homeLabels: any;
  labels: any;
  subcategoryTypesModalLabels: any;

  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  subcategoryTypes: SubcategoryType[] = [];
  templates: Template[] = [];
  subcategoryTypeValues: SubcategoryTypeValue[] = [];

  categoryModel = 0;
  subcategoryModel = 0;
  templateModel = 0;
  downloadFilenameModel = '';
  subcategoryTypeModel = 0;

  isGetClicked = false;
  isSubcategoryTypesModalOpened = false;

  fieldsForm!: FormGroup;

  isPreviewClicked = false;
  processedText = '';

  userDetails!: User | null;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private httpService: HttpService,
    private authService: AuthService,
    private downloadTemplateService: DownloadTemplateService
  ) {}

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails();

    this.homeLabels = HOME_LABELS;
    this.labels = LABELS;
    this.subcategoryTypesModalLabels = SUBCATEGORY_TYPES_MODAL_LABELS;

    this.getCategories();

    this.fieldsForm = this.fb.group({
      fields: this.fb.array([]),
    });

    this.onSubcategoryTypesModalOpened();
    this.onSubcategoryTypesModalClosed();
  }

  ngOnDestroy(): void {
    this.closeAddSubcategoryModal();
    this.modalServiceOnShownSubscription?.unsubscribe();
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

    this.templateModel = 0;
    this.templates = [];

    if (categoryId) {
      this.getSubcategories(categoryId);
    }

    this.closeAddSubcategoryModal();
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
    this.templateModel = 0;
    this.subcategoryTypes = [];
    this.templates = [];

    if (subcategoryId) {
      this.getSubcategoryTypes(subcategoryId);
      this.getTemplates(subcategoryId);
    }

    this.closeAddSubcategoryModal();
  }

  getSubcategoryTypes(subcategoryId: number) {
    this.subcategoryTypes = [];

    this.httpService
      .get(`${URLS.Subcategories}/${subcategoryId}/${URLS.SubcategoryTypes}`)
      .subscribe(
        (data: any) => {
          this.subcategoryTypes = data?.data;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  onSubcategoryTypeModelChange(subcategoryTypeId: number) {
    this.subcategoryTypeModel = 0;
    this.subcategoryTypeValues = [];

    if (subcategoryTypeId) {
      this.getSubcategoryTypeValues(subcategoryTypeId);
    }
  }

  getTemplates(subcategoryId: number) {
    const requestJson = {
      userId: this.userDetails?.id,
      userCategoryId: this.userDetails?.userCategoryId,
    };

    this.httpService
      .post(
        `${URLS.Subcategories}/${subcategoryId}/${URLS.Templates}`,
        requestJson
      )
      .subscribe(
        (data: any) => {
          this.templates = data?.data;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  onTemplateModelChange(templateId: number) {
    this.templateModel = templateId;
    this.isGetClicked = false;
  }

  getSubcategoryTypeValues(subcategoryTypeId: number) {
    this.subcategoryTypeValues = [];

    this.httpService
      .get(`${URLS.SubcategoryTypes}/${subcategoryTypeId}/values`)
      .subscribe(
        (data: any) => {
          this.subcategoryTypeValues = data?.data;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  get fields() {
    return this.fieldsForm.controls['fields'] as FormArray;
  }

  addField(field?: Field) {
    const fieldForm = this.fb.group({
      name: [field?.name || '', Validators.required],
      notes: [field?.notes || ''],
      size: [field?.size || 0],
      value: ['', Validators.required],
    });
    this.fields.push(fieldForm);
  }

  getFields() {
    this.fields.clear();
    this.fieldsForm.reset();

    this.isPreviewClicked = false;
    this.processedText = '';

    this.isGetClicked = true;

    if (this.templateModel) {
      this.httpService
        .get(`${URLS.Templates}/${this.templateModel}/fields`)
        .subscribe(
          (data: any) => {
            if (data?.data?.length > 0) {
              data?.data?.forEach((field: Field) => {
                this.addField(field);
              });
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
    }
  }

  getText() {
    this.isPreviewClicked = true;

    if (this.templateModel) {
      this.httpService
        .get(`${URLS.Templates}/${this.templateModel}/text`)
        .subscribe(
          (data: any) => {
            const text = data?.data[0]?.text;
            if (text) {
              this.preview(text);
            }
          },
          (error: any) => {
            console.log(error);
          }
        );
    }
  }

  preview(text: string) {
    let processedText: any = text;

    this.fields.controls.forEach((field: AbstractControl) => {
      const fieldSnippet = `&lt;${field.value.name}&gt;`;
      if (processedText.includes(fieldSnippet)) {
        processedText = processedText.replaceAll(
          fieldSnippet,
          field.value.value
        );
      }
    });

    this.processedText = processedText;
  }

  download(filetype: string) {
    const currentDateAndTime = moment().format('YYYYMMDDHHmm');
    const templateName = this.getTemplateName(this.templateModel)
      .trim()
      .split(' ')
      .join('_');

    let filename = this.downloadFilenameModel;
    filename = filename || [currentDateAndTime, templateName].join('_');

    const processedAndUpdatedText =
      document.getElementById('preview')?.innerHTML;

    const requestJson = {
      userId: this.userDetails?.id,
      text: processedAndUpdatedText,
      filename: filename,
    };

    this.httpService.put(URLS.UserTemplates, requestJson).subscribe(
      (data: any) => {
        this.downloadTemplateService.download(
          filetype,
          'preview',
          filename || data?.data?.uuid,
          processedAndUpdatedText
        );
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  openSubcategoryTypesModal(subcategoryTypesModalTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(subcategoryTypesModalTemplate, {
      class: 'subcategory-types-modal modal-sm me-0 shadow',
      backdrop: false,
    });
  }

  onSubcategoryTypesModalOpened() {
    this.modalServiceOnShownSubscription = this.modalService.onShown.subscribe(
      () => {
        this.isSubcategoryTypesModalOpened = true;

        const subcategoryTypesModalDialogEl: HTMLDivElement | any =
          document.querySelector('.subcategory-types-modal');

        const subcategoryTypesModalContentEl: HTMLDivElement | any =
          subcategoryTypesModalDialogEl?.querySelector('.modal-content');
        subcategoryTypesModalContentEl.style.maxHeight = '300px';
        subcategoryTypesModalContentEl.style.overflowX = 'hidden';
        subcategoryTypesModalContentEl.style.overflowY = 'scroll';

        const subcategoryTypesModalEl: HTMLDivElement | any =
          subcategoryTypesModalDialogEl?.closest('.modal');
        subcategoryTypesModalEl.style.pointerEvents = 'none';
        subcategoryTypesModalEl.style.top = '125px';
      }
    );
  }

  onSubcategoryTypesModalClosed() {
    this.modalServiceOnShownSubscription = this.modalService.onHidden.subscribe(
      () => {
        this.isSubcategoryTypesModalOpened = false;
      }
    );
  }

  getSubcategoryName(subcategoryId: number) {
    return this.subcategories.filter(
      (subcategory: Subcategory) =>
        Number(subcategory.id) === Number(subcategoryId)
    )[0].name;
  }

  getTemplateName(templateId: number) {
    return this.templates.filter(
      (template: Template) => Number(template.id) === Number(templateId)
    )[0].name;
  }

  closeAddSubcategoryModal(): void {
    this.modalRef?.hide();
  }
}
