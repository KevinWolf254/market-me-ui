import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Group } from '../../models/models.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private uri: string = "http://localhost:8083/mmcs";
  private header = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})};

  private groupSource = new BehaviorSubject<Group[]>([]);
  public groupObserver = this.groupSource.asObservable();

  constructor(private _http: HttpClient) {}

  public get groups(): Observable<Group[]>{
    return this._http.get<Group[]>(this.uri + "/secure/group");
  }
  public set _groups(groups: Group[]){
    this.groupSource.next(groups);
  }
  // public saveGroup(name: string){
  //   let requestParam = "name="+name;
  //   return this._http.post(this.uri + "/secure/group", requestParam, this.header);
  // }

  // public getContactsOfGroup(id: number) {
  //   return this._http.get(this.uri + "/secure/contacts/" + id);
  // } 

  public find(groups: Group[], selectedId: number): Group{
    let group: Group = groups.find((group: Group) =>{
      return group.id == selectedId;
    });
    return group;
  }

  // deleteGroup(groupId: number){
  //   return this._http.delete(this.uri + "/secure/group/"+groupId);
  // }
}
