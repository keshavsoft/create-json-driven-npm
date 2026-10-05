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

test("guard blocks execution when target directory already contains JSON-driven artifacts", (t) => {
    const guardArtifactDir = path.join(__dirname, "temp-test-guard-artifacts");
    fs.mkdirSync(path.join(guardArtifactDir, "external-api"), { recursive: true });

    t.after(() => {
        if (fs.existsSync(guardArtifactDir)) {
            fs.rmSync(guardArtifactDir, { recursive: true, force: true });
        }
    });

    assert.throws(
        () => scaffold({ inTargetDir: guardArtifactDir, inForce: false }),
        /Target directory already contains existing JSON-driven artifacts/
    );
});

test("guard blocks execution when target directory has non-ignorable files", (t) => {
    const guardNonEmptyDir = path.join(__dirname, "temp-test-guard-nonempty");
    fs.mkdirSync(guardNonEmptyDir, { recursive: true });
    fs.writeFileSync(path.join(guardNonEmptyDir, "some-custom-file.txt"), "hello world");

    t.after(() => {
        if (fs.existsSync(guardNonEmptyDir)) {
            fs.rmSync(guardNonEmptyDir, { recursive: true, force: true });
        }
    });

    assert.throws(
        () => scaffold({ inTargetDir: guardNonEmptyDir, inForce: false }),
        /Target directory is not empty/
    );
});

test("guard allows execution when inForce is true even if artifacts exist", (t) => {
    const forceDir = path.join(__dirname, "temp-test-force");
    fs.mkdirSync(forceDir, { recursive: true });
    fs.writeFileSync(path.join(forceDir, "source.json"), "{}");

    t.after(() => {
        if (fs.existsSync(forceDir)) {
            fs.rmSync(forceDir, { recursive: true, force: true });
        }
    });

    const { copied } = scaffold({ inTargetDir: forceDir, inForce: true });
    assert.ok(copied.includes("source.json"));
    assert.ok(fs.existsSync(path.join(forceDir, "index.js")));
});

