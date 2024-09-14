/** @type {import('next').NextConfig} */
const nextConfig = {
	swcMinify: true,
	compiler: {
		removeConsole: process.env.NODE_ENV !== "development",
	},
	images: {
		domains: ["image.tmdb.org"],
	},
};

const withPWA = require("next-pwa")({
	dest: "public",
});

module.exports = withPWA({
	...nextConfig,
	images: {
		unoptimized: true,
	},
});
