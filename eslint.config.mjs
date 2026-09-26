import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Disable formatting rules that conflict with Prettier
  eslintConfigPrettier,

  // Override default ignores of eslint-config-next. loadtest/ holds k6 scripts,
  // which run in k6's own runtime (k6/* modules, __ENV/__VU globals), not Next.
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "loadtest/**"]),
]);

export default eslintConfig;
