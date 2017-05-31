import {commandProcessor} from "../commands";
import {IAddIdentityToGroupCommand, ICreateUserCommand} from "../commands";
import {Identities} from "../identities";

const identities: Identities = new Identities();
const processCommand = commandProcessor(identities);

processCommand({
        commandType: "addIdentityToGroup",
        groupId: "1",
        memberId: "2"
    } as IAddIdentityToGroupCommand)
    .catch(error => {
        console.dir(error);
    })
    .then(() => processCommand({
            commandType: "createUser",
            name: "Meinte",
            emailAddress: "meinte.boersma@gmail.com",
            password: "hash brown horse battery staple"
        } as ICreateUserCommand)
    )
    .then(event => {
        identities.processEvent(event);
        console.dir(identities);
    });

