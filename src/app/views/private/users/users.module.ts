import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserListComponent } from './user-list/user-list.component';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    NgbTabsetModule,
    FormsModule,
    ReactiveFormsModule,    
    NgxDatatableModule
  ],
  declarations: [
    UserCreateComponent, 
    UserListComponent
  ]
})
export class UsersModule { }
