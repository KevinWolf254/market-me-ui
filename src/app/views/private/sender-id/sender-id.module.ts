import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageComponent } from './manage/manage.component';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTabsetModule
  ],
  declarations: [
    ManageComponent
  ]
})
export class SenderIdModule { }
