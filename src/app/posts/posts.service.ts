import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { from, Subject } from "rxjs";
import { IPost } from "./post.model";
import {map} from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private posts: IPost[] = [];
    private postsUpdated = new Subject<{posts: IPost[], totalRecords: number}>();
    constructor(private http: HttpClient,
        private router: Router){
    }

    getPosts(options?){
        const queryParams = `?pageSize=${options.pageSize}&page=${options.currentPage}`;
        this.http.get<{message:string, posts: any, totalRecords: number}>('http://localhost:3000/api/posts' + queryParams)
        .pipe(map(postData => {
            return {
               posts: postData.posts.map(post => {
                    return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath,
                        createdBy: post.createdBy
                    }
                }),
                totalRecords: postData.totalRecords
            } 
        }))
        .subscribe(transformedPostData => {
            console.log(transformedPostData);
            this.posts = transformedPostData.posts;
            this.postsUpdated.next({
                posts:[...this.posts],
                totalRecords: transformedPostData.totalRecords
            });
        })
    }

    getPostsUpdateListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(post: IPost){
        const postData = new FormData();
        postData.append('title', post.title);
        postData.append('content', post.content);
        postData.append('image', post.image, post.title);

        this.http.post<{message: string, post: any}>('http://localhost:3000/api/posts', postData)
        .subscribe(res => {
            this.router.navigate(['/'])
        });
    }

    getPostById(id: string){
        return this.http.get<{message: string, post: IPost}>('http://localhost:3000/api/posts/' + id);
    }

    updatePost(post: IPost){
        const postData = new FormData();
        if(!!post.image) {
            postData.append('id', post.id);
            postData.append('title', post.title);
            postData.append('content', post.content);
            postData.append('image', post.image);
        } else {
            postData.append('id', post.id);
            postData.append('title', post.title);
            postData.append('content', post.content);
            postData.append('imagePath', post.imagePath);
        }
        this.http.put('http://localhost:3000/api/posts/' + post.id, postData).subscribe((res:any) => {
            this.router.navigate(['/'])
        })
    }
    deletePost(id: string) {
        return this.http.delete('http://localhost:3000/api/posts/' + id);
    }
}