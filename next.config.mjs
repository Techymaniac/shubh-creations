/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // THIS ALLOWS EVERY DOMAIN (Sanity, Unsplash, Google, etc.)
      },
    ],
  },
};

export default nextConfig;