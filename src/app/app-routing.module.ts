import { AuthGuard } from './shared/guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPageComponent } from './components/main-page/main-page.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
const routes: Routes = [
  { path: 'main-page', component: MainPageComponent, canActivate: [AuthGuard] },
  { path: 'user-info', component: UserInfoComponent, canActivate: [AuthGuard] },
  { path: 'create-user', component: CreateUserComponent },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
