import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
    templateUrl: './header.component.html',
    selector: 'app-header',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated: boolean;
    private sub: Subscription;
    constructor(private authService: AuthService){
    }

    ngOnInit() {
        this.sub = this.authService.authStatus$.subscribe(res => {
            this.isAuthenticated = res;
        })
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}