import { Component, OnInit, VERSION } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CountryService } from '../../../providers/services/country.service';
import { Country } from '../../../models/models.model';
import { UserService } from '../../../providers/services/user.service';
import { confirmPasswordValidator } from '../../../providers/validators/confirm-password-validator';
import { countryValidator } from '../../../providers/validators/select-validator';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signUpForm: FormGroup;
  public isSigningUp: boolean = false;
  public countries = [];
  public version = VERSION.full;

  constructor(private _fb: FormBuilder, private router: Router, private notify: ToastrService,
    private cService: CountryService, private uService: UserService) {
    this.signUpForm = _fb.group({
      'surname': [null, Validators.required],
      'otherNames': [null],
      'country': ['4', countryValidator],
      'code': ['4', countryValidator],
      'phoneNo': [null, Validators.required],
      'organisation': [null, Validators.required],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'newPass': [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      'confirm_password': [null, Validators.compose([Validators.required, confirmPasswordValidator])],
      'recaptchaReactive': [null, Validators.required]
    });
  }

  ngOnInit() {
    this.cService.getCountries().subscribe(
      (response: any) => {
        response.forEach((country: Country) => {
          this.countries.push(country);
        });
      }, error => {
        console.log(error);
      }
    );
  }

  public signUp(form) {
    this.isSigningUp = true;

    this.uService.signUp(form.surname, form.otherNames, form.country.toUpperCase(), form.code,
      form.phoneNo, form.organisation, form.email, form.newPass).subscribe(
        (response) => {
          this.isSigningUp = false;
          this.router.navigate(['signIn']);
          this.notify.success('' + response.message);
        }, error => {
          this.notify.error('Error: ' + error.error.error_description);
          this.isSigningUp = false;
        }
      );
  }

}
