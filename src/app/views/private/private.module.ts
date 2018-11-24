import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateComponent } from './private/private.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbTabsetModule, NgbDatepickerModule, NgbModalModule, NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersModule } from './users/users.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { CampaignSendComponent } from './campaigns/campaign-send/campaign-send.component';
import { SubscribersModule } from './subscribers/subscribers.module';
import { SubCreateComponent } from './subscribers/sub-create/sub-create.component';
import { AuthGuard } from '../../providers/guards/auth.guard';
import { TopUpModule } from './top-up/top-up.module';
import { MpesaComponent } from './top-up/mpesa/mpesa.component';

const routes: Routes = [
  {path:'bulksms', component: PrivateComponent,
  canActivate: [AuthGuard],
    children:[
      {path: 'dashboard', component: DashboardComponent},
      {path: 'units', component: MpesaComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'users', component: UserCreateComponent},
      {path: 'campaigns', component: CampaignSendComponent},
      {path: 'subscribers', component: SubCreateComponent}
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,    
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule, 
    NgbDatepickerModule, 
    NgbButtonsModule,
    NgbModalModule,
    NgbTabsetModule,
    RouterModule.forChild(routes),
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
