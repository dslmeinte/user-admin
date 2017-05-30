export type EventType = "createUser" | "createGroup" | "deleteIdentity" | "addIdentityToGroup";

export type Event = ICreateUserEvent | ICreateGroupEvent | IAddIdentityToGroupEvent;


export /* abstract */ interface IEvent {
    eventType: EventType;
    timestamp: Date;
}

export /* abstract */ interface ICreateIdentityEvent extends IEvent {
    id: string;
    name: string;
}

export interface ICreateUserEvent extends ICreateIdentityEvent {
    eventType: "createUser";
    emailAddress: string;
    hashedPassword: string;
}

export interface ICreateGroupEvent extends ICreateIdentityEvent {
    eventType: "createGroup";
}

export interface IAddIdentityToGroupEvent extends IEvent {
    eventType: "addIdentityToGroup";
    groupId: string;
    memberId: string;
}

