import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { FormBuilder, FormGroup, Validators , FormControl } from '@angular/forms';
import { Post } from '../../models/post';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';

interface Categorypost {
  data: {
    category: string;
  };
  id: string;
}

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent implements OnInit {

  
  permalink : string = '';
  imgSrc : any = './assets/no-image-found.jpg'; 
  selectedImg : any;
  categories :  Categorypost[] = [];
  postForm! : FormGroup 
  post:any;
  formStatus : string = 'Add New';
  docId:string='';

  constructor( private categoryservice : CategoriesService , private fb : FormBuilder , private postService:PostsService , private route:ActivatedRoute){

    this.route.queryParams.subscribe(val =>{

      this.docId = val['id']

      if(this.docId){
        this.postService.loadOneData(val['id']).subscribe(post=>{

          this.post = post
          this.postForm = this.fb.group({
            title: [this.post.title, [Validators.required , Validators.minLength(10)]],
            permalink : [this.post.permalink,Validators.required],
            expect : [this.post.expect , [Validators.required , Validators.minLength(50)]],
            category : [`${this.post.category.categoryId}-${this.post.category.category}`, Validators.required],
            postImg : ['' , Validators.required],
            content : [this.post.content ,  Validators.required]
          })
          this.imgSrc = this.post.postImgPath
          this.formStatus = "Edit";
        })
      }

      else{
        this.postForm = this.fb.group({
          title: ['', [Validators.required , Validators.minLength(10)]],
          permalink : ['',Validators.required],
          expect : ['' , [Validators.required , Validators.minLength(50)]],
          category : ['', Validators.required],
          postImg : ['' , Validators.required],
          content : ['',  Validators.required]
        })
      }

    })
  }

  ngOnInit(): void {
      this.categoryservice.loadData().subscribe(val => {
        this.categories = val;
      })
  }

  get fc(){
    return this.postForm.controls;
  }

  onTitleChanged($event :any){

    const title = $event.target.value;
    this.permalink = title.replace(/\s/g,'-');
  }

  showPreview($event :any){
    const reader = new FileReader();
    reader.onload = (e)=> {
      this.imgSrc = e.target?.result
    }

    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];

  }
  onSubmit(){

    let splitted = this.postForm.value.category.split('-')
    console.log(splitted)


    const postData: Post ={
      title:this.postForm.value.title,
      permalink:this.postForm.value.permalink,
      category:{
        categoryId: splitted[0],
        category: splitted[1]
      },
      postImgPath: '',
      expect:this.postForm.value.expect,
      content:this.postForm.value.content,
      isFeatured:false,
      views:0,
      status:'new',
      createdAt:new Date()
    }
    this.postService.uploadImage(this.selectedImg , postData , this.formStatus , this.docId);
    this.postForm.reset()
    this.imgSrc = './assets/no-image-found.jpg'; 
  }


}
