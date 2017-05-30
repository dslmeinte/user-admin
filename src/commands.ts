import {Event, EventType} from "./events";


export type Command = ICreateUserCommand | ICreateGroupCommand | IDeleteIdentityCommand | IAddIdentityToGroupCommand;

export type CommandType = EventType;

export /* abstract */ interface ICommand {
    commandType: CommandType;
}

export /* abstract */ interface ICreateIdentityCommand extends ICommand {
    name: string;
    publicId: any;
}

export interface ICreateUserCommand extends ICreateIdentityCommand {
    commandType: "createUser";
    emailAddress: string;
    password: string;
}

export interface ICreateGroupCommand extends ICreateIdentityCommand {
    commandType: "createGroup";
}

export interface IDeleteIdentityCommand extends ICommand {
    commandType: "deleteIdentity";
    id: string;
}

export interface IAddIdentityToGroupCommand extends ICommand {
    commandType: "addIdentityToGroup";
    groupId: string;
    memberId: string;
    asAdmin: boolean;
}


export interface ICommandResult {
    event?: Event;
    errorMessage?: string;
}

