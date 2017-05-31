import {commandProcessor} from "../commands/processor";
import {IAddIdentityToGroupCommand, ICreateUserCommand} from "../commands/definitions";
import {IdentitiesStore} from "../identities/store";

const identitiesStore: IdentitiesStore = new IdentitiesStore();
const processCommand = commandProcessor(identitiesStore);

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
        identitiesStore.processEvent(event);
        console.dir(identitiesStore);
    });

