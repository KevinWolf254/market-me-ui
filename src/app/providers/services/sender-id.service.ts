import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SenderIdResponse, SenderId } from '../../models/models.model';

@Injectable({
  providedIn: 'root'
})
export class SenderIdService {
  private uri: string = "http://localhost:8083/mmcs";

  private senderIdsSource = new BehaviorSubject<SenderId[]>([]);
  public senderIdsObserver = this.senderIdsSource.asObservable();

  constructor(private _http: HttpClient) { }

  public senderIds(id: number): Observable<SenderId[]> {
    return this._http.get<SenderId[]>(this.uri + "/secure/senderId/" + id).pipe(
      catchError( err =>{
        return of([]);
      })
    );
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
  public exists(name: string): Observable<boolean> {
    return this.getSenderIdByName(name).pipe(
      map((response: SenderId) => {
        if (response.id == null || response.id == undefined)
          return false;
        return true;
      }),
      catchError(err => {
        return of(false);
      })
    );
  }
  public getSenderIdByName(name: string): Observable<SenderId> {
    return this._http.get<SenderId>(this.uri + '/secure/senderId/byName/' + name).pipe(
      catchError(err => {
        return of(new SenderId());
      })
    );
  }
}
