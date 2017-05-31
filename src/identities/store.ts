import {keys, values} from "lodash";
import {v4} from "uuid";

import {Event} from "../events";
import {IGroup, IUser, Identity} from "./definitions";


export class IdentitiesStore {

    private identities: { [id: string]: Identity } = {};

    constructor(serialisedIdentities: Identity[] = []) {
        for (const identity of serialisedIdentities) {
            this.identities[identity.id] = identity;
        }
    }

    processEvent(event: Event): void {
        switch (event.eventType) {
            case "emailAddressConfirmed": {
                (this.identities[event.userId] as IUser).state = {
                    userStateType: "active"
                };break;
            }
            case "groupCreated": {
                const group: IGroup = {
                    id: event.id,
                    identityType: "group",
                    name: event.name,
                    members: {}
                };
                this.identities[event.id] = group;
                break;
            }
            case "identityAddedToGroup": {
                (this.identities[event.groupId] as IGroup).members[event.memberId] = true;
                break;
            }
            case "identityUpdated": {
                const identity = this.identities[event.id]!;
                this.identities[event.id] = { ...identity, ...event.data } as Identity;
                break;
            }
            case "userAuthenticated": {
                // do nothing: event serves as paper trail
                break;
            }
            case "userCreated": {
                const user: IUser = {
                    id: event.id,
                    identityType: "user",
                    name: event.name,
                    emailAddress: event.emailAddress,
                    encryptedPassword: event.encryptedPassword,
                    state: {
                        userStateType: "confirmEmailAddress",
                        token: v4()
                    }
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

