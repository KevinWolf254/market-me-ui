import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sub-list',
  templateUrl: './sub-list.component.html',
  styleUrls: ['./sub-list.component.scss']
})
export class SubListComponent implements OnInit {

  public groups: any[] = [];
  public file: File;
  public contactsChoosen: boolean = false;
  public fileName: string = '';
  public isAddingClient: boolean = false;
  public isAddingClients: boolean = false;

  public form: FormGroup;
  public fileForm: FormGroup;

  constructor(private _fb: FormBuilder, private notify: ToastrService) { 
    this.form = _fb.group({
      'group': ['0'],
      'code': [null,Validators.compose([Validators.required, 
        Validators.pattern('[0-9]{3,3}')])],
      'phone': [null,Validators.compose([Validators.required, 
        Validators.pattern('^7[0-9]{8,8}')])],
    });
    this.fileForm = _fb.group({
      'group': ['0']
    });
  }

  ngOnInit() {
    // this.groupService.getGroups().subscribe(
    //   response=>{
    //     this.groups = response;
    //   }
    // );
  }

  public addContactToGroup(form){
    this.isAddingClient = true;
    let code = "+"+form.code;
    // this.contactService.saveContactToGroup(new Client(code, form.phone), form.group).subscribe(
    //   (response: any) => {
    //     this.isAddingClient = false;
    //     this.notify.success(response.message, response.title);
    //     this.resetSingleContactForm();
    //   }, error => {
    //     this.isAddingClient = false;
    //     this.notify.error(error.error.error_description, error.error.error);
    //   }
    // );
  }

  public uploadFile(event) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
    this.contactsChoosen = true;
  }

  public addContactssToGroup(){
    this.isAddingClients = true;
    // this.contactService.saveContactsToGroup(this.file, this.fileForm.get('group').value).subscribe(
    //   (response: any) =>{   
    //     if(response.type === HttpEventType.UploadProgress){
    //       // console.log("uploading progress: "+ Math.round(100 * response.loaded / response.total) +'%');
    //     }else if(response.type === HttpEventType.Response){ 
    //       this.isAddingClients = false;
    //       this.fileName = '';      
    //       this.notify.success(response.body.message, response.body.title);
    //       this.fileForm.get("group").setValue('0');
    //       this.contactsChoosen = false;
    //     }
    //   },error => {
    //     this.notify.error(error.error.error_description, error.error.error);
    //     this.isAddingClients = false;          
    //   }
    // );
  }

  resetSingleContactForm(){
    this.form.reset();
    this.form.get("group").setValue('0');
  }
}
