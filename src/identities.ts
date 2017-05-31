import {keys, values} from "lodash";

import {Event} from "./events";


export type IdentityType = "user" | "group";

export type Identity = IUser | IGroup;


export interface IIdentity {
    id: string;
    identityType: IdentityType;
    name: string;
}


export interface IUser extends IIdentity {
    identityType: "user";
    emailAddress: string;
    hashedPassword: string;
}


export interface IGroup extends IIdentity {
    identityType: "group";
    members: { [memberId: string]: boolean };
}



export class Identities {

    private identities: { [id: string]: Identity } = {};

    constructor(serialisedIdentities: Identity[] = []) {
        for (const identity of serialisedIdentities) {
            this.identities[identity.id] = identity;
        }
    }

    processEvent(event: Event): void {
        switch (event.eventType) {
            case "addIdentityToGroup": {
                (this.identities[event.groupId] as IGroup).members[event.memberId] = true;
                break;
            }
            case "createGroup": {
                const group: IGroup = {
                    id: event.id,
                    identityType: "group",
                    name: event.name,
                    members: {}
                };
                this.identities[event.id] = group;
                break;
            }
            case "createUser": {
                const user: IUser = {
                    id: event.id,
                    identityType: "user",
                    name: event.name,
                    emailAddress: event.emailAddress,
                    hashedPassword: event.hashedPassword
                };
                this.identities[event.id] = user;
                break;
            }
        }
    }

    byId(id: string): Identity | undefined {
        return this.identities[id];
    }

    userByEmailAddress(emailAddress: string): IUser | undefined {
        const id = keys(this.identities).find(identityId => {
            const identity = this.byId(identityId)!;
            switch (identity.identityType) {
                case "user": return identity.emailAddress === emailAddress;
                default: return false;
            }
        });
        return id === undefined ? undefined : this.byId(id) as IUser;
    }

    circularAfterAdding(groupId: string, memberId: string): boolean {
        const visited: { [id: string]: boolean } = {};
        const self = this;
        function inCycle(id: string): boolean {
            if (id in visited) {
                return true;
            }
            visited[id] = true;
            const identity = self.byId(id)!;
            return (identity.identityType === "group")
                ? (id === groupId ? inCycle(memberId) : false) || keys(identity.members).some(inCycle)
                : false;
        }
        return keys(self.identities).some(inCycle);
    }
    // TODO  unit test this...

    serialise(): Identity[] {
        return values(this.identities);
    }

}

