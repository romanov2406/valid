import { take } from 'rxjs/operators';
import { IUser } from './../../shared/interfaces/user.interface';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  
  constructor(private authService: AuthService) { }
  users: IUser[] = [];
  ngOnInit(): void {
    this.getStaticUsers();
  }



  getStaticUsers(): void {
    this.authService.getJSONUsers().pipe(take(1)).subscribe(
      data => {
        this.users = data;
      }
    );
  }

}
