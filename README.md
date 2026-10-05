# create-json-driven-npm

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D20.10-brightgreen.svg)](package.json)

The official scaffolding tool for bootstrapping clean, type-safe, **JSON-driven NPM client architectures** without directory sprawl.

Companion package to [json-driven-npm](https://www.npmjs.com/package/json-driven-npm).

---

## Quick Start

Scaffold the JSON-driven architecture directly into any directory:

```bash
# Using npm create:
npm create json-driven-npm ./src/v13

# Or using npx:
npx create-json-driven-npm ./my-api-client

# Overwrite existing files in non-empty directories:
npm create json-driven-npm . --force
```

### CLI Options

| Option | Alias | Description |
| :--- | :--- | :--- |
| `--force` | `-f` | Bypass safety guard and overwrite existing files |
| `--help` | `-h` | Display CLI usage instructions |
| `--version` | `-v` | Display package version |

---

## 🛡️ Built-in Safety Guard

`create-json-driven-npm` includes an active safety guard to protect your code:
- **Collision Protection**: Refuses to overwrite directories that already contain JSON-driven artifacts (`external-api`, `internal-working`, `source.json`, `index.js`).
- **Clean Directory Enforcement**: Blocks generation into non-empty directories by default (ignoring standard VCS and project metadata like `.git`, `package.json`, `README.md`, `LICENSE`).
- **Explicit Override**: Pass `--force` or `-f` to consciously overwrite.


---

## What Gets Scaffolded (2 Folders & 2 Files)

```text
<target-directory>/
├── external-api/
│   ├── api.json             # Public allowlist of callable dot-paths
│   └── api.js               # Public client entry point
├── internal-working/
│   ├── route/               # Dynamic in-memory route mounting engine
│   └── execution/           # Step-by-step query & execution pipeline
├── source.json              # Domain endpoint metadata specification
└── index.js                 # Re-exports public client facade
```

---

## The Single Point of Customization

In this architecture, you never create nested folders for new endpoints.

1. **`source.json`**: Declare your endpoint resources, actions, and metadata.
2. **`external-api/api.json`**: Add the route path to the public allowlist (e.g. `"app.users.profile.fetch"`).
3. **`internal-working/execution/index.js`**: **This is the ONLY file you write custom logic in.**
   Coordinate input validation, network dispatch, and response formatting in this 4-line pipeline.

---

## Features

- ⚡ **Zero Directory Sprawl**: Add 50 endpoints by editing 2 JSON files, creating 0 JavaScript files.
- 🎯 **Single Default Export**: Clean, unambiguous module boundaries.
- 📦 **Zero External Runtime Dependencies**: Pure native Node.js ESM.
- 🧭 **In-Memory Route Tree**: Dynamic, recursive tree assembly on startup.

---

## License

MIT © [KeshavSoft](https://github.com/keshavsoft)
