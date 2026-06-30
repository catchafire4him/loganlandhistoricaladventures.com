import ContactForm from "../../components/ContactForm";

export const metadata = {
  title: "Book Logan Land | Contact & Booking Information",
  description: "Get in touch to book a living history presentation, character portrayal, or family folk dancing circle. Serving Idaho, Washington, and the Pacific Northwest.",
};

export default function Contact() {
  return (
    <div className="section">
      <div className="container contact-container">
        <div className="section-title">
          <p>Get In Touch</p>
          <h2>Contact Us</h2>
          <p style={{ maxWidth: "600px", margin: "1.5rem auto 0 auto" }}>
            Have a question, want to book a presentation, or schedule a family folk dance event? Fill out the form below or send us an email.
          </p>
        </div>

        <div className="contact-grid">
          {/* Contact Details */}
          <div className="glass-panel contact-details">
            <h3>Contact Information</h3>
            <p>
              We look forward to hearing from you. Please reach out to discuss booking availability, pricing, or custom presentation topics.
            </p>
            
            <div className="contact-info-list">
              <div className="contact-info-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="contact-icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <div className="info-text">
                  <strong>Email</strong>
                  <a href="mailto:loganlandhistoricaladventures@gmail.com">loganlandhistoricaladventures@gmail.com</a>
                </div>
              </div>

              <div className="contact-info-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="contact-icon">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div className="info-text">
                  <strong>Location</strong>
                  <span>Coeur d'Alene, Idaho (Serving the Pacific Northwest & beyond)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Client Component */}
          <ContactForm />
        </div>
      </div>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 3rem;
          align-items: start;
        }
        @media (max-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }
        
        .contact-details {
          background-color: var(--color-primary);
          color: #fff;
          border-color: var(--color-primary);
        }
        .contact-details h3 {
          color: var(--color-secondary);
          margin-bottom: 1.5rem;
          font-size: 1.75rem;
        }
        .contact-details p {
          color: #f7eded;
          margin-bottom: 2.5rem;
        }
        
        .contact-info-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .contact-info-item {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
        }
        
        .contact-icon {
          color: var(--color-secondary);
          flex-shrink: 0;
          margin-top: 0.25rem;
        }
        
        .info-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .info-text strong {
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-secondary);
        }
        
        .info-text a, .info-text span {
          font-size: 1.05rem;
          color: #fff;
        }
        .info-text a:hover {
          color: var(--color-secondary);
          text-decoration: underline;
        }
        
        .contact-form-wrapper h3 {
          color: var(--color-primary);
          margin-bottom: 1.5rem;
          font-size: 1.75rem;
        }
        
        .status-banner {
          padding: 1rem;
          border-radius: var(--border-radius-sm);
          font-weight: 500;
          margin-bottom: 1.5rem;
        }
        
        .status-success {
          background-color: #E2F8EE;
          color: #0E623B;
          border: 1px solid #C4F1DB;
        }
        
        .status-error {
          background-color: #FCE8E6;
          color: #A82E2E;
          border: 1px solid #F9D0CB;
        }
        
        .form-submit-btn {
          width: 100%;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
