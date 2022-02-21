import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { HttpService } from 'src/app/web/home/shared/services/http/http.service';
import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';
import { Ckeditor4AngularService } from 'src/app/web/home/shared/services/ckeditor4-angular/ckeditor4-angular.service';

import { URLS } from 'src/app/web/home/shared/enums/urls.enum';
import { LABELS } from './compose-template.enum';

import { User } from 'src/app/web/home/shared/services/auth/auth.model';
import { Field } from './compose-template.model';

@Component({
  selector: 'app-compose-template',
  templateUrl: './compose-template.component.html',
  styleUrls: ['./compose-template.component.scss'],
})
export class ComposeTemplateComponent implements OnInit {
  editorConfig: any;

  labels: any;

  templateId = 0;
  templateName = '';

  textAndConfigForm!: FormGroup;

  fieldsForm!: FormGroup;
  addFieldForm!: FormGroup;

  userDetails!: User | null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private toastService: HotToastService,
    private httpService: HttpService,
    private authService: AuthService,
    private ckeditor4AngularService: Ckeditor4AngularService
  ) {
    this.route.params.subscribe((params) => {
      this.templateId = +params['id'];

      if (this.templateId) {
        this.getTemplate();
        this.getFields();
        this.getText();
      }
    });
  }

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails();

    this.editorConfig = this.ckeditor4AngularService.getConfig();

    this.labels = LABELS;

    this.fieldsForm = this.fb.group({
      fields: this.fb.array([]),
    });

    this.addFieldForm = this.fb.group({
      id: [0, [Validators.required]],
      name: ['', [Validators.required]],
    });

    this.textAndConfigForm = this.fb.group({
      id: [0, [Validators.required]],
      text: ['', [Validators.required]],
    });
  }

  getTemplate() {
    this.httpService.get(`${URLS.Templates}/${this.templateId}`).subscribe(
      (data: any) => {
        this.templateName = data?.data[0].name;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getFields() {
    this.httpService
      .get(`${URLS.Templates}/${this.templateId}/fields`)
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

  getText() {
    this.httpService.get(`${URLS.Templates}/${this.templateId}/text`).subscribe(
      (data: any) => {
        this.textAndConfigForm.get('id')?.setValue(data?.data[0]?.id || 0);
        this.textAndConfigForm.get('text')?.setValue(data?.data[0]?.text || '');
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  addFieldFormSubmit() {
    const field: Field = {
      id: 0,
      name: this.addFieldForm.value.name,
    };

    this.addField(field);
    this.addFieldForm.reset();
  }

  get fields() {
    return this.fieldsForm.controls['fields'] as FormArray;
  }

  addField(field?: Field) {
    const fieldForm = this.fb.group({
      id: [field?.id || 0, Validators.required],
      name: [field?.name || '', Validators.required],
      isEdit: false,
    });
    this.fields.push(fieldForm);
  }

  deleteField(index: number) {
    this.fields.removeAt(index);
  }

  manageField(action: string, field: any, index?: number) {
    switch (action) {
      case 'edit':
        field.get('isEdit').setValue(true);
        break;
      case 'update':
        field.get('isEdit').setValue(false);
        break;
      case 'remove':
        if (typeof index === 'number') {
          this.fields.removeAt(index);
        }
        break;
    }
  }

  textAndConfigFormSubmit() {
    const fields: Field[] = [];
    this.fields.controls.forEach((field: AbstractControl) => {
      fields.push({
        id: field.value.id,
        name: field.value.name,
      });
    });

    const requestJson = {
      userId: this.userDetails?.id,
      id: this.templateId,
      fields: fields,
      textId: this.textAndConfigForm.get('id')?.value,
      text: this.textAndConfigForm.get('text')?.value,
    };

    console.log('requestJson: ', requestJson);

    this.httpService.post(URLS.ComposeTemplate, requestJson).subscribe(
      (data: any) => {
        if (data?.message) {
          this.toastService.success(data?.message);
        }
        this.router.navigate(['/home/templates/view-all']);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
