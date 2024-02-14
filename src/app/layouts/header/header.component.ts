import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  userEmail :string = '';
  isLoggedIn$ : Observable<boolean>

  constructor( private authService:AuthService){
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser !== null) {
      const user = JSON.parse(storedUser);
      if (user.email) {
        this.userEmail = user.email;
      } else {
        console.error('User email not found in localStorage');
      }
    } else {
      console.error('User data not found in localStorage');
    }

    this.authService.isLoggedIn();
}

  onlogout(){
    this.authService.logout();
  }
}


