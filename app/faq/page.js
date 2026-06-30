import { sql } from "../../lib/db";

export const revalidate = 3600;

export const metadata = {
  title: "Frequently Asked Questions | Logan Land",
  description: "Find answers to questions about booking Logan for historical presentations, family folk dancing events, travel, and custom history topics.",
};

export default async function FAQ() {
  let list = [];
  try {
    list = await sql`SELECT * FROM faqs ORDER BY display_order ASC, id ASC`;
  } catch (err) {
    console.error("Error fetching FAQs:", err);
  }

  // Group FAQs by category
  const categories = {};
  list.forEach((f) => {
    if (!categories[f.category]) {
      categories[f.category] = [];
    }
    categories[f.category].push(f);
  });

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: "800px" }}>
        <div className="section-title">
          <p>Questions & Answers</p>
          <h2>Frequently Asked Questions</h2>
        </div>

        {Object.keys(categories).map((cat) => (
          <div key={cat} className="faq-category-section">
            <h3 className="faq-category-title">{cat}</h3>
            
            <div className="faq-list">
              {categories[cat].map((faq) => (
                <details key={faq.id} className="faq-item">
                  <summary className="faq-question">
                    <span>{faq.question}</span>
                    <span className="faq-icon-toggle">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 5v14M5 12h14" className="plus-icon" />
                      </svg>
                    </span>
                  </summary>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .faq-category-section {
          margin-bottom: 4rem;
        }
        
        .faq-category-title {
          color: var(--color-primary);
          border-bottom: 2px solid var(--color-primary);
          padding-bottom: 0.75rem;
          margin-bottom: 1.5rem;
          font-size: 1.75rem;
        }
        
        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .faq-item {
          background-color: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          transition: var(--transition-smooth);
        }
        
        .faq-item[open] {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-sm);
        }
        
        .faq-question {
          padding: 1.25rem 1.5rem;
          font-family: var(--font-sans);
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--color-text-dark);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          list-style: none;
          user-select: none;
          outline: none;
        }
        
        /* Remove default details arrow */
        .faq-question::-webkit-details-marker {
          display: none;
        }
        
        .faq-icon-toggle {
          color: var(--color-primary);
          transition: transform 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .faq-item[open] .faq-icon-toggle {
          transform: rotate(45deg);
        }
        
        .faq-answer {
          padding: 0 1.5rem 1.5rem 1.5rem;
          animation: fadeIn 0.3s ease-out;
        }
        
        .faq-answer p {
          margin-bottom: 0;
          font-size: 1rem;
          line-height: 1.6;
          color: var(--color-text-muted);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
