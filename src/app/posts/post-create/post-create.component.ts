import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IPost } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
    templateUrl: './post-create.component.html',
    selector: 'app-post-create',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
    inputTitle: string;
    inputContent: string;
    private mode:string = 'create';
    private postId: string;
    post: IPost = null;
    isLoading = false;
    constructor(private postsService: PostsService,
        private route: ActivatedRoute){   
    }

    ngOnInit(){
        
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            this.postId = paramMap.get('id');
            if(this.postId){
                this.mode = 'edit';
                this.isLoading = true;
                this.postsService.getPostById(this.postId).subscribe(res => {
                    this.isLoading = false;
                    this.post = res.post;
                });
            }else {
                this.postId = null;
                this.mode = 'create';
                
            }
        })
    }
    onSavePost(form: NgForm){
        if(form.invalid) return;
        if(this.mode === 'create') {
            const post: IPost = {  
                title: form.value.title,
                content: form.value.content
            }
            this.postsService.addPost(post);
        } else {
            this.postsService.updatePost({  
                id: this.postId,
                title: form.value.title,
                content: form.value.content
            });
        }
        
        
        form.resetForm();
    }
}