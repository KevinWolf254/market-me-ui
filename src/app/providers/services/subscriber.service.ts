import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GroupedContactsRequest, Subscriber_ } from '../../models/models.model';
import { ServiceProviderReport, SubscriberDetails } from '../../models/interfaces.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {
  private uri: string = "http://localhost:8083/mmcs";
  private jsonHeader = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  private header = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) };

  constructor(private _http: HttpClient) { }

  public get subscribers(): Observable<ServiceProviderReport[]> {
    return this._http.get<ServiceProviderReport[]>(this.uri + "/secure/subscriber").pipe(
      catchError(err => of([]))
    );
  }
  public find(groupIds: number[]): Observable<ServiceProviderReport[]> {
    let request: GroupedContactsRequest = new GroupedContactsRequest(groupIds);
    return this._http.post<ServiceProviderReport[]>(this.uri + "/secure/subscriber/groups", request, this.jsonHeader);
  }
  public save(groupId: number, subscriber: Subscriber_) {
    return this._http.post(this.uri + "/secure/subscriber/" + groupId, subscriber, this.jsonHeader);
  }
  public get form(): Observable<any> {
    return this._http.get(this.uri + "/secure/subscriber/form/addSubscribers.xlsx",
      { responseType: 'blob' }).pipe(
        map(res => {
          return {
            filename: 'addSubscribers.xlsx',
            data: res
          }
        }),
        catchError(err => of({}))
      );
  }
  public saveSubscribers(file: File) {
    let formData: FormData = new FormData();
    formData.append("file", file, file.name);
    return this._http.post(this.uri + "/secure/subscribers", formData);
  }

  public addMultiple(file: File, groupId: number) {
    let formData: FormData = new FormData();
    formData.append("file", file, file.name);
    return this._http.post(this.uri + "/secure/subscribers/" + groupId, formData);
  }

  public getByGroupId(id: number) {
    return this._http.get<SubscriberDetails[]>(this.uri + "/secure/subscriber/" + id);
  }

  public deleteSubscriber(contactId: number, groupId: number) {
    let requestParams = "ContactId=" + contactId + "&GroupId=" + groupId;
    return this._http.post(this.uri + "/secure/subscriber/remove", requestParams, this.header);
  }
}
