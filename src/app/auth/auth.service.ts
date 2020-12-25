import { HttpClient } from "@angular/common/http";
import { ThrowStmt } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject} from "rxjs";
import { environment } from "src/environments/environment";
import { IAuthData } from "./auth-data.model";

const BACKEND_URL = environment.apiUrl + 'posts/';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private authStatus = new BehaviorSubject<boolean>(null);
    public authStatus$ = this.authStatus.asObservable();

    
    constructor(private http: HttpClient, private router: Router){}
    public setToken(token: string): void {
        this.token = token;
        this.authStatus.next(true);
    }

    public getUserId(): string {
        return this.userId;
    }

    public saveAuthData(expirationDate: Date) {
        const authData = {
            token: this.token,
            expirationDate: expirationDate.toISOString(),
            userId: this.userId
        }
        localStorage.setItem('authData', JSON.stringify(authData));
    }

    private clearAuthData() {
        localStorage.removeItem('authData')
    }
    public getToken(): string {
        return this.token; 
    }

    public setUserId(id: string): void {
        this.userId = id;
    }

    public setTokenTimer(duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }
    signup(data: IAuthData) {
        return this.http.post(BACKEND_URL + 'signup', data);
    }

    login(data: IAuthData) {
        return this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + 'login', data);
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
            const expireIn = new Date(authData.expirationDate).getTime() - now.getTime();
            if(expireIn > 0) {
                this.token = authData.token;
                this.userId = authData.userId
                this.authStatus.next(true);
                this.setTokenTimer(expireIn/1000);
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