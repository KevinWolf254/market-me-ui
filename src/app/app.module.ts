import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { PrivateModule } from './views/private/private.module';
import { PublicModule } from './views/public/public.module';
import { CoreModule } from './providers/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxDatatableModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    PrivateModule,
    PublicModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
