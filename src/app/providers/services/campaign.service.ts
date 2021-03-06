import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Sms, Report, CampaignRequest, CampaignReport } from '../../models/models.model';
import { map } from 'rxjs/operators';
import { Campaign } from '../../models/interfaces.model';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private url: string = environment.url;

  constructor(private _http: HttpClient) { }

  public sendScheduledSms(sms: Sms): Observable<Campaign> {
    return this._http.post<Campaign>(this.url + '/secure/schedule', sms);
  }
  public nameExists(name: string): Observable<boolean> {
    return this.getCampaignByName(name).pipe(
      map((report: Report) => {
        return (report.code == 200)
      })
    );
  }
  public getCampaignByName(name: string): Observable<Report> {
    return this._http.get<Report>(this.url + '/secure/schedule/' + name);
  }
  getCampaignDetails(name: string): Observable<CampaignReport> {
    return this._http.get<CampaignReport>(this.url + '/secure/schedule/details/' + name);
  }
  public getCampaigns(): Observable<Campaign[]>{
    return this._http.get<Campaign[]>(this.url + '/secure/schedule');
  }
  public runCampaignNow(request: CampaignRequest): Observable<Report>{
    return this._http.put<Report>(this.url + '/secure/schedule', request);
  }
}
