import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { HttpService } from 'src/app/web/home/shared/services/http/http.service';
import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';
import { Ckeditor4AngularService } from 'src/app/web/home/shared/services/ckeditor4-angular/ckeditor4-angular.service';
import { DownloadTemplateService } from 'src/app/web/home/shared/services/download-template/download-template.service';

import { URLS } from 'src/app/web/home/shared/enums/urls.enum';
import { LABELS } from './view.enum';

import { User } from 'src/app/web/home/shared/services/auth/auth.model';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  editorConfig: any;

  labels: any;

  userTemplateId = 0;
  userTemplateUuid = '';
  filename = '';

  textForm!: FormGroup;

  userDetails!: User | null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService,
    private ckeditor4AngularService: Ckeditor4AngularService,
    private downloadTemplateService: DownloadTemplateService
  ) {
    this.route.params.subscribe((params) => {
      this.userTemplateId = +params['id'];

      if (this.userTemplateId) {
        this.getText();
      }
    });
  }

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails();

    this.editorConfig = this.ckeditor4AngularService.getConfig();

    this.labels = LABELS;

    this.textForm = this.fb.group({
      text: ['', [Validators.required]],
    });
  }

  getText() {
    this.httpService
      .get(`${URLS.UserTemplates}/${this.userTemplateId}`)
      .subscribe(
        (data: any) => {
          this.userTemplateUuid = data?.data[0]?.uuid;
          this.filename = data?.data[0]?.filename;
          this.textForm.get('text')?.setValue(data?.data[0]?.text || '');
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  download(filetype: string) {
    const requestJson = {
      userId: this.userDetails?.id,
      text: this.textForm.get('text')?.value,
    };

    this.httpService.put(URLS.UserTemplates, requestJson).subscribe(
      (data: any) => {
        const filename = data?.data?.uuid;
        this.downloadTemplateService.download(
          filetype,
          'preview',
          filename,
          this.textForm.get('text')?.value
        );
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
