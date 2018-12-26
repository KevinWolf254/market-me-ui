import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserReport } from '../../models/models.model';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserProfileResolverService implements Resolve<UserReport>{

  constructor(private _userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserReport>{
    return this._userService.getUserProfile().pipe(
      tap(report => {
        this._userService.profile = report;
      }),
      catchError(err => of(new UserReport()))
    );
  }

}
