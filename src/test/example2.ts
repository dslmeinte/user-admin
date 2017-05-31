import {Command, commandProcessor} from "../commands";
import {Identities} from "../identities";
import {writeJson} from "./file-utils";

const commands: Command[] = require("../../data/test-commands.json");

const identities = new Identities();
const processCommand = commandProcessor(identities);

Promise.all(commands.map(processCommand))
    .then(events => {
        writeJson("./data/events.json", events);
        events.forEach(event => identities.processEvent(event));
        writeJson("./data/identities.json", identities.serialise());
    });

