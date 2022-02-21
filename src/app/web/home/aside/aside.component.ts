import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { HttpService } from 'src/app/web/home/shared/services/http/http.service';

import { ProfileDetailsComponent } from 'src/app/web/home/shared/components/profile-details/profile-details.component';
import { ChangePasswordComponent } from 'src/app/web/home/shared/components/change-password/change-password.component';

import { AuthService } from 'src/app/web/home/shared/services/auth/auth.service';
import { LogoutService } from 'src/app/web/home/shared/services/logout/logout.service';

import { URLS } from 'src/app/web/home/shared/enums/urls.enum';

import { App } from 'src/app/web/home/shared/services/auth/auth.model';
import { User } from 'src/app/web/home/shared/services/auth/auth.model';
import { Menu, UserMenu } from './aside.model';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit {
  menus: Menu[] = [];
  userMenus: UserMenu[] = [];

  url: string = '';

  appDetails!: App | null;
  userDetails!: User | null;

  constructor(
    private location: Location,
    private router: Router,
    private modalService: BsModalService,
    private httpService: HttpService,
    private authService: AuthService,
    private logoutService: LogoutService
  ) {
    this.router.events.subscribe(() => {
      this.url = this.location.path();
    });
  }

  ngOnInit(): void {
    this.appDetails = this.authService.getAppDetails();
    this.userDetails = this.authService.getUserDetails();

    this.getMenus();
    this.getUserMenus();
  }

  getMenus() {
    this.httpService
      .get(`${URLS.Menus}/${this.userDetails?.userCategoryId}`)
      .subscribe(
        (data: any) => {
          this.menus = data?.data;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getUserMenus() {
    this.httpService
      .get(`${URLS.UserMenus}/${this.userDetails?.userCategoryId}`)
      .subscribe(
        (data: any) => {
          this.userMenus = data?.data;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  navigate(menu: Menu) {
    const path = [menu.basePath, menu.path].join('/');
    this.router.navigate([path]);
  }

  openUserMenu(userMenu: UserMenu) {
    if (userMenu.code === 'profile_details') {
      this.profileDetails();
    } else if (userMenu.code === 'change_password') {
      this.changePassword();
    } else if (userMenu.code === 'logout') {
      this.logoutService.logout();
    }
  }

  profileDetails() {
    const initialState: ModalOptions = {
      class: 'modal-dialog-centered',
    };

    this.modalService.show(ProfileDetailsComponent, initialState);
  }

  changePassword() {
    this.modalService.show(ChangePasswordComponent);
  }
}
