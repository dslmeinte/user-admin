import {assert} from "chai";

import * as commands from "../commands/definitions";
import {commandProcessor} from "../commands/processor";
import * as events from "../events";
import {IdentitiesStore} from "../identities/store";
import {writeJson} from "./file-utils";


describe("commands processor", () => {

    const identitiesStore = new IdentitiesStore();
    const processCommand = commandProcessor(identitiesStore);

    it("should error on wrong input for createUser", done => {
        processCommand({
            commandType: "createUser",
            name: "   ",
            emailAddress: "me@apple.com",
            password: "1234"
        } as commands.ICreateUserCommand)
            .then(_ => {
                done(new Error("should error"));
            })
            .catch(error => {
                assert.equal(error, "name empty");
            })
            .then(done);
    });

    it("should error on wrong input for addIdentity", done => {
        processCommand({
                commandType: "addIdentityToGroup",
                groupId: "1",
                memberId: "2"
            } as commands.IAddIdentityToGroupCommand)
            .then(_ => {
                done(new Error("should error"));
            })
            .catch(error => {
                assert.equal(error, "group does not exist");
            })
            .then(done);
    });

    it("should process createUser command correctly", done => {
        processCommand({
                    commandType: "createUser",
                    name: "Meinte",
                    emailAddress: "me@apple.com",
                    password: "hash brown horse battery staple"
                } as commands.ICreateUserCommand)
            .then(event => {
                assert.equal(event.eventType, "userCreated");
                const userCreatedEvent = event as events.IUserCreatedEvent;
                assert.equal(userCreatedEvent.name, "Meinte");
                identitiesStore.processEvent(event);
                assert.ok(identitiesStore.userByEmailAddress("me@apple.com"));
            })
            .then(done, done);
    });

    it("should process the test commands without errors", done => {
        const commands: commands.Command[] = require("../../data/test-commands.json");
        Promise.all(commands.map(processCommand))
            .then(events => {
                writeJson("./data/events.json", events);
                events.forEach(event => identitiesStore.processEvent(event));
                writeJson("./data/identities.json", identitiesStore.serialise());
            })
            .then(done, done);
    });

});

