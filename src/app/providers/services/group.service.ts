import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Group } from '../../models/models.model';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private url: string = "http://localhost:8083/mmcs";
  private header = { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }) };

  private groupSource = new BehaviorSubject<Group[]>([]);
  public groupObserver = this.groupSource.asObservable();

  constructor(private _http: HttpClient) { }

  public get groups(): Observable<Group[]> {
    return this._http.get<Group[]>(this.url + "/secure/group");
  }
  public set _groups(groups: Group[]) {
    this.groupSource.next(groups);
  }
  getGroup(name: string): Observable<Group> {
    console.log("getting: " + name)
    return this._http.get<Group>(this.url + "/secure/group/" + name);
  }
  public nameExists(name: string): Observable<boolean> {
    return this.getGroup(name).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((group: Group) => {
        return !(group == null || group == undefined)
      })
    );
  }
  public save(name: string) {
    let requestParam = "name=" + name;
    return this._http.post(this.url + "/secure/group", requestParam, this.header);
  }

  public delete(groupId: number) {
    return this._http.delete(this.url + "/secure/group/" + groupId);
  }

  // public getContactsOfGroup(id: number) {
  //   return this._http.get(this.uri + "/secure/contacts/" + id);
  // } 

  public find(groups: Group[], selectedId: number): Group {
    let group: Group = groups.find((group: Group) => {
      return group.id == selectedId;
    });
    return group;
  }
}
