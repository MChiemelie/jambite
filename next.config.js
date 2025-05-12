module.exports = {
  images: {
    remotePatterns: [
      new URL('https://lh3.googleusercontent.com/a/**'),
      new URL('https://res.cloudinary.com/**'),
      new URL('https://cdn.pixabay.com/**'),
      new URL('https://img.freepik.com/**'),
      new URL('https://cloud.appwrite.io/**'),
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};
