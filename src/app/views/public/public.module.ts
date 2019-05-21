import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicComponent } from './public/public.component';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { BrowserModule } from '@angular/platform-browser';
import { SuccessSignUpComponent } from './success-sign-up/success-sign-up.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';

const routes: Routes = [
  {path:'', component:PublicComponent,
    children:[
      {path: 'home', component: HomeComponent},
      {path: 'signIn', component: SignInComponent},
      {path: 'signUp', component: SignUpComponent},
      { path: '**', component: HomeComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbCarouselModule,
    RouterModule.forChild(routes),
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule
  ],
  declarations: [
    PublicComponent, 
    SignInComponent, 
    HomeComponent, 
    SignUpComponent, 
    SuccessSignUpComponent, 
    FooterComponent, 
    NavigationComponent
  ],
  providers: [{
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: '6LeEanUUAAAAAK6UvvKodU899gGtksDT-kCjPWHF',
    } as RecaptchaSettings,
  }]
}) 
export class PublicModule { }
