import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType, HttpResponse, HttpHeaderResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { tap, catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private _router: Router, private _alert: ToastrService) { }
 
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.headers.get('No-Auth') == "true") {
            request.headers.delete('No-Auth');
            return next.handle(request.clone());
        }
        if (request.headers.get('Api') == "true") {
            let url = request.url;
            return next.handle(new HttpRequest<any>('GET', url));
        }
        if (this.isTokenValid) {
            const clonedRequest = request.clone({ headers: request.headers.set("Authorization", "Bearer " + localStorage.getItem('accessToken')) });
            return next.handle(clonedRequest).pipe(
                tap(() => null,
                    error => {
                        if (error.status == 401) {
                            localStorage.removeItem('accessToken');
                            this._router.navigateByUrl('/signIn');
                            this._alert.warning('Session has Expired!');
                        }
                    }
                )
                // catchError(err => {
                //     if (err.status == 401) {
                //         localStorage.removeItem('accessToken');
                //         this._router.navigateByUrl('/signIn');
                //         this._alert.warning('Session has Expired!');
                //         return of(new HttpResponse());
                //     }        
                //     this._alert.error(err.error.message);
                //     return of(err);
                // })
            );
        }
        this._router.navigateByUrl('/signIn');
        this._alert.error('Authentication is required!');
        return null;
    }

    private get isTokenValid() {
        return (localStorage.getItem('accessToken') != undefined || localStorage.getItem('accessToken') != null);
    }
}
