const nextConfig = {
  reactStrictMode: false,
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
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin"
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
