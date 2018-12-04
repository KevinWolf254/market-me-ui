import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private/private.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTabsetModule, NgbDatepickerModule, NgbModalModule, NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
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
    NgbTabsetModule,
    UsersModule,
    CampaignsModule,
    SubscribersModule,
    TopUpModule
  ],
  declarations: [
    PrivateComponent,
    DashboardComponent,
    ProfileComponent,
  ]
})
export class PrivateModule { }
