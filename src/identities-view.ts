import {Event} from "./events";


export type IdentityType = "user" | "group";

export type Identity = IUser | IGroup;


export interface IIdentity {
    id: string;
    identityType: IdentityType;
    name: string;
    publicId: any;
    permissions: { [permissionId: string]: any };
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

    processEvent(event: Event): void {
        switch (event.eventType) {
            case "createUser": {
                const user: IUser = {
                    id: event.id,
                    identityType: "user",
                    name: event.name,
                    publicId: event.publicId,
                    emailAddress: event.emailAddress,
                    hashedPassword: event.hashedPassword,
                    permissions: {}
                };
                this.identities[event.id] = user;
                break;
            }
            case "createGroup": {
                const group: IGroup = {
                    id: event.id,
                    identityType: "group",
                    name: event.name,
                    publicId: event.publicId,
                    permissions: {},
                    members: {}
                };
                this.identities[event.id] = group;
                break;
            }
            case "deleteIdentity": {
                delete this.identities[event.id];
                break;
            }
            case "addIdentityToGroup": {
                (this.identities[event.groupId] as IGroup).members[event.memberId] = event.asAdmin;
                break;
            }
        }
    }

}

