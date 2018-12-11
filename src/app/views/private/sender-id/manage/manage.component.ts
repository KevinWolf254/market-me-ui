import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { selectValidator, senderIdNameValidator } from '../../../../providers/validators/validators';
import { SenderIdService } from '../../../../providers/services/sender-id.service';

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

  constructor(private _fb: FormBuilder, private _senderIdService: SenderIdService) {
    this.form = _fb.group({
      'type': ['', Validators.required],
      'details': this._fb.array([])
    });
  }

  ngOnInit() {
    this.form.get('type').valueChanges.subscribe(type => {
      if (type == 'new')
        this.senderIdDetails = this.setNew();
    });
  }

  acquire(form) {

  }
  get isTypeValid(): boolean {
    return this.form.get('type').value != '';
  }
  get isTypeNew(): boolean {
    return this.form.get('type').value == 'new';
  }
  set senderIdDetails(formGroup: FormGroup) {
    if ((<FormArray>this.form.get('details')).length >= 0)
      (<FormArray>this.form.get('details')).removeAt(0);
    (<FormArray>this.form.get('details')).push(formGroup);
  }
  private setNew(): FormGroup {
    let form: FormGroup;
    form = this._fb.group({
      'senderId': ['', Validators.compose([Validators.required, Validators.maxLength(11)]), senderIdNameValidator(this._senderIdService)],
      'country': ['0', selectValidator],
      'customerId': [''],
      'paybillNo': ['', Validators.required],
      'transNo': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      'currency': ['0', Validators.compose([Validators.required, selectValidator])],
      'amount': ['', Validators.required]
    });
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
  //sender id name
  public get isSenderIdInValid(){
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
  //country
  public get isCountryInValid(){
    return this.hasDefaultValueError && this.isArrayTouched('country');
  }
  public get hasDefaultValueError() {
    return this.isArrayInValid('country', 'defaultValue')
  }
  //transNo
  get istransNoValid() {
    return !this.transNoHasErrors && this.isArrayTouched('transNo');
  }
  get istransNoInvalid() {
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
  //currency
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
  //amount
  public get isAmountValid() {
    return !this.hasAmountRequiredError && this.isArrayTouched('amount');
  }
  public get isAmountInvalid() {
    return this.hasAmountRequiredError && this.isArrayTouched('amount');
  }
  public get hasAmountRequiredError() {
    return this.isArrayInValid('amount', 'required')
  }
  //application form
  public uploadFile(event) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    this.isFileChoosen = this.fileName != '';
  }
  public downloadForm(){
    this._senderIdService.applicationForm.subscribe(
    res =>{
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
}
