import eslint from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
    {
        ignores: [
            ".storybook/**",
            "build/**",
            "core/**",
            "dist/**",
            "storybook-static/**",
            "public/**",
            "node_modules/**",
            "coverage/**",
            "**/*.min.js",
            "**/vendor/**",
        ],
        linterOptions: {
            reportUnusedDisableDirectives: "warn",
        },
    },
    {
        files: ["src/**/*.{ts,tsx}"],
        extends: [tseslint.configs.recommended],
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
            },
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
    {
        files: ["src/**/*.{js,jsx}", "scripts/**/*.{js,mjs,cjs}"],
        extends: [eslint.configs.recommended],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            "prefer-const": "error",
        },
    },
    {
        files: ["src/**/*.{jsx,tsx}"],
        extends: [pluginReact.configs.flat.recommended, pluginReact.configs.flat["jsx-runtime"]],
    },
    {
        files: ["scripts/**/*.{js,mjs,cjs}", "*.config.{js,mjs,cjs}"],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        files: ["**/*.stories.{js,jsx,ts,tsx}"],
        rules: {
            "react/no-unescaped-entities": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
        },
    },
    {
        settings: {
            react: {
                version: "detect",
            },
        },
    },
]);
