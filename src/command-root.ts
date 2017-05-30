import {v4} from "uuid";

import {Command, validateSyntax} from "./commands";
import {Event, IAddIdentityToGroupEvent, ICreateGroupEvent, ICreateUserEvent} from "./events";
import {Identities} from "./identities-view";


function now() {
    return new Date();
}


export interface ICommandResult {
    event?: Event;
    errorMessages?: string[];
}


function success(event: Event): ICommandResult {
    return { event };
}

function error(...errorMessages: string[]): ICommandResult {
    return { errorMessages: errorMessages };
}


export async function processCommand(identities: Identities, command: Command): Promise<ICommandResult> {
    // TODO  syntax of command should already have happened at this point
    const syntaxIssues = validateSyntax(command);
    if (syntaxIssues.length > 0) {
        return error(...syntaxIssues);
    }
    switch (command.commandType) {
        case "addIdentityToGroup": {
            const group = identities.byId(command.groupId);
            const member = identities.byId(command.memberId);
            if (group === undefined || group.identityType !== "group") {
                return error("group does not exist");
            }
            if (member === undefined) {
                return error("member does not exists");
            }
            if (member.id in group.members) {
                return error("member already in group");
            }
            if (identities.circularAfterAdding(group.id, member.id)) {
                return error("circularity not permitted");
            }
            return success({
                    eventType: "addIdentityToGroup",
                    timestamp: now(),
                    groupId: command.groupId,
                    memberId: command.memberId
                } as IAddIdentityToGroupEvent);
        }
        case "createGroup": {
            // TODO  validate non-emptyness of name
            return success({
                    eventType: "createGroup",
                    id: v4(),
                    timestamp: now(),
                    name: command.name
                } as ICreateGroupEvent);
        }
        case "createUser": {
            // TODO  validate non-emptyness of name
            // TODO  validate email address and password
            return (identities.userByEmailAddress(command.emailAddress) === undefined)
                ? success({
                        eventType: "createUser",
                        id: v4(),
                        timestamp: now(),
                        name: command.name,
                        emailAddress: command.emailAddress,
                        hashedPassword: "salt$" + command.password    // TODO  really hash it
                    } as ICreateUserEvent)
                : error("user with that email address already exists");
        }
        /*
         * Note: if TypeScript insists on a default case, you've missed a case!
         * Conversely, `command` should have type `never` in the default case.
         */
    }
}

