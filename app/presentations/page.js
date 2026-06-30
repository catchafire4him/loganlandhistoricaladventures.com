import { sql } from "../../lib/db";

export const revalidate = 0;

export default async function Presentations() {
  let list = [];
  try {
    list = await sql`SELECT * FROM presentations ORDER BY id ASC`;
  } catch (err) {
    console.error("Error fetching presentations:", err);
  }

  return (
    <div className="section">
      <div className="container">
        <div className="section-title">
          <p>Living History Presentations</p>
          <h2>Characters Brought to Life</h2>
          <p style={{ maxWidth: "600px", margin: "0 auto", marginTop: "1rem" }}>
            Logan delivers highly researched, costumed presentations exploring key historical figures and events. Click on any character below to read details.
          </p>
        </div>

        <div className="card-grid">
          {list.map((p) => {
            const getImgSrc = (url) => {
              if (!url) return "/wp-content/uploads/2026/06/presentation-scaled.jpg";
              if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
                return url;
              }
              return `/wp-content/uploads/2026/06/${url}`;
            };
            const imgSrc = getImgSrc(p.image_url);

            return (
              <div key={p.id} className="card presentation-card">
                <div className="card-img-wrapper">
                  <img 
                    src={imgSrc} 
                    alt={p.title} 
                    className="card-img"
                  />
                </div>
                <div className="card-content">
                  <h3 className="card-title">{p.title}</h3>
                  <p className="card-excerpt">{p.excerpt || p.description.slice(0, 100) + "..."}</p>
                  
                  <details className="presentation-details">
                    <summary className="btn btn-secondary details-summary-btn">
                      Read Full Story
                    </summary>
                    <div className="details-expanded-content">
                      <p>{p.description}</p>
                    </div>
                  </details>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .presentation-card {
          height: auto;
        }
        .card-excerpt {
          font-size: 0.95rem;
          color: var(--color-text-light);
          margin-bottom: 1.5rem;
        }
        .presentation-details {
          margin-top: auto;
          width: 100%;
        }
        
        /* Reset default details arrow marker */
        .presentation-details summary::-webkit-details-marker {
          display: none;
        }
        .presentation-details summary {
          list-style: none;
          display: inline-flex;
          width: 100%;
          text-align: center;
          align-items: center;
          justify-content: center;
          outline: none;
        }
        
        .details-summary-btn {
          cursor: pointer;
          user-select: none;
        }
        
        .details-expanded-content {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-border);
          animation: slideDown 0.3s ease-out;
        }
        
        .details-expanded-content p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--color-text-muted);
          margin-bottom: 0;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Change button look when details is open */
        .presentation-details[open] summary {
          background-color: var(--color-primary-light);
          color: var(--color-primary);
          border-color: var(--color-primary);
        }
        .presentation-details[open] summary::after {
          content: ' (Close)';
          font-size: 0.85rem;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
}
