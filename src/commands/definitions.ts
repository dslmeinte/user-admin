export type Command = IConfirmEmailAddressCommand | ICreateUserCommand | ICreateGroupCommand | IAddIdentityToGroupCommand;

export type CommandType = "confirmEmailAddress" | "createUser" | "createGroup" | "addIdentityToGroup";


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


// TODO  turn into classes since TS's switch-statement is sufficiently Xtend-like

