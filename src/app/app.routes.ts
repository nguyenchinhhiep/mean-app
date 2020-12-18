import { Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";

export const routes: Routes = [
    {
        path: '',
        component: PostListComponent
    },
    {
        path: 'create',
        component: PostCreateComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'edit/:id',
        component: PostCreateComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    }
]