import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: "https://tv-app-beta.vercel.app",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: "https://tv-app-beta.vercel.app/search",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.5,
		},
		{
			url: "https://tv-app-beta.vercel.app/movie",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.5,
		},
		{
			url: "https://tv-app-beta.vercel.app/tv",
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.5,
		},
	];
}
