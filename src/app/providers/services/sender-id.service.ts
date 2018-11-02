import { Injectable } from '@angular/core';
import { SenderId } from '../../models/models.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SenderIdService {
  private uri: string = "http://localhost:8083/mmcs";

  private senderIdsSource = new BehaviorSubject<SenderId[]>([]);
  public senderIdsObserver = this.senderIdsSource.asObservable();

  constructor(private _http: HttpClient) { }

  public senderIds(id: number){
    return this._http.get<SenderId[]>(this.uri + "/secure/senderId/"+id);
  }

  public set _senderIds(senderIds: SenderId[]){
    this.senderIdsSource.next(senderIds);
  }
}
