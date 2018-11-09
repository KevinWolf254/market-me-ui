import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { CampaignService } from '../../../../providers/services/campaign.service';
import { Campaign } from '../../../../models/interfaces.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CampaignReport, UserReport, CampaignRequest, Report } from '../../../../models/models.model';
import { UserService } from '../../../../providers/services/user.service';
import { Command } from '../../../../models/enums.model';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {
  public campaigns: any[] = [];
  public tempCampaigns = [];

  // public deleteSchedule: any;
  public modalRef: NgbModalRef;

  profile: UserReport;
  campaignDetails: CampaignReport;

  public perPageForm: FormGroup;
  public searchForm: FormGroup;

  public perPage: number;
  public perPageNos: number[] = [10, 25, 50, 100];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  public customPagerIcons = {
    sortAscending: 'fa fa-sort-asc', sortDescending: 'fa fa-sort-desc',
    pagerLeftArrow: 'fa fa-chevron-left', pagerRightArrow: 'fa fa-chevron-right',
    pagerPrevious: 'fa fa-step-backward', pagerNext: 'fa fa-step-forward'
  };

  constructor(private fb: FormBuilder, private modalService: NgbModal, private notify: ToastrService,
    private campaignService: CampaignService, private userService: UserService) {
    this.perPageForm = fb.group({ 'perPage': [0] });
    this.searchForm = fb.group({ 'search': [''] });
  }

  ngOnInit() {
    this.getCampaigns();
    this.perPage = this.perPageNos[0];
    //monitors perPage selection
    this.perPageForm.get('perPage').valueChanges.subscribe(selected => {
      this.perPage = selected
    });
    //obtain user profile
    this.userService.profileObserver.subscribe(profile => this.profile = profile);
    //monitors search parameters
    this.searchForm.get('search').valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(name => {
      this.search(name);
    });
  }
  public getCampaigns() {
    this.campaignService.getCampaigns().subscribe(
      (campaigns: Campaign[]) => {
        this.campaigns = campaigns;
        // cache our campaigns
        this.tempCampaigns = [...campaigns];
      }
    );
  }
  public search(name: string) {
    const searchParam = name.toLowerCase().trim();
    // filter our data
    let temp = this.tempCampaigns.filter(schedule => {
      return schedule.name.toLowerCase().indexOf(searchParam) !== -1 || !searchParam;
    });
    // update the rows
    this.campaigns = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  public getName(campaign: Campaign) {
    return campaign.type.toLocaleLowerCase();
  }
  public getStatus(value: string) {
    return value.toLocaleLowerCase();
  }
  public getBtnType(value: any) {
    if (value == 'DATE' || value == 'SCHEDULED' || value == 'MONTHLY')
      return {
        'btn-outline-info': true,
        'btn': true,
        'btn-sm': true,
        'mx-1': true
      };
    if (value == 'DAILY' || value == 'ERROR')
      return {
        'btn-outline-danger': true,
        'btn': true,
        'btn-sm': true,
        'mx-1': true
      };
    if (value == 'WEEKLY' || value == 'PAUSED')
      return {
        'btn-outline-warning': true,
        'btn': true,
        'btn-sm': true,
        'mx-1': true
      };
    if (value == 'RUNNING')
      return {
        'btn-success': true,
        'btn': true,
        'btn-sm': true,
        'mx-1': true
      };
    if (value == 'NONE' || value == 'COMPLETE' || value == 'BLOCKED')
      return {
        'btn-outline-secondary': true,
        'btn': true,
        'btn-sm': true,
        'mx-1': true
      };
  }
  public getIcon(value: any) {
    if (value == 'RUNNING')
      return {
        'fa': true,
        'fa-ellipsis-h': true,
        'fa-lg': true
      };
    if (value == 'PAUSED')
      return {
        'fa': true,
        'fa-circle': true,
      };
    if (value == 'BLOCKED')
      return {
        'fa': true,
        'fa-square': true,
      };
    if (value == 'SCHEDULED')
      return {
        'fa': true,
        'fa-play': true,
      };
    if (value == 'COMPLETE')
      return {
        'fa': true,
        'fa-check': true,
      };
    if (value == 'ERROR')
      return {
        'fa': true,
        'fa-danger': true,
      };
  }
  get btnType() {
    if (this.unitsInsufficient)
      return {
        'btn-secondary': true,
        'btn': true,
      };
    if (this.zeroUnits)
      return {
        'btn-outline-primary': true,
        'btn': true,
      };
    return {
      'btn-success': true,
      'btn': true,
    };
  }
  openRunDialog(modal, campaign: Campaign, rowIndex: number) {
    this.campaignService.getCampaignDetails(campaign.name).subscribe(
      response => {
        this.campaignDetails = response;
        this.modalRef = this.modalService.open(modal, { size: 'lg' });
      }
    );
  }
  run(){
    const request = new CampaignRequest(this.campaignName, Command.START);
    this.campaignService.runCampaignNow(request).subscribe(
      (response: Report) => {
        this.notify.success(response.message);
        this.getCampaigns();
      }, error => {
        if (error.status == 400)
          this.notify.error(error.message);
        else
          this.notify.error(error.error.message);
      }
    );
  }
  get campaignName(): string {
    return this.campaignDetails.schedule.name
  }
  get senderId(): string {
    return this.campaignDetails.schedule.senderId
  }
  get groupTotal(): number {
    return this.campaignDetails.groups.length
  }
  get subscriberTotal(): number {
    return this.campaignDetails.charges.totalContacts
  }
  get cost(): number {
    return this.campaignDetails.charges.estimatedCost
  }
  get availableUnits(): number {
    return this.profile.client.creditAmount
  }
  get currency(): string {
    return this.campaignDetails.charges.currency.currency.toLowerCase()
  }
  get unitsInsufficient(): boolean {
    return this.cost > this.availableUnits;
  }
  get zeroUnits(): boolean {
    return this.availableUnits == 0;
  }
  get tableCellType(){
    if (this.unitsInsufficient)
      return {
        'table-danger': true,
      };
      return {
        'table-success': true,
      };
  }
  openDeleteDialog(modal, schedule: any, rowIndex) {
    // this.deleteSchedule = new ScheduleDetails(schedule.name, schedule.type, schedule.schedule,
    //   schedule.nextFire, schedule.lastFired, schedule.status);
    // this.modalRefDel = this.modalService.open(modal);
  }

  delete() {
    // let name: string = this.deleteSchedule.name;
    // this.campaignService.changeScheduleStatus(name, ScheduleStatus.NONE).subscribe(
    //   (response: any) => {
    //     this.notify.success(response.message, response.title);
    //     this.getSchedules();
    //   }, error => {
    //     this.notify.error(error.error.error_description, error.error.error);
    //   }
    // );
    // this.modalRefDel.close(); 
  }
}
