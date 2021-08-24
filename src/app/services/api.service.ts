import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiBase;
  userName;
  password;

  constructor(
    private http: HttpClient
  ) { }

  init(apiBase, userName, password) {
    this.apiBase = apiBase;
    this.userName = userName;
    this.password = password;
  }

  checkServerStatus() {
    return this.http.get(this.apiBase + '/api/v1.0/status');
  }
  getImagePath(fileName) {
    return this.apiBase + '/api/v1.0/image/' + fileName;
  }
  uploadImage(base64String: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa(this.userName + ':' + this.password)
      })
    };

    const body = {
      picture: base64String
    }
    return this.http.post(this.apiBase + '/api/v1.0/ranking', body, httpOptions);
  }
}
