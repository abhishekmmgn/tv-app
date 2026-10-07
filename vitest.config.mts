import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		include: ["**/*.test.ts"],
		exclude: ["node_modules/**", ".next/**", ".agents/**"],
	},
	resolve: {
		alias: { "@": new URL(".", import.meta.url).pathname },
	},
})
