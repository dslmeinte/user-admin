import {isObject, isString} from "lodash";

import {EventType} from "./events";


export type Command = ICreateUserCommand | ICreateGroupCommand | IAddIdentityToGroupCommand;

export type CommandType = EventType;


export /* abstract */ interface ICommand {
    commandType: CommandType;
}

export interface IAddIdentityToGroupCommand extends ICommand {
    commandType: "addIdentityToGroup";
    groupId: string;
    memberId: string;
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


// TODO  turn into classes since switch-statements is sufficiently Xtend-like


/**
 * Performs a basic syntax check of commands.
 * This is necessary since commands can come from un-/semi-trusted sources.
 * Events are considered to be generated by ourselves, so don't require syntax validation.
 */
export function validateSyntax(command: any): string[] {

    const issues: string[] = [];

    function checkString<T extends Command>(propertyName: keyof T) {
        const value = command[propertyName];
        if (!isString(value) || !value) {
            issues.push(`'${propertyName}' not valid`);
        }
    }

    if (isObject(issues)) {
        switch (command.commandType) {
            case "addIdentityToGroup": {
                checkString<IAddIdentityToGroupCommand>("groupId");
                checkString<IAddIdentityToGroupCommand>("memberId");
                break;
            }
            case "createGroup": {
                checkString<ICreateGroupCommand>("name");
                break;
            }
            case "createUser": {
                checkString<ICreateUserCommand>("name");
                checkString<ICreateUserCommand>("emailAddress");
                checkString<ICreateUserCommand>("password");
                break;
            }
            default: {
                issues.push("'commandType' not valid");
            }
        }
    } else {
        issues.push("not an object");
    }

    return issues;
}

// TODO  replace with JSON Schema check

