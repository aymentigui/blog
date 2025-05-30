import createNextIntlPlugin from "next-intl/plugin";
import { webpack } from "next/dist/compiled/webpack/webpack";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: 1024 * 1024 , 
    },
  },
  images: {
    domains: ['https://aimen-blog.com'],
  },
};

export default withNextIntl(nextConfig);

