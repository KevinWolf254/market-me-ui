import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GroupedContactsRequest } from '../../models/models.model';
import { ServiceProviderReport } from '../../models/interfaces.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {
  private basicUri: string = "http://localhost:8083/mmcs";
  private jsonHeader = {headers: new HttpHeaders({'Content-Type':'application/json'})};

  constructor(private _http: HttpClient) { }
  
  public get subscribers(): Observable<ServiceProviderReport[]>{
    return this._http.get<ServiceProviderReport[]>(this.basicUri + "/secure/subscriber");
  }
  public find(groupIds: number[]): Observable<ServiceProviderReport[]>{ 
    let request: GroupedContactsRequest = new GroupedContactsRequest(groupIds);
    return this._http.post<ServiceProviderReport[]>(this.basicUri + "/secure/subscriber/groups", request, this.jsonHeader);
  }
}
