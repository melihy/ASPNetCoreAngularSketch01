import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  getMembers() {
    // return this.http.get<Member[]>(this.baseUrl + 'users', this.getHttpOptions());
    return this.http.get<Member[]>(this.baseUrl + 'users');
  }

  getMember(username: string) {
    // return this.http.get<Member>(this.baseUrl + 'users/' + username, this.getHttpOptions());
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  //handled with httpinterceptor. see:jwt.Interceptor.ts
  // getHttpOptions() {
  //   const userString = localStorage.getItem('user');
  //   if (!userString) return;

  //   const user = JSON.parse(userString);

  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + user.token
  //     })
  //   }
  // }
}
