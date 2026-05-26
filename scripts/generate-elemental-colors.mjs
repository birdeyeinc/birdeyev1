/**
 * Generate src/styles/elemental-colors.css + elemental-tailwind-theme.css
 * from Elemental BK-BIRD-00000-learning colors.js
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const elementalRoot = process.env.ELEMENTAL_ROOT
  ? path.resolve(process.env.ELEMENTAL_ROOT)
  : path.resolve(repoRoot, "../Source/elemental");

const colorsPath = path.join(
  elementalRoot,
  "src/Docs/Styles/colors/colors.js",
);

/** gray900 → gray-900, blueBg → blue-bg, comparison0Star → comparison-0-star */
export function tokenKeyToCssVar(key) {
  return key
    .replace(/([a-z])(\d)/gi, "$1-$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

function parseColorsJs(source) {
  const tokens = {};
  const re = /"([a-zA-Z0-9]+)"\s*:\s*"(#[^"]+)"/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    tokens[m[1]] = m[2];
  }
  return tokens;
}

function normalizeHex(hex) {
  let h = hex.toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(h)) {
    h =
      "#" +
      h[1] +
      h[1] +
      h[2] +
      h[2] +
      h[3] +
      h[3];
  }
  return h;
}

function main() {
  let source;
  try {
    source = readFileSync(colorsPath, "utf8");
  } catch {
    console.error(`[generate:colors] Missing ${colorsPath}`);
    console.error("  Set ELEMENTAL_ROOT to your elemental clone.");
    process.exit(1);
  }

  const tokens = parseColorsJs(source);
  tokens.brandColor = "#2652ed";

  const vars = Object.entries(tokens)
    .map(([key, value]) => {
      const varName = tokenKeyToCssVar(key);
      return `  --${varName}: ${value};`;
    })
    .sort()
    .join("\n");

  const themeRegs = Object.keys(tokens)
    .map((key) => {
      const varName = tokenKeyToCssVar(key);
      return `  --color-${varName}: var(--${varName});`;
    })
    .sort()
    .join("\n");

  const header = `/* Auto-generated — do not edit. Run: npm run generate:colors */\n/* Source: Elemental BK-BIRD-00000-learning colors.js + brand-color #2652ED */\n`;

  writeFileSync(
    path.join(repoRoot, "src/styles/elemental-colors.css"),
    `${header}\n:root {\n${vars}\n}\n`,
    "utf8",
  );

  writeFileSync(
    path.join(repoRoot, "src/styles/elemental-tailwind-theme.css"),
    `${header}\n@theme inline {\n${themeRegs}\n}\n`,
    "utf8",
  );

  // Hex → tailwind utility token map for codemod (JSON)
  const hexToToken = {};
  for (const [key, value] of Object.entries(tokens)) {
    const varName = tokenKeyToCssVar(key);
    hexToToken[normalizeHex(value)] = varName;
  }
  // Common aliases used in app
  hexToToken["#2552ed"] = "brand-color";
  hexToToken["#1e44cc"] = "brand-color";
  hexToToken["#2952e3"] = "brand-color";
  hexToToken["#ffffff"] = hexToToken["#fff"] ?? "gray-0";

  writeFileSync(
    path.join(repoRoot, "scripts/elemental-hex-map.json"),
    JSON.stringify(hexToToken, null, 2),
    "utf8",
  );

  console.log(
    `[generate:colors] Wrote ${Object.keys(tokens).length} tokens from ${colorsPath}`,
  );
}

main();
