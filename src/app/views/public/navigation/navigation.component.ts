import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  public show:boolean = false;
  public env = environment;

  constructor() { }

  ngOnInit() {
  }

  toggleCollapse() {
    this.show = !this.show
  }
}
