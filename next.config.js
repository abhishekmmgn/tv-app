/** @type {import('next').NextConfig} */
const nextConfig = {
	turbopack: {},
	compiler: {
		removeConsole: process.env.NODE_ENV !== "development",
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "image.tmdb.org",
			},
		],
		unoptimized: true,
	},
};

module.exports = nextConfig;
