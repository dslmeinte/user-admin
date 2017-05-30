import {processCommand} from "./command-root";
import {ICreateUserCommand} from "./commands";
import {} from "./file-utils";
import {Identities} from "./identities-view";

const identities: Identities = new Identities();

processCommand(identities, {
        commandType: "createUser",
        name: "Meinte",
        description: "allround software value creator",
        emailAddress: "meinte.boersma@gmail.com",
        password: "hash brown horse battery staple",
        publicId: "some OpenID string"
    } as ICreateUserCommand)
    .then(result => {
        if (result.event) {
            identities.processEvent(result.event);
            console.dir(identities);
        } else {
            console.error(result.errorMessage);
        }
    });

