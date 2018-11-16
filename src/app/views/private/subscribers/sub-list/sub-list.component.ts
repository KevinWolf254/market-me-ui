import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../../../../providers/services/group.service';
import { selectValidator, countryCodeValidator, phoneNoValidator } from '../../../../providers/validators/validators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CountryService } from '../../../../providers/services/country.service';
import { Country } from '../../../../models/interfaces.model';
import { Group, Subscriber_ } from '../../../../models/models.model';
import { SubscriberService } from '../../../../providers/services/subscriber.service';

@Component({
  selector: 'app-sub-list',
  templateUrl: './sub-list.component.html',
  styleUrls: ['./sub-list.component.scss']
})
export class SubListComponent implements OnInit {

  public groups: any[] = [];
  public form: FormGroup;
  public fileForm: FormGroup;

  public countries = [];
  public codes: string[] = [];
  public isCodeNonExistant: boolean;

  public isAddingSingle: boolean = false;
  public file: File;
  public fileName: string = '';
  public isFileChoosen: boolean = false;
  public isAddingMultiple: boolean = false;


  constructor(private _fb: FormBuilder, private notify: ToastrService, private groupService: GroupService,
    private countryService: CountryService, private subscriberService: SubscriberService) {
    this.form = _fb.group({
      'group': ['0', Validators.compose([Validators.required, selectValidator])],
      'code': ['', Validators.compose([Validators.required, countryCodeValidator])],
      'phoneNo': ['', Validators.compose([Validators.required, phoneNoValidator])]
    });
    this.fileForm = _fb.group({
      'group': ['0', Validators.compose([Validators.required, selectValidator])]
    });
  }

  ngOnInit() {
    this.getGroups();
    this.countryService.getCountries().subscribe(
      (response: any) => {
        response.forEach((country: Country) => {
          this.countries.push(country);
          this.codes.push(country.callingCodes[0]);
        });
      }
    );
    //observe country code for valid country code
    this.form.get('code').valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(
      value => {
        this.isCodeNonExistant = this.codeExists(value)
      }
    )
  }
  private getGroups() {
    this.groupService.groups.subscribe(groups => this.groups = groups);
  }
  public codeExists(code: string): boolean {
    return this.codes.includes(code);
  }
  public getFormValue(formAttribute: string) {
    return this.form.get(formAttribute).value
  }
  public isTouched(inputField: string): boolean {
    return this.form.controls[inputField].touched;
  }
  public isInValid(inputField: string, error: string): boolean {
    return this.form.controls[inputField].hasError(error);
  }
  public get isGroupSelectInvalid() {
    return this.groupSelectHasErrors && this.isTouched('group')
  }
  public get groupSelectHasErrors() {
    return (this.hasGroupRequiredError || this.hasDefaultValueError);
  }
  public get hasGroupRequiredError() {
    return this.isInValid('group', 'required');
  }
  public get hasDefaultValueError() {
    return this.isInValid('group', 'defaultValue');
  }
  public get isCodeInvalid() {
    return this.codeHasErrors && this.isTouched('code')
  }
  public get codeHasErrors() {
    return (this.hasCodeRequiredError || this.hasCodeFormatError);
  }
  public get hasCodeRequiredError() {
    return this.isInValid('code', 'required')
  }
  public get hasCodeFormatError() {
    return this.isInValid('code', 'notMatch') && !this.hasCodeRequiredError
  }
  public get isCodeValueInvalid() {
    return (!this.codeHasErrors && this.isCodeNonExistant);
  }
  public get isPhoneNoInvalid() {
    return this.phoneNoHasErrors && this.isTouched('phoneNo')
  }
  public get phoneNoHasErrors() {
    return (this.hasPhoneNoRequiredError || this.hasPhoneNoFormatError);
  }
  public get hasPhoneNoRequiredError() {
    return this.isInValid('phoneNo', 'required')
  }
  public get hasPhoneNoFormatError() {
    return this.isInValid('phoneNo', 'notMatch') && !this.hasPhoneNoRequiredError
  }
  public get isFormValid() {
    return (this.form.valid && !this.isCodeNonExistant);
  }
  public addSubscriber(form) {
    this.isAddingSingle = true;
    const subscriber = new Subscriber_(form.code, form.phoneNo);
    this.saveSubscriber(form.group, subscriber);
  }
  public saveSubscriber(groupId: number, subscriber: Subscriber_) {
    this.subscriberService.save(groupId, subscriber).subscribe(
      (response: any) => {
        this.resetAddSingleForm();
        this.isAddingSingle = false;
        this.notify.success("Suscriber added succesfully");
      }, error => {
        this.isAddingSingle = false;
        if (error.status == 400)
          this.notify.error(error.message);
        else
          this.notify.error(error.error.message);
      }
    );
  }
  private resetAddSingleForm() {
    this.form.get('group').reset('0')
    this.form.get('code').reset('')
    this.form.get('phoneNo').reset('')
  }
  // multiple
  public isMultipleSelectTouched(inputField: string): boolean {
    return this.fileForm.controls[inputField].touched;
  }
  public isMultipleInValid(inputField: string, error: string): boolean {
    return this.fileForm.controls[inputField].hasError(error);
  }
  public get isMultipleSelectInvalid() {
    return this.multipleSelectHasErrors && this.isMultipleSelectTouched('group')
  }
  public get multipleSelectHasErrors() {
    return (this.hasMultipleRequiredError || this.hasMultipleDefaultValueError);
  }
  public get hasMultipleRequiredError() {
    return this.isMultipleInValid('group', 'required');
  }
  public get hasMultipleDefaultValueError() {
    return this.isMultipleInValid('group', 'defaultValue');
  }
  public uploadFile(event) {
    this.file = event.target.files[0];
    let isRightFormat = this.file.type == 'text/csv';
    this.fileName = this.file.name;
    if (this.fileName && isRightFormat)
      this.isFileChoosen = true;
    else
      this.isFileChoosen = false;
  }
  get isFileChoosenInvalid() {
    return (this.fileForm.invalid || !this.isFileChoosen);
  }
  public addMultiple() {
    this.isAddingMultiple = true;
    let groupId = this.fileForm.get('group').value;
    this.subscriberService.addMultiple(this.file, groupId).subscribe(
      (response: any) => {
        this.isAddingMultiple = false;
        this.resetMultipleForm();
        this.notify.success("Successfully added subscribers");
        this.isFileChoosen = false;
      }, error => {
        this.notify.error("Something happened!");
        this.isAddingMultiple = false;
      }
    );
  }
  private resetMultipleForm() {
    this.fileName = '';
    this.fileForm.get("group").reset('0');
  }
}
