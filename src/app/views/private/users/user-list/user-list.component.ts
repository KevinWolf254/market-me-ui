import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../../providers/services/user.service';
import { UserReport, Report } from '../../../../models/models.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Role } from '../../../../models/enums.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  public form: FormGroup;
  public isEditing = false;

  public users: UserReport[] = [];
  public editRolesArray: string[] = [];
  public selected = '';

  public deleteUser: UserReport;
  public deleteUserEmail: string = '';
  public deleteRow: number = null;

  public allRoles: string[] = [];

  public perPage: number;
  public perPageNos: number[] = [10, 25, 50, 100];
  public modalRef: NgbModalRef;

  public temp = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // Custom icons for ngx-datatable
  public customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc', pagerLeftArrow: 'fa fa-chevron-left',
    pagerRightArrow: 'fa fa-chevron-right', pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };

  constructor(private _fb: FormBuilder, private modalService: NgbModal, private userService: UserService,
    private notify: ToastrService) {
    this.form = _fb.group({
      'surname': [null, Validators.required],
      'otherNames': [null],
      'role': [''],
      'status':[null, Validators.required],
      'email': [null, Validators.required]
    });
  }

  ngOnInit() {
    this.getUsers();
    this.allRoles = [Role.ADMIN, Role.USER];
    this.perPage = this.perPageNos[0];
  }
  private getUsers() {
    this.userService.users.subscribe(users => this.users = users);
  }
  public surname(row: UserReport) {
    return row.user.surname
  }
  public email(row: UserReport) {
    return row.user.email
  }
  public otherNames(row: UserReport) {
    return row.user.otherNames
  }
  public roles(row: UserReport) {
    let my_roles: string[] = this.rolesArray(row);
    let myRoles = '';
    for(let i = 0; i <= my_roles.length - 1; i++){
      myRoles = myRoles.concat(my_roles[i]);
      if(i != my_roles.length-1)
        myRoles = myRoles.concat(', ')
    }
    return myRoles;
  }
  public rolesArray(row: UserReport){
    let my_roles: string[] = [];
    row.roles.forEach(role=>{
      my_roles.push(role.role.toString());
    })
    return my_roles;
  }

  public acntStatus(row: UserReport) {
    return row.credentials.enabled
  }

  public edit(modal, details: UserReport) {
    this.form.get('surname').setValue(details.user.surname);
    this.form.get('otherNames').setValue(details.user.otherNames);
    this.form.get('status').setValue(details.credentials.enabled);
    this.form.get('email').setValue(details.user.email);
    this.editRolesArray = this.rolesArray(details);
    this.modalRef = this.modalService.open(modal);
  }

  public delete(modal, details: UserReport, rowIndex) {
    this.deleteUser = details;

    this.deleteUserEmail = details.user.email;
    this.deleteRow = rowIndex;
    this.modalRef = this.modalService.open(modal);
  }

  public selectedRole(event){
    this.selected = event.target.value
  }

  public addRole(){
    let exist = this.editRolesArray.find(myrole=> myrole == this.selected)
    if(exist == null || exist == undefined)
      this.editRolesArray.push(this.selected);
    else
      this.notify.warning('User already has that role');
    this.form.get("role").setValue('');
  }

  public deleteRole(role: Role){
    if(this.editRolesArray.length == 1)
      this.notify.warning('User must have at least one role ');
    else
      this.editRolesArray = this.editRolesArray.filter(myrole=> {return role != myrole});
  }

  public confirm() {
    this.userService.delete(this.deleteUserEmail).subscribe(
      (response: Report) =>{             
        this.modalRef.close();
        this.users.splice(this.deleteRow, 1);
        this.users = [...this.users];
        this.notify.success(response.message);
      },error=>{
        if(error.status == 400)
          this.notify.error(error.message);
        else
          this.notify.error("something went wrong. could not complete request");
      }
    );
  }

  public update(form){
    this.isEditing = true;
    this.userService.update(form.surname, form.otherNames, form.status, form.email, this.editRolesArray).subscribe(
      result=>{
        this.getUsers();
      },error =>{
        if(error.status == 400)
          this.notify.error(error.message);
        else
          this.notify.error("something went wrong. could not complete request");
        this.isEditing = false;
      }
    );
  }

  public set pageEntries(event) {
    this.perPage = event.target.value;
  }
  
  public search(event) {
    let searchParam = event.target.value.toLowerCase();
    // filter our data
    let temp = this.temp.filter(user => {
      return user.email.toLowerCase().indexOf(searchParam) !== -1 || !searchParam;
    });
    // update the rows
    this.users = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
