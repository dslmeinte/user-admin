import {Command} from "../commands/definitions";
import {commandProcessor} from "../commands/processor";
import {IdentitiesStore} from "../identities/store";
import {writeJson} from "./file-utils";

const commands: Command[] = require("../../data/test-commands.json");

const identitiesStore = new IdentitiesStore();
const processCommand = commandProcessor(identitiesStore);

Promise.all(commands.map(processCommand))
    .then(events => {
        writeJson("./data/events.json", events);
        events.forEach(event => identitiesStore.processEvent(event));
        writeJson("./data/identities.json", identitiesStore.serialise());
    })
    .then(() => {
        console.log("execution successful");
    });

