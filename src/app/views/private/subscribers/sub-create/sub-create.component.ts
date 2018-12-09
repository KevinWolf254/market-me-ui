import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { countryCodeValidator, phoneNoValidator } from '../../../../providers/validators/validators';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CountryService } from '../../../../providers/services/country.service';
import { Country } from '../../../../models/interfaces.model';
import { SubscriberService } from '../../../../providers/services/subscriber.service';
import { GroupService } from '../../../../providers/services/group.service';
import { Group, Subscriber_ } from '../../../../models/models.model';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-sub-create',
  templateUrl: './sub-create.component.html',
  styleUrls: ['./sub-create.component.scss']
})
export class SubCreateComponent implements OnInit {

  public form: FormGroup;
  public isCreating: boolean = false;
  public isAddingClients: boolean = false;
  public isFileChoosen: boolean = false;
  public file: File;
  public fileName: string = '';

  public codes: string[] = [];
  public isCodeNonExistant: boolean;
  public countries = [];

  constructor(private _fb: FormBuilder, private notify: ToastrService,
    private countryService: CountryService, private subscriberService: SubscriberService,
    private groupService: GroupService) {
    this.form = _fb.group({
      'code': ['', Validators.compose([Validators.required, countryCodeValidator])],
      'phoneNo': ['', Validators.compose([Validators.required, phoneNoValidator])]
    });
  }

  ngOnInit() {
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
    ).subscribe(value => this.isCodeNonExistant = this.codeExists(value))
  }
  public getFormValue(formAttribute: string) {
    return this.form.get(formAttribute).value
  }
  public codeExists(code: string): boolean {
    return this.codes.includes(code);
  }
  public isTouched(inputField: string): boolean {
    return this.form.controls[inputField].touched;
  }
  public isInValid(inputField: string, error: string): boolean {
    return this.form.controls[inputField].hasError(error);
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
  public add(form) {
    this.isCreating = true;
    const code: string = form.code;
    const phone: string = form.phoneNo;
    this.groupService.getGroup('All_Subscribers').pipe(
      map((group: Group) => group.id)
    ).subscribe((id: number) => {
      const subscriber = new Subscriber_(form.code, form.phoneNo);
      this.saveSubscriber(id, subscriber);
    });
  }
  public saveSubscriber(groupId: number, subscriber: Subscriber_) {
    this.subscriberService.save(groupId, subscriber).subscribe(
      (response: any) => {
        this.form.reset();
        this.isCreating = false;
        this.notify.success("Suscriber added succesfully");
      }, error => {
        this.isCreating = false;
        if (error.status == 400)
          this.notify.error(error.message);
        else
          this.notify.error(error.error.message);
      }
    );
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

  public saveContacts() {
    this.isAddingClients = true;
    this.subscriberService.saveSubscribers(this.file).subscribe(
      (response: any) => {
        // if (response.type === HttpEventType.UploadProgress) {
        //   this.uploadProgess = Math.round(100 * response.loaded / response.total) + '%';
        // } else if (response.type === HttpEventType.Response) {
          this.isAddingClients = false;
          this.fileName = '';
          this.notify.success("Successfully added subscribers");
          this.isFileChoosen = false;
        // }
      }, error => {
        if (error.status == 500)
          this.notify.error("Could not complete request");
        else
          this.notify.error(error.error.error_description);
        this.isAddingClients = false;
      }
    );
  }
}
