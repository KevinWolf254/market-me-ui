import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignSendComponent } from './campaign-send/campaign-send.component';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignScheduleComponent } from './campaign-schedule/campaign-schedule.component';
import { NgbTabsetModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTabsetModule,
    NgxDatatableModule,
    NgbDatepickerModule,
    NgbTimepickerModule
  ],
  declarations: [
    CampaignSendComponent, 
    CampaignListComponent, 
    CampaignScheduleComponent
  ]
})
export class CampaignsModule { }
