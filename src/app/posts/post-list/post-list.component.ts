import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { IPost } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
    templateUrl: './post-list.component.html',
    selector: 'app-post-list',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
    posts: IPost[] = [];
    isLoading: boolean = false;
    pageSize: number = 5;
    currentPage: number = 1;
    pageSizeOptions = [5,10,20];
    userId: string;
    totalRecords: number;
    isAuthenticated: boolean;
    constructor(private postsService: PostsService, private authService: AuthService){
    }

    ngOnInit(){
        this.isLoading = true;
        this.userId = this.authService.getUserId();
        const queryParams = {
            pageSize: this.pageSize,
            currentPage: this.currentPage
        }
        this.postsService.getPosts(queryParams);
        this.authService.authStatus$.subscribe(res => {
            this.isAuthenticated = res;
        })
        this.postsService.getPostsUpdateListener().subscribe((data) => {
            this.isLoading = false;
            this.posts = data.posts;
            this.totalRecords = data.totalRecords
        })
    }

    onPageChange(event) {
        this.isLoading = true;
       this.currentPage = event.pageIndex + 1;
       this.pageSize = event.pageSize;
       const queryParams = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
    }
       this.postsService.getPosts(queryParams);
    }

    onDelete(postId: string){
        this.isLoading = true;
        this.postsService.deletePost(postId).subscribe(res => {            
            this.postsService.getPosts({
                pageSize: this.pageSize,
                currentPage: this.currentPage
            });
            this.isLoading = false;
        });
    }
}