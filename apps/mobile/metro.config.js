const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add shared packages to watch folders
config.watchFolders = [path.resolve(__dirname, "../../packages")];

// Add path aliases for shared packages
config.resolver.extraNodeModules = {
  "@pact/shared-types": path.resolve(__dirname, "../../packages/shared/types"),
  "@pact/shared-api": path.resolve(__dirname, "../../packages/shared/api"),
  "@pact/shared-utils": path.resolve(__dirname, "../../packages/shared/utils"),
  "@pact/shared-hooks": path.resolve(__dirname, "../../packages/shared/hooks"),
};

module.exports = config;
