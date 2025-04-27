import type { NextConfig } from "next";
import type { WebpackConfigContext } from "next/dist/server/config-shared";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,

  webpack(config: any, { isServer }: WebpackConfigContext) {
    config.module.rules.push({
      test: /\.svg$/i,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name].[hash][ext]",
      },
      ignoreDuringBuilds: true,
    });

    return config;
  },
};

export default nextConfig;
