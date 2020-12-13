import { Component } from '@angular/core';
import { IPost } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedPosts: IPost[] = [
    {
      title: 'Post 1',
      content: 'This is post 1'
    },
    {
      title: 'Post 2',
      content: 'This is post 2'
    },
    {
      title: 'Post 3',
      content: 'This is post 3'
    }
  ];
  onPostAdded(post){
    this.storedPosts.push(post);
  }

}
