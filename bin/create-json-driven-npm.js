#!/usr/bin/env node

import path from "node:path";
import packageInfo from "../package.json" with { type: "json" };
import scaffold from "../src/index.js";

const usage = `
create-json-driven-npm

Scaffold a clean, type-safe, JSON-driven NPM client architecture without directory sprawl.

Usage:
  npm create json-driven-npm [target-directory] [options]
  npx create-json-driven-npm [target-directory] [options]

Examples:
  npm create json-driven-npm ./src/v4
  npm create json-driven-npm ./my-api-client
  npm create json-driven-npm . --force

Options:
  -f, --force      Overwrite existing files if target directory is not empty
  -h, --help       Show this help message
  -v, --version    Show version (${packageInfo.version})
`;

const args = process.argv.slice(2);

if (args.includes("-h") || args.includes("--help")) {
    console.log(usage.trim());
    process.exit(0);
}

if (args.includes("-v") || args.includes("--version")) {
    console.log(packageInfo.version);
    process.exit(0);
}

const isForce = args.includes("-f") || args.includes("--force");
const targetArg = args.find((arg) => !arg.startsWith("-")) || ".";
const resolvedTarget = path.resolve(process.cwd(), targetArg);

try {
    const { version, copied } = scaffold({
        inTargetDir: resolvedTarget,
        inForce: isForce
    });
    const displayTarget = path.relative(process.cwd(), resolvedTarget) || ".";

    console.log(`
=============================================================
  ⚡ create-json-driven-npm (v${packageInfo.version})
  Zero Directory Sprawl • Data-Driven API Architecture
=============================================================

✨ Scaffolded successfully into: ${displayTarget}
📦 Source Architecture: json-driven-npm (${version})

📁 Scaffolded Architecture:`);

    for (const item of copied) {
        console.log(`   ├── ${item}`);
    }

    const apiPath = copied.includes("api.json") ? "api.json" : path.join("external-api", "api.json");

    console.log(`
👉 Next Steps:
   1. Define your public routes in ${path.join(displayTarget, apiPath)}
   2. Specify your endpoint metadata in ${path.join(displayTarget, "source.json")}
   3. Write your query/fetch logic in ${path.join(displayTarget, "internal-working", "execution", "index.js")}
   4. Run 'create-intellisense' to generate TypeScript declarations (index.d.ts)!

💡 All route trees are automatically mounted in memory at startup!
=============================================================
`);
} catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
}
