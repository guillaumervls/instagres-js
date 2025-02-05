# Instagres

Instant Postgres. No signup required. Powered by [Neon](https://neon.tech).

## CLI Usage

To get started, run:

```sh
npx instagres
```

Running this will give you a Postgres connection string and add it to a `.env` file. (You need NodeJS installed.)

## Library usage

```sh
npm install instagres
```

Use the `instagres` async function to retrieve an instant Postgres connection string from Instagres. If the `DATABASE_URL` (or a custom key) is not already set in your specified `.env` file, the function will:

1. Prompt the user to generate a new connection string.
1. Save the generated connection string to the specified `.env` file
   (defaults to `.env`) under the specified key (defaults to `DATABASE_URL`)
1. Return the connection string.

```js
/**
 * Creates an instant Postgres connection string from Instagres by Neon
 * if not already set in the specified .env file.
 * Prompts the user to optionally generate a connection string,
 * saves it to the .env file, and returns the connection string.
 *
 * @param {Object} params - The function parameters.
 * @param {string} [params.dotEnvFile='.env'] - The path to the .env file.
 * @param {string} [params.dotEnvKey='DATABASE_URL'] - The environment variable key for the connection string.
 *
 * @returns {Promise<string>} - The Postgres connection string.
 */
const connectionString = await instagres({ dotEnvFile, dotEnvKey });
```
