import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Report, Payment } from '../../models/models.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private url: string = "http://localhost:8083/mmcs";

  constructor(private _http: HttpClient) { }

  public confirm(payment: Payment): Observable<Report> {
    return this._http.post<Report>(this.url + '/secure/payment', payment);
  }
}
