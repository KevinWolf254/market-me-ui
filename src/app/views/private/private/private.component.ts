import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../providers/services/user.service';
import { UserReport } from '../../../models/models.model';
import { Role } from '../../../models/enums.model';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {
  public show: boolean = false;
  public show2: boolean = false;

  public profile: UserReport;
  public isAdmin: boolean = false;

  constructor(private userService: UserService){}

  ngOnInit() {
    this.userService.profileObserver.subscribe((profile: UserReport) => {
      this.profile = profile
      let admin = profile.roles.find(role=>{
        return role.role == Role.ADMIN;
       });
       if(admin == null || admin == undefined)
         this.isAdmin = false;
       else
        this.isAdmin = true;
    });
  }
  toggleCollapse() {
    this.show = !this.show
  }  
  toggleCollapse2() {
    this.show2 = !this.show2
  }
  public get units(): number{
    return this.profile.client.creditAmount;
  }
  public get currency(): string{
    return this.profile.client.country.currency.toLowerCase();
  }
  public get user(): string{
    return this.profile.user.otherNames+' '+this.profile.user.surname;
  }
}
