export type IdentityType = "user" | "group";

export type Identity = IUser | IGroup;


export interface IIdentity {
    id: string;
    identityType: IdentityType;
    name: string;
}


export interface IUser extends IIdentity {
    identityType: "user";
    emailAddress: string;
    hashedPassword: string;
    state: UserState;
}


export type UserStateType = "active" | "confirmEmailAddress";

export type UserState = IActiveUserState | IConfirmEmailAddressUserState;

export interface IUserState {
    userStateType: UserStateType;
}

export interface IConfirmEmailAddressUserState extends IUserState {
    userStateType: "confirmEmailAddress";
    token: string;
}

export interface IActiveUserState extends IUserState {
    userStateType: "active";
}


export interface IGroup extends IIdentity {
    identityType: "group";
    members: { [memberId: string]: boolean };
}

