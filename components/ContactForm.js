"use client";

import { useState } from "react";
import { submitContactForm } from "../app/actions";

export default function ContactForm() {
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    const formData = new FormData(event.target);
    const result = await submitContactForm(formData);

    setLoading(false);
    if (result.success) {
      setStatus({ type: "success", message: result.message });
      event.target.reset();
    } else {
      setStatus({ type: "error", message: result.error });
    }
  }

  return (
    <div className="glass-panel contact-form-wrapper">
      <h3>Send a Message</h3>
      
      {status.message && (
        <div className={`status-banner status-${status.type}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required 
            placeholder="Your Name" 
            className="form-input" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address *</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            placeholder="your.email@example.com" 
            className="form-input" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject" className="form-label">Subject</label>
          <input 
            type="text" 
            id="subject" 
            name="subject" 
            placeholder="What is this regarding?" 
            className="form-input" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">Message *</label>
          <textarea 
            id="message" 
            name="message" 
            required 
            placeholder="Tell us about your event (date, size, location) or how we can help..." 
            className="form-input"
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="btn btn-primary form-submit-btn"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
