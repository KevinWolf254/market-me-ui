import { Component, OnInit, VERSION } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CountryService } from '../../../providers/services/country.service';
import { UserService } from '../../../providers/services/user.service';
import { countryValidator, confirmPasswordValidator, passwordValidator } from '../../../providers/validators/validators';
import { Country } from '../../../models/interfaces.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signUpForm: FormGroup;
  public isSigningUp: boolean = false;
  public countries = [];
  codes: string[] = [];
  isCodeNonExistant: boolean;
  public version = VERSION.full;
  phoneNoPattern: string = '^[7]\d{8}$'
  codePattern: string = '^[+2]\d{2}$'

  constructor(private _fb: FormBuilder, private router: Router, private notify: ToastrService,
    private countryService: CountryService, private uService: UserService) {
    this.signUpForm = _fb.group({
      'surname': ['', Validators.required],
      'otherNames': [''],
      'country': ['4', countryValidator],
      // 'code': ['4', countryValidator],
      'code': ['', Validators.compose([Validators.required, Validators.pattern(this.codePattern)])],
      'phoneNo': ['', Validators.compose([Validators.required, Validators.pattern(this.phoneNoPattern)])],
      'organisation': ['', Validators.required],
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'password': ['', Validators.compose([Validators.required, passwordValidator])],
      'confirmPassword': ['', Validators.compose([Validators.required, confirmPasswordValidator])],
      'recaptchaReactive': [null, Validators.required]
    });
  }

  ngOnInit() {
    this.countryService.getCountries().subscribe(
      (response: any) => {
        response.forEach((country: Country) => {
          this.countries.push(country);
          console.log("Code: "+country.callingCodes)
          this.codes.push(country.callingCodes[0]);
        });
      }
    );
    //observe country code for valid country code
    this.signUpForm.get('code').valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(
      value=>{
        console.log("Selected code: "+value)
        this.isCodeNonExistant = this.codeExists(value)
      }
    )
  }
  codeExists(code: string): boolean{
    return this.codes.includes(code);
  }
  public getFormValue(formAttribute: string) {
    return this.signUpForm.get(formAttribute).value
  }
  public isTouched(input: string): boolean {
    return this.signUpForm.controls[input].touched;
  }
  public isInValid(input: string, error: string): boolean {
    return this.signUpForm.controls[input].hasError(error);
  }
  get isSurnameInvalid() {
    return this.isInValid('surname', 'required') && this.isTouched('surname')
  }
  get isOrgInvalid() {
    return this.isInValid('organisation', 'required') && this.isTouched('organisation')
  }
  get isCountryInvalid() {
    return this.isInValid('country', 'defaultValue') && this.isTouched('country')
  }
  get isCodeInvalid() {
    return  this.codeHasErrors && this.isTouched('code')
  }
  get codeHasErrors(){
    return (this.isInValid('code', 'required') || this.isInValid('code', 'pattern'));
  }
  get isPhoneNoInvalid() {
    return  this.phoneNoHasErrors && this.isTouched('phoneNo')
  }
  get phoneNoHasErrors(){
    return (this.isInValid('phoneNo', 'required') || this.isInValid('phoneNo', 'pattern'));
  }
  get isEmailInvalid() {
    return  this.emailHasErrors && this.isTouched('email')
  }
  get emailHasErrors(){
    return (this.isInValid('email', 'required') || this.isInValid('email', 'email'));
  }
  get isPasswordInvalid() {
    return  this.passwordHasErrors && this.isTouched('password')
  }
  get passwordHasErrors(){
    return (this.isInValid('password', 'required') || this.isInValid('password', 'isNotStrong'));
  }
  get passwordStengthInvalid(){
    return (!this.isInValid('password', 'required') && this.isInValid('password', 'isNotStrong') && this.isTouched('password'));
  }
  get isConfirmPasswordInvalid() {
    return  this.confirmPasswordHasErrors && this.isTouched('confirmPassword')
  }
  get confirmPasswordHasErrors(){
    return (this.isInValid('confirmPassword', 'required') || this.isInValid('confirmPassword', 'notMatch'));
  }
  public signUp(form) {
    this.isSigningUp = true;
    this.uService.signUp(form.surname, form.otherNames, form.country.toUpperCase(), form.code,
      form.phoneNo, form.organisation, form.email, form.password).subscribe(
        (response) => {
          this.isSigningUp = false;
          this.router.navigate(['signIn']);
          this.notify.success(response.message);
        }, error => {
          this.notify.error(error.error.error_description);
          this.isSigningUp = false;
        }
      );
  }

}