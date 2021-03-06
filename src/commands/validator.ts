import {isString} from "lodash";

import * as defs from "./definitions";


/**
 * Performs a basic syntax check of commands.
 * This is necessary since commands can come from un-/semi-trusted sources.
 * Events are considered to be generated by ourselves, so don't require syntax validation.
 */
export function validateSyntax(command: any): string[] {

    const issues: string[] = [];

    function checkString<T extends defs.Command>(propertyName: keyof T) {
        const value = command[propertyName];
        if (!isString(value) || !value) {
            issues.push(`'${propertyName}' not valid`);
        }
    }

    switch (command.commandType) {
        case "addIdentityToGroup": {
            checkString<defs.IAddIdentityToGroupCommand>("groupId");
            checkString<defs.IAddIdentityToGroupCommand>("memberId");
            break;
        }
        case "confirmEmailAddress": {
            checkString<defs.IConfirmEmailAddressCommand>("emailAddress");
            checkString<defs.IConfirmEmailAddressCommand>("token");
            break;
        }
        case "createGroup": {
            checkString<defs.ICreateGroupCommand>("name");
            break;
        }
        case "createUser": {
            checkString<defs.ICreateUserCommand>("name");
            checkString<defs.ICreateUserCommand>("emailAddress");
            checkString<defs.ICreateUserCommand>("password");
            break;
        }
        default: {
            issues.push("'commandType' not valid");
        }
    }

    return issues;
}

// TODO  replace with JSON Schema check

