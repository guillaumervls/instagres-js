import { parse } from "dotenv";
import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import open from "open";
import pWaitFor from "p-wait-for";

/**
 * Creates an instant Postgres connection string from Instagres by Neon
 * if not already set in the specified .env file.
 * Prompts the user to optionally generate a connection string,
 * saves it to the .env file, and returns the connection string.
 *
 * @param {Object} params - The function parameters.
 * @param {string} [params.dotEnvFile='.env'] - The path to the .env file.
 * @param {string} [params.dotEnvKey='DATABASE_URL'] - The name for the connection string in the .env file.
 * @param {boolean} [params.withPooler=false] - Indicates whether a connection pooler should be used.
 * @param {string} params.source - A name to help us (Instagres & Neon) understand where this is coming from. You should set this to the name of your project.
 *
 * @returns {Promise<string | undefined>} - A promise resolving to the Postgres connection string or undefined if not generated.
 */
const instagres = async ({
	dotEnvFile = ".env",
	dotEnvKey = "DATABASE_URL",
	withPooler = false,
	source,
}: {
	dotEnvFile?: string;
	dotEnvKey?: string;
	withPooler?: boolean;
	source: string;
}): Promise<string | undefined> => {
	if (!source)
		throw new Error(
			"Source parameter is empty. You should set this to the name of your project.",
		);
	const dotEnvContent = existsSync(dotEnvFile)
		? parse(readFileSync(dotEnvFile, "utf8"))
		: {};
	const existingValue = dotEnvContent[dotEnvKey];

	// If the value is already set, we don't need to do anything.
	if (existingValue) {
		console.log(`${dotEnvKey} found in ${dotEnvFile}`);
		return;
	}

	console.log(`${dotEnvKey} not found in ${dotEnvFile}`);
	const rl = createInterface(process.stdin, process.stderr);
	const ok = await rl.question(
		"Would you like an instant Postgres connection string from Neon (No signup required)? (Y/n): ",
	);
	rl.close();
	if (ok.toLowerCase() === "n") {
		console.log("No problem! You can set it up manually.");
		return;
	}

	console.log(
		"\nA tab will open in your browser just to check your're not a bot.",
	);
	console.log("(Nothing to do there, just return here when it's done.)");
	console.log(
		"\nPaste the link below in your browser if it doesn't open automatically:",
	);
	const dbId = randomUUID();
	const verificationUrl = new URL(
		`https://www.instagres.com/databases/${dbId}`,
	);
	verificationUrl.searchParams.append("ref", source);
	console.log(verificationUrl.href);
	open(verificationUrl.href);
	let connString = await pWaitFor<string>(
		async () => {
			const res = await fetch(
				`https://www.instagres.com/api/v1/databases/${dbId}`,
			);
			if (!res.ok) return false;
			return pWaitFor.resolveWith(
				((await res.json()) as { connectionString: string }).connectionString,
			);
		},
		{ before: false, interval: 2000 },
	);
	if (withPooler) {
		const [start, ...end] = connString.split(".");
		connString = `${start}-pooler.${end.join(".")}`;
	}
	console.log("\nHere's your connection string:");
	console.log(connString);

	dotEnvContent[dotEnvKey] = connString;
	writeFileSync(
		dotEnvFile,
		Object.entries(dotEnvContent)
			.map(([k, v]) => `${k}=${v}`)
			.join("\n"),
	);
	console.log(`Saved it to ${dotEnvFile} as ${dotEnvKey}`);

	return connString;
};

export default instagres;
