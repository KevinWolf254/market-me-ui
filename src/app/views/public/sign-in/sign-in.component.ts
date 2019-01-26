import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Role } from '../../../models/enums.model';
import { UserService } from '../../../providers/services/user.service';
import { UserReport } from '../../../models/models.model';
import { Token } from '../../../models/interfaces.model';
import { TokenService } from '../../../providers/services/token.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  public signInForm: FormGroup;
  public isSigningIn: boolean = false;
  private user: UserReport;

  constructor(private _fb: FormBuilder, private _router: Router, private _notify: ToastrService,
    private _userService: UserService, private _tokenService: TokenService) {
    this.signInForm = this._fb.group({
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'password': [null, Validators.required]
    });
  }

  ngOnInit() {}

  public isTouched(input: string): boolean {
    return this.signInForm.controls[input].touched;
  }
  public isInValid(input: string, error: string): boolean {
    return this.signInForm.controls[input].hasError(error);
  }
  public get isEmailInvalid() {
    return this.emailHasError && this.isTouched('email')
  }
  public get emailHasError() {
    return this.isInValid('email', 'required') || this.isInValid('email', 'email')
  }
  public get isPasswordInvalid() {
    return this.isInValid('password', 'required') && this.isTouched('password')
  }
  public signIn(form) {
    this.isSigningIn = true;
    this._tokenService.getJsonToken(form.email, form.password).subscribe(
      (jsonToken: Token) => {
        if (jsonToken != null || jsonToken != undefined) {
          localStorage.setItem('accessToken', jsonToken.access_token);
          this.routeTo();
        }
      }
    );
  }
  public routeTo() {
    this._userService.getUserProfile().pipe(
      map((profile: UserReport) => {
        let admin = profile.roles.find(role => {
          return role.role == Role.ADMIN;
        });
        this.user = profile;
        return !(admin == null || admin == undefined);
      })
    ).subscribe(isAdmin => {
      isAdmin ? this._router.navigate(['/bulksms/dashboard']) :
        this._router.navigate(['/bulksms/profile'])
        this._notify.success('Welcome: ' + this.user.user.otherNames + ' ' + this.user.user.surname);
        this.isSigningIn = false;
      });
  }
}