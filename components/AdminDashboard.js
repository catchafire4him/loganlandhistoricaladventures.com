"use client";

import { useState } from "react";
import { 
  adminLogout,
  createEvent, updateEvent, deleteEvent,
  createPresentation, updatePresentation, deletePresentation,
  createFaq, updateFaq, deleteFaq,
  createVideo, updateVideo, deleteVideo
} from "../app/actions";

export default function AdminDashboard({ events, presentations, faqs, videos = [] }) {
  const [activeTab, setActiveTab] = useState("events");
  const [message, setMessage] = useState({ type: null, text: "" });
  const [loading, setLoading] = useState(false);

  // Edit states
  const [editEventId, setEditEventId] = useState(null);
  const [editPresId, setEditPresId] = useState(null);
  const [editFaqId, setEditFaqId] = useState(null);
  const [editVideoId, setEditVideoId] = useState(null);

  // Form input states
  const [eventForm, setEventForm] = useState({
    title: "", date: "", time: "", location: "", description: "", link: "", image_url: ""
  });
  const [presForm, setPresForm] = useState({
    title: "", image_url: "", description: "", excerpt: ""
  });
  const [faqForm, setFaqForm] = useState({
    category: "History Presentations", question: "", answer: "", display_order: 0
  });
  const [videoForm, setVideoForm] = useState({
    title: "", video_url: "", display_order: 0
  });

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: null, text: "" }), 5000);
  };

  async function handleLogout() {
    await adminLogout();
    window.location.reload();
  }

  // --- EVENTS CRUD ---
  async function handleEventSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editEventId) {
        await updateEvent(editEventId, eventForm);
        showMsg("success", "Event updated successfully!");
      } else {
        await createEvent(eventForm);
        showMsg("success", "Event created successfully!");
      }
      setEventForm({ title: "", date: "", time: "", location: "", description: "", link: "", image_url: "" });
      setEditEventId(null);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showMsg("error", "Error saving event: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEditEvent(ev) {
    setEditEventId(ev.id);
    setEventForm({
      title: ev.title,
      date: ev.date,
      time: ev.time,
      location: ev.location,
      description: ev.description,
      link: ev.link || "",
      image_url: ev.image_url || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteEvent(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setLoading(true);
    try {
      await deleteEvent(id);
      showMsg("success", "Event deleted successfully!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showMsg("error", "Error deleting event: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // --- PRESENTATIONS CRUD ---
  async function handlePresSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editPresId) {
        await updatePresentation(editPresId, presForm);
        showMsg("success", "Presentation updated successfully!");
      } else {
        await createPresentation(presForm);
        showMsg("success", "Presentation created successfully!");
      }
      setPresForm({ title: "", image_url: "", description: "", excerpt: "" });
      setEditPresId(null);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showMsg("error", "Error saving presentation: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEditPres(pr) {
    setEditPresId(pr.id);
    setPresForm({
      title: pr.title,
      image_url: pr.image_url || "",
      description: pr.description,
      excerpt: pr.excerpt || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeletePres(id) {
    if (!confirm("Are you sure you want to delete this presentation?")) return;
    setLoading(true);
    try {
      await deletePresentation(id);
      showMsg("success", "Presentation deleted successfully!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showMsg("error", "Error deleting presentation: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // --- FAQS CRUD ---
  async function handleFaqSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editFaqId) {
        await updateFaq(editFaqId, faqForm);
        showMsg("success", "FAQ updated successfully!");
      } else {
        await createFaq(faqForm);
        showMsg("success", "FAQ created successfully!");
      }
      setFaqForm({ category: "History Presentations", question: "", answer: "", display_order: 0 });
      setEditFaqId(null);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showMsg("error", "Error saving FAQ: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEditFaq(fq) {
    setEditFaqId(fq.id);
    setFaqForm({
      category: fq.category,
      question: fq.question,
      answer: fq.answer,
      display_order: fq.display_order
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteFaq(id) {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    setLoading(true);
    try {
      await deleteFaq(id);
      showMsg("success", "FAQ deleted successfully!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showMsg("error", "Error deleting FAQ: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  // --- VIDEOS CRUD ---
  async function handleVideoSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (editVideoId) {
        await updateVideo(editVideoId, videoForm);
        showMsg("success", "Video updated successfully!");
      } else {
        await createVideo(videoForm);
        showMsg("success", "Video created successfully!");
      }
      setVideoForm({ title: "", video_url: "", display_order: 0 });
      setEditVideoId(null);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showMsg("error", "Error saving video: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEditVideo(vi) {
    setEditVideoId(vi.id);
    setVideoForm({
      title: vi.title,
      video_url: vi.video_url,
      display_order: vi.display_order || 0
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteVideo(id) {
    if (!confirm("Are you sure you want to delete this video?")) return;
    setLoading(true);
    try {
      await deleteVideo(id);
      showMsg("success", "Video deleted successfully!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showMsg("error", "Error deleting video: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section">
      <div className="container">
        {/* Dashboard Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "1.5rem" }}>
          <div>
            <h1 style={{ color: "var(--color-primary)" }}>Admin Dashboard</h1>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--color-text-light)" }}>Manage presentations, events, FAQs, and videos.</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: "0.5rem 1.5rem", fontSize: "0.9rem" }}>
            Logout
          </button>
        </div>

        {/* Status Message */}
        {message.text && (
          <div className={`status-banner status-${message.type}`} style={{ marginBottom: "2rem" }}>
            {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2.5rem", borderBottom: "2px solid var(--color-border)", flexWrap: "wrap" }}>
          <button 
            className={`btn ${activeTab === "events" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "8px 8px 0 0", padding: "0.75rem 1.5rem", borderBottom: "none" }}
            onClick={() => setActiveTab("events")}
          >
            Events ({events.length})
          </button>
          <button 
            className={`btn ${activeTab === "presentations" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "8px 8px 0 0", padding: "0.75rem 1.5rem", borderBottom: "none" }}
            onClick={() => setActiveTab("presentations")}
          >
            Presentations ({presentations.length})
          </button>
          <button 
            className={`btn ${activeTab === "faqs" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "8px 8px 0 0", padding: "0.75rem 1.5rem", borderBottom: "none" }}
            onClick={() => setActiveTab("faqs")}
          >
            FAQs ({faqs.length})
          </button>
          <button 
            className={`btn ${activeTab === "videos" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "8px 8px 0 0", padding: "0.75rem 1.5rem", borderBottom: "none" }}
            onClick={() => setActiveTab("videos")}
          >
            Dance Videos ({videos.length})
          </button>
        </div>

        {/* EVENTS TAB CONTENT */}
        {activeTab === "events" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "3rem" }}>
            {/* List */}
            <div>
              <h3>Scheduled Events</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1.5rem" }}>
                {events.map((ev) => (
                  <div key={ev.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ color: "var(--color-primary)", marginBottom: "0.25rem" }}>{ev.title}</h4>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                        <strong>Date:</strong> {ev.date} | <strong>Location:</strong> {ev.location}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => startEditEvent(ev)} className="btn btn-secondary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.85rem", borderRadius: "4px" }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteEvent(ev.id)} className="btn btn-primary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.85rem", borderRadius: "4px", backgroundColor: "#A82E2E", boxShadow: "none" }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="glass-panel">
              <h3>{editEventId ? "Edit Event" : "Create New Event"}</h3>
              <form onSubmit={handleEventSubmit} style={{ marginTop: "1.5rem" }}>
                <div className="form-group">
                  <label className="form-label">Event Title *</label>
                  <input type="text" required value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})} className="form-input" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Date (e.g. July 11, 2026) *</label>
                    <input type="text" required value={eventForm.date} onChange={(e) => setEventForm({...eventForm, date: e.target.value})} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time (e.g. 9:00 AM - 5:00 PM) *</label>
                    <input type="text" required value={eventForm.time} onChange={(e) => setEventForm({...eventForm, time: e.target.value})} className="form-input" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input type="text" required value={eventForm.location} onChange={(e) => setEventForm({...eventForm, location: e.target.value})} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea required value={eventForm.description} onChange={(e) => setEventForm({...eventForm, description: e.target.value})} className="form-input" style={{ minHeight: "80px" }}></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">External Event Link (optional)</label>
                  <input type="url" value={eventForm.link} onChange={(e) => setEventForm({...eventForm, link: e.target.value})} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Image Filename (optional, e.g. event-poster.jpg)</label>
                  <input type="text" value={eventForm.image_url} onChange={(e) => setEventForm({...eventForm, image_url: e.target.value})} className="form-input" />
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                    {editEventId ? "Update Event" : "Save Event"}
                  </button>
                  {editEventId && (
                    <button type="button" onClick={() => { setEditEventId(null); setEventForm({ title: "", date: "", time: "", location: "", description: "", link: "", image_url: "" }); }} className="btn btn-secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PRESENTATIONS TAB CONTENT */}
        {activeTab === "presentations" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "3rem" }}>
            {/* List */}
            <div>
              <h3>Portrayed Characters</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1.5rem" }}>
                {presentations.map((pr) => (
                  <div key={pr.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ color: "var(--color-primary)", marginBottom: "0.25rem" }}>{pr.title}</h4>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                        {pr.excerpt || pr.description.slice(0, 80) + "..."}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => startEditPres(pr)} className="btn btn-secondary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.85rem", borderRadius: "4px" }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeletePres(pr.id)} className="btn btn-primary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.85rem", borderRadius: "4px", backgroundColor: "#A82E2E", boxShadow: "none" }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="glass-panel">
              <h3>{editPresId ? "Edit Character" : "Create New Character"}</h3>
              <form onSubmit={handlePresSubmit} style={{ marginTop: "1.5rem" }}>
                <div className="form-group">
                  <label className="form-label">Character Name *</label>
                  <input type="text" required value={presForm.title} onChange={(e) => setPresForm({...presForm, title: e.target.value})} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Short Excerpt *</label>
                  <input type="text" required value={presForm.excerpt} onChange={(e) => setPresForm({...presForm, excerpt: e.target.value})} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Description *</label>
                  <textarea required value={presForm.description} onChange={(e) => setPresForm({...presForm, description: e.target.value})} className="form-input" style={{ minHeight: "120px" }}></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Image Filename (optional, e.g. 20240808_155201-768x1024.webp)</label>
                  <input type="text" value={presForm.image_url} onChange={(e) => setPresForm({...presForm, image_url: e.target.value})} className="form-input" />
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                    {editPresId ? "Update Character" : "Save Character"}
                  </button>
                  {editPresId && (
                    <button type="button" onClick={() => { setEditPresId(null); setPresForm({ title: "", image_url: "", description: "", excerpt: "" }); }} className="btn btn-secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* FAQS TAB CONTENT */}
        {activeTab === "faqs" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "3rem" }}>
            {/* List */}
            <div>
              <h3>Frequently Asked Questions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1.5rem" }}>
                {faqs.map((fq) => (
                  <div key={fq.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "var(--color-text-light)" }}>
                        {fq.category}
                      </span>
                      <h4 style={{ color: "var(--color-primary)", margin: "0.15rem 0" }}>{fq.question}</h4>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
                        {fq.answer.slice(0, 80) + "..."}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => startEditFaq(fq)} className="btn btn-secondary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.85rem", borderRadius: "4px" }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteFaq(fq.id)} className="btn btn-primary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.85rem", borderRadius: "4px", backgroundColor: "#A82E2E", boxShadow: "none" }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="glass-panel">
              <h3>{editFaqId ? "Edit FAQ" : "Create New FAQ"}</h3>
              <form onSubmit={handleFaqSubmit} style={{ marginTop: "1.5rem" }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select 
                    value={faqForm.category} 
                    onChange={(e) => setFaqForm({...faqForm, category: e.target.value})} 
                    className="form-input"
                  >
                    <option value="History Presentations">History Presentations</option>
                    <option value="Family Folk Dancing">Family Folk Dancing</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Question *</label>
                  <input type="text" required value={faqForm.question} onChange={(e) => setFaqForm({...faqForm, question: e.target.value})} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Answer *</label>
                  <textarea required value={faqForm.answer} onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})} className="form-input" style={{ minHeight: "100px" }}></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label">Display Order (e.g. 1, 2, 3)</label>
                  <input type="number" value={faqForm.display_order} onChange={(e) => setFaqForm({...faqForm, display_order: parseInt(e.target.value) || 0})} className="form-input" />
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                    {editFaqId ? "Update FAQ" : "Save FAQ"}
                  </button>
                  {editFaqId && (
                    <button type="button" onClick={() => { setEditFaqId(null); setFaqForm({ category: "History Presentations", question: "", answer: "", display_order: 0 }); }} className="btn btn-secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VIDEOS TAB CONTENT */}
        {activeTab === "videos" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "3rem" }}>
            {/* List */}
            <div>
              <h3>Folk Dancing Demonstration Videos</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1.5rem" }}>
                {videos.map((vi) => (
                  <div key={vi.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ color: "var(--color-primary)", marginBottom: "0.25rem" }}>{vi.title}</h4>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-light)", wordBreak: "break-all" }}>
                        <strong>URL:</strong> {vi.video_url}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => startEditVideo(vi)} className="btn btn-secondary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.85rem", borderRadius: "4px" }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteVideo(vi.id)} className="btn btn-primary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.85rem", borderRadius: "4px", backgroundColor: "#A82E2E", boxShadow: "none" }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {videos.length === 0 && (
                  <p style={{ fontStyle: "italic", color: "var(--color-text-light)" }}>No demonstration videos uploaded yet. Use the form on the right to add some!</p>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="glass-panel">
              <h3>{editVideoId ? "Edit Video" : "Add Demonstration Video"}</h3>
              <form onSubmit={handleVideoSubmit} style={{ marginTop: "1.5rem" }}>
                <div className="form-group">
                  <label className="form-label">Video Title *</label>
                  <input type="text" required placeholder="e.g. Virginia Reel Dance at Wedding" value={videoForm.title} onChange={(e) => setVideoForm({...videoForm, title: e.target.value})} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Video URL (YouTube or Direct Video File URL) *</label>
                  <input type="text" required placeholder="https://www.youtube.com/watch?v=... or https://yourdomain.com/video.mp4" value={videoForm.video_url} onChange={(e) => setVideoForm({...videoForm, video_url: e.target.value})} className="form-input" />
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>
                    Supports full YouTube watch URLs, short `youtu.be` links, and direct video file uploads.
                  </span>
                </div>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input type="number" value={videoForm.display_order} onChange={(e) => setVideoForm({...videoForm, display_order: parseInt(e.target.value) || 0})} className="form-input" />
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                    {editVideoId ? "Update Video" : "Save Video"}
                  </button>
                  {editVideoId && (
                    <button type="button" onClick={() => { setEditVideoId(null); setVideoForm({ title: "", video_url: "", display_order: 0 }); }} className="btn btn-secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
