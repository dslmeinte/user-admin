import {validate as isValidEmail} from "email-validator";
import {generate, verify} from "password-hash";
import {v4} from "uuid";
const ValidatePassword = require("validate-password");

import * as events from "../events";
import {IPasswordChangeRequestedUserState} from "../identities/definitions";
import {IdentitiesStore} from "../identities/store";
import * as defs from "./definitions";
import {validateSyntax} from "./validator";


const now = () => new Date();
const isEmpty = (name: string) => name.trim().length === 0;
const passwordValidator = new ValidatePassword();


export function commandProcessor(identitiesStore: IdentitiesStore): (command: defs.Command) => Promise<events.Event> {
    return command => {
        // TODO  syntax of command should already have happened at this point
        const syntaxIssues = validateSyntax(command);
        if (syntaxIssues.length > 0) {
            return Promise.reject(syntaxIssues);
        }

        switch (command.commandType) {
            case "authenticateUser": {
                const user = identitiesStore.userByEmailAddress(command.emailAddress);
                if (user === undefined) {
                    return Promise.reject("email address not known");
                }
                if (user.state.userStateType !== "active") {
                    return Promise.reject("user not active");
                }
                if (!verify(command.password, user.encryptedPassword)) {
                    return Promise.reject("password not valid");
                }
                return Promise.resolve({
                    eventType: "userAuthenticated",
                    timestamp: now(),
                    userId: user.id
                } as events.IUserAuthenticatedEvent);
            }
            case "addIdentityToGroup": {
                const group = identitiesStore.byId(command.groupId);
                const member = identitiesStore.byId(command.memberId);
                if (group === undefined || group.identityType !== "group") {
                    return Promise.reject("group does not exist");
                }
                if (member === undefined) {
                    return Promise.reject("member does not exists");
                }
                if (member.id in group.members) {
                    return Promise.reject("member already in group");
                }
                if (identitiesStore.circularAfterAdding(group.id, member.id)) {
                    return Promise.reject("circularity not permitted");
                }
                return Promise.resolve({
                        eventType: "addedIdentityToGroup",
                        timestamp: now(),
                        groupId: command.groupId,
                        memberId: command.memberId
                    } as events.IAddIdentityToGroupEvent);
            }
            case "confirmEmailAddress": {
                const user = identitiesStore.userByEmailAddress(command.emailAddress);
                if (user === undefined) {
                    return Promise.reject("email address not known");
                }
                if (user.state.userStateType !== "confirmEmailAddress") {
                    return Promise.reject("state not valid for this command");
                } else {
                    if (user.state.token !== command.token) {
                        return Promise.reject("token not valid");
                    }
                }
                return Promise.resolve({
                    eventType: "emailAddressConfirmed",
                    timestamp: now(),
                    userId: user.id
                } as events.IEmailAddressConfirmedEvent);
            }
            case "createGroup": {
                return isEmpty(command.name)
                    ? Promise.reject("name not valid")
                    : Promise.resolve({
                            eventType: "createdGroup",
                            id: v4(),
                            timestamp: now(),
                            name: command.name
                        } as events.ICreateGroupEvent)
                    ;
            }
            case "createUser": {
                if (identitiesStore.userByEmailAddress(command.emailAddress) !== undefined) {
                    return Promise.reject("user with that email address already exists");
                }
                if (isEmpty(command.name)) {
                    return Promise.reject("name empty");
                }
                if (isEmpty(command.password)) {
                    return Promise.reject("password empty");
                }
                const passwordData = passwordValidator.checkPassword(command.password);
                if (passwordData.isValid) {
                    return Promise.reject("password not valid: " +  passwordData.validationMessage);
                }
                if (!isValidEmail(command.emailAddress)) {
                    return Promise.reject("email address not valid");
                }
                return Promise.resolve({
                        eventType: "createdUser",
                        id: v4(),
                        timestamp: now(),
                        name: command.name,
                        emailAddress: command.emailAddress,
                        encryptedPassword: generate(command.password)
                    } as events.ICreateUserEvent);
            }
            case "requestPasswordChange": {
                const user = identitiesStore.userByEmailAddress(command.emailAddress);
                if (user === undefined) {
                    return Promise.reject("email address not known");
                }
                if (user.state.userStateType !== "active") {
                    return Promise.reject("user not active");
                }
                return Promise.resolve({
                        eventType: "identityUpdated",
                        timestamp: now(),
                        id: user.id,
                        data: {
                            state: {
                                userStateType: "passwordChangeRequested",
                                token: v4()
                            } as IPasswordChangeRequestedUserState
                        }
                    } as events.IIdentityUpdatedEvent);
            }
            /*
            * Note: if TypeScript insists on a default case, you've missed a case!
            * Conversely, `command` should have type `never` in the default case.
            */
        }
    };
}

