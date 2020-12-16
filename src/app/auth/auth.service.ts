import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IAuthData } from "./auth-data.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private http: HttpClient){}
    onSignup(data: IAuthData) {
        return this.http.post('http://localhost:3000/api/posts/signup', data);
    }
}