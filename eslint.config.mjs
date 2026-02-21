import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "vars": "all",                      // すべての変数をチェック
          "args": "after-used",               // 使用された引数の後の未使用引数を無視（例: callbackの後）
          "argsIgnorePattern": "^_",          // _で始まる引数を無視
          "varsIgnorePattern": "^_",          // _で始まる変数を無視
          "caughtErrorsIgnorePattern": "^_",  // catchのエラー変数も
          "ignoreRestSiblings": true          // オブジェクトデストラクチャのrestプロパティの兄弟を無視
        }
      ]
    }
  },
]);

export default eslintConfig;
