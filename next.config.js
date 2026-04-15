/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs'],
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig