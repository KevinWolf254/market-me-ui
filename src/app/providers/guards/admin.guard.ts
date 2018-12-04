import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private _userService: UserService, private _router: Router,  private _notify: ToastrService) { 
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this._userService.isAdmin().pipe(
      map(isAdmin => {
        if (!isAdmin){
          this._router.navigate(['bulksms/profile']);
          this._notify.warning('Access rights required!');
        }
        return isAdmin;
      }),
      catchError(err => of(false))
    );
  }
}
