import {Identity} from "./identities/definitions";

export type EventType = "identityAddedToGroup" | "userCreated" | "groupCreated" | "emailAddressConfirmed" | "identityUpdated" | "userAuthenticated";

export type Event = IEmailAddressConfirmedEvent | IGroupCreatedEvent | IIdentityAddedToGroupEvent | IIdentityUpdatedEvent | IUserAuthenticatedEvent | IUserCreatedEvent;


export /* abstract */ interface IEvent {
    eventType: EventType;
    timestamp: Date;
}

export /* abstract */ interface IIdentityCreatedEvent extends IEvent {
    id: string;
    name: string;
}

export interface IEmailAddressConfirmedEvent extends IEvent {
    eventType: "emailAddressConfirmed";
    userId: string;
}

export interface IGroupCreatedEvent extends IIdentityCreatedEvent {
    eventType: "groupCreated";
}

export interface IIdentityAddedToGroupEvent extends IEvent {
    eventType: "identityAddedToGroup";
    groupId: string;
    memberId: string;
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

export interface IUserCreatedEvent extends IIdentityCreatedEvent {
    eventType: "userCreated";
    emailAddress: string;
    encryptedPassword: string;
}

