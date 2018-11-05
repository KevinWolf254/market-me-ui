import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Time } from '@angular/common';
import { GroupService } from '../../../../providers/services/group.service';
import { selectValidator, campaignNameValidator } from '../../../../providers/validators/validators';
import { CampaignService } from '../../../../providers/services/campaign.service';

@Component({
  selector: 'app-campaign-schedule',
  templateUrl: './campaign-schedule.component.html',
  styleUrls: ['./campaign-schedule.component.scss']
})
export class CampaignScheduleComponent implements OnInit {

  public messageLength: number = 0;
  public canSend: boolean = true;
  public isLong: boolean = false;
  public isChecking: boolean = false;
  public isSendingSchedule = false;

  public nameIsAvailable: boolean = null;
  public checked: boolean = false;

  public selected: number = 0;
  public groups: any[] = [];
  public selectedRecipients: any[] = [];
  public week: string[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
    "THURSDAY", "FRIDAY", "SATURDAY"];

  public recipientsIds: number[] = [];
  public form: FormGroup;

  public defaultTime = { hour: 12, minute: 30 };
  public meridian: boolean = true;

  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  constructor(private fb: FormBuilder, private notify: ToastrService, private groupService: GroupService, 
    private campaignService: CampaignService) {
    this.form = fb.group({
      'name': ['', Validators.required, campaignNameValidator(campaignService)],
      'message': ['', Validators.compose([Validators.required, Validators.maxLength(320)])],
      'group': ['0'],
      'schedule': ['', Validators.required],
      'time': [this.defaultTime, Validators.required],
      'details': this.fb.array([])
    });
  }

  ngOnInit() {
    // retrieve groups for organisation from API    
    this.groupService.groupObserver.subscribe(groups => this.groups = groups);

    //check availability of campaign name
    this.form.get('name').valueChanges.subscribe(name => {
      if (this.form.get('name').valid && this.form.get('name'))
        this.nameIsAvailable = null;
      this.checked = false;
    });

    //observes the changes in the message textfield
    this.form.get('message').valueChanges.subscribe(message => {
      this.messageLength = message.length;
      if (this.messageLength > 160) {
        this.isLong = true;
      } else if (this.messageLength > 0 && this.messageLength <= 160) {
        this.isLong = false;
      } else {
        this.isLong = false;
      }
    }
    );

    this.form.get('schedule').valueChanges.subscribe(schedule => {
      if (schedule == 'date' || schedule == 'monthly')
        this.scheduleDetails = this.setDate();
      else if (schedule == 'weekly')
        this.scheduleDetails = this.setDay();
    });
  }

  private set scheduleDetails(formGroup: FormGroup) {
    if ((<FormArray>this.form.get('details')).length >= 0)
      (<FormArray>this.form.get('details')).removeAt(0);
    (<FormArray>this.form.get('details')).push(formGroup);
  }

  private setDate(): FormGroup {
    return this.fb.group({
      'date': ['', Validators.required]
    });
  }
  private  setDay(): FormGroup {
    return this.fb.group({
      'day': ['0', selectValidator]
    });
  }

  public add() {
    // //find group with selected id
    // let group: Group = this.groupService.findGroup(this.groups, this.selected);
    // //check if recipients has a group of recipients added to it
    // if(this.selectedRecipients.length !=0){
    //   //check and remove duplicates
    //   this.selectedRecipients = this.removeDuplicate();
    // }
    // this.selectedRecipients.push(group);    
    // this.recipientsIds.push(group.id);
    // this.form.get("group").setValue('0');
  }

  public removeDuplicate(): any[] {
    return this.selectedRecipients = this.selectedRecipients.filter((group: any) => {
      return group.id != this.selected;
    });
  }

  public removeIdsDuplicate(): number[] {
    return this.recipientsIds = this.recipientsIds.filter((id: number) => {
      return id != this.selected;
    });
  }

  /**removes group from array of selected groups */
  public remove(removeGroup: any) {
    this.selectedRecipients.forEach((group, index) => {
      if (group.id == removeGroup.id) {
        this.selectedRecipients.splice(index, 1);
      }
    });
    //remove from recipientsIds/groupIds
    this.recipientsIds.forEach((id, index) => {
      if (id == removeGroup.id) {
        this.recipientsIds.splice(index, 1);
      }
    })
  }

  public checkName() {
    this.isChecking = true;
    let name: string = this.form.get('campaignName').value;
    // this.campaignService.checkCampaignNameAvailability(name).subscribe(
    //   (result: AvailabilityResponse) =>{
    //     this.checked = true;
    //     this.isChecking = false;
    //     this.nameIsAvailable = result.isAvailable;
    //     console.log(this.nameIsAvailable)
    //   }, (error) => {
    //     this.checked = true;
    //     this.isChecking = false;
    //     this.nameIsAvailable = error.error.isAvailable;
    //     console.log(this.nameIsAvailable)
    //   }
    // );
  }

  public sendScheduledSms(form) {
    this.isSendingSchedule = true;
    let scheduledDate: Date = new Date();
    let scheduledTime: Time = { hours: 0, minutes: 0 };
    // let sms: Sms = null;
    if (form.campaignType == "oneOff") {
      //   scheduledDate.setUTCFullYear(form.oneOff_Date.year, form.oneOff_Date.month - 1, 
      //     form.oneOff_Date.day);  
      //   scheduledTime.hours = form.oneOff_Time.hour;
      //   scheduledTime.minutes = form.oneOff_Time.minute;
      //   sms = new Sms(form.message, new ScheduleDate(form.campaignName, ScheduleType.DATE, scheduledDate, scheduledTime), this.recipientsIds);
    }
    else if (form.campaignType == 'recurring') {
      if (form.recurring == 'daily') {
        //     scheduledTime.hours = form.dailyTime.hour;
        //     scheduledTime.minutes = form.dailyTime.minute;
        //     sms = new Sms(form.message, new ScheduleDaily(form.campaignName, ScheduleType.DAILY, scheduledTime), this.recipientsIds);
      } else if (form.recurring == 'weekly') {
        //     scheduledTime.hours = form.weeklyTime.hour;
        //     scheduledTime.minutes = form.weeklyTime.minute;
        //     sms = new Sms(form.message, new ScheduleWeekly(form.campaignName, ScheduleType.WEEKLY, scheduledTime, form.dayOfWeek), this.recipientsIds);
      } else if (form.recurring == 'monthly') {
        //     scheduledDate.setUTCFullYear(form.monthlyDate.year, form.monthlyDate.month - 1, 
        //       form.monthlyDate.day);  
        //     scheduledTime.hours = form.monthlyTime.hour;
        //     scheduledTime.minutes = form.monthlyTime.minute;
        //     sms = new Sms(form.message, new ScheduleMonthly(form.campaignName, ScheduleType.MONTHLY, scheduledDate, scheduledTime, form.monthlyDate.day), this.recipientsIds);
      }
    }
    // console.log("Sms: "+JSON.stringify(sms));
    // this.campaignService.sendScheduled(sms).subscribe(
    //   response=>{
    //     this.isSendingSchedule = false;
    //     this.notify.success(response.message, response.title);
    //     //reset form and select_Groups array
    //     this.resetDataValues();
    //     this.resetForm();
    //   }, error=>{
    //     this.isSendingSchedule = false;
    //     this.notify.error(error.error.error_description, error.error.error);
    //   }
    // );
  }

  resetForm() {
    this.form.get("campaignName").setValue('');
    this.form.get("campaignType").reset();
    this.form.get("message").setValue('');
    this.form.get("group").setValue('0');
  }

  resetDataValues() {
    this.selectedRecipients = [];
    this.recipientsIds = [];
  }
}
