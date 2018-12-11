import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpEventType, HttpResponse, HttpHeaderResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { tap, catchError } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private notify: ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.headers.get('No-Auth') == "true") {
            return next.handle(request.clone());
        }
        if (request.headers.get('Api') == "true") {
            let url = request.url;
            return next.handle(new HttpRequest<any>('GET', url));
        }
        if (this.isTokenValid) {
            const clonedRequest = request.clone({ headers: request.headers.set("Authorization", "Bearer " + localStorage.getItem('accessToken')) });
            return next.handle(clonedRequest).pipe(
                // tap(() => null,
                //     error => {
                //         if (error.status == 401) {
                //             localStorage.removeItem('accessToken');
                //             this.router.navigateByUrl('/signIn');
                //             this.notify.warning('Session has Expired!');
                //         }
                //     }
                // )
                catchError(err => {
                    if (err.status == 401) {
                        localStorage.removeItem('accessToken');
                        this.router.navigateByUrl('/signIn');
                        this.notify.warning('Session has Expired!');
                    }
                    return of(new HttpResponse());
                })
            );
        }
        this.router.navigateByUrl('/signIn');
        this.notify.error('Authentication is required!');
        return null;
    }

    private get isTokenValid() {
        return (localStorage.getItem('accessToken') != undefined || localStorage.getItem('accessToken') != null);
    }
}
