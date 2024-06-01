/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/study365-a3ffe.appspot.com/o/**',
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
