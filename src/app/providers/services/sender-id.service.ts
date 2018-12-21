import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { SenderId, SenderIdRequest, Report } from '../../models/models.model';

@Injectable({
  providedIn: 'root'
})
export class SenderIdService {
  private uri: string = "http://localhost:8083/mmcs";

  constructor(private _http: HttpClient) { }

  public getSenderIdsByCompanyId(id: number): Observable<SenderId[]> {
    return this._http.get<SenderId[]>(this.uri + "/secure/senderId/" + id).pipe(
      catchError(err => of([]))
    );
  }
  public get applicationForm(): Observable<any> {
    return this._http.get(this.uri + "/secure/file/contactsFormat.xlsx",
      { responseType: 'blob' }).pipe(
        map(res => {
          return {
            filename: 'contactsFormat.xlsx',
            data: res
          }
        }),
        catchError(err => of({}))
      );
  }
  public exists(name: string): Observable<boolean> {
    return this.getSenderIdByName(name).pipe(
      map((response: SenderId) => {
        if (response.id == null || response.id == undefined)
          return false;
        return true;
      }),
      catchError(err => of(false))
    );
  }
  public getSenderIdByName(name: string): Observable<SenderId> {
    return this._http.get<SenderId>(this.uri + '/secure/senderId/byName/' + name).pipe(
      catchError(err => of(new SenderId()))
    );
  }
  public sendRequest(request: SenderIdRequest): Observable<Report>{
    return this._http.post<Report>(this.uri + "/secure/senderId", request)
    .pipe(
      catchError(err => {
        return of(new Report(400, err.error.title, err.error.message))
      })
    );
  }
  public sendRequestFile(file: File): Observable<Report> {
    let formData: FormData = new FormData();
    formData.append("file", file, file.name);
    return this._http.post<Report>(this.uri + "/secure/senderId/form", formData).pipe(
      retry(2),
      catchError(err => of(new Report()))
    );
  }
}
