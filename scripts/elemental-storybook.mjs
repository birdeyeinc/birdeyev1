/**
 * Run Elemental Storybook (port 3000) from the external elemental repo.
 * Sets BIRDEYE_PROTOTYPE_ROOT so Pattern/Birdeye stories resolve @birdeye → this app's src/app.
 */
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const elementalRoot = process.env.ELEMENTAL_ROOT
  ? path.resolve(process.env.ELEMENTAL_ROOT)
  : path.resolve(repoRoot, "../Source/elemental");

if (!existsSync(path.join(elementalRoot, "package.json"))) {
  console.error(
    [
      "[storybook:elemental] Elemental source not found.",
      `  Expected: ${elementalRoot}`,
      "  Set ELEMENTAL_ROOT to your elemental clone, or clone to ../Source/elemental",
    ].join("\n"),
  );
  process.exit(1);
}

const env = {
  ...process.env,
  BIRDEYE_PROTOTYPE_ROOT: repoRoot,
};

console.log(`[storybook:elemental] ${elementalRoot} (BIRDEYE_PROTOTYPE_ROOT=${repoRoot})`);

const result = spawnSync("npm", ["run", "story"], {
  cwd: elementalRoot,
  stdio: "inherit",
  shell: process.platform === "win32",
  env,
});

process.exit(result.status ?? 1);
