/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  matcher: ["/((?!_next/static|favicon.ico|auth).*)"],
};

export default nextConfig;
