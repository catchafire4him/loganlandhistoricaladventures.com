import { sql } from "../lib/db";

export default async function sitemap() {
  const baseUrl = "https://loganlandhistoricaladventures.com";

  // Fetch dynamic blog posts for sitemap indexing
  let blogUrls = [];
  try {
    const posts = await sql`SELECT slug, published_at FROM posts WHERE status = 'published'`;
    blogUrls = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (err) {
    console.error("Error fetching sitemap dynamic posts:", err);
  }

  // Define core static routes
  const staticRoutes = ["", "/presentations", "/dancing", "/events", "/faq", "/contact", "/blog"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...staticRoutes, ...blogUrls];
}
