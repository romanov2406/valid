import { Select, Store } from '@ngxs/store';
import { GetUsers, Update, DeleteUser } from './../../shared/store/action/users.actions';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AuthService } from './../../shared/services/auth.service';
import { IUser } from './../../shared/interfaces/user.interface';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { pluck, take } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { UsersState } from 'src/app/shared/store/state/users.state';

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
  searchField:string;
  
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
    this.user = user
    this.editForm.controls.firstName.patchValue(user.firstName);
    this.editForm.controls.lastName.patchValue(user.lastName);
    this.editForm.controls.userName.patchValue(user.userName)
    this.editForm.controls.phone.patchValue(user.phone);
    this.editForm.controls.email.patchValue(user.email);
    this.editForm.controls.addressType.patchValue(user.addressType);
    this.editForm.controls.address.patchValue(user.address);
    this.editForm.controls.city.patchValue(user.city);
    this.editForm.controls.postalCode.patchValue(user.postalCode);
  };

  saveUser(): void {
    this.user.firstName = this.editForm.controls.firstName.value
    this.user.lastName = this.editForm.controls.lastName.value
    this.user.userName = this.editForm.controls.userName.value
    this.user.phone = this.editForm.controls.phone.value
    this.user.email = this.editForm.controls.email.value
    this.user.addressType = this.editForm.controls.addressType.value
    this.user.address = this.editForm.controls.address.value
    this.user.city = this.editForm.controls.city.value
    this.user.postalCode = this.editForm.controls.postalCode.value;
    // this.user = {
    //   firstName: this.editForm.controls.firstName.value,
    //   lastName:
    // }

    this.store.dispatch(new Update(this.user)).subscribe(
      () => this.getStaticUsers()
    )
  }
}
