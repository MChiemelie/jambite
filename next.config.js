/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
  remotePatterns: [
   {
    protocol: 'https',
    hostname: 'lh3.googleusercontent.com',
    port: '',
    pathname: '/a/**',
   }
  ],
 },
 typescript: {
  ignoreBuildErrors: true,
 }
}

module.exports = nextConfig