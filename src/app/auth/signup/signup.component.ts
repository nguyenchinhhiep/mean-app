import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent {
    isLoading: boolean;
    constructor(private authService: AuthService){}
    
    onSignup(form){
        if(form.invalid) return;
        this.authService.signup(form.value).subscribe(res =>{
            console.log(res);
        }, err => {
            
        }, () => {
            this.isLoading = false;
        });
    }
}