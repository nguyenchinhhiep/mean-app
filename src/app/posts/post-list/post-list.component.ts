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
    totalPosts: number = 10;
    pageSize: number = 5;
    pageSizeOptions = [5,10,20]
    constructor(private postsService: PostsService){
    }

    ngOnInit(){
        this.isLoading = true;
        this.postsService.getPosts();
        this.postsService.getPostsUpdateListener().subscribe((posts: IPost[]) => {
            this.isLoading = false;
            this.posts = posts;
        })
    }

    onPageChange(event) {
        console.log(event);
    }

    onDelete(postId: string){
        this.postsService.deletePost(postId);
    }
}