import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../../../../providers/services/group.service';
import { selectValidator, campaignNameValidator } from '../../../../providers/validators/validators';
import { CampaignService } from '../../../../providers/services/campaign.service';
import { UserReport, SenderId, Group } from '../../../../models/models.model';
import { UserService } from '../../../../providers/services/user.service';
import { SenderIdService } from '../../../../providers/services/sender-id.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-campaign-schedule',
  templateUrl: './campaign-schedule.component.html',
  styleUrls: ['./campaign-schedule.component.scss']
})
export class CampaignScheduleComponent implements OnInit {
  public form: FormGroup;
  public defaultTime = { hour: 12, minute: 30 };
  public messageLength: number = 0;
  public groups: any[] = [];
  public profile: UserReport;
  public senderIds: SenderId[] = [];
  public selectedRecipients: any[] = [];
  private today = new Date();
  public todayDate: NgbDateStruct;
  public week: string[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
    "THURSDAY", "FRIDAY", "SATURDAY"];
  public days: number[] = new Array(31);

  public meridian: boolean = true;
  public toggleMeridian() {
    this.meridian = !this.meridian;
  }

  public isSending: boolean = false;

  constructor(private fb: FormBuilder, private notify: ToastrService, private groupService: GroupService,
    private campaignService: CampaignService, private userService: UserService,
    private senderIdService: SenderIdService) {
    this.form = fb.group({
      'name': ['', Validators.required, campaignNameValidator(campaignService)],
      'senderId': [''],
      'group': ['0'],
      'message': ['', Validators.compose([Validators.required, Validators.maxLength(320)])],
      'schedule': ['', Validators.required],
      'time': [this.defaultTime, Validators.required],
      'details': this.fb.array([])
    });
    this.todayDate = { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() };
  }

  ngOnInit() {
    //set up days of month
    for (let i = 0; i <= 30; i++)
      this.days[i] = i + 1;
    // retrieve subscriber groups    
    this.groupService.groupObserver.subscribe(groups => this.groups = groups);
    //obtain user profile
    this.userService.profileObserver.subscribe(profile => this.profile = profile);
    //retrieve senderIds
    this.senderIdService.senderIds(this.profile.client.id).subscribe(senderIds => this.senderIdService._senderIds = senderIds);
    this.senderIdService.senderIdsObserver.subscribe(senderIds => this.senderIds = senderIds);
    //observes the changes in the message textfield
    this.form.get('message').valueChanges.subscribe(message => {
      this.messageLength = message.length;
    });
    //observes the values of the schedule type and sets appropriate form control to the
    //details form array
    this.form.get('schedule').valueChanges.subscribe(schedule => {
      if (schedule == 'date')
        this.scheduleDetails = this.setDate();
      else if (schedule == 'weekly')
        this.scheduleDetails = this.setDay();
      else if (schedule == 'monthly')
        this.scheduleDetails = this.setMonthDay();
    });
  }
  private set scheduleDetails(formGroup: FormGroup) {
    if ((<FormArray>this.form.get('details')).length >= 0)
      (<FormArray>this.form.get('details')).removeAt(0);
    (<FormArray>this.form.get('details')).push(formGroup);
  }
  private setDate(): FormGroup {
    return this.fb.group({ 'date': [this.todayDate, Validators.required] });
  }
  private setDay(): FormGroup {
    return this.fb.group({ 'day': ['0', selectValidator] });
  }
  private setMonthDay(): FormGroup {
    return this.fb.group({ 'month': ['0', selectValidator] });
  }
  public getFormValue(formAttribute: string) {
    return this.form.get(formAttribute).value
  }
  public isInValid(input: string, error: string): boolean {
    return this.form.controls[input].hasError(error);
  }
  public isTouched(input: string): boolean {
    return this.form.controls[input].touched;
  }
  public isArrayInValid(input: string, error: string): boolean {
    return (<FormGroup>(<FormArray>this.form.get('details')).controls[0]).controls[input].hasError(error);
  }
  public isArrayTouched(input: string): boolean {
    return (<FormGroup>(<FormArray>this.form.get('details')).controls[0]).controls[input].touched;
  }
  public get isSelectedValid(): boolean {
    if (this.getFormValue('group') == 0)
      return false;
    return true;
  }
  public get isSelectedGroupsInValid(): boolean {
    return this.selectedRecipients.length == 0 && this.isTouched('group');
  }
  public isScheduleInvalid(): boolean {
    return this.isInValid('schedule', 'required') && this.isTouched('schedule');
  }
  public get isDayInvalid(): boolean {
    return this.isArrayInValid('day', 'defaultValue') && this.isArrayTouched('day');
  }
  public get isMonthInvalid(): boolean {
    return this.isArrayInValid('month', 'defaultValue') && this.isArrayTouched('month');
  }
  public get isDateInvalid(): boolean {
    return this.isArrayInValid('date', 'required') && this.isArrayTouched('date');
  }
  public get selectedDate() {
    const value = (<FormGroup>(<FormArray>this.form.get('details')).controls[0]).value;
    return new Date(value.date.year, value.date.month - 1, value.date.day);
  }
  public get selectedMonthDay() {
    const value = (<FormGroup>(<FormArray>this.form.get('details')).controls[0]).value;
    return value.month;
  }
  public get selectedTime() {
    const time = this.form.get('time').value
    return new Date(2000, 10, 10, time.hour, time.minute);
  }
  public get selectedDay() {
    const value = (<FormGroup>(<FormArray>this.form.get('details')).controls[0]).value;
    return value.day;
  }
  public addSubscriberGroup() {
    const id = this.getFormValue('group');
    const group: Group = this.groupService.find(this.groups, id);
    //check if recipients array has a group of recipients added to it
    if (this.selectedRecipients.length != 0) {
      //check and remove duplicates
      this.selectedRecipients = this.removeGroupDuplicates(id);
    }
    this.selectedRecipients.push(group);
    //reset select
    this.form.get('group').setValue('0');
  }
  private removeGroupDuplicates(groupId: number): Group[] {
    return this.selectedRecipients = this.selectedRecipients.filter((group: any) => {
      return group.id != groupId;
    });
  }
  //removes group from array of selected groups 
  public remove(removeGroup: Group) {
    this.selectedRecipients.forEach((group, index) => {
      if (group.id == removeGroup.id) {
        this.selectedRecipients.splice(index, 1);
      }
    });
  }
  public get isMaximum(): boolean {
    if (this.messageLength == 320)
      return true;
    return false;
  }
  public get isMessageInvalid(): boolean {
    return (this.isTouched('message') && this.isInValid('message', 'required'));
  }
  public get isFormInvalid(): boolean {
    return (this.form.invalid && this.selectedRecipients.length == 0)
  }
  send(form) {
    this.isSending = true;
    console.log(form);
  }
  // public sendScheduledSms(form) {
  //   this.isSendingSchedule = true;
  //   let scheduledDate: Date = new Date();
  //   let scheduledTime: Time = { hours: 0, minutes: 0 };
  // let sms: Sms = null;
  // if (form.campaignType == "oneOff") {
  //   scheduledDate.setUTCFullYear(form.oneOff_Date.year, form.oneOff_Date.month - 1, 
  //     form.oneOff_Date.day);  
  //   scheduledTime.hours = form.oneOff_Time.hour;
  //   scheduledTime.minutes = form.oneOff_Time.minute;
  //   sms = new Sms(form.message, new ScheduleDate(form.campaignName, ScheduleType.DATE, scheduledDate, scheduledTime), this.recipientsIds);
  // }
  // else if (form.campaignType == 'recurring') {
  //   if (form.recurring == 'daily') {
  //     scheduledTime.hours = form.dailyTime.hour;
  //     scheduledTime.minutes = form.dailyTime.minute;
  //     sms = new Sms(form.message, new ScheduleDaily(form.campaignName, ScheduleType.DAILY, scheduledTime), this.recipientsIds);
  // } else if (form.recurring == 'weekly') {
  //     scheduledTime.hours = form.weeklyTime.hour;
  //     scheduledTime.minutes = form.weeklyTime.minute;
  //     sms = new Sms(form.message, new ScheduleWeekly(form.campaignName, ScheduleType.WEEKLY, scheduledTime, form.dayOfWeek), this.recipientsIds);
  // } else if (form.recurring == 'monthly') {
  //     scheduledDate.setUTCFullYear(form.monthlyDate.year, form.monthlyDate.month - 1, 
  //       form.monthlyDate.day);  
  //     scheduledTime.hours = form.monthlyTime.hour;
  //     scheduledTime.minutes = form.monthlyTime.minute;
  //     sms = new Sms(form.message, new ScheduleMonthly(form.campaignName, ScheduleType.MONTHLY, scheduledDate, scheduledTime, form.monthlyDate.day), this.recipientsIds);
  //   }
  // }
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
  // }
  // resetForm() {
  //   this.form.get("campaignName").setValue('');
  //   this.form.get("campaignType").reset();
  //   this.form.get("message").setValue('');
  //   this.form.get("group").setValue('0');
  // }
  // resetDataValues() {
  //   this.selectedRecipients = [];
  //   this.recipientsIds = [];
  // }
}