import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    plugins: {
      "react-hooks/exhaustive-deps": [
        "warn",
        {
          enableDangerousAutofixThisMayCauseInfiniteLoops: true,
        },
      ],
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },
];
