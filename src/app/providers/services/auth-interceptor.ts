import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { UserService } from "./user.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    private token: string;

    constructor(private router: Router, private userService: UserService){
        this.userService.tokenObserver.subscribe(token => this.token = token);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(request.headers.get('No-Auth') == "true"){
            return next.handle(request.clone());
        }
        if(request.headers.get('Api') == "true"){
            let url = request.url;
            return next.handle(new HttpRequest<any>('GET',url));
        }
        if(this.token != null || this.token != ''){
            let clonedRequest = request.clone({
                headers: request.headers.set("Authorization", "Bearer "+this.token)
                }
            );
            return next.handle(clonedRequest)
                .pipe(
                    tap(() => null,
                    error => this.router.navigateByUrl('/signIn')
                )
            );
        }
        // if(localStorage.getItem('userToken') != null){
        //     const clonedRequest = request.clone({
        //     headers: request.headers.set("Authorization", "Bearer "+localStorage.getItem('userToken'))
        //     });
        //     return next.handle(clonedRequest)
        //     .pipe(
        //         tap(
        //         success =>{                    
        //         },
        //         error => {
        //             if (error.status === 401){
        //                 localStorage.removeItem('userToken');
        //                 localStorage.removeItem('userRole');
        //                 this.router.navigateByUrl('/signIn');
        //             }                        
        //         })
        //     );
        // }
        // else{
        //     this.router.navigateByUrl('/signIn');
        // }
    }
}
