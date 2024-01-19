# UClient class

Base client class holding neccesary data and managing modules, events and commands. Extends discord.js Client class.

## Properties

> `config: object`

Holds configuration data defined in `config.json` file.

---

> `verbose: boolean`

Determines if running in verbose mode. Used mainly by [Logger](./logger.md) class.

---

> `modules: Collection<string, any>`

Used to store modules loaded during initialization.

---

> `forbidden_events: any[]`

Array of events with *restricted: true* blocking adding these events again in custom modules. It defines event as single-listener event.

---

> `commands: CommandsManager`

Instance of [CommandsManager](./commandsmanager.md) handling all global and module-defined commands and subcommands.

---

> `log: Logger`

Instance of [Logger](./logger.md). Used for logging and handling error catches.

---

> `database: DatabaseManager`

Instance of [DatabaseManager](./databasemanager.md) for managing database queries.

## Methods

> `async run()`

Here everything start. Load modules, commands and event, connect database and login discord API.

---

> `private async load()`

Loading commands and modules from ./modules/ directory. Used only internally by *run()* method.
