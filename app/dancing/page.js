import { sql } from "../../lib/db";
import Link from "next/link";

export const revalidate = 3600;

export const metadata = {
  title: "Family Folk Dancing Circles | Logan Land",
  description: "Dynamic traditional folk dancing for weddings, block parties, community festivals, and school events. Simple circle, line, and reel dances led by Logan.",
};

export default async function Dancing() {
  const events = [
    {
      title: "Weddings",
      description: "Give your wedding guests an unforgettable experience. Logan leads fun, simple circle and reel dances that get both sides of the family laughing and dancing together, breaking the ice early in the reception."
    },
    {
      title: "Community Gatherings",
      description: "Whether it's a neighborhood block party, a church social, a town festival, or a school assembly, folk dancing brings communities closer and builds long-lasting memories."
    },
    {
      title: "Birthdays & Graduations",
      description: "Celebrate milestones with a joyful circle. These dances are easy to learn in under a minute, ensuring that guests of all ages—from kids to seniors—can participate and feel included."
    }
  ];

  // Fetch videos from the database
  let videosList = [];
  try {
    videosList = await sql`SELECT * FROM videos ORDER BY display_order ASC, id ASC`;
  } catch (err) {
    console.error("Error fetching videos:", err);
  }

  // Helper function to extract YouTube Embed URL
  function getYouTubeEmbedUrl(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  }

  return (
    <div>
      {/* Hero Header */}
      <section className="dancing-hero">
        <div className="container">
          <span className="dancing-tag">Community & Celebration</span>
          <h1>Family Folk Dancing</h1>
          <p style={{ maxWidth: "600px", margin: "1.5rem auto 0 auto", color: "#e5dfdf", fontSize: "1.2rem" }}>
            A high-energy, multi-generational community dancing experience. Simple traditional dances taught in seconds—no prior experience needed!
          </p>
        </div>
      </section>

      {/* Main Description */}
      <section className="section section-light">
        <div className="container dancing-grid">
          <div className="dancing-text">
            <h2>Bringing People Together in a Circle</h2>
            <p>
              Traditional folk dancing is about one thing: <strong>connection</strong>. Logan's family folk dances are designed to be completely inclusive. There are no complicated steps to memorize, and no partner is required to start. 
            </p>
            <p>
              Within minutes of starting, your group will be laughing, moving in unison, and sharing a collective experience of joy. Logan uses a wide range of acoustic traditional tunes, including Irish jigs, American reels, and international circle dances.
            </p>
            <div style={{ marginTop: "2rem" }}>
              <Link href="/contact" className="btn btn-primary">
                Book a Dance Event
              </Link>
            </div>
          </div>
          <div className="dancing-img-frame">
            <img 
              src="/wp-content/uploads/2026/06/Dance.jpg" 
              alt="Community Folk Dancing Circle" 
              className="dancing-img"
            />
          </div>
        </div>
      </section>

      {/* Video Demonstration Section */}
      {videosList.length > 0 && (
        <section className="section" style={{ backgroundColor: "var(--color-bg-card)", borderBottom: "1px solid var(--color-border)" }}>
          <div className="container">
            <div className="section-title">
              <p>Folk Dancing in Action</p>
              <h2>Watch the Dances</h2>
            </div>
            
            <div className="videos-grid">
              {videosList.map((v) => {
                const embedUrl = getYouTubeEmbedUrl(v.video_url);
                return (
                  <div key={v.id} className="video-card glass-panel">
                    <h3 className="video-title">{v.title}</h3>
                    <div className="video-wrapper">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={v.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="embedded-player"
                        ></iframe>
                      ) : (
                        <video 
                          src={v.video_url} 
                          controls 
                          preload="metadata"
                          className="native-player"
                        ></video>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Event Types Grid */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <p>Perfect for Any Celebration</p>
            <h2>Where We Dance</h2>
          </div>

          <div className="card-grid">
            {events.map((e, idx) => (
              <div key={idx} className="card event-type-card">
                <div className="card-content">
                  <div className="icon-wrapper">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--color-primary)" }}>
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <h3 className="card-title" style={{ marginTop: "1rem" }}>{e.title}</h3>
                  <p className="card-text">{e.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-light">
        <div className="container">
          <div className="section-title">
            <p>Testimonials</p>
            <h2>What People Are Saying</h2>
          </div>

          <div className="testimonials-grid">
            <div className="glass-panel testimonial-card">
              <p className="testimonial-text">
                "We had Logan lead a folk dance for our wedding reception, and it was the highlight of the night! He got guests of all ages onto the floor immediately. It broke the ice and set a joyful tone for the whole evening."
              </p>
              <div className="testimonial-author">
                <strong>— Sarah & David K.</strong>
                <span>Married in Coeur d'Alene</span>
              </div>
            </div>

            <div className="glass-panel testimonial-card">
              <p className="testimonial-text">
                "Logan's instruction is simple, clear, and full of energy. The kids loved it, and the grandparents had just as much fun. Truly a multi-generational event!"
              </p>
              <div className="testimonial-author">
                <strong>— Principal Thomas R.</strong>
                <span>School Assembly Event</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .dancing-hero {
          background: linear-gradient(rgba(7, 53, 30, 0.5), rgba(7, 53, 30, 0.75)), url('/wp-content/uploads/2026/06/Dance.jpg') no-repeat center top/cover;
          padding: 11rem 0;
          color: #fff;
          text-align: center;
          border-bottom: 5px solid var(--color-primary);
        }
        .dancing-tag {
          font-family: var(--font-sans);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-secondary);
          display: block;
          margin-bottom: 1rem;
        }
        .dancing-hero h1 {
          font-size: 3.5rem;
        }
        .dancing-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        @media (max-width: 992px) {
          .dancing-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }
        .dancing-img-frame {
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border: 4px solid #fff;
        }
        .dancing-img {
          width: 100%;
          height: auto;
          display: block;
        }
        .icon-wrapper {
          background-color: var(--color-primary-light);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
        }
        @media (max-width: 768px) {
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
        }
        .testimonial-card {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          border-left: 4px solid var(--color-primary);
        }
        .testimonial-text {
          font-style: italic;
          font-size: 1.05rem;
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
          line-height: 1.7;
        }
        .testimonial-author {
          display: flex;
          flex-direction: column;
          margin-top: auto;
        }
        .testimonial-author strong {
          color: var(--color-primary);
          font-size: 1.05rem;
        }
        .testimonial-author span {
          font-size: 0.9rem;
          color: var(--color-text-light);
        }

        /* Videos Section Styles */
        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 2.5rem;
          margin-top: 1.5rem;
        }
        @media (max-width: 500px) {
          .videos-grid {
            grid-template-columns: 1fr;
          }
        }
        .video-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: #ffffff;
          border: 1px solid var(--color-border);
        }
        .video-title {
          font-size: 1.35rem;
          color: var(--color-primary);
          font-family: var(--font-serif);
          font-weight: 700;
        }
        .video-wrapper {
          position: relative;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          background: #000;
          box-shadow: var(--shadow-sm);
        }
        .embedded-player, .native-player {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>
    </div>
  );
}
