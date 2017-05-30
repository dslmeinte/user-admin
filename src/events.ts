export type EventType = "createUser" | "createGroup" | "deleteIdentity" | "addIdentityToGroup";

export type Event = ICreateUserEvent | ICreateGroupEvent | IDeleteIdentityEvent | IAddIdentityToGroupEvent;


export /* abstract */ interface IEvent {
    eventType: EventType;
    timestamp: Date;
}

export /* abstract */ interface ICreateIdentityEvent extends IEvent {
    id: string;
    name: string;
    publicId: any;
}

export interface ICreateUserEvent extends ICreateIdentityEvent {
    eventType: "createUser";
    emailAddress: string;
    hashedPassword: string;
}

export interface ICreateGroupEvent extends ICreateIdentityEvent {
    eventType: "createGroup";
}


export interface IDeleteIdentityEvent extends IEvent {
    eventType: "deleteIdentity";
    id: string;
}

export interface IAddIdentityToGroupEvent extends IEvent {
    eventType: "addIdentityToGroup";
    groupId: string;
    memberId: string;
    asAdmin: boolean;
}

