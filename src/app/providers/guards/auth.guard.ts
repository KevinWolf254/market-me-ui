import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authenticated: boolean;
  private expireTime: number; 

  constructor(private userService: UserService, private router: Router){
    this.userService.expiresAtObserver.subscribe(time => this.expireTime = time);
    this.userService.authenticatedObserver.subscribe(isAuth => this.authenticated = isAuth);
  }
  
  canActivate(
    next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // if(!this.isAuth){
    //   this.router.navigate(['/signIn']);
    //   return false;
    // }
    return true;
  }

  private get isAuth(): boolean{
    return Date.now() < this.expireTime && this.authenticated;
  }
}
