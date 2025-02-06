import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["**/node_modules/", "**/dist/"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "no-unused-vars": "off",
      "prettier/prettier": [
        "warn",
        {
          arrowParens: "always",
          semi: true,
          trailingComma: "all",
          tabWidth: 2,
          endOfLine: "auto",
          useTabs: false,
          singleQuote: false,
          printWidth: 120,
          jsxSingleQuote: false,
        },
      ],
    },
  },
];
