// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");

// Without a real project ID the Studio route still compiles; it just cannot connect.
// Fill PUBLIC_SANITY_PROJECT_ID in .env (see .env.example) to activate /admin and live content.
const projectId = env.PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = env.PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  site: "https://pomibbrowstudio.com",
  output: "static",
  trailingSlash: "never",
  integrations: [
    sanity({
      projectId,
      dataset,
      useCdn: false,
      apiVersion: "2025-06-01",
      studioBasePath: "/admin",
    }),
    react(),
    sitemap({ filter: (page) => !page.includes("/admin") }),
  ],
  image: {
    // Original gallery images are large phone shots; cap the largest generated size.
    responsiveStyles: true,
  },
  server: { port: 4400 },
  devToolbar: { enabled: false },
});
