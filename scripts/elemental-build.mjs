/**
 * Build Elemental for birdeye-v1 consumption.
 *
 * 1. If ELEMENTAL_ROOT (default: ../Source/elemental) exists → run `npm run build:dev` there.
 * 2. Else if node_modules/@birdeye/elemental/core exists → OK (published tarball).
 * 3. Else exit 1 with install instructions.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const elementalRoot = process.env.ELEMENTAL_ROOT
  ? path.resolve(process.env.ELEMENTAL_ROOT)
  : path.resolve(repoRoot, "../Source/elemental");

function run(cmd, args, cwd) {
  const result = spawnSync(cmd, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (existsSync(path.join(elementalRoot, "package.json"))) {
  console.log(`[build:elemental] Building from ${elementalRoot}`);
  run("npm", ["run", "build:dev"], elementalRoot);
  console.log("[build:elemental] Done.");
  process.exit(0);
}

const installedCore = path.join(repoRoot, "node_modules/@birdeye/elemental/core");
if (existsSync(installedCore)) {
  console.log("[build:elemental] Using pre-built @birdeye/elemental from node_modules (no local source).");
  process.exit(0);
}

console.error(
  [
    "[build:elemental] No Elemental build found.",
    "  • npm install @birdeye/elemental  (published core/), or",
    `  • clone elemental and set ELEMENTAL_ROOT (tried ${elementalRoot})`,
  ].join("\n"),
);
process.exit(1);
