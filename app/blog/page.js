import { sql } from "../../lib/db";
import Link from "next/link";

export const revalidate = 3600;

export const metadata = {
  title: "Living History & Folk Dancing Blog | Logan Land",
  description: "Read stories, historical insights, and folk dancing updates from Logan. Learn about George Washington's rules, Alvin York's courage, and more.",
};

export default async function Blog() {
  let postsList = [];
  try {
    postsList = await sql`SELECT * FROM posts WHERE status = 'published' ORDER BY published_at DESC, id DESC`;
  } catch (err) {
    console.error("Error fetching blog posts:", err);
  }

  // Resolve image source helper
  function getImageSrc(url) {
    if (!url) return "/wp-content/uploads/2026/06/presentation-scaled.jpg";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
      return url;
    }
    return `/wp-content/uploads/2026/06/${url}`;
  }

  return (
    <div className="section">
      <div className="container">
        <div className="section-title">
          <p>Read & Reflect</p>
          <h2>Adventures in History Blog</h2>
          <p style={{ maxWidth: "600px", margin: "1rem auto 0 auto", color: "var(--color-text-light)" }}>
            Deep dives into historical research, costume details, behind-the-scenes stories, and community folk dancing events.
          </p>
        </div>

        {postsList.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: "center", padding: "5rem 2rem", color: "var(--color-text-light)" }}>
            <h3>No posts published yet</h3>
            <p style={{ marginTop: "1rem" }}>Our writers are hard at work. Check back soon for exciting historical stories!</p>
          </div>
        ) : (
          <div className="blog-grid">
            {postsList.map((p) => {
              const formattedDate = new Date(p.published_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
              });

              return (
                <div key={p.id} className="card blog-card">
                  <div className="card-img-wrapper" style={{ height: "220px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(7, 53, 30, 0.08)" }}>
                    <img 
                      src={getImageSrc(p.image_url)} 
                      alt={p.title} 
                      className="card-img" 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-content" style={{ display: "flex", flexDirection: "column", height: "calc(100% - 220px)", padding: "1.75rem" }}>
                    <span className="blog-meta-date" style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--color-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>
                      {formattedDate}
                    </span>
                    <h3 className="card-title" style={{ fontSize: "1.45rem", marginBottom: "0.75rem", fontFamily: "var(--font-serif)" }}>
                      {p.title}
                    </h3>
                    <p className="card-text" style={{ flex: 1, color: "var(--color-text-muted)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                      {p.excerpt || p.content.slice(0, 120) + "..."}
                    </p>
                    <Link href={`/blog/${p.slug}`} className="btn btn-secondary btn-sm" style={{ alignSelf: "flex-start", width: "auto" }}>
                      Read Article &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2.5rem;
          margin-top: 1.5rem;
        }
        .blog-card {
          background-color: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: var(--transition-smooth);
        }
        .blog-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        .btn-sm {
          padding: 0.5rem 1.25rem;
          font-size: 0.85rem;
          border-radius: var(--border-radius-sm);
        }
      `}</style>
    </div>
  );
}
