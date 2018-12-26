import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChargesReport, Sms, Report } from '../../models/models.model';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  private url: string = environment.url;

  private jsonHeader = {headers: new HttpHeaders({'Content-Type':'application/json'})};

  constructor(private _http: HttpClient) { }

  public getCharges(sms: Sms): Observable<ChargesReport>{
    return this._http.post<ChargesReport>(this.url + "/secure/charges", sms, this.jsonHeader);
  }
  public sendSms(sms: Sms): Observable<Report>{
    return this._http.post<Report>(this.url + "/secure/sms", sms, this.jsonHeader);
  }
}
