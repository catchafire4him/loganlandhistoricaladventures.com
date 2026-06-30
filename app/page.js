import Link from "next/link";
import { sql } from "../lib/db";

// Force Next.js to run dynamic queries rather than caching permanently
export const revalidate = 0;

export default async function Home() {
  // Fetch next upcoming event
  let nextEvent = null;
  try {
    const events = await sql`SELECT * FROM events ORDER BY id DESC LIMIT 1`;
    if (events && events.length > 0) {
      nextEvent = events[0];
    }
  } catch (err) {
    console.error("Error fetching next event:", err);
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
            <h2>Educational & Interactive Adventures</h2>
          </div>

          <div className="card-grid">
            <div className="card">
              <div className="card-img-wrapper">
                <img 
                  src="/wp-content/uploads/2026/06/presentation-scaled.jpg" 
                  alt="Living History Presentation" 
                  className="card-img"
                />
              </div>
              <div className="card-content">
                <h3 className="card-title">Living History Presentations</h3>
                <p className="card-text">
                  Logan portrays historical figures—such as George Washington, Abraham Lincoln, and Alvin York—with authentic costuming, deep research, and historic artifacts. Inspiring, dramatic, and educational.
                </p>
                <Link href="/presentations" className="btn btn-secondary" style={{ marginTop: "auto" }}>
                  View Characters
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

      {/* Next Upcoming Event banner */}
      {nextEvent && (
        <section className="section">
          <div className="container">
            <div className="glass-panel event-banner">
              <div className="event-banner-content">
                <span className="event-tag">Next Upcoming Event</span>
                <h3>{nextEvent.title}</h3>
                <div className="event-meta">
                  <div className="event-meta-item">
                    <strong>Date:</strong> {nextEvent.date}
                  </div>
                  <div className="event-meta-item">
                    <strong>Time:</strong> {nextEvent.time}
                  </div>
                  <div className="event-meta-item">
                    <strong>Location:</strong> {nextEvent.location}
                  </div>
                </div>
                <p>{nextEvent.description}</p>
                <div className="event-actions">
                  <Link href="/events" className="btn btn-primary">
                    View All Events
                  </Link>
                  {nextEvent.link && (
                    <a href={nextEvent.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      Event Details
                    </a>
                  )}
                </div>
              </div>
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
          border-bottom: 5px solid var(--color-primary);
        }
        .hero-container {
          display: flex;
          justify-content: center;
        }
        .hero-content {
          max-width: 800px;
        }
        .hero-subtitle {
          display: block;
          font-family: var(--font-sans);
          font-size: 1.1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-secondary);
          margin-bottom: 1.5rem;
        }
        .hero-content h1 {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        .hero-content p {
          color: #e5dfdf;
          font-size: 1.25rem;
          margin-bottom: 2.5rem;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        }
        .hero-actions {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .hero-actions .btn-secondary {
          color: #fff;
          border-color: #fff;
        }
        .hero-actions .btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .event-banner {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          border-left: 6px solid var(--color-primary);
        }
        .event-tag {
          display: inline-block;
          background-color: var(--color-primary);
          color: #fff;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.35rem 1rem;
          border-radius: 50px;
          margin-bottom: 1rem;
        }
        .event-banner h3 {
          font-size: 2.25rem;
          color: var(--color-primary);
          margin-bottom: 1rem;
        }
        .event-meta {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          font-size: 1.05rem;
        }
        .event-meta-item strong {
          color: var(--color-text-dark);
        }
        .event-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
