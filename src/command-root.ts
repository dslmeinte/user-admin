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
                    memberId: command.memberId,
                    asAdmin: command.asAdmin
                } as IAddIdentityToGroupEvent);
        }
        case "createGroup": {
            // TODO  validate (unicity of) publicId?
            return success({
                    eventType: "createGroup",
                    id: v4(),
                    timestamp: now(),
                    name: command.name,
                    publicId: command.publicId
                } as ICreateGroupEvent);
        }
        case "createUser": {
            // TODO  validate email address and password
            // TODO  validate (unicity of) publicId?
            return (identities.userByEmailAddress(command.emailAddress) === undefined)
                ? success({
                        eventType: "createUser",
                        id: v4(),
                        timestamp: now(),
                        name: command.name,
                        publicId: command.publicId,
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

