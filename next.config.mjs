/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    secret: "4f7475a642b80ccb890bdb80557d2c82d883ff5c347a26188e6e9ba84fd831d0",
  },
  publicRuntimeConfig: {
    apiUrl: `/api`,
  },
};

export default nextConfig;