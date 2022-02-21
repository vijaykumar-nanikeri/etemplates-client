import { Injectable } from '@angular/core';

import { App, User } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  // AppDetails START >>
  setAppDetails(appDetails: App) {
    sessionStorage.setItem('appDetails', JSON.stringify(appDetails));
  }

  getAppDetails(): App | null {
    const appDetails = sessionStorage.getItem('appDetails');
    return JSON.parse(appDetails ? appDetails : '');
  }

  removeAppDetails() {
    return sessionStorage.removeItem('appDetails');
  }
  // END AppDetails

  // AuthToken START >>
  setAuthToken(authToken: string) {
    sessionStorage.setItem('authToken', authToken);
  }

  getAuthToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  removeAuthToken() {
    return sessionStorage.removeItem('authToken');
  }
  // END AuthToken

  // UserDetails START >>
  setUserDetails(userDetails: User) {
    sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
  }

  getUserDetails(): User | null {
    const userDetails = sessionStorage.getItem('userDetails');
    return JSON.parse(userDetails ? userDetails : '');
  }

  removeUserDetails() {
    return sessionStorage.removeItem('userDetails');
  }
  // END UserDetails
}
