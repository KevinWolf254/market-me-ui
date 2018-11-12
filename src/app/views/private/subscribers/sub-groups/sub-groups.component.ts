import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { groupNameValidator } from '../../../../providers/validators/validators';
import { GroupService } from '../../../../providers/services/group.service';

@Component({
  selector: 'app-sub-groups',
  templateUrl: './sub-groups.component.html',
  styleUrls: ['./sub-groups.component.scss']
})
export class SubGroupsComponent implements OnInit {

  public entriesPerPage: number;
  public perPageNos: number[] = [10, 25, 50, 100];
  public tempContacts: any[] = [];

  public isCreatingGroup: boolean = false;
  public isDeletingGroup: boolean = false;

  public groups: any[] = [];  
  public createForm: FormGroup;
  public deleteForm: FormGroup;
  
  public groupContacts: any[] = [];
  private removeModal: NgbModalRef;

  public removeContact: any = null;
  public removeRow: number;

  public selectedGroupId: number = 0;
  public selectedGroup: any;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc', pagerLeftArrow: 'fa fa-chevron-left', 
    pagerRightArrow: 'fa fa-chevron-right', pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };

  constructor(private _fb: FormBuilder, private modalService: NgbModal, private notify: ToastrService,
    groupService: GroupService) { 
    this.createForm = _fb.group({
      'name': ['',Validators.compose([Validators.required, groupNameValidator(groupService)])]
    });
    this.deleteForm = _fb.group({
      'group': ['0']
    });
  }

  ngOnInit() {    
    this.getGroups();
    this.entriesPerPage = this.perPageNos[0];
  } 
  public isInValid(input: string, error: string): boolean {
    return this.createForm.controls[input].hasError(error);
  }
  public isTouched(input: string): boolean {
    return this.createForm.controls[input].touched;
  }
  get isCreateFormInvalid(){
    return this.createForm.invalid;
  }
  public get isNameInvalid(): boolean {
    return (this.hasRequiredError || this.hasExistError) && this.isTouched('name')
  }
  get hasRequiredError(){
    return this.isInValid('name', 'required')
  }
  get hasExistError(){
    return this.isInValid('name', 'exists');
  }
  private getGroups() {
    // this.groupService.getGroups().subscribe(response => {
    //   this.groups = response;
    // });
  }

  public searchContact(event) {
    // let searchParam = event.target.value.toLowerCase();
    // // filter our data
    // let tempContacts = this.tempContacts.filter((contact: ContactDetails) => {
    //   return contact.number.indexOf(searchParam) !== -1 || !searchParam;
    // });
    // // update the rows
    // this.groupContacts = tempContacts;
    // // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  public createGroup(form) {
    this.isCreatingGroup = true;
    // this.groupService.saveGroup(form.name).subscribe(
    //   (response: any) => {
    //     this.createForm.reset();
    //     this.isCreatingGroup = false;
    //     this.notify.success(response.message, response.title);
    //   }, error => {
    //     this.isCreatingGroup = false;
    //     this.notify.error(error.error.error_description, error.error.error);        
    //   }
    // ); 
  }

  public getContactsOfGroup(event){
    this.selectedGroupId = event.target.value;
    // this.groupService.getContactsOfGroup(this.selectedGroupId).subscribe(
    //   (response: any) => {
    //     this.groupContacts = response;
    //     //initialize the selected group
    //     this.selectedGroup = this.groups.find(group => {
    //       return group.id == this.selectedGroupId;
    //     })
    //     // cache our clients
    //     this.tempContacts = [...this.groupContacts];
    //     this.groups
    //   }, error => {
    //     this.notify.error(error.error);        
    //   }
    // );
  }

  public openRemoveClientDialog(removeModal, contact: any, rowIndex){
    // this.removeContact = new ContactDetails(contact.id, contact.code, 
    //   contact.number, contact.teleCom);
    // this.removeRow = rowIndex;
    // this.removeModal = this.modalService.open(removeModal);
  }

  public changeEntriesPerPage(event){
    this.entriesPerPage = event.target.value;
  }

  public removeContactFromGroup(){    
    this.groupContacts.splice(this.removeRow, 1);
    // this.contactService.removeContactFromGroup(this.removeContact.id, this.selectedGroup.id).subscribe(
    //   (response: any) => {
    //     this.notify.success(response.message, response.title);
    //   }, error =>{
    //     this.notify.error(error.error);        
    //   }
    // );
    this.groupContacts = [...this.groupContacts];
    this.tempContacts = [...this.groupContacts];
    this.removeModal.close(); 
  }
  public deleteGroup(form){
    // this.groupService.deleteGroup(form.group).subscribe(
    //   (response:any) => {
    //     this.getGroups();
    //     this.notify.success(response.message, response.title);
    //   }, error =>{
    //     this.notify.error(error.error);        
    //   }
    // );
  }
}
