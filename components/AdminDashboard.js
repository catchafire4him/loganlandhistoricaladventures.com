"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  adminLogout,
  createEvent, updateEvent, deleteEvent,
  createPresentation, updatePresentation, deletePresentation,
  createFaq, updateFaq, deleteFaq,
  createVideo, updateVideo, deleteVideo,
  createPost, updatePost, deletePost
} from "../app/actions";

export default function AdminDashboard({ events, presentations, faqs, videos = [], posts = [] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial tab from URL query param, default to "events"
  const initialTab = searchParams.get("tab") || "events";
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [message, setMessage] = useState({ type: null, text: "" });
  const [loading, setLoading] = useState(false);

  // Sync tab with URL search parameter
  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  const changeTab = (tabName) => {
    setActiveTab(tabName);
    router.push(`/admin?tab=${tabName}`, { scroll: false });
  };

  // Edit states
  const [editEventId, setEditEventId] = useState(null);
  const [editPresId, setEditPresId] = useState(null);
  const [editFaqId, setEditFaqId] = useState(null);
  const [editVideoId, setEditVideoId] = useState(null);
  const [editPostId, setEditPostId] = useState(null);

  // Form input states
  const [eventForm, setEventForm] = useState({
    title: "", date: "", time: "", location: "", description: "", link: "", image_url: ""
  });
  const [presForm, setPresForm] = useState({
    title: "", image_url: "", description: "", excerpt: "", visible: true
  });
  const [faqForm, setFaqForm] = useState({
    category: "History Presentations", question: "", answer: "", display_order: 0
  });
  const [videoForm, setVideoForm] = useState({
    title: "", video_url: "", display_order: 0
  });
  const [postForm, setPostForm] = useState({
    title: "", slug: "", content: "", excerpt: "", status: "draft", image_url: ""
  });

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: null, text: "" }), 5000);
  };

  async function handleLogout() {
    await adminLogout();
    window.location.reload();
  }

  // --- HELPERS TO PARSE DATES AND TIMES FOR FORM BINDING ---
  function convertToISODate(dateStr) {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  }

  function getStartTime(timeStr) {
    if (!timeStr || !timeStr.includes(" - ")) return "";
    const startPart = timeStr.split(" - ")[0].trim();
    return convertTo24Hour(startPart);
  }

  // Same helper but gets the second half
  function getEndTime(timeStr) {
    if (!timeStr || !timeStr.includes(" - ")) return "";
    const endPart = timeStr.split(" - ")[1].trim();
    return convertTo24Hour(endPart);
  }

  function convertTo24Hour(time12h) {
    const match = time12h.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return "";
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  }

  // --- EVENTS CRUD ---
  async function handleEventSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      if (editEventId) {
        await updateEvent(editEventId, formData);
        showMsg("success", "Event updated successfully!");
      } else {
        await createEvent(formData);
        showMsg("success", "Event created successfully!");
      }
      setEventForm({ title: "", date: "", time: "", location: "", description: "", link: "", image_url: "" });
      setEditEventId(null);
      e.target.reset();
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
      const formData = new FormData(e.target);
      if (editPresId) {
        await updatePresentation(editPresId, formData);
        showMsg("success", "Presentation updated successfully!");
      } else {
        await createPresentation(formData);
        showMsg("success", "Presentation created successfully!");
      }
      setPresForm({ title: "", image_url: "", description: "", excerpt: "", visible: true });
      setEditPresId(null);
      e.target.reset();
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
      excerpt: pr.excerpt || "",
      visible: pr.visible !== false
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
      const formData = new FormData(e.target);
      if (editVideoId) {
        await updateVideo(editVideoId, formData);
        showMsg("success", "Video updated successfully!");
      } else {
        await createVideo(formData);
        showMsg("success", "Video created successfully!");
      }
      setVideoForm({ title: "", video_url: "", display_order: 0 });
      setEditVideoId(null);
      e.target.reset();
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

  // --- BLOGS CRUD ---
  async function handlePostSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      if (editPostId) {
        await updatePost(editPostId, formData);
        showMsg("success", "Blog post updated successfully!");
      } else {
        await createPost(formData);
        showMsg("success", "Blog post created successfully!");
      }
      setPostForm({ title: "", slug: "", content: "", excerpt: "", status: "draft", image_url: "" });
      setEditPostId(null);
      e.target.reset();
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showMsg("error", "Error saving blog post: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEditPost(po) {
    setEditPostId(po.id);
    setPostForm({
      title: po.title,
      slug: po.slug,
      content: po.content,
      excerpt: po.excerpt || "",
      status: po.status || "draft",
      image_url: po.image_url || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeletePost(id) {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    setLoading(true);
    try {
      await deletePost(id);
      showMsg("success", "Blog post deleted successfully!");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showMsg("error", "Error deleting blog post: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section">
      <div className="container">
        {/* Dashboard Header */}
        <div className="admin-header">
          <div>
            <h1 style={{ color: "var(--color-primary)" }}>Admin Dashboard</h1>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--color-text-light)" }}>Manage presentations, events, FAQs, videos, and blogs.</p>
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
            onClick={() => changeTab("events")}
          >
            Events ({events.length})
          </button>
          <button 
            className={`btn ${activeTab === "presentations" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "8px 8px 0 0", padding: "0.75rem 1.5rem", borderBottom: "none" }}
            onClick={() => changeTab("presentations")}
          >
            Presentations ({presentations.length})
          </button>
          <button 
            className={`btn ${activeTab === "faqs" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "8px 8px 0 0", padding: "0.75rem 1.5rem", borderBottom: "none" }}
            onClick={() => changeTab("faqs")}
          >
            FAQs ({faqs.length})
          </button>
          <button 
            className={`btn ${activeTab === "videos" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "8px 8px 0 0", padding: "0.75rem 1.5rem", borderBottom: "none" }}
            onClick={() => changeTab("videos")}
          >
            Dance Videos ({videos.length})
          </button>
          <button 
            className={`btn ${activeTab === "blog" ? "btn-primary" : "btn-secondary"}`}
            style={{ borderRadius: "8px 8px 0 0", padding: "0.75rem 1.5rem", borderBottom: "none" }}
            onClick={() => changeTab("blog")}
          >
            Blog Posts ({posts.length})
          </button>
        </div>

        {/* EVENTS TAB CONTENT */}
        {activeTab === "events" && (
          <div className="admin-grid">
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
              <form onSubmit={handleEventSubmit} style={{ marginTop: "1.5rem" }} encType="multipart/form-data">
                <input type="hidden" name="image_url" value={eventForm.image_url} />
                
                <div className="form-group">
                  <label className="form-label">Event Title *</label>
                  <input type="text" name="title" required value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})} className="form-input" />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Date *</label>
                    <input 
                      type="date" 
                      name="eventDate" 
                      required 
                      defaultValue={convertToISODate(eventForm.date)} 
                      className="form-input" 
                    />
                    {editEventId && (
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>
                        Current Date: {eventForm.date}
                      </span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Time Range *</label>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <input 
                        type="time" 
                        name="startTime" 
                        required 
                        defaultValue={getStartTime(eventForm.time)} 
                        className="form-input" 
                      />
                      <span style={{ color: "var(--color-text-light)" }}>to</span>
                      <input 
                        type="time" 
                        name="endTime" 
                        required 
                        defaultValue={getEndTime(eventForm.time)} 
                        className="form-input" 
                      />
                    </div>
                    {editEventId && (
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>
                        Current Time: {eventForm.time}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input type="text" name="location" required value={eventForm.location} onChange={(e) => setEventForm({...eventForm, location: e.target.value})} className="form-input" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea name="description" required value={eventForm.description} onChange={(e) => setEventForm({...eventForm, description: e.target.value})} className="form-input" style={{ minHeight: "80px" }}></textarea>
                </div>
                
                <div className="form-group">
                  <label className="form-label">External Event Link (optional)</label>
                  <input type="url" name="link" value={eventForm.link} onChange={(e) => setEventForm({...eventForm, link: e.target.value})} className="form-input" />
                </div>
                
                <div className="form-group" style={{ border: "1px dashed var(--color-border)", padding: "1rem", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.4)" }}>
                  <label className="form-label" style={{ fontWeight: "600" }}>Upload Event Poster Image</label>
                  {eventForm.image_url && (
                    <div style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: "600", marginBottom: "0.5rem" }}>
                      Current File: {eventForm.image_url.split("/").pop()}
                    </div>
                  )}
                  <input type="file" name="imageFile" accept="image/*" className="form-input" style={{ border: "none", padding: "0.25rem 0", background: "transparent" }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>Leave empty to keep the current image. Images will be optimized to WebP format.</span>
                </div>
                
                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
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
          <div className="admin-grid">
            {/* List */}
            <div>
              <h3>Portrayed Characters</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1.5rem" }}>
                {presentations.map((pr) => (
                  <div key={pr.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <h4 style={{ color: "var(--color-primary)", margin: 0 }}>{pr.title}</h4>
                        {pr.visible === false ? (
                          <span style={{ fontSize: "0.7rem", backgroundColor: "#A82E2E", color: "#fff", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>Hidden</span>
                        ) : (
                          <span style={{ fontSize: "0.7rem", backgroundColor: "var(--color-primary)", color: "#fff", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>Visible</span>
                        )}
                      </div>
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
              <form onSubmit={handlePresSubmit} style={{ marginTop: "1.5rem" }} encType="multipart/form-data">
                <input type="hidden" name="visible" value={presForm.visible ? "true" : "false"} />
                
                <div className="form-group">
                  <label className="form-label">Character Name *</label>
                  <input type="text" name="title" required value={presForm.title} onChange={(e) => setPresForm({...presForm, title: e.target.value})} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Short Excerpt *</label>
                  <input type="text" name="excerpt" required value={presForm.excerpt} onChange={(e) => setPresForm({...presForm, excerpt: e.target.value})} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Full Description *</label>
                  <textarea name="description" required value={presForm.description} onChange={(e) => setPresForm({...presForm, description: e.target.value})} className="form-input" style={{ minHeight: "120px" }}></textarea>
                </div>
                
                <div className="form-group" style={{ border: "1px dashed var(--color-border)", padding: "1rem", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>
                  <label className="form-label" style={{ fontWeight: "600" }}>Upload Character Photo</label>
                  {presForm.image_url && (
                    <div style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: "600", marginBottom: "0.5rem" }}>
                      Current File: {presForm.image_url.split("/").pop()}
                    </div>
                  )}
                  <input type="file" name="imageFile" accept="image/*" className="form-input" style={{ border: "none", padding: "0.25rem 0", background: "transparent" }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>Images will be compressed into WebP format automatically.</span>
                </div>

                <div className="form-group">
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.98rem" }}>
                    <input 
                      type="checkbox" 
                      checked={presForm.visible} 
                      onChange={(e) => setPresForm({...presForm, visible: e.target.checked})} 
                      style={{ width: "18px", height: "18px", accentColor: "var(--color-primary)" }}
                    />
                    <strong>Visible on public website</strong>
                  </label>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)", display: "block", marginLeft: "1.7rem", marginTop: "0.15rem" }}>
                    Uncheck to temporarily hide this character without deleting it.
                  </span>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                    {editPresId ? "Update Character" : "Save Character"}
                  </button>
                  {editPresId && (
                    <button type="button" onClick={() => { setEditPresId(null); setPresForm({ title: "", image_url: "", description: "", excerpt: "", visible: true }); }} className="btn btn-secondary">
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
          <div className="admin-grid">
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
          <div className="admin-grid">
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
              <form onSubmit={handleVideoSubmit} style={{ marginTop: "1.5rem" }} encType="multipart/form-data">
                <div className="form-group">
                  <label className="form-label">Video Title *</label>
                  <input type="text" name="title" required placeholder="e.g. Virginia Reel Dance at Wedding" value={videoForm.title} onChange={(e) => setVideoForm({...videoForm, title: e.target.value})} className="form-input" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Video Link / YouTube URL (Optional if uploading file)</label>
                  <input type="text" name="video_url" placeholder="https://www.youtube.com/watch?v=..." value={videoForm.video_url} onChange={(e) => setVideoForm({...videoForm, video_url: e.target.value})} className="form-input" />
                </div>
                
                <div className="form-group" style={{ border: "1px dashed var(--color-border)", padding: "1rem", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.4)" }}>
                  <label className="form-label" style={{ fontWeight: "600" }}>Upload Video File</label>
                  {videoForm.video_url && !videoForm.video_url.includes("youtube") && !videoForm.video_url.includes("youtu.be") && (
                    <div style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: "600", marginBottom: "0.5rem" }}>
                      Current File: {videoForm.video_url.split("/").pop()}
                    </div>
                  )}
                  <input type="file" name="videoFile" accept="video/*" className="form-input" style={{ border: "none", padding: "0.25rem 0", background: "transparent" }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>Leave empty to keep current file or use the YouTube URL above.</span>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input type="number" name="display_order" value={videoForm.display_order} onChange={(e) => setVideoForm({...videoForm, display_order: parseInt(e.target.value) || 0})} className="form-input" />
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

        {/* BLOG TAB CONTENT */}
        {activeTab === "blog" && (
          <div className="admin-grid">
            {/* List */}
            <div>
              <h3>Blog Articles</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1.5rem" }}>
                {posts.map((po) => (
                  <div key={po.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <h4 style={{ color: "var(--color-primary)", margin: 0 }}>{po.title}</h4>
                        {po.status === "published" ? (
                          <span style={{ fontSize: "0.7rem", backgroundColor: "var(--color-primary)", color: "#fff", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>Published</span>
                        ) : (
                          <span style={{ fontSize: "0.7rem", backgroundColor: "#b58e2a", color: "#fff", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>Draft</span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                        <strong>Slug:</strong> {po.slug}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => startEditPost(po)} className="btn btn-secondary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.85rem", borderRadius: "4px" }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeletePost(po.id)} className="btn btn-primary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.85rem", borderRadius: "4px", backgroundColor: "#A82E2E", boxShadow: "none" }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && (
                  <p style={{ fontStyle: "italic", color: "var(--color-text-light)" }}>No blog articles written yet. Use the form on the right to start writing!</p>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="glass-panel">
              <h3>{editPostId ? "Edit Blog Article" : "Write New Blog Article"}</h3>
              <form onSubmit={handlePostSubmit} style={{ marginTop: "1.5rem" }} encType="multipart/form-data">
                <div className="form-group">
                  <label className="form-label">Article Title *</label>
                  <input type="text" name="title" required value={postForm.title} onChange={(e) => setPostForm({...postForm, title: e.target.value})} className="form-input" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Custom Slug (optional - autogenerated if left empty)</label>
                  <input type="text" name="slug" placeholder="e.g. washington-presentation-coeur-dalene" value={postForm.slug} onChange={(e) => setPostForm({...postForm, slug: e.target.value})} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Excerpt (optional)</label>
                  <input type="text" name="excerpt" placeholder="A brief summary showing on the blog listing page..." value={postForm.excerpt} onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})} className="form-input" />
                </div>

                <div className="form-group">
                  <label className="form-label">Publishing Status *</label>
                  <select name="status" value={postForm.status} onChange={(e) => setPostForm({...postForm, status: e.target.value})} className="form-input">
                    <option value="draft">Draft (hidden from public)</option>
                    <option value="published">Published (visible on website)</option>
                  </select>
                </div>

                <div className="form-group" style={{ border: "1px dashed var(--color-border)", padding: "1rem", borderRadius: "8px", backgroundColor: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>
                  <label className="form-label" style={{ fontWeight: "600" }}>Upload Cover Image</label>
                  {postForm.image_url && (
                    <div style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: "600", marginBottom: "0.5rem" }}>
                      Current File: {postForm.image_url.split("/").pop()}
                    </div>
                  )}
                  <input type="file" name="imageFile" accept="image/*" className="form-input" style={{ border: "none", padding: "0.25rem 0", background: "transparent" }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>Cover images will be compressed to WebP automatically.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Article Content *</label>
                  <textarea name="content" required placeholder="Write your article here. Use double-newlines to separate paragraphs." value={postForm.content} onChange={(e) => setPostForm({...postForm, content: e.target.value})} className="form-input" style={{ minHeight: "220px", fontFamily: "inherit" }}></textarea>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                    {editPostId ? "Update Article" : "Publish/Save Article"}
                  </button>
                  {editPostId && (
                    <button type="button" onClick={() => { setEditPostId(null); setPostForm({ title: "", slug: "", content: "", excerpt: "", status: "draft", image_url: "" }); }} className="btn btn-secondary">
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
