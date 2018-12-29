import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Report, Payment } from '../../models/models.model';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private url: string = environment.url;

  constructor(private _http: HttpClient) { }

  public confirm(payment: Payment): Observable<Report> {
    return this._http.post<Report>(this.url + '/secure/payment', payment);
  }
}
