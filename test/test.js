import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import scaffold from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tempDir = path.join(__dirname, "temp-test-scaffold");

test("scaffolds modern JSON-driven v3 architecture and executes cleanly", async (t) => {
    t.after(() => {
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    const { version, copied } = scaffold({ inTargetDir: tempDir });

    assert.equal(version, "v4");
    assert.ok(copied.includes("api.json"));
    assert.ok(copied.includes("engine"));
    assert.ok(copied.includes("source.json"));
    assert.ok(copied.includes("index.js"));

    assert.ok(fs.existsSync(path.join(tempDir, "api.json")));
    assert.ok(fs.existsSync(path.join(tempDir, "engine", "route", "index.js")));
    assert.ok(fs.existsSync(path.join(tempDir, "engine", "execution", "index.js")));
    assert.ok(fs.existsSync(path.join(tempDir, "source.json")));
    assert.ok(fs.existsSync(path.join(tempDir, "index.js")));

    const entryUrl = pathToFileURL(path.join(tempDir, "index.js")).href;
    const { default: app } = await import(entryUrl);

    assert.equal(typeof app.founder.profile.fetch, "function");
    assert.equal(typeof app.founder.links.fetch, "function");
    assert.equal(typeof app.company.info.fetch, "function");
    assert.equal(typeof app.ecosystem.tools.blueprint.fetch, "function");

    const profile = await app.founder.profile.fetch();
    assert.equal(profile.name, "Keshav Nalam");
    assert.equal(profile.company, "KeshavSoft");

    const links = await app.founder.links.fetch();
    assert.equal(links.website, "https://keshavsoft.com/");

    const packages = await app.company.packages.fetch();
    assert.ok(Array.isArray(packages));
    assert.ok(packages.some((p) => p.name === "create-intellisense"));
});

test("guard blocks execution when target directory already contains JSON-driven artifacts", (t) => {
    const guardArtifactDir = path.join(__dirname, "temp-test-guard-artifacts");
    fs.mkdirSync(guardArtifactDir, { recursive: true });
    fs.writeFileSync(path.join(guardArtifactDir, "api.json"), "[]");

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
