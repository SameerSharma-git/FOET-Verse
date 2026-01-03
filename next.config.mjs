/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/**',
            },
        ],
        qualities: [75, 90],
    },
    webpack: (config) => {
    // This is the magic fix for PDF.js 5.x
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    
    // Handle node: handles
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
};

export default nextConfig;
