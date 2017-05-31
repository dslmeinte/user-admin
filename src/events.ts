import {Identity} from "./identities/definitions";

export type EventType = "addedIdentityToGroup" | "createdUser" | "createdGroup" | "emailAddressConfirmed" | "identityUpdated" | "userAuthenticated";

export type Event = IAddIdentityToGroupEvent | ICreateUserEvent | ICreateGroupEvent | IEmailAddressConfirmedEvent | IIdentityUpdatedEvent | IUserAuthenticatedEvent;


export /* abstract */ interface IEvent {
    eventType: EventType;
    timestamp: Date;
}

export interface IAddIdentityToGroupEvent extends IEvent {
    eventType: "addedIdentityToGroup";
    groupId: string;
    memberId: string;
}

export /* abstract */ interface ICreateIdentityEvent extends IEvent {
    id: string;
    name: string;
}

export interface ICreateUserEvent extends ICreateIdentityEvent {
    eventType: "createdUser";
    emailAddress: string;
    encryptedPassword: string;
}

export interface ICreateGroupEvent extends ICreateIdentityEvent {
    eventType: "createdGroup";
}

export interface IEmailAddressConfirmedEvent extends IEvent {
    eventType: "emailAddressConfirmed";
    userId: string;
}

export interface IIdentityUpdatedEvent extends IEvent {
    eventType: "identityUpdated";
    id: string;
    data: Partial<Identity>;
}

export interface IUserAuthenticatedEvent extends IEvent {
    eventType: "userAuthenticated";
    userId: string;
}

