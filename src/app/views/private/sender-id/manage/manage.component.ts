import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { selectValidator, senderIdNameValidator } from '../../../../providers/validators/validators';
import { SenderIdService } from '../../../../providers/services/sender-id.service';
import { UserReport, SenderId, SenderIdRequest } from '../../../../models/models.model';
import { UserService } from '../../../../providers/services/user.service';
import { Country_ } from '../../../../models/interfaces.model';
import { CountryService } from '../../../../providers/services/country.service';
import { ToastrService } from 'ngx-toastr';
import { SenderIdProduct } from '../../../../models/enums.model';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {
  public form: FormGroup;
  public file: File;
  public fileName: string = '';
  public isFileChoosen: boolean = false;
  public profile: UserReport = new UserReport();
  public countries: Country_[] = [];
  public senderIds: SenderId[] = [];

  constructor(private _fb: FormBuilder, private _senderIdService: SenderIdService,
    private _userService: UserService, private _countryService: CountryService, private _alert: ToastrService) {
    this.form = _fb.group({
      'type': ['', Validators.required],
      'details': this._fb.array([])
    });
  }

  ngOnInit() {
    //monitors selected option for sender id 
    this.form.get('type').valueChanges.subscribe(type => this.senderIdDetails = this.addDetailsFormGroup());
    //retrieves and observes user profile
    this._userService.profileObserver.subscribe(profile => this.profile = profile);
    //retrieves country list
    this._countryService.myCountries.subscribe(countries => this.countries = countries);
    //retrieves sender ids acquired by the company
    this._senderIdService.getSenderIdsByCompanyId(this.profile.client.id).subscribe(senderIds => this.senderIds = senderIds);
  }
  public get isTypeValid(): boolean {
    return this.form.get('type').value != '';
  }
  public get isTypeNew(): boolean {
    return this.form.get('type').value == 'new';
  }
  private set senderIdDetails(formGroup: FormGroup) {
    if ((<FormArray>this.form.get('details')).length >= 0)
      (<FormArray>this.form.get('details')).removeAt(0);
    (<FormArray>this.form.get('details')).push(formGroup);
  }
  private addDetailsFormGroup(): FormGroup {
    let form: FormGroup;
    form = this._fb.group({
      'country': ['0', selectValidator],
      'customerId': [''],
      'paybillNo': [''],
      'transNo': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      'currency': ['0', Validators.compose([Validators.required, selectValidator])],
      'amount': ['', Validators.required]
    });
    if (this.isTypeNew)
      form.addControl('senderId', new FormControl('', Validators.compose([Validators.required, Validators.maxLength(11)]), senderIdNameValidator(this._senderIdService)));
    else
      form.addControl('senderId', new FormControl('0', selectValidator));
    return form;
  }
  public isTouched(inputField: string): boolean {
    return this.form.controls[inputField].touched;
  }
  public isInValid(inputField: string, error: string): boolean {
    return this.form.controls[inputField].hasError(error);
  }
  public isArrayInValid(input: string, error: string): boolean {
    return (<FormGroup>(<FormArray>this.form.get('details')).controls[0]).controls[input].hasError(error);
  }
  public isArrayTouched(input: string): boolean {
    return (<FormGroup>(<FormArray>this.form.get('details')).controls[0]).controls[input].touched;
  }
  //new sender id name
  public get isSenderIdInValid() {
    return this.senderIdHasErrors && this.isArrayTouched('senderId');
  }
  public get senderIdHasErrors() {
    return (this.hasSenderIdRequiredError || this.hasSenderIdExistError);
  }
  public get hasSenderIdRequiredError() {
    return this.isArrayInValid('senderId', 'required')
  }
  public get hasSenderIdExistError() {
    return this.isArrayInValid('senderId', 'exists')
  }
  //new country
  public get isCountryInValid() {
    return this.hasDefaultValueError && this.isArrayTouched('country');
  }
  public get hasDefaultValueError() {
    return this.isArrayInValid('country', 'defaultValue')
  }
  //new account info
  public get businessNo() {
    return 518654;
  }
  public get accountNo() {
    return this.profile.client.customerId;
  }
  //new transNo
  public get istransNoValid() {
    return !this.transNoHasErrors && this.isArrayTouched('transNo');
  }
  public get isTransNoInvalid() {
    return this.transNoHasErrors && this.isArrayTouched('transNo');
  }
  public get transNoHasErrors() {
    return (this.hasTransNoRequiredError || this.hasTransNoMinError || this.hasTransNoMaxError);
  }
  public get hasTransNoRequiredError() {
    return this.isArrayInValid('transNo', 'required')
  }
  public get hasTransNoMinError() {
    return this.isArrayInValid('transNo', 'minlength') && !this.hasTransNoRequiredError
  }
  public get hasTransNoMaxError() {
    return this.isArrayInValid('transNo', 'maxlength') && !this.hasTransNoRequiredError
  }
  //new currency
  public get isCurrencyValid() {
    return !this.currencyHasErrors && this.isArrayTouched('currency');
  }
  public get isCurrencyInvalid() {
    return this.currencyHasErrors && this.isArrayTouched('currency');
  }
  public get currencyHasErrors() {
    return (this.hasCurrencyRequiredError || this.hasCurrencyDefaultError);
  }
  public get hasCurrencyRequiredError() {
    return this.isArrayInValid('currency', 'required')
  }
  public get hasCurrencyDefaultError() {
    return this.isArrayInValid('currency', 'defaultValue') && !this.hasCurrencyRequiredError;
  }
  //new amount
  public get isAmountValid() {
    return !this.hasAmountRequiredError && this.isArrayTouched('amount');
  }
  public get isAmountInvalid() {
    return this.hasAmountRequiredError && this.isArrayTouched('amount');
  }
  public get hasAmountRequiredError() {
    return this.isArrayInValid('amount', 'required')
  }
  //new selected currency and amount
  public get selectedCurrency(): string {
    return (<FormGroup>(<FormArray>this.form.get('details')).controls[0]).controls['currency'].value;
  }
  public get selectedAmount(): number {
    return (<FormGroup>(<FormArray>this.form.get('details')).controls[0]).controls['amount'].value;
  }
  //update sender id
  public get isUpdateSenderIdValid() {
    return !this.hasSenderIdDefaultValueError && this.isArrayTouched('senderId');
  }
  public get isUpdateSenderIdInValid() {
    return this.hasSenderIdDefaultValueError && this.isArrayTouched('senderId');
  }
  public get hasSenderIdDefaultValueError() {
    return this.isArrayInValid('senderId', 'defaultValue')
  }
  public get regSenderIdCountries(): string {
    const senderId = (<FormGroup>(<FormArray>this.form.get('details')).controls[0]).controls['senderId'].value;
    const selectedSenderId: SenderId = this.senderIds.find(result => result.name = senderId);
    const countries: Country_[] = selectedSenderId.countries;
    let selectedCountries = '';
    countries.forEach((country, index) => {
      selectedCountries.concat(country.name)
      if (index != countries.length - 1)
        selectedCountries.concat(', ')
    })
    return selectedCountries;
  }
  //download senderId application form
  public downloadForm() {
    this._senderIdService.applicationForm.subscribe(
      res => {
        let url = window.URL.createObjectURL(res.data);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = res.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      });
  }
  //new application form
  public uploadFile(event) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    this.isFileChoosen = this.fileName != '';
  }
  public sendSenderIdRequest(form) {
    const product: SenderIdProduct = this.getProductName(form.country);
    const request = new SenderIdRequest(product, form.type, this.profile.user.email, 
      form.details.senderId, form.details.country, form.details.transNo, form.details.currency, 
      form.details.amount);
    // if (form.type == 'new')
      this._senderIdService.sendRequest(request).subscribe(response => {
        console.log(JSON.stringify(response));
        this._alert.success('Request received!');
        // this.sendFile();
      }, error =>{
        this._alert.error(error.error.message);
      });
    // else
    //   this._senderIdService.sendUpdateRequest(request).subscribe(response => {
    //     this._alert.success('Request received!');
    //     this.sendFile();
    //   });
  }
  private sendFile() {
    this._senderIdService.sendRequestFile(this.file).subscribe(response => {
      console.log('file was successfully received');
    });
  }
  private getProductName(country: string): SenderIdProduct {
    if (country == 'RWANDA')
      return SenderIdProduct.SENDER_ID_RW;
    if (country == 'KENYA')
      return SenderIdProduct.SENDER_ID_KE;
    if (country == 'TANZANIA')
      return SenderIdProduct.SENDER_ID_TZ;
    if (country == 'UGANDA')
      return SenderIdProduct.SENDER_ID_UG;
    return null;
  }
}
