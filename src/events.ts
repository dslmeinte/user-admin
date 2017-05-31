export type EventType = "addedIdentityToGroup" | "createdUser" | "createdGroup" | "emailAddressConfirmed";

export type Event = IAddIdentityToGroupEvent | ICreateUserEvent | ICreateGroupEvent | IEmailAddressConfirmedEvent;


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
    hashedPassword: string;
}

export interface ICreateGroupEvent extends ICreateIdentityEvent {
    eventType: "createdGroup";
}

export interface IEmailAddressConfirmedEvent extends IEvent {
    eventType: "emailAddressConfirmed";
    userId: string;
}

