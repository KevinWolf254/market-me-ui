import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Role } from '../../../models/enums.model';
import { UserService } from '../../../providers/services/user.service';
import { UserReport } from '../../../models/models.model';
import { Token } from '../../../models/interfaces.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  public signInForm: FormGroup;
  public isSigningIn: boolean = false;
  public profile: UserReport;

  public isAdmin: boolean;

  constructor(private _fb: FormBuilder, private router: Router, private notify: ToastrService,
    private userService: UserService) {
    this.signInForm = _fb.group({
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'password': [null, Validators.required]
    });
  }

  ngOnInit() {
    this.userService.profileObserver.subscribe(profile => this.profile = profile);
  }
  public isTouched(input: string): boolean {
    return this.signInForm.controls[input].touched;
  }
  public isInValid(input: string, error: string): boolean {
    return this.signInForm.controls[input].hasError(error);
  }
  get isEmailInvalid() {
    return this.emailHasError && this.isTouched('email')
  }
  get emailHasError() {
    return this.isInValid('email', 'required') || this.isInValid('email', 'email')
  }
  get isPasswordInvalid() {
    return this.isInValid('password', 'required') && this.isTouched('password')
  }
  public authenticate(form) {
    this.isSigningIn = true;
    this.userService.authenticate(form.email, form.password).subscribe(
      (token: Token) => {
        this.userService.expireTime = token.expires_in;
        this.userService.token = token.access_token;
        this.signIn();
      }, error => {
        if (error.status == 400)
          this.notify.error(error.error.error_description);
        else
          this.notify.error(error.error.message);
        this.isSigningIn = false;
      }
    );
  }
  private signIn() {
    this.userService.signIn().subscribe(
      (report: UserReport) => {
        this.isSigningIn = false;
        this.userService.isAuthenticated = true;
        this.userProfile = report;
      }
    );
  }
  private set userProfile(profile: UserReport) {
    this.userService.profile = profile;
    let admin = profile.roles.find(role => {
      return role.role == Role.ADMIN;
    });
    if (admin == null || admin == undefined)
      this.router.navigate(['/bulksms/profile']);
    else
      this.router.navigate(['/bulksms/dashboard']);
    this.notify.success('Welcome: ' + this.profile.user.otherNames + ' ' + this.profile.user.surname);
  }
}
