import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../providers/services/user.service';
import { UserReport } from '../../../models/models.model';
import { Role } from '../../../models/enums.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {
  public show: boolean = false;
  public show2: boolean = false;

  public profile: UserReport;
  public units: number = 0.0;
  public currency: string = '';
  public name: string = '';

  public isAdmin: boolean = false;

  constructor(private userService: UserService, private notify: ToastrService) { }

  ngOnInit() {
    this.userService.getUserProfile().subscribe(profile => {
        this.profile = profile;
        this.userService.profile = profile;
        this._isAdmin = profile;
        this.setUserDetails();
      }, error => { 
        this.notify.error('Could not retrieve profile!');
      }
    );
  }
  toggleCollapse() {
    this.show = !this.show
  }
  toggleCollapse2() {
    this.show2 = !this.show2
  }
  private setUserDetails(){
    this.setName();
    this.setCurrency();
    this.setUnits();
  }
  private setUnits() {
    this.units = this.profile.client.creditAmount;
  }
  private setCurrency() {
    this.currency = this.profile.client.country.currency.toLowerCase();
  }
  private setName() {
    this.name = this.profile.user.otherNames + ' ' + this.profile.user.surname;
  }
  private set _isAdmin(profile: UserReport){
    let admin = profile.roles.find(role => {
      return role.role == Role.ADMIN;
    });
    this.isAdmin = !(admin == null || admin == undefined);
  }
}
