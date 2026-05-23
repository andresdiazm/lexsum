/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/lexsum",
  images: { unoptimized: true },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: "/lexsum",
  },
};

export default nextConfig;
