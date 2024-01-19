# Logger class

Class used for logging data into console and files and handle errors.

## Constructor

> `new Logger(client?: UClient)`

Argument *client* is optional due to database connection in index.ts file where client is not instantiated. Client is passed later during [UClient](./uclient.md) instance construction. Always use *log* instance of *client* and dont create instances of Logger.

## Properties

> `client: UClient`

Reference to base [UClient](./uclient.md) instance.

---

> `logsDir: string`

Logs files directory

---

> `private logStream`

WriteStream used for write logs into files.

## Methods

> `private timestamp(): string`

Used internally for log file name and console timestamp..

###### Returns

`string`

Timestamp string created from *new Date()* object.

---

> `info(message: string): void`

Logs message into file, and if run mode is *verbose* logs into console.

###### Arguments

`message: string`

Message that will be logged into console and file.

###### Returns

`void`

---

> `success(message: string)`

Logs success message into file and console. Even without *verbose* mode.

###### Arguments

`message: string`

Message that will be logged into console and file.

###### Returns

`void`

---

> `error(error: any, fatal?: boolean)`

Used mainly in try-catch block. Handles the error check if error is string or instance of Error and logs it into file and console.

###### Arguments

`error: any`

Error instance or error string catched.

`fatal?: boolean`

If fatal is true it kills node process.

###### Returns

`void`
