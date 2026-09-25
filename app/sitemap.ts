import type { MetadataRoute } from "next";

const APP_URL = "https://staysoji.vercel.app";
const LAST_MODIFIED = new Date("2026-09-25");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/calculate", "/lookup", "/scan", "/about", "/privacy", "/terms", "/contact", "/login", "/signup"];

  return routes.map((route) => ({
    url: `${APP_URL}${route}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));
}
