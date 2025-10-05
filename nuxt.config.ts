// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-10-04",
	devtools: { enabled: false },
	ssr: false,
	modules: ["@nuxt/ui"],
	css: ["~/assets/css/main.css"],
});
