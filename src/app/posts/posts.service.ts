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
    private postsUpdated = new Subject<IPost[]>();
    constructor(private http: HttpClient,
        private router: Router){
    }

    getPosts(){
        this.http.get<{message:string, posts: any}>('http://localhost:3000/api/posts')
        .pipe(map(postData => {
            return postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath
                }
            })
        }))
        .subscribe(postData => {
            this.posts = postData;
            this.postsUpdated.next([...this.posts]);
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
            const postAdded: IPost = {
                id: res.post.id,
                title: post.title,
                content: post.content,
                imagePath: res.post.imagePath
            }
            this.posts.push(postAdded);
            this.postsUpdated.next([...this.posts]);
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
            const updatedPosts = [...this.posts];
            const oldIndex = updatedPosts.findIndex(p => p.id === post.id);
            updatedPosts[oldIndex] = {
                ...post,
                imagePath: res.imagePath
            };
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(['/'])
        })
    }
    deletePost(id: string) {
        this.http.delete('http://localhost:3000/api/posts/' + id).subscribe(res => {
            const updatePosts = this.posts.filter(post => post.id !== id);
            this.posts = updatePosts;
            this.postsUpdated.next([...this.posts]);
        });
    }
}