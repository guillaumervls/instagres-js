#!/usr/bin/env node

import arg from "arg";
import instagres from "./instagres.js";

(async () => {
	const {
		"--file": dotEnvFile,
		"--name": dotEnvKey,
		"--pooler": withPooler,
	} = arg({
		"--name": String,
		"--file": String,
		"--pooler": Boolean,
	});

	const connString = await instagres({
		dotEnvFile,
		dotEnvKey,
		withPooler,
		source: "instagres-cli",
	});
	process.exit(connString ? 0 : 1);
})();
