import reactHooks from "eslint-plugin-react-hooks";

export default {
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "react-hooks/rules-of-hooks": reactHooks.rulesOfHooks,
    "react-hooks/exhaustive-deps": reactHooks.exhaustiveDeps,
  },
  [reactHooks.configs["recommended-latest"]]: {
    additionalRules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": [
        "warn",
        {
          additionalHooks: "(useMyCustomHook|useMyOtherCustomHook)",
        },
      ],
    },
  },
};
