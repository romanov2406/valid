import { CreateUser } from './../../shared/store/action/users.actions';
import { Store } from '@ngxs/store';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { countryList } from './../../shared/countries';
import { AuthService } from './../../shared/services/auth.service';
import { take } from 'rxjs/operators';
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
  file: any;
  inputFileValue: string;
  defaultValidatorsProperties = [Validators.required, Validators.minLength(2), Validators.maxLength(10)];
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private afStorage: AngularFireStorage,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', this.defaultValidatorsProperties],
      lastName: ['', this.defaultValidatorsProperties],
      userName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2)]],
      addressType: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required, Validators.minLength(6)]],
      postalCode: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.getStaticUser();
  }


  validateField(selector): boolean {
    return this.registerForm.controls[selector].status === 'INVALID' && this.registerForm.controls[selector].touched;
  }


  getStaticUser(): void {
    this.authService.getJSONUsers().pipe(take(1)).subscribe(
      data => {
        this.users = data;
      }
    );
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
      country: this.registerForm.controls.country.value,
      postalCode: this.registerForm.controls.postalCode.value,
    }
    let { id, ...user } = USER
    if (this.users.every(el => el.email !== user.email)) {
      this.store.dispatch(new CreateUser(user as IUser));
      alert('success');
      this.getStaticUser();
      this.registerForm.reset();
      this.isNext = false;
      this.userImage = '';
    } else {
      alert('Something is wrong');
    }
  }

  uploadFile(event): void {
    this.file = event.target.files[0];
    const filePath = `images/${this.file.name}`;
    this.upload = this.afStorage.upload(filePath, this.file);
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
        this.userImage = '';
        this.inputFileValue = '';
      })
      .catch(err => console.log(err));
  }


}

