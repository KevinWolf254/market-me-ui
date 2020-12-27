import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private/private.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbDatepickerModule, NgbModalModule, NgbButtonsModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { SenderIdModule } from './sender-id/sender-id.module';
import { UsersModule } from './users/users.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { TopUpModule } from './top-up/top-up.module';

@NgModule({
  imports: [
    PrivateRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbButtonsModule,
    NgbModalModule,
    UsersModule,
    CampaignsModule,
    SubscribersModule,
    TopUpModule,
    SenderIdModule,
    NgbNavModule
  ],
  declarations: [
    PrivateComponent,
    DashboardComponent,
    ProfileComponent,
  ]
})
export class PrivateModule { }
