import { Store } from '@ngxs/store';
import { GetUsers, Update, DeleteUser } from './../../shared/store/action/users.actions';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { IUser } from './../../shared/interfaces/user.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pluck, take } from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
  users: IUser[] = [];
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
      email: ['', [Validators.required, Validators.minLength(6)]],
      addressType: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(6)]],
      city: ['', [Validators.required, Validators.minLength(6)]],
      postalCode: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.getStaticUsers();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getStaticUsers(): void {
    this.store.dispatch(new GetUsers()).pipe(take(1), pluck('UsersState', 'users')).subscribe(el => {
      this.users = el
    });
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
      addressType: user.addressType,
      address: user.address,
      city: user.city,
      postalCode: user.postalCode
    })
  };

  saveUser(): void {
    this.user = {
      ...this.user,
      firstName: this.editForm.controls.firstName.value,
      lastName: this.editForm.controls.lastName.value,
      userName: this.editForm.controls.userName.value,
      phone: this.editForm.controls.phone.value,
      email: this.editForm.controls.email.value,
      addressType: this.editForm.controls.addressType.value,
      address: this.editForm.controls.address.value,
      city: this.editForm.controls.city.value,
      postalCode: this.editForm.controls.postalCode.value
    }

    this.store.dispatch(new Update(this.user)).subscribe(
      () => this.getStaticUsers()
    )
  }
}
