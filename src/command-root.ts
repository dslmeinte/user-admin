import {v4} from "uuid";

import {ICommandResult, Command} from "./commands";
import {Event, IAddIdentityToGroupEvent, ICreateGroupEvent, ICreateUserEvent, IDeleteIdentityEvent} from "./events";
import {Identities} from "./identities-view";


function now() {
    return new Date();
}

// TODO  add validation

function success(event: Event): ICommandResult {
    return { event };
}

export async function processCommand(identities: Identities, command: Command): Promise<ICommandResult> {
    switch (command.commandType) {
        case "createUser": {
            return success({
                eventType: "createUser",
                id: v4(),
                timestamp: now(),
                name: command.name,
                publicId: command.publicId,
                emailAddress: command.emailAddress,
                hashedPassword: "salt$" + command.password    // TODO  really hash it
            } as ICreateUserEvent);
        }
        case "createGroup": {
            return success({
                eventType: "createGroup",
                id: v4(),
                timestamp: now(),
                name: command.name,
                publicId: command.publicId
            } as ICreateGroupEvent);
        }
        case "deleteIdentity": {
            return success({
                eventType: "deleteIdentity",
                id: command.id,
                timestamp: now()
            } as IDeleteIdentityEvent);
        }
        case "addIdentityToGroup": {
            return success({
                eventType: "addIdentityToGroup",
                timestamp: now(),
                groupId: command.groupId,
                memberId: command.memberId,
                asAdmin: command.asAdmin
            } as IAddIdentityToGroupEvent);
        }
        /*
         * Note: if TypeScript insists on a default case, you've missed a case!
         * Conversely, `command` should have type `never` in the default case.
         */
    }
}

