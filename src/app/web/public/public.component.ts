import { Component, OnInit } from '@angular/core';

import { HttpService } from 'src/app/web/public/shared/services/http/http.service';
import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';

import { URLS } from 'src/app/web/public/shared/enums/urls';

import { App } from 'src/app/web/home/shared/services/auth/auth.model';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit {
  appDetails!: App;
  appDetailsAlias!: App;

  constructor(
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.appDetailsAlias = {
      id: 0,
      name: 'eTemplates',
      acronym: 'eT',
      version: '1.0',
    };

    this.getAppDetails();
  }

  getAppDetails() {
    this.httpService.get(URLS.App).subscribe(
      (data: any) => {
        this.appDetails = data?.data[0];
        this.authService.setAppDetails(this.appDetails);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
