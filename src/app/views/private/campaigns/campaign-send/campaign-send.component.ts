import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../../../../providers/services/group.service';
import { Group, UserReport, Sms, Schedule, SenderId } from '../../../../models/models.model';
import { UserService } from '../../../../providers/services/user.service';
import { SenderIdService } from '../../../../providers/services/sender-id.service';
import { SmsService } from '../../../../providers/services/sms.service';

@Component({
  selector: 'app-campaign-send',
  templateUrl: './campaign-send.component.html',
  styleUrls: ['./campaign-send.component.scss']
})
export class CampaignSendComponent implements OnInit {
  public chargeAmount: number = 0;
  public senderIds: SenderId[] = [];
  public totalSubscribers: number = 0;
  public messageLength: number = 0;
  public groups: Group[] = [];
  public selectedRecipients: Group[] = [];
  public form: FormGroup;
  public isSendingSms: boolean = false;
  public enoughUnits = false;
  public report: any;
  public profile: UserReport;

  constructor(private _fb: FormBuilder, private notify: ToastrService,
    private groupService: GroupService, private userService: UserService,
    private senderIdService: SenderIdService, private smsService: SmsService) {

    this.form = _fb.group({
      'senderId': [''],
      'message': [null, Validators.compose([Validators.required, Validators.maxLength(320)])],
      'group': ['0']
    });
  }

  ngOnInit() {
    // retrieve subscriber groups
    this.groupService.groups.subscribe(groups => this.groupService._groups = groups);
    this.groupService.groupObserver.subscribe(groups => this.groups = groups);
    //obtain user profile
    this.userService.profileObserver.subscribe(profile => this.profile = profile);
    //retrieve senderIds
    this.senderIdService.getSenderIdsByCompanyId(this.profile.client.id).subscribe(senderIds => this.senderIds = senderIds);
    //observes the changes in the message textfield
    this.form.get('message').valueChanges.subscribe(message => {
      this.messageLength = message.length;
      this.resetCharges();
    });
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
  public get isSelectedGroupsInValid(): boolean {
    return this.selectedRecipients.length == 0 && this.isTouched('group');
  }
  public get isMessageInvalid() {
    return (this.isTouched('message') && this.isInValid('message', 'required'));
  }
  public addSubscriberGroup() {
    let id = this.form.get('group').value;
    let group: Group = this.groupService.find(this.groups, id);
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
  public resetCharges() {
    //reset charge amount and subscribers
    this.chargeAmount = 0;
    this.totalSubscribers = 0;
  }
  //removes group from array of selected groups 
  public remove(removeGroup: Group) {
    this.resetCharges();
    this.selectedRecipients.forEach((group, index) => {
      if (group.id == removeGroup.id) {
        this.selectedRecipients.splice(index, 1);
      }
    });
  }
  public get currency() {
    return this.profile.client.country.currency.toLowerCase();
  }
  public get units() {
    return this.profile.client.creditAmount;
  }
  get textType() {
    if (this.canSend)
      return {
        'text-success': true,
        'bd-highlight': true
      }
    else
      return {
        'text-danger': true,
        'bd-highlight': true
      }
  }
  get notSelectedSenderId() {
    return this.isTouched('senderId') && this.getFormValue('senderId') == '';
  }
  public smsCharges() {
    let email = this.profile.user.email;
    let senderId = this.form.get('senderId').value;
    let message = this.form.get('message').value;
    let sms: Sms = new Sms(email, senderId, message, new Schedule(), this.recipientsIds);

    this.smsService.getCharges(sms).subscribe(charges => {
      this.chargeAmount = charges.estimatedCost;
      this.totalSubscribers = charges.totalContacts;
      if (this.canSend)
        this.enoughUnits = true;
    });
  }
  //used by calculate button to verify that charges can be calculated
  public get canCalculate() {
    if (this.form.valid && this.recipientsIds.length != 0)
      return true;
    else
      return false;
  }
  public get isSelectedValid() {
    if (this.form.get('group').value == 0)
      return false;
    return true;
  }
  public get canSend() {
    return this.units >= this.chargeAmount
  }
  get charText() {
    if (this.max)
      return {
        'text-warning': true
      }
    else
      return {
        'text-muted': true
      }
  }
  public get max() {
    return this.messageLength == 320
  }
  public sendSms(form) {
    this.isSendingSms = true;
    if (!this.enoughUnits) {
      this.notify.error("Not enough units.");
      this.isSendingSms = false;
    }
    else {
      let sms: Sms = new Sms(this.profile.user.email, form.senderId, form.message,
        new Schedule(), this.recipientsIds);
      this.smsService.sendSms(sms).subscribe(
        response => {
          this.isSendingSms = false;
          this.enoughUnits = false;
          this.notify.success(response.message);
          this.resetDataValues();
          this.resetForm();
        }, error => {
          this.isSendingSms = false;
          this.notify.error(error.error.error_description);
        }
      );
    }
  }
  private get recipientsIds(): number[] {
    let id = [];
    this.selectedRecipients.forEach(group => id.push(group.id))
    return id;
  }
  private resetForm() {
    this.form.get('senderId').reset('');
    this.form.get('message').reset('');
    this.form.get('group').reset('');
  }
  private resetDataValues() {
    this.selectedRecipients = [];
    this.totalSubscribers = 0;
  }
}