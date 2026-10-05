import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import scaffold from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = path.join(__dirname, "temp-test-scaffold");

test("scaffolds JSON-driven architecture and executes cleanly", async (t) => {
    t.after(() => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    const { version, copied } = scaffold({ inTargetDir: tempDir });

    assert.ok(version.startsWith("v"));
    assert.ok(copied.includes("external-api"));
    assert.ok(copied.includes("internal-working"));
    assert.ok(copied.includes("source.json"));
    assert.ok(copied.includes("index.js"));

    assert.ok(fs.existsSync(path.join(tempDir, "external-api", "api.json")));
    assert.ok(fs.existsSync(path.join(tempDir, "external-api", "api.js")));
    assert.ok(fs.existsSync(path.join(tempDir, "internal-working", "route", "index.js")));
    assert.ok(fs.existsSync(path.join(tempDir, "internal-working", "execution", "index.js")));
    assert.ok(fs.existsSync(path.join(tempDir, "source.json")));
    assert.ok(fs.existsSync(path.join(tempDir, "index.js")));

    const entryUrl = pathToFileURL(path.join(tempDir, "index.js")).href;
    const { default: app } = await import(entryUrl);

    assert.equal(typeof app.users.profile.fetch, "function");
    assert.equal(typeof app.reports.summary.fetch, "function");

    const result = await app.users.profile.fetch("tester-99");
    assert.equal(result.status, "success");
    assert.equal(result.resource, "users");
    assert.equal(result.data.id, "tester-99");
});
