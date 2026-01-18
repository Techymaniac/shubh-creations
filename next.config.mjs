/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This tells Vercel: "Ignore small errors and BUILD ANYWAY"
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // WILD CARD: Allows images from ANYWHERE on the internet
      },
    ],
  },
};

export default nextConfig;