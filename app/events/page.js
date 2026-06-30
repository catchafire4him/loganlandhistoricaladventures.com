import { sql } from "../../lib/db";
import EventActionButtons from "../../components/EventActionButtons";

export const revalidate = 0;

export default async function Events() {
  let list = [];
  try {
    list = await sql`SELECT * FROM events ORDER BY date ASC, id DESC`;
  } catch (err) {
    console.error("Error fetching events:", err);
  }

  // Helper to resolve image paths (handles local files and Vercel Blob URLs)
  function getImageSrc(url) {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/")) {
      return url;
    }
    return `/wp-content/uploads/2026/06/${url}`;
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: "1000px" }}>
        <div className="section-title">
          <p>Calendar</p>
          <h2>Upcoming Events & presentations</h2>
          <p style={{ maxWidth: "600px", margin: "1rem auto 0 auto", color: "var(--color-text-light)" }}>
            Check out where Logan will be presenting or leading dances next. Come join us!
          </p>
        </div>

        {list.length === 0 ? (
          <div className="glass-panel no-events-panel">
            <p>No upcoming events scheduled at this time. Check back later or contact us to book a private event!</p>
          </div>
        ) : (
          <div className="events-timeline">
            {list.map((e) => {
              const imgSrc = getImageSrc(e.image_url);
              return (
                <div key={e.id} id={`event-${e.id}`} className="event-card glass-panel" style={{ scrollMarginTop: "120px" }}>
                  <div className="event-date-badge">
                    <span className="event-date-month">{e.date.split(" ")[0]}</span>
                    <span className="event-date-day">{e.date.split(" ")[1]?.replace(",", "") || ""}</span>
                    <span className="event-date-year">{e.date.split(" ")[2] || ""}</span>
                  </div>
                  
                  <div className="event-details-content">
                    <h3 className="event-title">{e.title}</h3>
                    <div className="event-details-meta">
                      <div className="meta-item">
                        <strong>Time:</strong> {e.time}
                      </div>
                      <div className="meta-item">
                        <strong>Location:</strong> {e.location}
                      </div>
                    </div>
                    <p className="event-desc">{e.description}</p>
                    
                    {e.link && (
                      <div className="event-link-wrapper">
                        <a 
                          href={e.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-secondary btn-sm"
                        >
                          External Link & Details
                        </a>
                      </div>
                    )}

                    {/* Interactive Save and Share Bar */}
                    <EventActionButtons event={e} />
                  </div>

                  {imgSrc && (
                    <div className="event-poster-wrapper">
                      <img 
                        src={imgSrc} 
                        alt={`${e.title} Poster`} 
                        className="event-poster-img"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .no-events-panel {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--color-text-light);
        }
        .events-timeline {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        
        .event-card {
          display: flex;
          gap: 3rem;
          padding: 2.5rem;
          border-left: 6px solid var(--color-primary);
          transition: var(--transition-smooth);
          align-items: flex-start;
        }
        .event-card:hover {
          transform: translateX(4px);
        }
        
        @media (max-width: 900px) {
          .event-card {
            flex-direction: column;
            gap: 1.5rem;
            padding: 2rem;
          }
        }
        
        .event-date-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: var(--color-primary-light);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          min-width: 110px;
          height: 110px;
          color: var(--color-primary);
          padding: 1rem;
        }
        
        .event-date-month {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .event-date-day {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 2rem;
          line-height: 1;
          margin: 0.2rem 0;
        }
        .event-date-year {
          font-family: var(--font-sans);
          font-size: 0.85rem;
          opacity: 0.8;
        }
        
        .event-details-content {
          flex: 1;
        }
        .event-title {
          font-size: 1.85rem;
          color: var(--color-primary);
          margin-bottom: 0.75rem;
        }
        .event-details-meta {
          display: flex;
          gap: 2rem;
          font-size: 0.98rem;
          color: var(--color-text-muted);
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }
        .meta-item strong {
          color: var(--color-text-dark);
        }
        .event-desc {
          line-height: 1.65;
          margin-bottom: 1.5rem;
        }
        .btn-sm {
          padding: 0.5rem 1.5rem;
          font-size: 0.9rem;
        }

        /* Event Poster Styling */
        .event-poster-wrapper {
          width: 200px;
          height: 200px;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-border);
          background-color: rgba(7, 53, 30, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .event-poster-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        .event-card:hover .event-poster-img {
          transform: scale(1.05);
        }
        @media (max-width: 900px) {
          .event-poster-wrapper {
            width: 100%;
            height: 260px;
          }
        }
      `}</style>
    </div>
  );
}
