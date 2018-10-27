import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ReportDates } from '../../models/models.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private basicUri: string = "http://localhost:8083/mmcs";
  private header = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private _http: HttpClient) { }

  requestPurchasesReport(email: string, from: NgbDate, to: NgbDate) {
    let params = new ReportDates(email, new Date(from.year, from.month - 1,
      from.day), new Date(to.year, to.month - 1, to.day));
    return this._http.post(this.basicUri + "/reportPDF/purchase", params,
      this.header);
  }

  requestDeliveryReport(email: string, from: NgbDate, to: NgbDate) {
    let params = new ReportDates(email, new Date(from.year, from.month - 1,
      from.day), new Date(to.year, to.month - 1, to.day));
    return this._http.post(this.basicUri + "/reportPDF/delivery", params,
      this.header);
  }
}
