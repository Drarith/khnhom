import type { NextConfig } from "next";

import { i18n } from "./next-i18next.config";

const nextConfig: NextConfig = {
  output: "standalone",
  i18n,
};

export default nextConfig;
