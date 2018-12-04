import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '../../models/interfaces.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private uri: string = "http://localhost:8083/mmcs";
  private authBasicHeader = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'Authorization':'Basic dGVzdDAxOnRlc3QwMQ==', 'No-Auth':'true'})};

  constructor(private _http: HttpClient) { }

  public getJsonToken(email: string, password: string): Observable<Token>{
    let authUri: string = this.uri+"/oauth/token";
    let oAuthData = "grant_type=password"+"&username="+email+"&password="+password;
    return this._http.post<Token>(authUri, oAuthData, this.authBasicHeader);  
  }
}
