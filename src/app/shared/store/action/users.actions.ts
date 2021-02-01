import { IUser } from './../../interfaces/user.interface';

export class GetUsers {
    static readonly desc = 'get users';
    static readonly type = '[GetUsers] get users';
}

export class CreateUser {
    static readonly desc = 'create user';
    static readonly type = '[CreateUser] create user';
    constructor(public payload: IUser) { }
}

export class Update {
    public static readonly type = '[Users] Update';
    constructor(public readonly user: IUser) { }
}

export class DeleteUser {
    public static readonly type = '[Users] Delete';
    constructor(public readonly id: number) { }
}