import { NgModule } from '@angular/core';
import { CountryService } from './services/country.service';
import { UserService } from './services/user.service';
import { ReportService } from './services/report.service';
import { SubscriberService } from './services/subscriber.service';
import { GroupService } from './services/group.service';
import { SmsService } from './services/sms.service';
import { SenderIdService } from './services/sender-id.service';
import { CampaignService } from './services/campaign.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth-interceptor';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  providers: [
    CountryService,
    UserService,
    ReportService,
    SubscriberService,
    GroupService,
    SmsService,
    SenderIdService,
    CampaignService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard,
  ]
})
export class CoreModule { }
