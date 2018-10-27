import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-campaign-send',
  templateUrl: './campaign-send.component.html',
  styleUrls: ['./campaign-send.component.scss']
})
export class CampaignSendComponent implements OnInit {

  public unitsDetails: any;
  public totalSubscribers: number = 0;
  // public contacts: Contacts;
  public subsReport: any[];
  public isLong: boolean = false;

  public currency: string = "ksh";
  public totalCharges: number = 0.00;
  private basicCharges: number = 0.00;
  
  public messageLength: number = 0;
  public canSend: boolean = true;

  public selected = 0;
  public groups: any[] = [];
  public selectedRecipients: any[] = [];

  public recipientsIds: number[] = [];  
  public form: FormGroup;
  
  public isSendingSms: boolean = false;

  public report: any;
  
  constructor(private _fb: FormBuilder, private notify: ToastrService) {

    this.form = _fb.group({
      'message': [null,Validators.compose([Validators.required, Validators.maxLength(320)])],
      'group': ['0']
    });
  }

  ngOnInit() {
    // retrieve groups for organisation from API
    // this.groupService.getGroups().subscribe(
    //   (groups: Group[]) =>{
    //     this.groups = groups;
    //   }
    // );

    // //get details on units available and setup the currency
    // this.unitsService.getUnitsAvailable().subscribe(
    //   (report: CreditReport) => {
    //     // this.setUpCurrency(response);
    //     // this.unitsDetails = response;
    //     this.report = report;
    //   }
    // );

    //observes the changes in the message textfield
    this.monitorCharges();
  }   

  private monitorCharges() {
    this.form.get('message').valueChanges.subscribe(message => {
      if(this.form.get('message').touched && this.form.get('message').valid)
        this.messageLength = message.length;
      this.changeCharges(message);
      
    });
  }

  private setUpCurrency(unitsDetails: any) {
    // this.currency = this.unitsService.setUpCurrency(unitsDetails);
  }

  public checkSendingValidity(){
    if(this.unitsDetails.unitsAvailable > this.totalCharges){      
      this.canSend = true;
    }else if(this.unitsDetails.unitsAvailable < this.totalCharges){
      this.canSend = false;
    }
  }

  public addGroup() {
    // find group with selected id
    // let group: Group = this.groupService.findGroup(this.groups, this.selected);
    // //check if recipients has a group of recipients added to it
    // if (this.selectedRecipients.length != 0) {
    //   //check and remove duplicates
    //   this.selectedRecipients = this.removeDuplicate();
    //   this.recipientsIds = this.removeIdsDuplicate();

    // }
    // this.selectedRecipients.push(group);
    // this.recipientsIds.push(group.id);

    // this.getNoOfContactsByGroup(this.recipientsIds);
    // //reset select
    // this.form.get('group').setValue('0');
  }
  
  private getNoOfContactsByGroup(recipientsIds: number[]){
    // this._clientService.findByGroupsId(recipientsIds).subscribe(
    //   (report: ServiceProviderReport[]) =>{
    //     this.subsReport = report;
    //     this.totalSubscribers = this._clientService.calculateNoOfContacts(report);
    //     this.getCharges();
    //   }
    // );
  }

  private getCharges(){
    // this._clientService.getCharges().subscribe(
    //   (charges: Charges) =>{
    //     this.basicCharges = this._clientService.calculateCharges(charges, this.subsReport);
    //     if(this.form.get('message').touched && this.form.get('message').valid){
    //       let message = this.form.get('message').value;
    //       //calculate charges
    //       this.changeCharges(message);
    //     }
    //   }
    // );
  }

  private changeCharges(message: any) {
    this.messageLength = message.length;
    if (this.messageLength > 160 && this.recipientsIds.length != 0) {
      this.isLong = true;
      this.totalCharges = this.basicCharges * 2;
    }
    else if (this.messageLength > 0 && this.messageLength <= 160 && this.recipientsIds.length != 0) {
      this.isLong = false;
      this.totalCharges = this.basicCharges;
    }
    else {
      this.isLong = false;
      this.totalCharges = 0;
    }
    this.checkSendingValidity();
  }

  private removeIdsDuplicate(): number[]{
    return this.recipientsIds = this.recipientsIds.filter((id: number)=>{
        return id != this.selected;
    });
  }

  private removeDuplicate(): any[]{
    return this.selectedRecipients = this.selectedRecipients.filter((group: any)=>{
        return group.id != this.selected;
    });
  }

  /**removes group from array of selected groups */
  public remove(removeGroup: any){
    this.selectedRecipients.forEach((group, index)=>{
      if(group.id == removeGroup.id){
        this.selectedRecipients.splice(index, 1);
      }
    });
    //remove from recipientsIds/groupIds
    this.recipientsIds.forEach((id, index)=>{
      if(id == removeGroup.id){
        this.recipientsIds.splice(index, 1);
      }
    })
    this.getNoOfContactsByGroup(this.recipientsIds);
  } 

  public sendSms(form){
    // this.isSendingSms = true; 
    // // let sms: Sms = new SmsToGroup(form.message, new NoSchedule, this.recipientsIds);
    // let sms: Sms;
    // sms.message = form.message;
    // this.campaignService.sendSms(sms).subscribe(
    //   response =>{
    //     this.isSendingSms = false;
    //     this.notify.success(response.message, response.title);
    //     //reset form and select_Groups array
    //     this.resetDataValues();
    //     this.resetForm();
    //   }, error =>{
    //     this.isSendingSms = false;
    //     this.notify.error(error.error.error_description, error.error.error);
    //   }
    // );
  }
   
  private resetForm(){
    this.form.get('message').setValue('');
    this.form.get('group').setValue('0');
  }

  private resetDataValues(){
    this.selectedRecipients = [];
    this.recipientsIds = [];
    this.totalSubscribers = 0;
  }

}
