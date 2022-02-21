import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get(url: string): any {
    return this.http.get(`${this.apiUrl}/${url}`, {
      responseType: 'json',
    });
  }

  post(url: string, requestJson = {}): any {
    return this.http.post(`${this.apiUrl}/${url}`, requestJson, {
      responseType: 'json',
    });
  }

  put(url: string, requestJson = {}): any {
    return this.http.put(`${this.apiUrl}/${url}`, requestJson, {
      responseType: 'json',
    });
  }

  delete(url: string): any {
    return this.http.delete(`${this.apiUrl}/${url}`, {
      responseType: 'json',
    });
  }
}
