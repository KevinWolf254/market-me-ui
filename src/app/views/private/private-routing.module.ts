import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivateComponent } from './private/private.component';
import { UserProfileResolverService } from '../../providers/services/user-profile-resolver.service';
import { AuthGuard } from '../../providers/guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MpesaComponent } from './top-up/mpesa/mpesa.component';
import { ProfileComponent } from './profile/profile.component';
import { UserCreateComponent } from './users/user-create/user-create.component';
import { CampaignSendComponent } from './campaigns/campaign-send/campaign-send.component';
import { SubCreateComponent } from './subscribers/sub-create/sub-create.component';
import { AdminGuard } from '../../providers/guards/admin.guard';

const routes: Routes = [
  {
    path: 'bulksms', component: PrivateComponent,
    resolve: { userProfile: UserProfileResolverService },
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard] },
          { path: 'units', component: MpesaComponent, canActivate: [AdminGuard] },
          { path: 'profile', component: ProfileComponent },
          { path: 'users', component: UserCreateComponent, canActivate: [AdminGuard] },
          { path: 'campaigns', component: CampaignSendComponent },
          { path: 'subscribers', component: SubCreateComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }