# create-json-driven-npm

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D20.10-brightgreen.svg)](package.json)
[![npm](https://img.shields.io/npm/v/create-json-driven-npm.svg)](https://www.npmjs.com/package/create-json-driven-npm)

The official scaffolding and code-transporting tool for bootstrapping clean, type-safe, **JSON-driven NPM client architectures** without directory sprawl.

It acts as the **bridge** between the architectural blueprint ([json-driven-npm](https://www.npmjs.com/package/json-driven-npm)) and the type generator ([create-intellisense](https://www.npmjs.com/package/create-intellisense)).

---

## The Three-Tier Ecosystem

```text
┌─────────────────────────────────┐
│        1. json-driven-npm       │  ◄── THE SOURCE OF TRUTH
│  • Reference architecture       │      (Holds specifications & standards)
│  • Versions: v1, v2, v3         │
└────────────────┬────────────────┘
                 │
                 │ imported by
                 ▼
┌─────────────────────────────────┐
│   2. create-json-driven-npm     │  ◄── THE TRANSPORTER / SCAFFOLDER (This Package)
│  • Run via: npm create ...      │      (Transports the clean v3 skeleton
│  • Zero-dependency starter      │       into any project or version directory)
└────────────────┬────────────────┘
                 │
                 │ scaffolds target project, which then runs
                 ▼
┌─────────────────────────────────┐
│     3. create-intellisense      │  ◄── THE TYPE GENERATOR
│  • Run via: npx ...             │      (Emits index.d.ts directly from
│  • Instant IDE autocomplete     │       your custom api.json & source.json)
└─────────────────────────────────┘
```

---

## Quick Start

Scaffold the latest architecture (`v3`) into any directory with standard npm syntax:

```bash
# Using standard npm create:
npm create json-driven-npm ./my-api-client

# Or adding a new version inside an existing project:
npm create json-driven-npm ./src/v4

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

## What Gets Scaffolded (Modern `v3` Flattened Layout)

When you scaffold a new client or version directory, `create-json-driven-npm` copies the clean, flattened `v3` skeleton:

```text
<target-directory>/
├── api.json              # Public allowlist of callable dot-paths
├── source.json           # Domain endpoint metadata specification & data
├── index.js              # Composition root exporting the in-memory client
└── internal-working/
    ├── route/            # In-memory route tree assembly engine
    └── execution/        # Single-responsibility query & dispatch pipeline
```

---

## The 3-Step Development Workflow

After scaffolding your project:

1. **Define Your Domain**:
   - Declare your endpoints, resources, and descriptions in `source.json`.
   - Expose your public routes in `api.json` (e.g. `["app.orders.fetch", "app.orders.create"]`).

2. **Add Execution Logic**:
   - `internal-working/execution/` is the **only** place you implement your custom fetch, database, or transport logic. All tree mounting is automated!

3. **Generate TypeScript IntelliSense**:
   - Run [`create-intellisense`](https://www.npmjs.com/package/create-intellisense) in your project:
     ```bash
     npx create-intellisense
     ```
   - It reads your `api.json` and `source.json` to generate `src/index.d.ts` with complete type definitions and JSDoc hover documentation.

---

## 🛡️ Built-in Safety Guard

`create-json-driven-npm` includes an active safety guard to protect your code:
- **Collision Protection**: Refuses to overwrite directories that already contain JSON-driven artifacts (`api.json`, `internal-working`, `source.json`, `index.js`).
- **Clean Directory Enforcement**: Blocks generation into non-empty directories by default (ignoring standard VCS and project metadata like `.git`, `package.json`, `README.md`, `LICENSE`).
- **Explicit Override**: Pass `--force` or `-f` to consciously overwrite.

---

## Features

- ⚡ **Zero Directory Sprawl**: Add 50 endpoints by editing JSON specifications without creating 50 directories.
- 🎯 **Zero Runtime Dependencies**: The scaffolded package runs on pure native Node.js ESM.
- 🧭 **In-Memory Route Assembly**: Builds clean, nested, callable JavaScript object trees at startup.
- 🔒 **Safe & Deterministic**: Automatically selects the highest stable version from `json-driven-npm`.

---

## License

MIT © [KeshavSoft](https://keshavsoft.com/)
