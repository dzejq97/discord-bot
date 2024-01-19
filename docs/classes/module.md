# Module class

Used for defining custom modules and all its data. Should be rather extended than used directly. Manages load of events listener and commands.

## Constructor

Check [Creating module](../guides/createmodule.md)

## Properties

> `client: UClient | undefined`

UClient instance reference

---

> `meta: IModuleMeta | undefined`

Meta data defines responsible for module begaviour.

---

> `commands: Collection<string, ICommand>

Stores all commands and subcomands loaded from commands directory. Later is used by CommandsManager to index commands and handle them.

## Methods

> `async load(client: UClient)

Loading commands and events from files and register module inside UClient instance.

###### Arguments

`client: UClient`

Client instance to register module.

###### Returns

`void`
