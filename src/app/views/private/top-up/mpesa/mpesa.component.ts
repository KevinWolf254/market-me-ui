import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryService } from '../../../../providers/services/country.service';
import { UserReport } from '../../../../models/models.model';
import { UserService } from '../../../../providers/services/user.service';
import { Country } from '../../../../models/interfaces.model';

@Component({
  selector: 'app-mpesa',
  templateUrl: './mpesa.component.html',
  styleUrls: ['./mpesa.component.scss']
})
export class MpesaComponent implements OnInit {
  public form: FormGroup;
  public amount: number = 0;
  public currency: string = '';
  public countries: Country[];
  public date = Date.now();
  public profile: UserReport = new UserReport();

  constructor(private _fb: FormBuilder, private countryService: CountryService, private userService: UserService) { 
    this.form = _fb.group({
      'transNo': [null,Validators.required],
      'currency': [0,Validators.required],
      'amount': [null,Validators.required]
    });
  }

  ngOnInit() {
    this.form.get('amount').valueChanges.subscribe(amount => {
      this.amount = amount;
    });
    this.form.get('currency').valueChanges.subscribe(currency => {
      this.currency = currency;
    });
    this.countryService.countryObserver.subscribe(countries => this.countries = countries);
    this.userService.profileObserver.subscribe(profile => this.profile = profile);
    if(this.countries.length == 0)
      this.countryService.getCountries().subscribe(countries=> this.countryService.countries = countries);
  }

  public submit(form){
    console.log(form.transNo);
  }
  public get total(){
    if(this.currency == undefined || this.amount == undefined)
      return 0;
    return this.currency+' '+this.amount;
  }
  public get names(){
    return this.profile.user.otherNames+' '+this.profile.user.surname;
  }
  public get organization(){
    return this.profile.client.name;
  }
  public get userEmail(){
    return this.profile.user.email;
  }
}
