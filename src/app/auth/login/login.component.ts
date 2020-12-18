import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    isLoading: boolean;
    constructor(private authService: AuthService, private router: Router){

    }
    onLogin(form: NgForm){
        if(form.invalid) return;
        this.authService.login(form.value).subscribe(res => {
            this.authService.setToken(res.token);
            this.authService.setTokenTimer(res.expireIn);
            const now = new Date();
            const expirationDate = now.getTime() + res.expireIn;
            this.authService.saveAuthData(new Date(expirationDate)); 
            this.router.navigate(['/']);
        })
    }
}