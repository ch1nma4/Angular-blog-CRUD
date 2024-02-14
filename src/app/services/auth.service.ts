import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  LoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGuard : boolean = false

  constructor(private afAuth:AngularFireAuth, private toastr:ToastrService , private router:Router) { }

  login(email:any , password:any){
    this.afAuth.signInWithEmailAndPassword(email , password).then(locref=>{
      this.toastr.success('Logged In Successfully..!')
      this.loadUser();
      this.LoggedIn.next(true);
      this.isLoggedInGuard= true;
      this.router.navigate(['/'])
    }).catch(e=>{
      this.toastr.warning('Invalid Email or Password..!');
    })
  }

  loadUser(){
    this.afAuth.authState.subscribe(user=>{
      
      localStorage.setItem('user',JSON.stringify(user));
    })
  }

  logout(){
    this.afAuth.signOut().then(()=>{
      this.toastr.success("User Logged Out Successfully..!")
      localStorage.removeItem('user')
      this.LoggedIn.next(false);
      this.isLoggedInGuard = false;
      this.router.navigate(['/login'])
    })
  }

  isLoggedIn(){
    return this.LoggedIn.asObservable();
  }
}
