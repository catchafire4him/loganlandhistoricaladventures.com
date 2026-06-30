import Link from "next/link";
import { sql } from "../lib/db";

export const revalidate = 0;

export default async function Home() {
  // Fetch next 3 upcoming events
  let upcomingEvents = [];
  try {
    // 1. Fetch next 3 upcoming events (today or future)
    upcomingEvents = await sql`SELECT * FROM events WHERE event_date >= CURRENT_DATE ORDER BY event_date ASC, id ASC LIMIT 3`;
    
    // 2. Fallback to the most recent events if all events are in the past
    if (!upcomingEvents || upcomingEvents.length === 0) {
      upcomingEvents = await sql`SELECT * FROM events ORDER BY event_date DESC, id DESC LIMIT 3`;
    }
  } catch (err) {
    console.error("Error fetching upcoming events:", err);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-subtitle">Living History & Community Tradition</span>
            <h1>Bringing the Stories of History to Life</h1>
            <p>
              Experience engaging, educational living history presentations and lively family folk dancing circles led by Logan. Perfect for schools, festivals, churches, and private gatherings.
            </p>
            <div className="hero-actions">
              <Link href="/presentations" className="btn btn-primary">
                Explore Presentations
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                Book an Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section section-light">
        <div className="container">
          <div className="section-title">
            <p>What We Offer</p>
            <h2>Educational & Interactive Programs</h2>
          </div>

          <div className="card-grid">
            <div className="card">
              <div className="card-img-wrapper">
                <img 
                  src="/wp-content/uploads/2026/06/presentation-scaled.jpg" 
                  alt="George Washington Living History Presentation" 
                  className="card-img"
                />
              </div>
              <div className="card-content">
                <h3 className="card-title">History Presentations</h3>
                <p className="card-text">
                  Highly researched, dramatic character portrayals that transport audiences to key moments in history. Logan brings figures like George Washington and Alvin York to life with authentic attire and props.
                </p>
                <Link href="/presentations" className="btn btn-secondary" style={{ marginTop: "auto" }}>
                  Explore Characters
                </Link>
              </div>
            </div>

            <div className="card">
              <div className="card-img-wrapper">
                <img 
                  src="/wp-content/uploads/2026/06/Dance.jpg" 
                  alt="Family Folk Dancing" 
                  className="card-img"
                />
              </div>
              <div className="card-content">
                <h3 className="card-title">Family Folk Dancing</h3>
                <p className="card-text">
                  A high-energy, multi-generational community dancing experience. Logan teaches simple, fun traditional circle and line dances that get everyone from children to grandparents moving together.
                </p>
                <Link href="/dancing" className="btn btn-secondary" style={{ marginTop: "auto" }}>
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Schedule Section */}
      {upcomingEvents.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-title">
              <p>Calendar</p>
              <h2>Upcoming Schedule</h2>
            </div>
            
            <div className="upcoming-events-grid">
              {upcomingEvents.map((ev) => (
                <div key={ev.id} className="glass-panel upcoming-event-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", width: "100%" }}>
                    <span className="upcoming-event-tag">Next Event</span>
                    <span className="upcoming-event-date-badge">{ev.date.split(",")[0]}</span>
                  </div>
                  <h3 className="upcoming-event-title">{ev.title}</h3>
                  <div className="upcoming-event-meta">
                    <div><strong>Time:</strong> {ev.time}</div>
                    <div><strong>Location:</strong> {ev.location}</div>
                  </div>
                  <p className="upcoming-event-desc">
                    {ev.description.length > 130 ? ev.description.slice(0, 130) + "..." : ev.description}
                  </p>
                  <div className="upcoming-event-actions">
                    <Link href={`/events#event-${ev.id}`} className="btn btn-secondary btn-sm">
                      Save & Share
                    </Link>
                    {ev.link && (
                      <a href={ev.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                        Details
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
              <Link href="/events" className="btn btn-primary">
                View Calendar Timeline
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Custom Styles for Home Page Elements */}
      <style>{`
        .hero-section {
          background: linear-gradient(rgba(7, 53, 30, 0.65), rgba(7, 53, 30, 0.85)), url('/wp-content/uploads/2026/06/PXL_20230721_192205167-scaled.jpg') no-repeat center center/cover;
          padding: 8rem 0;
          color: #fff;
          text-align: center;
        }
        .hero-subtitle {
          font-family: var(--font-sans);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-secondary);
          display: block;
          margin-bottom: 1rem;
        }
        .hero-section h1 {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
        }
        .hero-section p {
          max-width: 800px;
          margin: 0 auto 2.5rem auto;
          font-size: 1.2rem;
          color: #f0eae4;
        }
        .hero-actions {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }
        .hero-section .btn-secondary {
          color: #fff;
          border-color: #fff;
        }
        .hero-section .btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        /* Upcoming Events Grid */
        .upcoming-events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 1rem;
        }
        .upcoming-event-card {
          padding: 2.25rem 2rem;
          display: flex;
          flex-direction: column;
          border-left: 5px solid var(--color-primary);
          height: 100%;
          background: #ffffff;
        }
        .upcoming-event-tag {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background-color: var(--color-primary-light);
          color: var(--color-primary);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
        }
        .upcoming-event-date-badge {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-secondary);
        }
        .upcoming-event-title {
          font-size: 1.35rem;
          color: var(--color-primary);
          margin-bottom: 0.75rem;
          font-family: var(--font-serif);
          font-weight: 700;
          line-height: 1.3;
        }
        .upcoming-event-meta {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .upcoming-event-desc {
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--color-text-muted);
          margin-bottom: 1.75rem;
          flex: 1;
        }
        .upcoming-event-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: auto;
          flex-wrap: wrap;
        }
        .upcoming-event-actions .btn-sm {
          padding: 0.45rem 1.25rem;
          font-size: 0.85rem;
          border-radius: var(--border-radius-sm);
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 5rem 0;
          }
          .hero-section h1 {
            font-size: 2.25rem;
          }
          .hero-actions {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
