import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MpesaComponent } from './mpesa/mpesa.component';
import { PayPalComponent } from './pay-pal/pay-pal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule
  ],
  declarations: [
    MpesaComponent,
    PayPalComponent
  ]
})
export class TopUpModule { }
