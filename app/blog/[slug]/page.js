import { sql } from "../../../lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const results = await sql`SELECT title, excerpt FROM posts WHERE slug = ${slug} AND status = 'published'`;
    if (results.length > 0) {
      return {
        title: `${results[0].title} | Logan Land Blog`,
        description: results[0].excerpt || `Read the latest article: ${results[0].title} by Logan.`,
      };
    }
  } catch (err) {
    console.error("Error generating blog metadata:", err);
  }
  return {
    title: "Blog Article | Logan Land",
  };
}

export default async function BlogPostPage({ params }) {
  // Await params since it's a dynamic route
  const { slug } = await params;

  let post = null;
  try {
    const results = await sql`SELECT * FROM posts WHERE slug = ${slug} AND status = 'published'`;
    if (results.length > 0) {
      post = results[0];
    }
  } catch (err) {
    console.error("Error fetching blog post by slug:", err);
  }

  if (!post) {
    notFound();
  }

  // Resolve image source
  function getImageSrc(url) {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
      return url;
    }
    return `/wp-content/uploads/2026/06/${url}`;
  }

  const formattedDate = new Date(post.published_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const imgSrc = getImageSrc(post.image_url);

  return (
    <article className="section">
      <div className="container" style={{ maxWidth: "800px" }}>
        
        {/* Back Link */}
        <div style={{ marginBottom: "2rem" }}>
          <Link href="/blog" className="blog-back-link">
            &larr; Back to Blog
          </Link>
        </div>

        {/* Post Header */}
        <header className="blog-post-header">
          <span className="blog-post-meta">Published on {formattedDate} by Logan Land</span>
          <h1>{post.title}</h1>
        </header>

        {/* Featured Image */}
        {imgSrc && (
          <div className="blog-post-image-wrapper">
            <img src={imgSrc} alt={post.title} className="blog-post-image" />
          </div>
        )}

        {/* Post Content */}
        <div className="blog-post-content">
          {post.content.split("\n\n").map((paragraph, index) => {
            if (!paragraph.trim()) return null;
            return (
              <p key={index}>
                {paragraph.split("\n").map((line, lineIndex) => (
                  <span key={lineIndex}>
                    {lineIndex > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            );
          })}
        </div>

        {/* Post Footer */}
        <footer className="blog-post-footer" style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--color-border)", textAlign: "center" }}>
          <p style={{ fontStyle: "italic", color: "var(--color-text-light)", marginBottom: "1.5rem" }}>
            Thank you for reading! Feel free to contact us if you would like to book a history presentation or folk dance.
          </p>
          <Link href="/blog" className="btn btn-primary">
            Back to Blog Posts
          </Link>
        </footer>

      </div>

      <style>{`
        .blog-back-link {
          font-size: 0.95rem;
          color: var(--color-primary);
          text-decoration: none;
          font-weight: 600;
          transition: var(--transition-smooth);
        }
        .blog-back-link:hover {
          color: var(--color-secondary);
          transform: translateX(-4px);
          display: inline-block;
        }
        .blog-post-header {
          margin-bottom: 2rem;
        }
        .blog-post-meta {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          color: var(--color-text-light);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          display: block;
          margin-bottom: 0.75rem;
        }
        .blog-post-header h1 {
          font-family: var(--font-serif);
          font-size: 3rem;
          color: var(--color-primary);
          line-height: 1.15;
        }
        @media (max-width: 768px) {
          .blog-post-header h1 {
            font-size: 2.25rem;
          }
        }
        .blog-post-image-wrapper {
          width: 100%;
          max-height: 480px;
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          border: 1px solid var(--color-border);
          margin-bottom: 3rem;
        }
        .blog-post-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .blog-post-content {
          font-size: 1.15rem;
          line-height: 1.8;
          color: var(--color-text-dark);
        }
        .blog-post-content p {
          margin-bottom: 1.75rem;
        }
      `}</style>
    </article>
  );
}
