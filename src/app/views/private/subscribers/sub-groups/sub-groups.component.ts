import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { selectValidator } from '../../../../providers/validators/validators';
import { GroupService } from '../../../../providers/services/group.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Group, Subscriber_, UserReport } from '../../../../models/models.model';
import { SubscriberService } from '../../../../providers/services/subscriber.service';
import { SubscriberDetails } from '../../../../models/interfaces.model';
import { UserService } from '../../../../providers/services/user.service';

@Component({
  selector: 'app-sub-groups',
  templateUrl: './sub-groups.component.html',
  styleUrls: ['./sub-groups.component.scss']
})
export class SubGroupsComponent implements OnInit {

  public entriesPerPage: number;
  public perPageNos: number[] = [10, 25, 50, 100];
  public tempSubscribers: SubscriberDetails[] = [];

  public isCreatingGroup: boolean = false;
  public isDeletingGroup: boolean = false;

  public groups: Group[] = [];
  public createForm: FormGroup;
  public deleteForm: FormGroup;

  public subscribers: SubscriberDetails[] = [];
  private modal: NgbModalRef;

  public selectedGroup: Group;
  public selectedSubscriber: SubscriberDetails;
  public selectedRow: number;

  public nameExists: boolean = false;

  public profile: UserReport;

  @ViewChild(DatatableComponent) table: DatatableComponent;
  customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc', pagerLeftArrow: 'fa fa-chevron-left',
    pagerRightArrow: 'fa fa-chevron-right', pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };

  constructor(private _fb: FormBuilder, private modalService: NgbModal, private notify: ToastrService,
    private groupService: GroupService, private userService: UserService, private subscriberService: SubscriberService) {
    this.createForm = _fb.group({
      'name': ['', Validators.required]
    });
    this.deleteForm = _fb.group({
      'group': ['0', selectValidator]
    });
  }

  ngOnInit() {
    this.getGroups();
    this.entriesPerPage = this.perPageNos[0];
    this.monitorName();
    this.monitorSelected();
    this.userService.profileObserver.subscribe(profile => this.profile = profile);

  }

  private monitorName() {
    this.createForm.get('name').valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe((name: string) => {
        this.setNameValidity(name);
      });
  }

  private setNameValidity(name: string) {
    this.groupService.getGroup(name).pipe(
      map((group: Group) => group))
      .subscribe(group => {
        if (group == null || group == undefined)
          this.nameExists = false;
        else
          this.nameExists = true;
      });
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
      if (this.nameExists || this.hasRequiredError)
        return true;
      return false
  }

  get hasRequiredError() {
    return this.isInValid('name', 'required')
  }

  get isDeletionInvalid() {
    return this.deleteForm.get('group').invalid;
  }

  private getGroups() {
    this.groupService.groups.subscribe(groups => this.groups = groups);
  }

  public createGroup(form) {
    this.isCreatingGroup = true;
    this.groupService.save(form.name).subscribe(
      (response: any) => {
        this.reset();
        this.isCreatingGroup = false;
        this.getGroups();
        this.notify.success(response.message);
      }, error => {
        this.isCreatingGroup = false;
        this.notify.error(error.error.error_description, error.error.error);
      }
    );
  }

  private reset() {
    this.createForm.get('name').reset('');
    this.nameExists = false;
  }

  monitorSelected() {
    this.deleteForm.get('group').valueChanges.pipe(map(id => id))
      .subscribe(id => {
        if (id == 0)
          this.subscribers = [];
        else {
          this.selectedGroup = this.groups.find(group => group.id == id);
          this.subscribers = [];
          if (!this.isDefaultGroup)
            this.getSubscribersByGroupId(id);
        }
      });
  }

  get isDefaultGroup() {
    let defaultGroupName = this.profile.client.id + '_All_Subscribers';
    if (this.selectedGroup)
      return this.selectedGroup.name == defaultGroupName;
    return false;
  }

  public search(event) {
    let searchParam = event.target.value.toLowerCase();
    // filter our data
    let subscriber = this.tempSubscribers.filter((subscriber: SubscriberDetails) => {
      return subscriber.fullPhoneNo.indexOf(searchParam) !== -1 || !searchParam;
    });
    // update the rows
    this.subscribers = subscriber;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  public changeEntriesPerPage(event) {
    this.entriesPerPage = event.target.value;
  }

  openDeleteModal(modal) {
    this.modal = this.modalService.open(modal);
  }

  delete() {
    this.groupService.delete(this.selectedGroup.id).subscribe(response => {
      this.getGroups();
      this.deleteForm.get('group').reset('0');
      this.modal.close();
      this.getGroups();
      this.notify.success('Deleted');
    }, error => {
      this.notify.error(error.error);
    }
    );
  }

  private getSubscribersByGroupId(id: number) {
    this.subscriberService.getByGroupId(id).subscribe(subscribers => {
      this.subscribers = subscribers;
      // cache our clients
      this.tempSubscribers = [...this.subscribers];
    });
  }

  openDeleteSubModal(modal, subscriber: SubscriberDetails, rowIndex: number) {
    this.selectedRow = rowIndex;
    this.selectedSubscriber = subscriber;
    this.modal = this.modalService.open(modal);
  }

  public deleteSubscriber() {
    this.subscribers.splice(this.selectedRow, 1);
    this.subscriberService.deleteSubscriber(this.selectedSubscriber.id, this.selectedGroup.id).subscribe(
      (response: any) => {
        this.modal.close();
        this.notify.success(response.message);
      }, error => {
        this.notify.error(error.error);
      }
    );
    // this.groupContacts = [...this.groupContacts]; 
    // this.tempContacts = [...this.groupContacts];
  }
}
