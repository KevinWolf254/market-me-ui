import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { SenderId, SenderIdRequest, Report } from '../../models/models.model';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SenderIdService {
  private url: string = environment.url;

  constructor(private _http: HttpClient) { }

  public getSenderIdsByCompanyId(id: number): Observable<SenderId[]> {
    return this._http.get<SenderId[]>(this.url + "/secure/senderId/" + id).pipe(
      catchError(err => of([]))
    );
  }
  public get applicationForm(): Observable<any> {
    return this._http.get(this.url + "/secure/senderId/form/senderIdForm.doc",
      { responseType: 'blob' }).pipe(
        map(res => {
          return {
            filename: 'senderIdForm.doc',
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
    return this._http.get<SenderId>(this.url + '/secure/senderId/byName/' + name).pipe(
      catchError(err => of(new SenderId()))
    );
  }
  public sendRequest(request: SenderIdRequest): Observable<Report>{
    return this._http.post<Report>(this.url + "/secure/senderId", request)
    .pipe(
      catchError(err => {
        return of(new Report(400, err.error.title, err.error.message))
      })
    );
  }
  public sendRequestFile(file: File): Observable<Report> {
    let formData: FormData = new FormData();
    formData.append("file", file, file.name);
    return this._http.post<Report>(this.url + "/secure/senderId/form", formData).pipe(
      retry(2),
      catchError(err => of(new Report()))
    );
  }
}
