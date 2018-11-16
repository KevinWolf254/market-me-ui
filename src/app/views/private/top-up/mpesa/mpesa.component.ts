import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryService } from '../../../../providers/services/country.service';
import { UserReport } from '../../../../models/models.model';
import { UserService } from '../../../../providers/services/user.service';
import { Country } from '../../../../models/interfaces.model';
import { selectValidator } from '../../../../providers/validators/validators';

@Component({
  selector: 'app-mpesa',
  templateUrl: './mpesa.component.html',
  styleUrls: ['./mpesa.component.scss']
})
export class MpesaComponent implements OnInit {
  public form: FormGroup;
  public transNo: string = '';
  public amount: number = 0;
  public currency: string = '';
  public countries: Country[] = [];
  public date = Date.now();
  public profile: UserReport = new UserReport();

  constructor(private _fb: FormBuilder, private countryService: CountryService, private userService: UserService) {
    this.form = _fb.group({
      'transNo': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      'bizNo': [''],
      'acntNo': [''],
      'currency': ['0', Validators.compose([Validators.required, selectValidator])],
      'amount': ['', Validators.required]
    });
  }

  ngOnInit() {
    // get list of all countries
    this.countryService.countryObserver.subscribe((countries: Country[]) => this.countries = countries);
    //monitor transNo currency
    this.form.get('transNo').valueChanges.subscribe((transNo: string) => {
      this.transNo = transNo.toUpperCase();
    });
    //monitor payment currency
    this.form.get('currency').valueChanges.subscribe(currency => {
      if (currency == 0)
        this.currency = '';
      else
        this.currency = currency
    });
    //monitor payment amount
    this.form.get('amount').valueChanges.subscribe(amount => this.amount = amount);
    //get user profile data
    this.userService.profileObserver.subscribe(profile => this.profile = profile);
  }
  public get surname() {
    return this.profile.user.surname;
  }
  public get otherNames() {
    return this.profile.user.otherNames;
  }
  public get organization() {
    return this.profile.client.name;
  }
  public get userEmail() {
    return this.profile.user.email;
  }
  public get businessNo() {
    return 518654;
  }
  public get accountNo() {
    return this.profile.client.id;
  }
  public get paymentCurrency() {
    return this.currency;
  }
  public get paymentAmount() {
    if (this.currency == undefined || this.amount == undefined)
      return 0;
    return this.amount;
  }
  //validation
  public isTouched(inputField: string): boolean {
    return this.form.controls[inputField].touched;
  }
  public isInValid(inputField: string, error: string): boolean {
    return this.form.controls[inputField].hasError(error);
  }
  //transNo
  get istransNoValid(){
    return !this.transNoHasErrors && this.isTouched('transNo');
  }
  get istransNoInvalid(){
    return this.transNoHasErrors && this.isTouched('transNo');
  }
  public get transNoHasErrors() {
    return (this.hasTransNoRequiredError || this.hasTransNoMinError || this.hasTransNoMaxError);
  }
  public get hasTransNoRequiredError() {
    return this.isInValid('transNo', 'required') 
  }
  public get hasTransNoMinError() {
    return this.isInValid('transNo', 'minlength') && !this.hasTransNoRequiredError
  }
  public get hasTransNoMaxError() {
    return this.isInValid('transNo', 'maxlength') && !this.hasTransNoRequiredError
  }
  //currency
  public get isCurrencyValid(){
    return !this.currencyHasErrors && this.isTouched('currency');
  }
  public get isCurrencyInvalid(){
    return this.currencyHasErrors && this.isTouched('currency');
  }
  public get currencyHasErrors(){
    return (this.hasCurrencyRequiredError || this.hasCurrencyDefaultError);
  }
  public get hasCurrencyRequiredError() {
    return this.isInValid('currency', 'required') 
  }
  public get hasCurrencyDefaultError() {
    return this.isInValid('currency', 'defaultValue') && !this.hasCurrencyRequiredError;
  }
  //amount
  public get isAmountValid(){
    return !this.hasAmountRequiredError && this.isTouched('amount');
  }
  public get isAmountInvalid(){
    return this.hasAmountRequiredError && this.isTouched('amount');
  }
  public get hasAmountRequiredError() {
    return this.isInValid('amount', 'required') 
  }
  public confirmPayment(form) {
    console.log(form.transNo);
  }
}