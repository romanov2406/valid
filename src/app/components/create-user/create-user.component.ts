import { IAddress } from './../../shared/interfaces/user.interface';
import { CreateUser } from './../../shared/store/action/users.actions';
import { Store } from '@ngxs/store';

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { countryList } from '../../shared/countries';
import { AuthService } from './../../shared/services/auth.service';
import { take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  // Variables
  isNext: boolean;


  addressArray: FormArray;


  countries: string[] = countryList;
  registerForm: FormGroup;
  addressForm: FormGroup;
  users: IUser[] = [];
  upload: any;
  userImage: string;
  file: any;
  isUpload: boolean;
  inputFileValue: string;

  array:any[] = [];


  // RegExp
  regExpPhoneNumber = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
  regExpPassword = /^[a-zA-Z0-9]{8,15}$/;
  regExpName = /^[a-zA-Z]{3,15}$/;
  regExpEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  // Validators Default Properties
  defaultValidatorsProperties = [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern(this.regExpName)];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private afStorage: AngularFireStorage,
    private store: Store
  ) { }



  ngOnInit(): void {
    // Registrations About User Form
    this.registerForm = this.formBuilder.group({
      firstName: ['', this.defaultValidatorsProperties],
      lastName: ['', this.defaultValidatorsProperties],
      userName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(this.regExpPhoneNumber)]],
      email: ['', [Validators.required, Validators.pattern(this.regExpEmail)]],
      password: ['', [Validators.required, Validators.pattern(this.regExpPassword)]],
    });

    // Registration Addres Form
    this.addressForm = this.formBuilder.group({
      addressType: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      country: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      postalCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5), Validators.pattern(/[0-9]/)]],
    })
    this.addressArray = new FormArray([]);
    this.getStaticUser();
  }

  addAddress() {
    this.addressArray.push(this.addressForm);
    // this.array.push(this.addressForm)
    this.addressForm.reset()
    console.log(this.addressForm.controls.addressType.value)
  }

  deleteAddress(index): void {
    this.addressArray.controls.splice(index, 1);
  }
  

  validateField(selector): boolean {
    return this.registerForm.controls[selector].status === 'INVALID' && this.registerForm.controls[selector].touched;
  }2

  // Get All Userfrom Server
  getStaticUser(): void {
    this.authService.getJSONUsers().pipe(take(1)).subscribe(data => { this.users = data; });
  }

  // User Registration
  registration(): void {
    const ADDRESS: IAddress = {
      addressType: this.addressForm.controls.addressType.value,
      address: this.addressForm.controls.address.value,
      city: this.addressForm.controls.city.value,
      country: this.addressForm.controls.country.value,
      postalCode: this.addressForm.controls.postalCode.value,
    }
    const USER: IUser = {
      id: 1,
      img: this.userImage,
      firstName: this.registerForm.controls.firstName.value,
      lastName: this.registerForm.controls.lastName.value,
      userName: this.registerForm.controls.userName.value,
      phone: this.registerForm.controls.phone.value,
      email: this.registerForm.controls.email.value,
      password: this.registerForm.controls.password.value,
      address: [ADDRESS]
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

  // Upload User Image
  uploadFile(event): void {
    this.file = event.target.files[0];
    const filePath = `images/${this.file.name}`;
    this.upload = this.afStorage.upload(filePath, this.file);
    this.upload.then(image => {
      this.afStorage.ref(`images/${image.metadata.name}`).getDownloadURL().subscribe(url => {
        this.userImage = url;
        event.target.files = null;
        this.isUpload = true;
      });
    });
  }


  // DeleteUserImage
  deleteImage(): void {
    this.afStorage.storage.refFromURL(this.userImage).delete()
      .then(() => {
        this.userImage = '';
        this.inputFileValue = '';
        this.isUpload = false;
      })
      .catch(err => console.log(err));
  }


}

