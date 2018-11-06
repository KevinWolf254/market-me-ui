import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../../../../providers/services/group.service';
import { selectValidator, campaignNameValidator } from '../../../../providers/validators/validators';
import { CampaignService } from '../../../../providers/services/campaign.service';
import { UserReport, SenderId, Group, Sms, Schedule, ScheduleBuilder } from '../../../../models/models.model';
import { UserService } from '../../../../providers/services/user.service';
import { SenderIdService } from '../../../../providers/services/sender-id.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleType } from '../../../../models/enums.model';

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
  public selectedRecipients: Group[] = [];
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
  public get isNameInvalid(): boolean{
    return (this.isInValid('name', 'required') || this.isInValid('name', 'exists')) && this.isTouched('name')
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
    return (this.form.invalid || this.selectedRecipients.length == 0)
  }
  private get selectedDateSchedule(): Date {
    return new Date(this.selectedDate.getFullYear(), this.selectedDate.getDate(),
      this.selectedDate.getDay(), this.selectedTime.getHours(), this.selectedTime.getMinutes());
  }
  private get basicSchedule(): ScheduleBuilder {
    return new ScheduleBuilder()
      .setName(this.getFormValue('name'))
      .setSenderId(this.getFormValue('senderId'))
      .setCreatedBy(this.profile.user.email);
  }
  private get dateSchedule(): Schedule {
    return this.basicSchedule
      .setType(ScheduleType.DATE)
      .setDate(this.selectedDateSchedule)
      .build();
  }
  private get dailySchedule(): Schedule {
    return this.basicSchedule
      .setType(ScheduleType.DAILY)
      .setDate(this.selectedTime)
      .build();
  }
  private get weeklySchedule(): Schedule {
    return this.basicSchedule
      .setType(ScheduleType.WEEKLY)
      .setDayOfWeek(this.selectedDay)
      .setDate(this.selectedDateSchedule)
      .build();
  }
  private get monthlySchedule(): Schedule {
    return this.basicSchedule
      .setType(ScheduleType.MONTHLY)
      .setDayOfMonth(this.selectedMonthDay)
      .setDate(this.selectedTime)
      .build();
  }
  private get selectedGroupIds(): number[] {
    return this.selectedRecipients.map(group => group.id);
  }
  private getDateSms(form): Sms {
    return new Sms(this.profile.user.email, form.senderId, form.message,
      this.dateSchedule, this.selectedGroupIds);
  }
  private getDailySms(form): Sms {
    return new Sms(this.profile.user.email, form.senderId, form.message,
      this.dailySchedule, this.selectedGroupIds);
  }
  private getWeeklySms(form): Sms {
    return new Sms(this.profile.user.email, form.senderId, form.message,
      this.weeklySchedule, this.selectedGroupIds);
  }
  private getMonthlySms(form): Sms {
    return new Sms(this.profile.user.email, form.senderId, form.message,
      this.monthlySchedule, this.selectedGroupIds);
  }
  private getSms(form): Sms {
    if (form.schedule == 'date')
      return this.getDateSms(form);
    if (form.schedule == 'daily')
      return this.getDailySms(form);
    if (form.schedule == 'weekly')
      return this.getWeeklySms(form);
    if (form.schedule == 'monthly')
      return this.getMonthlySms(form);
  }
  public send(form) {
    this.isSending = true;
    this.campaignService.sendSms(this.getSms(form)).subscribe(
      response => {
        this.isSending = false;
        this.notify.success("Created SMS campaign successfully");
        //reset form and selectedGroups array
        this.form.reset();
        this.selectedRecipients = [];
      }, error => {
        this.isSending = false;
        this.notify.error(error.error.error_description, error.error.error);
      }
    );
  }
}