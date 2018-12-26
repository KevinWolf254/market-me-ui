import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Country, Country_ } from '../../models/interfaces.model';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private thirdPartURL: string = "https://restcountries.eu/rest/v2";
  // private url: string = "http://localhost:8083/mmcs/secure/country"
  private url: string = environment.url;

  private header = { headers: new HttpHeaders({ 'Api': 'true' }) };

  private countrySource = new BehaviorSubject<Country[]>([]);
  public countryObserver = this.countrySource.asObservable();

  constructor(private _http: HttpClient) { }

  public getCountries(): Observable<Country[]> {
    return this._http.get<Country[]>(this.thirdPartURL, this.header);
  }
  public set countries(countries: Country[]) {
    this.countrySource.next(countries);
  }
  public get myCountries(): Observable<Country_[]> {
    return this._http.get<Country_[]>(this.url + '/secure/country');
  }
}
