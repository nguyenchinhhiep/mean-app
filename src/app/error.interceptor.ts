import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private _snackBar: MatSnackBar) {
    }
    intercept(req: HttpRequest<any>, next: HttpHandler){
       return next.handle(req).pipe(
           catchError((error: HttpErrorResponse) => {
            this._snackBar.open('An error occured', 'hide', {
                duration: 2000,
              });
               return throwError(error);
           })
       )
    }
}