# Instagres

Instant Postgres. No signup required. Powered by [Neon](https://neon.tech).

## CLI Usage

To get started, run one of the commands below.
This will give you a Postgres connection string and add it to a `.env` file.
(You need one of Node.js / Bun / Deno installed.)

```sh
# Node + NPM
npx instagres

# Node + Yarn
yarn dlx instagres

# Node + PNPM
pnpx instagres

# Bun
bunx instagres

# Deno
deno run -A npm:instagres
```

Available options:

```txt
--file   : Path to the .env file - defaults to .env
--name   : Environment variable key for the connection string in the .env file - defaults to DATABASE_URL
--pooler : Get a connection string to a connection pooler - not enabled by default
```

## Library usage

```sh
# NPM
npm install instagres

# Yarn
yarn add instagres

# PNPM
pnpm install instagres

# Bun
bun install instagres
```

Use the `instagres` async function to retrieve an instant Postgres connection string from Instagres. If the `DATABASE_URL` (or a custom key) is not already set in your specified `.env` file, the function will:

1. Prompt the user to generate a new connection string.
1. Save the generated connection string to the specified `.env` file
   (defaults to `.env`) under the specified key (defaults to `DATABASE_URL`)
1. Return the connection string.

```js
// ESM
import instagres from "instagres";

// CommonJS
const { default: instagres } = require("instagres");

// Deno
import instagres from "npm:instagres@^1.1.4";

/**
 * Creates an instant Postgres connection string from Instagres by Neon
 * if not already set in the specified .env file.
 * Prompts the user to optionally generate a connection string,
 * saves it to the .env file, and returns the connection string.
 *
 * @param {Object} params - The function parameters.
 * @param {string} [params.dotEnvFile='.env'] - The path to the .env file.
 * @param {string} [params.dotEnvKey='DATABASE_URL'] - The environment variable key for the connection string.
 * @param {boolean} [params.withPooler=false] - Indicates whether a connection pooler should be used.
 *
 * @returns {Promise<string>} - The Postgres connection string.
 */
// use defaults
const connectionString = await instagres();
// or pass (some) options
const connectionString = await instagres({
  dotEnvFile: ".env",
  dotEnvKey: "DATABASE_URL",
  withPooler: false,
});
```
