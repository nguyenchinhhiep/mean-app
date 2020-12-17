import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    isLoading: boolean;
    constructor(private authService: AuthService){

    }
    onLogin(form: NgForm){
        if(form.invalid) return;
        this.authService.login(form.value).subscribe(res => {
            console.log(res);
        })
    }
}