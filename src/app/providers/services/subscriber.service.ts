import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GroupedContactsRequest, Subscriber_ } from '../../models/models.model';
import { ServiceProviderReport } from '../../models/interfaces.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {
  private basicUri: string = "http://localhost:8083/mmcs";
  private jsonHeader = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(private _http: HttpClient) { }

  public get subscribers(): Observable<ServiceProviderReport[]> {
    return this._http.get<ServiceProviderReport[]>(this.basicUri + "/secure/subscriber");
  }
  public find(groupIds: number[]): Observable<ServiceProviderReport[]> {
    let request: GroupedContactsRequest = new GroupedContactsRequest(groupIds);
    return this._http.post<ServiceProviderReport[]>(this.basicUri + "/secure/subscriber/groups", request, this.jsonHeader);
  }
  public save(groupId: number, subscriber: Subscriber_) {
    return this._http.post(this.basicUri + "/secure/subscriber/" + groupId, subscriber, this.jsonHeader);
  }

  public saveSubscribers(file: File) {
    let formData: FormData = new FormData();
    formData.append("file", file, file.name);
    return this._http.post(this.basicUri + "/secure/subscribers", formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  getByGroupId(id: number) {
    return this._http.get<Subscriber_[]>(this.basicUri + "/secure/subscriber/" + id);
  }
  // public saveClient(contact: Client){
  //   return this._http.post(this.basicUri + "/secure/subscriber", contact, this.jsonHeader);
  // }

  // public saveContactToGroup(contact: Client, groupId: number){
  //   return this._http.post(this.basicUri + "/secure/subscriber/"+groupId, contact);
  // }

  // public saveContactsToGroup(file: File, groupId: number){
  //   let formData: FormData = new FormData();    
  //   formData.append("file", file, file.name);
  //   return this._http.post(this.basicUri + "/secure/subscriber/file/"+groupId, formData, {
  //     reportProgress: true,
  //     observe: 'events'
  //   });
  // }

  // public removeContactFromGroup(contactId: number, groupId: number){
  //   let requestParams = "ContactId="+contactId+"&GroupId="+groupId;
  //   return this._http.post(this.basicUri + "/secure/subscriber/remove", requestParams, this.header);
  // }
}
