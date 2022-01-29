module.exports = {
  extends: ["stylelint.config.standard"],
  rules: {
    "at-rule-no-unknow": [
      true,
      {
        ignoreAtRules: [
          "taildwind",
          "apply",
          "variants",
          "responsive",
          "screen",
        ],
      },
    ],
    "declaration-block-trailing-semicolon": null,
    "no-descending-specificaly": null,
  },
};
