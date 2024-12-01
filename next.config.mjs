/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.cache = {
      type: 'filesystem',
    };
    return config;
  },
  images: {
	domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
