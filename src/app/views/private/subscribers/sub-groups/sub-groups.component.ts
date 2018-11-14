import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { groupNameValidator, selectValidator } from '../../../../providers/validators/validators';
import { GroupService } from '../../../../providers/services/group.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Group, Subscriber_ } from '../../../../models/models.model';
import { SubscriberService } from '../../../../providers/services/subscriber.service';

@Component({
  selector: 'app-sub-groups',
  templateUrl: './sub-groups.component.html',
  styleUrls: ['./sub-groups.component.scss']
})
export class SubGroupsComponent implements OnInit {

  public entriesPerPage: number;
  public perPageNos: number[] = [10, 25, 50, 100];
  public tempSubscribers: any[] = [];

  public isCreatingGroup: boolean = false;
  public isDeletingGroup: boolean = false;

  public groups: any[] = [];
  public createForm: FormGroup;
  public deleteForm: FormGroup;

  public subscribers: Subscriber_[] = [];
  groupToDelete: Group;
  private modal: NgbModalRef;

  public removeContact: any = null;
  public removeRow: number;

  public selectedGroupId: number = 0;
  public selectedGroup: any;
  notExists: boolean;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc', pagerLeftArrow: 'fa fa-chevron-left',
    pagerRightArrow: 'fa fa-chevron-right', pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };

  constructor(private _fb: FormBuilder, private modalService: NgbModal, private notify: ToastrService,
    private groupService: GroupService, private subscriberService: SubscriberService) {
    this.createForm = _fb.group({
      'name': ['', Validators.compose([Validators.required])]
    });
    this.deleteForm = _fb.group({
      'group': ['0', selectValidator]
    });
  }

  ngOnInit() {
    this.getGroups();
    this.entriesPerPage = this.perPageNos[0];
    this.createForm.get('name').valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      let group = this.groupService.getGroup(value).pipe(
        map((group: Group) => group)
      ).subscribe(group => {
        this.notExists = group == null
      });
    });
    this.getSubscribersByGroupId();
  }
  public isInValid(input: string, error: string): boolean {
    return this.createForm.controls[input].hasError(error);
  }
  public isTouched(input: string): boolean {
    return this.createForm.controls[input].touched;
  }
  get isCreateFormInvalid() {
    return this.createForm.invalid;
  }
  public get isNameInvalid(): boolean {
    return this.hasRequiredError && this.isTouched('name')
  }
  get hasRequiredError() {
    return this.isInValid('name', 'required')
  }
  get isDeletionInvalid() {
    return this.deleteForm.get('group').invalid;
  }
  private getGroups() {
    this.groupService.groups.subscribe(groups => {
      this.groups = groups;
    });
  }

  public createGroup(form) {
    this.isCreatingGroup = true;
    this.groupService.save(form.name).subscribe(
      (response: any) => {
        this.createForm.reset();
        this.isCreatingGroup = false;
        this.notify.success(response.message, response.title);
      }, error => {
        this.isCreatingGroup = false;
        this.notify.error(error.error.error_description, error.error.error);
      }
    );
  }
  openDeleteModal(modal, form) {
    this.groupToDelete = this.groups.find(group => group.id == form.group);
    this.modal = this.modalService.open(modal);
  }
  public delete(form) {
    this.groupService.delete(form.group).subscribe(response => {
      this.getGroups();
      this.notify.success('Deleted');
    }, error => {
      this.notify.error(error.error);
    }
    );
  }
  getSubscribersByGroupId() {
    this.deleteForm.get('group').valueChanges.pipe(map(id => id))
      .subscribe(id => {
        if (id == 0)
          this.subscribers = [];
        else
          this.getSubscribers(id);
      });
  }
  private getSubscribers(id: any) {
    this.subscriberService.getByGroupId(id).subscribe(subscribers => {
      this.subscribers = subscribers;
      // cache our clients
      this.tempSubscribers = [...this.subscribers];
    });
  }

  public search(event) {
    let searchParam = event.target.value.toLowerCase();
    // filter our data
    let subscriber = this.tempSubscribers.filter((subscriber: Subscriber_) => {
      return subscriber.number.indexOf(searchParam) !== -1 || !searchParam;
    });
    // update the rows
    this.subscribers = subscriber;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  public changeEntriesPerPage(event) {
    this.entriesPerPage = event.target.value;
  }

  public removeContactFromGroup() {
    // this.groupContacts.splice(this.removeRow, 1);
    // this.contactService.removeContactFromGroup(this.removeContact.id, this.selectedGroup.id).subscribe(
    //   (response: any) => {
    //     this.notify.success(response.message, response.title);
    //   }, error =>{
    //     this.notify.error(error.error);        
    //   }
    // );
    // this.groupContacts = [...this.groupContacts];
    // this.tempContacts = [...this.groupContacts];
    // this.removeModal.close(); 
  }
}
