import { Component } from "@angular/core";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    isLoading: boolean;
    loginValue: any = {
        email: '',
        password: ''
    }
    
    onLogin(){

    }
}