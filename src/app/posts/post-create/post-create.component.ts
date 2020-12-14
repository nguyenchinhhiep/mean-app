import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { IPost } from '../post.model';
import { PostsService } from '../posts.service';
import { mineType } from './mine-type.validator';

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
    postForm: FormGroup;
    imageUrl: any;
    constructor(private postsService: PostsService,
        private fb: FormBuilder,
        private route: ActivatedRoute){   
    }

    ngOnInit(){
        this.postForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            content: ['', [Validators.required]],
            imagePath: [],
            image: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mineType]
            })
        });
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            this.postId = paramMap.get('id');
            if(this.postId){
                this.mode = 'edit';
                this.isLoading = true;
                this.postsService.getPostById(this.postId).subscribe(res => {
                    this.isLoading = false;
                    this.post = res.post;
                    this.postForm.patchValue({
                        title: this.post.title,
                        content: this.post.content,
                        image: this.post.imagePath,
                        imagePath: this.post.imagePath
                    })
                });
            }else {
                this.postId = null;
                this.mode = 'create';
                
            }
        })
    }
    onSavePost(){
        if(this.postForm.invalid) return;
        if(this.mode === 'create') {
            const post: IPost = {  
                title: this.postForm.value.title,
                content: this.postForm.value.content,
                image: this.postForm.value.image
            }
            this.postsService.addPost(post);
        } else {
            this.postsService.updatePost({  
                id: this.postId,
                title: this.postForm.value.title,
                content: this.postForm.value.content,
                image: this.postForm.value.image,
                imagePath: this.postForm.value.imagePath
            });
        }
        
        
        this.postForm.reset();
    }

    onFileChange(event: Event){
        const file = (event.target as HTMLInputElement).files[0];
        this.postForm.get('image').setValue(file);
        this.postForm.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.postForm.get('imagePath').setValue(reader.result);
        };
        reader.readAsDataURL(file);
    }
}