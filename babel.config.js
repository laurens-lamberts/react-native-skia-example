module.exports = function (api) {
  api.cache(true);
  const moduleResolver = [
    "module-resolver",
    {
      root: ["./src"],
      alias: {
        "@app": "./src/app",
        "@domains": "./src/domains",
      },
      extensions: [
        ".js",
        ".jsx",
        ".ts",
        ".tsx",
        ".android.js",
        ".android.tsx",
        ".ios.js",
        ".ios.tsx",
      ],
    },
  ];
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      moduleResolver,

      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
    ],
  };
};
