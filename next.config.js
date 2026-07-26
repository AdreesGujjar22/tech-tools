const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "api.builder.io",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

};

export default nextConfig;
