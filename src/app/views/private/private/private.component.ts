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

  constructor(private _userService: UserService) {}

  ngOnInit() {
    this._userService.profileObserver.subscribe(profile => this.profile = profile);
  }
  toggleCollapse() {
    this.show = !this.show
  }
  toggleCollapse2() {
    this.show2 = !this.show2
  }
  public get units() {
    return this.profile.client.creditAmount;
  }
  public get currency() {
    return this.profile.client.country.currency.toLowerCase();
  }
  public get name() {
    return this.profile.user.otherNames + ' ' + this.profile.user.surname;
  }
  public get isAdmin() {
    let admin = this.profile.roles.find(role => {
      return role.role == Role.ADMIN;
    });
    return !(admin == null || admin == undefined);
  }
}