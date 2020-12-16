import { Component, OnInit } from '@angular/core';
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
    totalRecords: number;
    constructor(private postsService: PostsService){
    }

    ngOnInit(){
        this.isLoading = true;
        const queryParams = {
            pageSize: this.pageSize,
            currentPage: this.currentPage
        }
        this.postsService.getPosts(queryParams);
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
            this.isLoading = false;
            this.postsService.getPosts({
                pageSize: this.pageSize,
                currentPage: this.currentPage
            })
        });
    }
}