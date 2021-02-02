import { CreateUser, DeleteUser } from './../action/users.actions';
import { catchError, filter, map, take, tap } from 'rxjs/operators';
import { IUser } from './../../interfaces/user.interface';
import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { GetUsers, Update } from '../action/users.actions';
import { AuthService } from '../../services/auth.service';


export interface usersStateModel {
    users: IUser[];
}

@State<usersStateModel>({
    name: 'UsersState',
    defaults: {
        users: []
    }
})

@Injectable()
export class UsersState {
    @Selector()
    static users(state: usersStateModel) {
        return state.users;
    }

    constructor(
        private authService: AuthService
    ) { }

    @Action(GetUsers)
    public getUsers({ patchState }: StateContext<usersStateModel>) {
        return this.authService.getJSONUsers().pipe(tap(data => patchState({ users: data })));
    }

    @Action(DeleteUser)
    public deleteUser({ getState, patchState }: StateContext<usersStateModel>, { id }: DeleteUser) {
        return this.authService.deleteJSONUser(id)
            .pipe(tap(() => {
                const state = getState();
                patchState({
                    users: state.users.filter(item => item.id !== id)
                });
            }));
    }


    @Action(Update)
    updateUser({ getState, patchState }: StateContext<usersStateModel>, { user }: Update) {
        return this.authService.updateJSONUser(user).pipe(tap(result => {
            patchState({
                users: [...getState().users, result]
            });
        }));
    }

    @Action(CreateUser)
    createUser({ patchState, getState }: StateContext<usersStateModel>, { payload }: CreateUser) {
        return this.authService.registration(payload).pipe(tap(
            data => {
                patchState({
                    users: [...getState().users, data]
                });
            }
        ));

    }
}