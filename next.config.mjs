/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ✅ New way (replaces deprecated "domains")
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
}

export default nextConfig
