import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../../models/models.model';
import { Role } from '../../../../models/enums.model';
import { UserService } from '../../../../providers/services/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {

  public userForm: FormGroup;
  public roles: string[] = [];
  public isCreating: boolean = false;

  constructor(private _fb: FormBuilder, private userService: UserService, private notify: ToastrService) {
    this.userForm = _fb.group({
      'surname': [null], 
      'otherNames': [null],
      'role': ['0', Validators.compose([Validators.required])],
      'email': [null,Validators.compose([Validators.required, Validators.email])],
      'defaultPass': [null,Validators.compose([Validators.required, Validators.minLength(4)])]
    });
   }

  ngOnInit() {
    this.roles = [Role.ADMIN, Role.USER];
  }

  public createUser(form){
    this.isCreating = true;
    this.userService.save(form.surname, form.otherNames, form.email, form.role, form.defaultPass).subscribe(
      response =>{ 
        this.notify.success('Created successfully');       
        this.userForm.reset();
        this.userForm.get("role").setValue(0);
        this.isCreating = false;
      },error =>{
        if(error.status == 400)
          this.notify.error(error.message);
        else
          this.notify.error("something went wrong. could not complete request");
        this.isCreating = false;
      }
    );
  }
}
