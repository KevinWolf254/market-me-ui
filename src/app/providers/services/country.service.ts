import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Country } from '../../models/interfaces.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private uri: string = "https://restcountries.eu/rest/v2";
  private header = {headers: new HttpHeaders({'Api':'true'})};
  
  private countrySource = new BehaviorSubject<Country[]>([]);
  public countryObserver = this.countrySource.asObservable();
  
  constructor(private _http: HttpClient) { }

  public getCountries():Observable<Country[]>{
    return this._http.get<Country[]>(this.uri, this.header);
  }
  public set countries(countries: Country[]){
    this.countrySource.next(countries);
  }
}
