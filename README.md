# User administration

This is an implementation of a user administration, i.e. a system to administer users in groups and organise authorization around that.
The implementation currently has the following characteristics:

* It uses CQRS.
* It is written TypeScript.
* It is incomplete.


## Model

* **Users** and **groups** are both **identities**.
* A user has a technical and a public ID (such as an OpenID), a name, an email address, a password, and one or more (named) security tokens (stored securely, obviously).
* A group has a technical ID, a name, a set of constituent identities (with a flag per identity as to whether it has admin rights).
* An identity references a set of **permissions** to which it has access.
* A permission has an ID, a type, and other required meta data.
	The ID is leading here - the rest doesn't even have to be stored here.

Constraint: identities are not allowed to be circular, i.e. a group cannot have itself as a nested constituent.


## CQRS

The *commands and events* seem to be isomorphic (modulo constraint checking) in this case, and consist of the usual CRUD operations on the concepts defined above.
The *views* are: identities, including permissions, and the events itself to see what happened when, possibly filtered for (un-)invites.


## Status

...of this implementation: simple prototype.

It lacks many, many details and features but will grow over time.
I'll try to add "complete" features, in the sense that they don't leave new TODOs behind.

