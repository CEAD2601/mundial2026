import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Ensure Prisma works on Vercel serverless
  serverExternalPackages: ['@prisma/client', 'prisma'],
}

export default nextConfig
