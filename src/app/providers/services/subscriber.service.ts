import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ServiceProviderReport } from '../../models/models.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {
  private basicUri: string = "http://localhost:8083/mmcs";

  constructor(private _http: HttpClient) { }
  
  public get subscribers(): Observable<ServiceProviderReport[]>{
    return this._http.get<ServiceProviderReport[]>(this.basicUri + "/secure/subscriber");
  }
}
