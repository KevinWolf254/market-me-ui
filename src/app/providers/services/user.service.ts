import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Token, UserReport, UserRole } from '../../models/models.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private uri: string = "http://localhost:8083/mmcs";
  private header = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'No-Auth':'true'})};
  private authBasicHeader = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'Authorization':'Basic dGVzdDAxOnRlc3QwMQ==', 'No-Auth':'true'})};
  private authBearerheader = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})};

  private expiresAtSource = new BehaviorSubject<number>(0);
  public expiresAtObserver = this.expiresAtSource.asObservable();

  private tokenSource = new BehaviorSubject<string>('');
  public tokenObserver = this.tokenSource.asObservable();

  private profileSource = new BehaviorSubject<UserReport>(new UserReport());
  public profileObserver = this.profileSource.asObservable();

  private authenticatedSource = new BehaviorSubject<boolean>(false);
  public authenticatedObserver = this.authenticatedSource.asObservable();

  private usersSource = new BehaviorSubject<UserReport[]>([]);
  public usersObserver = this.usersSource.asObservable();

  constructor(private _http: HttpClient, private notify: ToastrService) {}

  public signUp(surname: string, otherNames: string, country: string, code: string,
    phoneNo: string, organisation: string, email: string, password: string): Observable<any>{
      let clientRegUri: string = this.uri+"/signup";
      let clientRegData = "surname="+surname+
      "&otherNames="+otherNames+
      "&organisation="+organisation+
      "&country="+country+
      "&code="+code+
      "&phoneNo="+phoneNo+
      "&email="+email+
      "&password="+password;
      return this._http.post<any>(clientRegUri, clientRegData, this.header);
  }

  public authenticate(email: string, password: string): Observable<Token>{
    let authUri: string = this.uri+"/oauth/token";
    let oAuthData = "grant_type=password"+"&username="+email+"&password="+password;
    return this._http.post<Token>(authUri, oAuthData, this.authBasicHeader);  
  }

  public signIn(): Observable<UserReport>{
    let signInUri: string = this.uri+"/secure/user/signin";
    return this._http.get<UserReport>(signInUri);
  }

  public changePassword(newPass: string): Observable<any>{
    let passUri: string = this.uri+"/secure/credentials";
    let data = "NewPassword="+newPass;
    return this._http.put<any>(passUri, data, this.authBearerheader);
  }

  public save(surname: string, otherNames: string, email: string, role: string, password: string){
    let userData = "surname="+surname+
    "&otherNames="+otherNames+
    "&email="+email+
    "&role="+role+
    "&password="+password;
    return this._http.post<any>(this.uri + "/secure/user", userData, this.authBearerheader);
  }

  public update(surname: string, otherNames: string, status: boolean, email: string, roles: string[]){
    let userData = "surname="+surname+
    "&otherNames="+otherNames+
    "&email="+email+
    "&roles="+roles+
    "&status="+status;
    return this._http.put(this.uri + "/secure/user", userData, this.authBearerheader);
  }

  public delete(email: string){
    return this._http.delete(this.uri + "/secure/user/" + email);
  }

  public set token(token: string){
    this.tokenSource.next(token);
  }
  public set expireTime(expire_time: number){
    this.expiresAtSource.next(expire_time * 1000 + Date.now());
  }
  public set profile(report: UserReport){
    this.profileSource.next(report);
  }
  public set isAuthenticated(auth: boolean){
    this.authenticatedSource.next(auth);
  }
  public set _users(users: UserReport[]){
    this.usersSource.next(users);
  }
  public get users(): Observable<UserReport[]>{
    return this._http.get<UserReport[]>(this.uri + "/secure/user");
  }
}