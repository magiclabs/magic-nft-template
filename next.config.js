/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["*.nftstorage.link", "nftstorage.link"],
  },
};

module.exports = nextConfig;
