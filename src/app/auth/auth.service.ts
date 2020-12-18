import { HttpClient } from "@angular/common/http";
import { ThrowStmt } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject} from "rxjs";
import { IAuthData } from "./auth-data.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private token: string;
    private tokenTimer: any;
    private authStatus = new BehaviorSubject<boolean>(null);
    public authStatus$ = this.authStatus.asObservable();

    
    constructor(private http: HttpClient, private router: Router){}
    public setToken(token: string): void {
        this.token = token;
        this.authStatus.next(true);
    }

    public saveAuthData(expirationDate: Date) {
        const authData = {
            token: this.token,
            expirationDate: expirationDate.toISOString()
        }
        localStorage.setItem('authData', JSON.stringify(authData));
    }

    private clearAuthData() {
        localStorage.removeItem('authData')
    }
    public getToken(): string {
        return this.token; 
    }

    public setTokenTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }
    signup(data: IAuthData) {
        return this.http.post('http://localhost:3000/api/posts/signup', data);
    }

    login(data: IAuthData) {
        return this.http.post<{token: string, expireIn: number}>('http://localhost:3000/api/posts/login', data);
    }

    logout() {
        this.token = null;
        if(this.tokenTimer) {
            clearTimeout(this.tokenTimer);
        }
        this.clearAuthData();
        this.authStatus.next(false);
        this.router.navigate(['/']);
    }

    autoAuth(){
        const authData = this.getAuthData();
        const now = new Date();
        if(authData) {
            const expireIn = authData.expirationDate.getTime() - now.getTime();
            if(expireIn > 0) {
                this.token = authData.token;
                this.authStatus.next(true);
                this.setTokenTimer(expireIn);
            }
        }
        
    }

    getAuthData() {
        const authData = localStorage.getItem('authData');
        if(!authData){
            return;
        }
        return JSON.parse(authData);
    }
}