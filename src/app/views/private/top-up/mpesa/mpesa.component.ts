import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryService } from '../../../../providers/services/country.service';
import { UserReport, Payment } from '../../../../models/models.model';
import { UserService } from '../../../../providers/services/user.service';
import { Country_ } from '../../../../models/interfaces.model';
import { selectValidator } from '../../../../providers/validators/validators';
import { PaymentType, UnitsProduct, ProductType } from '../../../../models/enums.model';
import { PaymentService } from '../../../../providers/services/payment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mpesa',
  templateUrl: './mpesa.component.html',
  styleUrls: ['./mpesa.component.scss']
})
export class MpesaComponent implements OnInit {
  public form: FormGroup;
  public paymentType: PaymentType = PaymentType.MPESAC2B;
  public transNo: string = '';
  public amount: number = 0;
  public currency: string = '';
  public countries: Country_[] = [];
  public date = Date.now();
  public profile: UserReport = new UserReport();

  constructor(private _fb: FormBuilder, private countryService: CountryService, private userService: UserService,
    private paymentService: PaymentService, private notify: ToastrService) {
    this.form = _fb.group({
      'type': [''],
      'transNo': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      'bizNo': [''],
      'acntNo': [''],
      'currency': ['0', Validators.compose([Validators.required, selectValidator])],
      'amount': ['', Validators.required]
    });
  }

  ngOnInit() {
    // get list of all countries
    this.countryService.myCountries.subscribe(countries => this.countries = countries);//.countryObserver.subscribe((countries: Country[]) => this.countries = countries);
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
    return this.profile.client.customerId;
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
  get istransNoValid() {
    return !this.transNoHasErrors && this.isTouched('transNo');
  }
  get istransNoInvalid() {
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
  public get isCurrencyValid() {
    return !this.currencyHasErrors && this.isTouched('currency');
  }
  public get isCurrencyInvalid() {
    return this.currencyHasErrors && this.isTouched('currency');
  }
  public get currencyHasErrors() {
    return (this.hasCurrencyRequiredError || this.hasCurrencyDefaultError);
  }
  public get hasCurrencyRequiredError() {
    return this.isInValid('currency', 'required')
  }
  public get hasCurrencyDefaultError() {
    return this.isInValid('currency', 'defaultValue') && !this.hasCurrencyRequiredError;
  }
  //amount
  public get isAmountValid() {
    return !this.hasAmountRequiredError && this.isTouched('amount');
  }
  public get isAmountInvalid() {
    return this.hasAmountRequiredError && this.isTouched('amount');
  }
  public get hasAmountRequiredError() {
    return this.isInValid('amount', 'required')
  }
  public confirmPayment(form) {
    const payment: Payment = this.getPayment(form);
    this.paymentService.confirm(payment).subscribe(response => {
      if (response.code == 400)
        this.notify.error(response.message)
      else {
        this.notify.info('Payment has been confirmed.');
        this.form.reset();
      }
    }, error => {
      if (error.status == 400)
        this.notify.error(error.error.message)
      else
        this.notify.error('Something happened.');
    });
  }
  private getPayment(form): Payment {
    const productName = this.getUnitsProduct(this.profile.client.country);
    const productType = ProductType.SMS;
    const paymentType = this.paymentType;
    const email = this.userEmail;
    const currency = form.currency;
    const amount = form.amount;
    const mpesaNo = form.transNo;
    const senderId = '';
    const payment: Payment = new Payment(productName, productType, paymentType, email, currency,
      amount, mpesaNo, senderId);
    return payment;
  }
  private getUnitsProduct(country: Country_): UnitsProduct {
    const name = country.name;
    if (name == 'RWANDA')
      return UnitsProduct.SMS_RW;
    if (name == 'KENYA')
      return UnitsProduct.SMS_KE;
    if (name == 'TANZANIA')
      return UnitsProduct.SMS_TZ;
    if (name == 'UGANDA')
      return UnitsProduct.SMS_UG;
    return null;
  }
}