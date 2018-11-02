import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChargesReport, Sms, Report } from '../../models/models.model';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  private uri: string = "http://localhost:8083/mmcs";
  private jsonHeader = {headers: new HttpHeaders({'Content-Type':'application/json'})};

  constructor(private _http: HttpClient) { }

  public getCharges(sms: Sms): Observable<ChargesReport>{
    return this._http.post<ChargesReport>(this.uri + "/secure/charges", sms, this.jsonHeader);
  }
  public sendSms(sms: Sms): Observable<Report>{
    return this._http.post<Report>(this.uri + "/secure/sms", sms, this.jsonHeader);
  }
}
