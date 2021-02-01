import { Component, OnInit } from '@angular/core';
import { IUser } from './../../shared/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  localUser: IUser;
  constructor(private route: Router) { }

  ngOnInit(): void { 
    this.getLocalUser();
  }

  getLocalUser(): void {
    this.localUser = JSON.parse(localStorage.getItem('user'));
  }

  signOut(): void {
    localStorage.clear();
    this.localUser = null;
    this.route.navigateByUrl('create-user')
  }

}
