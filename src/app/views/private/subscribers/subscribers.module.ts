import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubCreateComponent } from './sub-create/sub-create.component';
import { SubListComponent } from './sub-list/sub-list.component';
import { SubGroupsComponent } from './sub-groups/sub-groups.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTabsetModule,
    NgxDatatableModule,
  ],
  declarations: [
    SubCreateComponent, 
    SubListComponent, 
    SubGroupsComponent
  ]
})
export class SubscribersModule { }
