import { CreateUser } from './../../shared/store/action/users.actions';
import { Store } from '@ngxs/store';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { countryList } from './../../shared/countries';
import { AuthService } from './../../shared/services/auth.service';
import { take } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  isNext: boolean;
  countries: string[] = countryList;
  registerForm: FormGroup;
  users: IUser[] = [];
  upload: any;
  userImage: string;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private afStorage: AngularFireStorage,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required,Validators.minLength(6)],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      addressType: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(6)]],
      city: ['', [Validators.required, Validators.minLength(6)]],
      country: ['', [Validators.required, Validators.minLength(6)]],
      postalCode: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.getStaticUser();
  }

  getStaticUser(): void {
    this.authService.getJSONUsers().pipe(take(1)).subscribe(
      data => {
        this.users = data;
      }
    )
  }

  registration(): void {
    const USER: IUser = {
      id: 1,
      img: this.userImage,
      firstName: this.registerForm.controls.firstName.value,
      lastName: this.registerForm.controls.lastName.value,
      userName: this.registerForm.controls.userName.value,
      phone: this.registerForm.controls.phone.value,
      email: this.registerForm.controls.email.value,
      password: this.registerForm.controls.password.value,
      addressType: this.registerForm.controls.addressType.value,
      address: this.registerForm.controls.address.value,
      city: this.registerForm.controls.city.value,
      postalCode: this.registerForm.controls.postalCode.value,
    }
    delete USER.id // mutation
    if (this.users.every(el => el.email !== USER.email)) {
      this.store.dispatch(new CreateUser(USER));
      alert('success');
      this.getStaticUser();
      this.registerForm.reset();
      this.isNext = false;
    } else {
      alert('Wrong');
    }
  }

  
  checkValidation(selector): any {
   return this.registerForm.controls[selector].touched ? '1px solid red' : '1px solid green';
  }


  uploadFile(event): void {
    const file = event.target.files[0];
    const filePath = `images/${file.name}`;
    this.upload = this.afStorage.upload(filePath, file);
    this.upload.then(image => {
      this.afStorage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.userImage = url;
        event.target.files = null;
      });
    });
  }

  deleteImage(): void {
    this.afStorage.storage.refFromURL(this.userImage).delete()
      .then(() => {
        alert('success');
      })
      .catch(err => console.log(err));
  }

}

