/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Allow Sanity
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Allow Unsplash (Fixed!)
      },
    ],
  },
};

export default nextConfig;