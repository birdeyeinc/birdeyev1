import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import json from '@rollup/plugin-json'; 
import image from "@rollup/plugin-image";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import copy from 'rollup-plugin-copy';
import alias from '@rollup/plugin-alias';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
import path from 'path'
import fs from 'fs';
import { fileURLToPath } from "url";
import loaderUtils from  "loader-utils"
import postcssUrl from "postcss-url";

function generateHash(str, length = 5) {
  const hash = loaderUtils.getHashDigest(
    Buffer.from(str),
    'sha1',
    'hex',
    length
  );
  return hash;
}


const DEV = "development";
const ifDev = process.env.NODE_ENV === DEV;

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
  input: "src/index.js",
  output: [
    {
      dir: "core",
      format: "esm",
      sourcemap: ifDev,
      preserveModules: true,
      preserveModulesRoot: "src",
    },
  ],
  plugins: [
    
    alias({
      entries: [
        { find: 'assets', replacement: path.resolve(__dirname, 'src/assets') },
        { find: 'atoms', replacement: path.resolve(__dirname, 'src/atoms') },
        { find: 'components', replacement: path.resolve(__dirname, 'src/components') },
        { find: 'sass', replacement: path.resolve(__dirname, 'src/sass') },
        { find: 'utils', replacement: path.resolve(__dirname, 'src/utils') },
        { find: 'hooks', replacement: path.resolve(__dirname, 'src/hooks') },
        { find: 'constants', replacement: path.resolve(__dirname, 'src/constants') }
      ]
    }),
    webWorkerLoader({
      targetPlatform: 'browser',
      inline: false,
      preserveSource: true,
      pattern: /.*[Ww]orker\.js$/
    }),
    resolve({ extensions:[...extensions, '.scss'], modulesOnly: true, dedupe: ['react']}),
    json(), 
    peerDepsExternal(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: ["@babel/env", "@babel/preset-react"],
    }),
    typescript({
      tsconfig: "tsconfig.json",
      include: "src/**/*.{tsx,ts}",
      sourceMap: false,
      declaration: true,
      declarationDir: "./core",
    }),
    commonjs({ extensions }),
    image(),
    postcss({
      extract: false,
      modules: {
        // generateScopedName: "[name]__[local]___[hash:base64:5]"
        generateScopedName: (name, filename) => {
          const baseName = path.basename(filename, '.module.scss');
          const modifiedName = `${baseName}__${name}`
          const hash = generateHash(modifiedName);
          return `${modifiedName}__${hash}`;
        },
      },
      use: {
        sass: {
          includePaths: [
            path.resolve(__dirname, './src'),
          ],
        },
      },
      minimize: true,
      plugins: [
        postcssUrl({
          url: (asset) => {
            const FONT_MIMES = {
              '.woff2': 'font/woff2',
              '.woff':  'font/woff',
              '.ttf':   'font/ttf',
              '.eot':   'application/vnd.ms-fontobject',
              '.svg':   'image/svg+xml',
            };
            const ext = path.extname(asset.url).toLowerCase();

            if (FONT_MIMES[ext]) {
              // Font URLs from _style.scss are bare filenames (e.g. url('icomoon.woff2')).
              // Sass inlines _style.scss into the importing component, losing its original
              // directory. postcss-url would resolve relative to the wrong .scss file.
              // Look up the font by name in the known icomoon directory instead.
              const fontPath = path.resolve(__dirname, 'src/assets/icomoon/phoenix', path.basename(asset.url));
              if (fs.existsSync(fontPath)) {
                const data = fs.readFileSync(fontPath).toString('base64');
                return `data:${FONT_MIMES[ext]};base64,${data}`;
              }
            }

            // For all other assets (images etc.): inline if under 10KB.
            if (asset.absolutePath && fs.existsSync(asset.absolutePath)) {
              const IMG_MIMES = {
                '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
                '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
              };
              if (IMG_MIMES[ext] && fs.statSync(asset.absolutePath).size <= 10 * 1024) {
                const data = fs.readFileSync(asset.absolutePath).toString('base64');
                return `data:${IMG_MIMES[ext]};base64,${data}`;
              }
            }
            // undefined → postcss-url leaves the URL unchanged (copy fallback)
          },
        }),
      ],
    }),
    terser(),
    copy({
      targets: [
        { src: 'src/sass/**', dest: 'core/sass/' },
        // icomoon assets must live alongside core/sass/ so that consuming apps
        // that compile global.scss with their own Sass can resolve the @import
        // "../assets/icomoon/phoenix/style" reference without falling back to
        // a runtime CSS @import url() that breaks in the browser.
        { src: 'src/assets/icomoon/**', dest: 'core/assets/icomoon/' },
        {
          src: 'src/atoms/AdvancedMapView/clusterWorker.js',
          dest: 'core/atoms/AdvancedMapView/'
        },
      ]
    })
  ],
  external: [
    "classnames",
    "prop-types",
    "lodash",
    "react-list",
    "react-slick",
    "react-modal",
    "validate.js",
    "google-libphonenumber",
    "react-grid-layout",
    "react-resizable",
    "react-resize-detector",
    "react",
    "react-dom",
    "rc-pagination",
    "react-date-range",
    "date-fns",
    "@tiptap/core",
    "@tiptap/extension-link",
    "@tiptap/extension-text-align",
    "@tiptap/extension-text-style",
    "@tiptap/extension-underline",
    "@tiptap/extension-list",
    "@tiptap/extension-hard-break",
    "@tiptap/extension-heading",
    "@tiptap/extension-bold",
    "@tiptap/extension-color",
    "@tiptap/extension-document",
    "@tiptap/extension-italic",
    "@tiptap/extension-paragraph",
    "@tiptap/extension-strike",
    "@tiptap/extension-text",
    "@tiptap/pm",
    "@tiptap/starter-kit",
    "grapesjs",
    "@grapesjs/react"
  ]
};