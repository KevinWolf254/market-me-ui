import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '../../models/interfaces.model';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private url: string = environment.url;

  private authBasicHeader = {
    headers: new HttpHeaders({
      "Accept": "application/json",
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic dGVzdDAxOnRlc3QwMQ==', 
      'No-Auth': 'true'
    })
  };

  constructor(private _http: HttpClient, private _alert: ToastrService) { }

  public getJsonToken(email: string, password: string): Observable<Token> {
    let authUri: string = this.url + "/oauth/token";
    let oAuthData = "grant_type=password" + "&username=" + email + "&password=" + password;
    return this._http.post<Token>(authUri, oAuthData, this.authBasicHeader).pipe(
      catchError(err => {
        err.status == 0 ? this._alert.error(err.message) : this._alert.error('Email or password are incorrect');
        return of(null);
      })
    );
  }
}
