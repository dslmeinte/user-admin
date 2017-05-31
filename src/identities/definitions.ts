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
    encryptedPassword: string;
    state: UserState;
}


export type UserStateType = "active" | "confirmEmailAddress" | "passwordChangeRequested";

export type UserState = IActiveUserState | IConfirmEmailAddressUserState | IPasswordChangeRequestedUserState;

export interface IUserState {
    userStateType: UserStateType;
}

export interface IActiveUserState extends IUserState {
    userStateType: "active";
}

export interface IConfirmEmailAddressUserState extends IUserState {
    userStateType: "confirmEmailAddress";
    token: string;
}

export interface IPasswordChangeRequestedUserState extends IUserState {
    userStateType: "passwordChangeRequested";
    token: string;
}


export interface IGroup extends IIdentity {
    identityType: "group";
    members: { [memberId: string]: boolean };
}

