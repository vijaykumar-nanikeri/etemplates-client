import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';

import { environment } from 'src/environments/environment';

import { AuthService } from '../../services/auth/auth.service';
import { URLS } from 'src/app/web/public/shared/enums/urls';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private toastService: HotToastService,
    private authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // With NoAuth header inclusion for Public URLs, the below code can be removed.
    const urls = [];
    urls.push(`${this.apiUrl}/${URLS.Login.toString()}`);
    urls.push(`${this.apiUrl}/${URLS.ResendOtp.toString()}`);

    if (!urls.includes(request.url)) {
      // Get the auth token from the service.
      const authToken = this.authService.getAuthToken();

      if (authToken !== null) {
        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        const authRequest = request.clone({
          headers: request.headers.set('Authorization', 'Bearer ' + authToken),
        });

        // send cloned request with header to the next handler.
        return next.handle(authRequest).pipe(
          catchError((event) => {
            this.router.navigate(['/login']);
            return throwError(event);
          })
        );
      } else {
        this.router.navigate(['/login']);
      }
    }

    return next.handle(request).pipe(
      catchError((event) => {
        return throwError(event);
      })
    );
  }
}
