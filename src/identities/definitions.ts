// (generated by Hierarchy DSL)


export type IdentityType = "group"
    | "user";

export type Identity = IGroup
    | IUser;

export /* abstract */ interface IIdentity {
    identityType: IdentityType;
    id: string;
    name: string;
}

export interface IGroup extends IIdentity {
    identityType: "group";
    members: { [memberId: string]: boolean };
}

export interface IUser extends IIdentity {
    identityType: "user";
    emailAddress: string;
    encryptedPassword: string;
    state: UserState;
}


export type UserStateType = "active"
    | "confirmEmailAddress"
    | "passwordChangeRequested";

export type UserState = IActiveUserState
    | IConfirmEmailAddressUserState
    | IPasswordChangeRequestedUserState;

export /* abstract */ interface IUserState {
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



