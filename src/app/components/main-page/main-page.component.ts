import { Store } from '@ngxs/store';
import { GetUsers, Update, DeleteUser } from './../../shared/store/action/users.actions';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { IUser, IAddress } from './../../shared/interfaces/user.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pluck, take, map } from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  users: IUser[] = [];
  addressOfUsers: IAddress[] = [];
  editForm: FormGroup;
  modalRef: BsModalRef;
  user: IUser;
  searchField: string;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required]],
      addressType: ['', [Validators.required]],
      address: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
    });
    this.getStaticUsers();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getStaticUsers(): void {
    this.store.dispatch(new GetUsers()).pipe(take(1), pluck('UsersState', 'users')).subscribe(el => {
      this.users = el;
      this.addressOfUsers = el.map(el => el.address).flat();
    },
    err => console.log);
  }

  deleteUser(user: IUser): void {
    this.store.dispatch(new DeleteUser(+user.id)).subscribe(
      () => this.getStaticUsers()
    )
  }

  edit(user: IUser): void {
    this.user = user;
    this.editForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      phone: user.phone,
      email: user.email,
      // address: [{
      //   addressType: user.address.addressType,
      //   address: user.address.address,
      //   country: user.address.country,
      //   city: user.address.city,
      //   postalCode: user.address.postalCode
      // }]

    });
  };

  saveUser(): void {
    this.user = {
      ...this.user,
      firstName: this.editForm.controls.firstName.value,
      lastName: this.editForm.controls.lastName.value,
      userName: this.editForm.controls.userName.value,
      phone: this.editForm.controls.phone.value,
      email: this.editForm.controls.email.value,
      // addressType: this.editForm.controls.addressType.value,
      address: this.editForm.controls.address.value,
      // city: this.editForm.controls.city.value,
      // country: this.editForm.controls.country.value,
      // postalCode: this.editForm.controls.postalCode.value
    }

    this.store.dispatch(new Update(this.user)).subscribe(
      () => this.getStaticUsers()
    )
  }
}
