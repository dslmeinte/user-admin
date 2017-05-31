import {v4} from "uuid";

import * as events from "../events";
import {IdentitiesStore} from "../identities/store";
import * as defs from "./definitions";
import {validateSyntax} from "./validator";


const now = () => new Date();
const error = Promise.reject;
const success = Promise.resolve;
const isValidName = (name: string) => name.trim().length > 0;


export function commandProcessor(identitiesStore: IdentitiesStore): (command: defs.Command) => Promise<events.Event> {
    return command => {
        // TODO  syntax of command should already have happened at this point
        const syntaxIssues = validateSyntax(command);
        if (syntaxIssues.length > 0) {
            return error(syntaxIssues);
        }
        switch (command.commandType) {
            case "addIdentityToGroup": {
                const group = identitiesStore.byId(command.groupId);
                const member = identitiesStore.byId(command.memberId);
                if (group === undefined || group.identityType !== "group") {
                    return error("group does not exist");
                }
                if (member === undefined) {
                    return error("member does not exists");
                }
                if (member.id in group.members) {
                    return error("member already in group");
                }
                if (identitiesStore.circularAfterAdding(group.id, member.id)) {
                    return error("circularity not permitted");
                }
                return success({
                        eventType: "addedIdentityToGroup",
                        timestamp: now(),
                        groupId: command.groupId,
                        memberId: command.memberId
                    } as events.IAddIdentityToGroupEvent);
            }
            case "confirmEmailAddress": {
                const user = identitiesStore.userByEmailAddress(command.emailAddress);
                if (user === undefined) {
                    return error("email address not known");
                }
                if (user.state.userStateType !== "confirmEmailAddress") {
                    return error("state not valid for this command");
                } else {
                    if (user.state.token !== command.token) {
                        return error("token not valid");
                    }
                }
                return success({
                    eventType: "emailAddressConfirmed",
                    timestamp: now(),
                    userId: user.id
                } as events.IEmailAddressConfirmedEvent);
            }
            case "createGroup": {
                return isValidName(command.name)
                    ? success({
                            eventType: "createdGroup",
                            id: v4(),
                            timestamp: now(),
                            name: command.name
                        } as events.ICreateGroupEvent)
                    : error("name not valid");
            }
            case "createUser": {
                // TODO  validate email address and password
                if (identitiesStore.userByEmailAddress(command.emailAddress) !== undefined) {
                    return error("user with that email address already exists");
                }
                if (!isValidName(command.name)) {
                    return error("name not valid");
                }
                return success({
                        eventType: "createdUser",
                        id: v4(),
                        timestamp: now(),
                        name: command.name,
                        emailAddress: command.emailAddress,
                        hashedPassword: "salt$" + command.password    // TODO  really hash it
                    } as events.ICreateUserEvent);
            }
            /*
            * Note: if TypeScript insists on a default case, you've missed a case!
            * Conversely, `command` should have type `never` in the default case.
            */
        }
    };
}

