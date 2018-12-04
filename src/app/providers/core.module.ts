import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { UserProfileResolverService } from './services/user-profile-resolver.service';
import { CountryService } from './services/country.service';
import { UserService } from './services/user.service';
import { ReportService } from './services/report.service';
import { SubscriberService } from './services/subscriber.service';
import { GroupService } from './services/group.service';
import { SmsService } from './services/sms.service';
import { PaymentService } from './services/payment.service';
import { SenderIdService } from './services/sender-id.service';
import { CampaignService } from './services/campaign.service';
import { TokenService } from './services/token.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth-interceptor';

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
    PaymentService,
    TokenService,
    UserProfileResolverService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard,
    AdminGuard
  ]
})
export class CoreModule { }
