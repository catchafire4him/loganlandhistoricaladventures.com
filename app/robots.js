export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/*"],
    },
    sitemap: "https://loganlandhistoricaladventures.com/sitemap.xml",
  };
}
