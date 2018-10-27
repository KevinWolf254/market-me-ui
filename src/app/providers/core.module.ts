import { NgModule } from '@angular/core';
import { CountryService } from './services/country.service';
import { UserService } from './services/user.service';
import { ReportService } from './services/report.service';
import { SubscriberService } from './services/subscriber.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth-interceptor';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  providers: [
    CountryService,
    UserService,
    ReportService,
    SubscriberService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthGuard
  ]
})
export class CoreModule { }
