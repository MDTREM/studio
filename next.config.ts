import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // This is needed to allow cross-origin requests in development.
  // The value is the domain of the Cloud Workstation.
  allowedDevOrigins: [
    '6000-firebase-studio-1764070301810.cluster-lr6dwlc2lzbcctqhqorax5zmro.cloudworkstations.dev',
    '*.stripe.com'
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite qualquer hostname
      },
      {
        protocol: 'http',
        hostname: '**', // Permite qualquer hostname
      }
    ],
  },
};

export default nextConfig;
