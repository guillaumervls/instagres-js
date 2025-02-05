#!/usr/bin/env node

import arg from "arg";
import instagres from "./instagres.js";

(async () => {
	const { "--file": dotEnvFile, "--name": dotEnvKey } = arg({
		"--name": String,
		"--file": String,
	});

	const connString = await instagres({ dotEnvFile, dotEnvKey });
	process.exit(connString ? 0 : 1);
})();
