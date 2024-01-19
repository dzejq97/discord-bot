# CommandsManager class

Handles all commands executions, loads, indexing, verificating command requirements etc. Basically its combine for doing everything with commands.

## Properties

> `private client: UClient`

Client instance

---

> `private list: Collection<string, ICommand>`

Holding all commands loaded from modules.

---

> `private cooldowns: CooldownManager`

Another handling combine instance for managing cooldowns of commands.

## Methods

> `async load()`

Initializes commands list by fetching data of every module in ./modules/ directory

###### Returns

`void`

---

> `async seek(msg: Message): Promise<boolean>`

Used inside onMessageCreate event. Verifying prefix, strips command into argument, looking through commands list and executing command after requirements verification. Also passing command context to command execution method.

###### Arguments

`msg: Message`

Message object given by onMessageCreate event

###### Returns

`Promise<boolean>`

**True** if command has beed executed, else **false**.

---

> `private async verifyRequirements(msg: Message, command: ICommand): Promise<boolean>`

Internal private func for verifying requirements defined inside ICommand meta data.

###### Arguments

`msg: Message`

Message object passed from event to *seek()* method.

`command: ICommand`

Command object passed from *seek()* after finding it in commands list collection.

###### Returns

`Promise<boolean>`

**True** if command can be executed, **false** if any of requirements haven't passed verification.


