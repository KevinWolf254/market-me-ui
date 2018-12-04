import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { UserReport, UserRole } from '../../models/models.model';
import { ToastrService } from 'ngx-toastr';
import { Token } from '../../models/interfaces.model';
import { TokenService } from './token.service';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private uri: string = "http://localhost:8083/mmcs";
  private header = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'No-Auth': 'true' }) };
  private authBearerheader = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) };

  private profileSource = new BehaviorSubject<UserReport>(new UserReport());
  public profileObserver = this.profileSource.asObservable();

  constructor(private _http: HttpClient, private tokenService: TokenService) { }

  public signUp(surname: string, otherNames: string, country: string, code: string,
    phoneNo: string, organisation: string, email: string, password: string): Observable<any> {
    let clientRegUri: string = this.uri + "/signup";
    let clientRegData = "surname=" + surname +
      "&otherNames=" + otherNames +
      "&organisation=" + organisation +
      "&country=" + country +
      "&code=" + code +
      "&phoneNo=" + phoneNo +
      "&email=" + email +
      "&password=" + password;
    return this._http.post<any>(clientRegUri, clientRegData, this.header);
  }
  public getUserProfile(): Observable<UserReport> {
    let signInUri: string = this.uri + "/secure/user/signin";
    return this._http.get<UserReport>(signInUri);
  }
  public changePassword(newPass: string): Observable<any> {
    let passUri: string = this.uri + "/secure/credentials";
    let data = "NewPassword=" + newPass;
    return this._http.put<any>(passUri, data, this.authBearerheader);
  }
  public save(surname: string, otherNames: string, email: string, role: string, password: string) {
    let userData = "surname=" + surname +
      "&otherNames=" + otherNames +
      "&email=" + email +
      "&role=" + role +
      "&password=" + password;
    return this._http.post<any>(this.uri + "/secure/user", userData, this.authBearerheader);
  }
  public update(surname: string, otherNames: string, status: boolean, email: string, roles: string[]) {
    let userData = "surname=" + surname +
      "&otherNames=" + otherNames +
      "&email=" + email +
      "&roles=" + roles +
      "&status=" + status;
    return this._http.put(this.uri + "/secure/user", userData, this.authBearerheader);
  }
  public delete(email: string) {
    return this._http.delete(this.uri + "/secure/user/" + email);
  }
  public set profile(report: UserReport) {
    this.profileSource.next(report);
  }
  public get users(): Observable<UserReport[]> {
    return this._http.get<UserReport[]>(this.uri + "/secure/user").pipe(
      catchError(err => of([]))
    );
  }
  public isAuthenticated(): Observable<boolean> {
    return this.getUserProfile().pipe(
      map((profile: UserReport) => {
        return true;
      }),
      catchError(err => of(false))
    );
  }
}