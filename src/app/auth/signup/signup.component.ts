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
    
    onSignup(form: NgForm){
        if(form.invalid) return;
        this.authService.onSignup(form.value).subscribe(res =>{
            console.log(res);
        });
    }
}