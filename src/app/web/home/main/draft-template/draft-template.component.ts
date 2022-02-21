import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { HttpService } from 'src/app/web/home/shared/services/http/http.service';
import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';
import { DownloadTemplateService } from 'src/app/web/home/shared/services/download-template/download-template.service';

import { URLS } from 'src/app/web/home/shared/enums/urls.enum';
import { LABELS } from './draft-template.enum';

import { User } from 'src/app/web/home/shared/services/auth/auth.model';
import { Category } from '../categories/view-all/view-all.model';
import { Subcategory } from '../categories/subcategories/subcategories.model';
import { Template } from '../templates/view-all/view-all.model';
import { Field } from '../templates/compose-template/compose-template.model';

@Component({
  selector: 'app-draft-template',
  templateUrl: './draft-template.component.html',
  styleUrls: ['./draft-template.component.scss'],
})
export class DraftTemplateComponent implements OnInit {
  labels: any;

  categories: Category[] = [];
  subcategories: Subcategory[] = [];
  templates: Template[] = [];

  categoryModel = 0;
  subcategoryModel = 0;
  templateModel = 0;

  isGetClicked = false;

  fieldsForm!: FormGroup;

  isPreviewClicked = false;
  processedText = '';

  userDetails!: User | null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastService: HotToastService,
    private httpService: HttpService,
    private authService: AuthService,
    private downloadTemplateService: DownloadTemplateService
  ) {}

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails();

    this.labels = LABELS;

    this.getCategories();

    this.fieldsForm = this.fb.group({
      fields: this.fb.array([]),
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

    this.templateModel = 0;
    this.templates = [];

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
    this.templateModel = 0;
    this.templates = [];

    if (subcategoryId) {
      this.getTemplates(subcategoryId);
    }
  }

  getTemplates(subcategoryId: number) {
    this.httpService
      .get(`${URLS.Subcategories}/${subcategoryId}/${URLS.Templates}`)
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

  get fields() {
    return this.fieldsForm.controls['fields'] as FormArray;
  }

  addField(field?: Field) {
    const fieldForm = this.fb.group({
      name: [field?.name || '', Validators.required],
      value: ['', Validators.required],
    });
    this.fields.push(fieldForm);
  }

  getFields() {
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
    const processedAndUpdatedText =
      document.getElementById('preview')?.innerHTML;

    const requestJson = {
      userId: this.userDetails?.id,
      text: processedAndUpdatedText,
    };

    this.httpService.put(URLS.UserTemplates, requestJson).subscribe(
      (data: any) => {
        const filename = data?.data?.uuid;
        this.downloadTemplateService.download(
          filetype,
          'preview',
          filename,
          processedAndUpdatedText
        );
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
