import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { HttpService } from 'src/app/web/home/shared/services/http/http.service';
import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';

import { URLS } from 'src/app/web/home/shared/enums/urls.enum';

import { LABELS } from './profile-details.enum';

import { User } from 'src/app/web/home/shared/services/auth/auth.model';
import { Profile } from './profile-details.model';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {
  labels: any;

  profileDetails!: Profile;
  userDetails!: User | null;

  constructor(
    private modalRef: BsModalRef,
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userDetails = this.authService.getUserDetails();

    this.labels = LABELS;

    this.getProfileDetails();
  }

  getProfileDetails() {
    const userId = this.userDetails?.id;

    this.httpService.get(`${URLS.Users}/${userId}/userDetails`).subscribe(
      (data: any) => {
        this.profileDetails = data?.data[0];
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  close() {
    this.modalRef?.hide();
  }
}
