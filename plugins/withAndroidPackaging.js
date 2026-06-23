const { withAppBuildGradle } = require("@expo/config-plugins");

module.exports = function withAndroidPackaging(config) {
  return withAppBuildGradle(config, (config) => {
    const gradle = config.modResults.contents;

    if (gradle.includes("META-INF/versions/9/OSGI-INF/MANIFEST.MF")) {
      return config; // already patched
    }

    config.modResults.contents = gradle.replace(
      /^android \{/m,
      `android {\n    packaging {\n        resources {\n            excludes += ['META-INF/versions/9/OSGI-INF/MANIFEST.MF']\n        }\n    }\n`,
    );

    return config;
  });
};
