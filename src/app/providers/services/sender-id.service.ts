import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SenderId } from '../../models/interfaces.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SenderIdService {
  private uri: string = "http://localhost:8083/mmcs";

  private senderIdsSource = new BehaviorSubject<SenderId[]>([]);
  public senderIdsObserver = this.senderIdsSource.asObservable();

  constructor(private _http: HttpClient) { }

  public senderIds(id: number): Observable<SenderId[]> {
    return this._http.get<SenderId[]>(this.uri + "/secure/senderId/" + id);
  }
  public set _senderIds(senderIds: SenderId[]) {
    this.senderIdsSource.next(senderIds);
  }
  public get applicationForm(): Observable<any> {
    return this._http.get(this.uri + "/secure/file/contactsFormat.xlsx",
      { responseType: 'blob' }).pipe(
        map(res => {
          return {
            filename: 'contactsFormat.xlsx',
            data: res
          }
        })
      );
  }
}
