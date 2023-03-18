// const withPlugins = require("next-compose-plugins");

// const config = {
//   async redirects() {
//     return [];
//   },
// };

// module.exports = withPlugins([], config);

module.exports = {
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
