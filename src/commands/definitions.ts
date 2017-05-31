export type Command = IAddIdentityToGroupCommand | IAuthenticateUserCommand | IConfirmEmailAddressCommand | ICreateUserCommand | ICreateGroupCommand | IRequestPasswordChange;

export type CommandType = "addIdentityToGroup" | "authenticateUser" | "confirmEmailAddress" | "createUser" | "createGroup" | "requestPasswordChange";


export /* abstract */ interface ICommand {
    commandType: CommandType;
}

export interface IAddIdentityToGroupCommand extends ICommand {
    commandType: "addIdentityToGroup";
    groupId: string;
    memberId: string;
}

export interface IConfirmEmailAddressCommand extends ICommand {
    commandType: "confirmEmailAddress";
    emailAddress: string;
    token: string;
}

export /* abstract */ interface ICreateIdentityCommand extends ICommand {
    name: string;
}

export interface ICreateGroupCommand extends ICreateIdentityCommand {
    commandType: "createGroup";
}

export interface ICreateUserCommand extends ICreateIdentityCommand {
    commandType: "createUser";
    emailAddress: string;
    password: string;
}

export interface IAuthenticateUserCommand extends ICommand {
    commandType: "authenticateUser";
    emailAddress: string;
    password: string;
}

export interface IRequestPasswordChange extends ICommand {
    commandType: "requestPasswordChange";
    emailAddress: string;
}

