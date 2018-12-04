import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../providers/services/user.service';
import { UserReport } from '../../../models/models.model';
import { ToastrService } from 'ngx-toastr';
import { confirmPasswordValidator } from '../../../providers/validators/validators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
 
  public form: FormGroup;
  public changingPass: boolean = false;
  public profile: UserReport;

  constructor(private _fb: FormBuilder, private _userService: UserService, private _notify: ToastrService) { 
    this.form = _fb.group({
      'password': [null,Validators.compose([Validators.required, Validators.minLength(8)])],
      'confirm': [null,Validators.compose([Validators.required, confirmPasswordValidator])]
    });
  }

  ngOnInit() {
    this._userService.profileObserver.subscribe(profile => this.profile = profile);
  }
  public get surname(){
    return this.profile.user.surname;
  }
  public get othernames(){
    return this.profile.user.otherNames;
  }
  public get email(){
    return this.profile.user.email;
  }
  public get signInDate(){
    return this.profile.credentials.signIn;
  }
  public get roles(): string{
    let my_roles: string[] = [];
    this.profile.roles.forEach(role=>{
      my_roles.push(role.role.toString().toLowerCase());
    })
    let myRoles = '';
    for(let i = 0; i <= my_roles.length - 1; i++){
      myRoles = myRoles.concat(my_roles[i]);
      if(i != my_roles.length-1)
        myRoles = myRoles.concat(', ')
    }
    return myRoles;
  }
  public changePassword(form){
    this.changingPass = true;
    this._userService.changePassword(form.newPass).subscribe(
      (response: any)=>{  
        this.changingPass = false; 
        this._notify.success('Password was successfully changed..');   
        this.form.reset(); 
      },errror =>{        
        this.changingPass = false; 
        this._notify.error('Something wrong happened..'); 
      }
    );
  } 
}
