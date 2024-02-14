import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private authservice:AuthService){}

  ngOnInit(): void {
      
  }


  onSubmit(formValue:any){
    this.authservice.login(formValue.email , formValue.password)

  }

}
