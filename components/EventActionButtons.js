"use client";

import { useState } from "react";

export default function EventActionButtons({ event }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  // Helper to parse dates and times for calendars
  function getCalendarDates(dateStr, timeStr) {
    try {
      const parsedDate = new Date(dateStr);
      if (isNaN(parsedDate.getTime())) return null;

      const year = parsedDate.getFullYear();
      const month = parsedDate.getMonth(); // 0-indexed
      const date = parsedDate.getDate();

      // Default times: 9:00 AM to 10:00 AM
      let startHour = 9;
      let startMin = 0;
      let endHour = 10;
      let endMin = 0;

      if (timeStr && timeStr.includes(" - ")) {
        const parts = timeStr.split(" - ");
        const parseTimePart = (part) => {
          const match = part.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i);
          if (!match) return null;
          let hr = parseInt(match[1]);
          const mn = parseInt(match[2]);
          const ampm = match[3].toUpperCase();
          if (ampm === "PM" && hr < 12) hr += 12;
          if (ampm === "AM" && hr === 12) hr = 0;
          return { hr, mn };
        };
        const startParsed = parseTimePart(parts[0]);
        const endParsed = parseTimePart(parts[1]);
        if (startParsed) {
          startHour = startParsed.hr;
          startMin = startParsed.mn;
        }
        if (endParsed) {
          endHour = endParsed.hr;
          endMin = endParsed.mn;
        } else if (startParsed) {
          endHour = startParsed.hr + 1;
          endMin = startParsed.mn;
        }
      }

      // Create UTC date strings to prevent local timezone offsets in calendar urls
      const startDate = new Date(Date.UTC(year, month, date, startHour, startMin, 0));
      const endDate = new Date(Date.UTC(year, month, date, endHour, endMin, 0));

      const formatToIcsString = (d) => {
        return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      };

      return {
        start: formatToIcsString(startDate),
        end: formatToIcsString(endDate),
      };
    } catch (err) {
      console.error("Error parsing date/time for calendar:", err);
      return null;
    }
  }

  const dates = getCalendarDates(event.date, event.time);
  if (!dates) return null;

  // 1. Google Calendar URL
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${dates.start}/${dates.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

  // 2. Outlook Web URL
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(event.title)}&startdt=${dates.start}&enddt=${dates.end}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;

  // 3. Yahoo Calendar URL
  const yahooUrl = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(event.title)}&st=${dates.start}&et=${dates.end}&desc=${encodeURIComponent(event.description)}&in_loc=${encodeURIComponent(event.location)}`;

  // 4. Download iCal (.ics) File
  function handleDownloadIcs() {
    try {
      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Logan Land//Event Calendar//EN",
        "BEGIN:VEVENT",
        `UID:${event.id}-${Date.now()}@loganlandhistoricaladventures.com`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
        `DTSTART:${dates.start}`,
        `DTEND:${dates.end}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`,
        `LOCATION:${event.location}`,
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to generate ICS file:", err);
    }
    setShowDropdown(false);
  }

  // 5. Share Handler (Web Share API / Clipboard)
  async function handleShare() {
    const shareUrl = `${window.location.origin}/events#event-${event.id}`;
    const shareText = `Check out "${event.title}" on ${event.date} in ${event.location}!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share failed or cancelled", err);
      }
    } else {
      // Fallback: Copy to Clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  }

  return (
    <div className="event-actions-bar">
      {/* Save to Calendar Button with Dropdown */}
      <div className="calendar-dropdown-wrapper">
        <button 
          className="action-btn" 
          onClick={() => setShowDropdown(!showDropdown)}
          aria-expanded={showDropdown}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.4rem" }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Add to Calendar
        </button>

        {showDropdown && (
          <div className="calendar-dropdown-menu">
            <a 
              href={googleUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setShowDropdown(false)}
            >
              Google Calendar
            </a>
            <button onClick={handleDownloadIcs}>
              Apple Calendar / iCal
            </button>
            <a 
              href={outlookUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setShowDropdown(false)}
            >
              Outlook Web
            </a>
            <a 
              href={yahooUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => setShowDropdown(false)}
            >
              Yahoo Calendar
            </a>
          </div>
        )}
      </div>

      {/* Share Event Button */}
      <div style={{ position: "relative" }}>
        <button className="action-btn" onClick={handleShare}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.4rem" }}>
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          {copied ? "Link Copied!" : "Share Event"}
        </button>
      </div>

      {/* Scoped CSS styling */}
      <style>{`
        .event-actions-bar {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--color-border);
          flex-wrap: wrap;
        }

        .calendar-dropdown-wrapper {
          position: relative;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          color: var(--color-text-muted);
          padding: 0.5rem 1rem;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-fast);
          user-select: none;
        }

        .action-btn:hover {
          color: var(--color-primary);
          border-color: var(--color-primary);
          background-color: var(--color-primary-light);
        }

        .calendar-dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          background-color: #ffffff;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-sm);
          box-shadow: var(--shadow-md);
          z-index: 10;
          display: flex;
          flex-direction: column;
          min-width: 180px;
          overflow: hidden;
          animation: dropdownFade 0.2s ease;
        }

        .calendar-dropdown-menu a, .calendar-dropdown-menu button {
          display: block;
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          color: var(--color-text-dark);
          padding: 0.75rem 1rem;
          font-family: var(--font-sans);
          font-size: 0.9rem;
          text-decoration: none;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .calendar-dropdown-menu a:hover, .calendar-dropdown-menu button:hover {
          background-color: var(--color-primary-light);
          color: var(--color-primary);
        }

        @keyframes dropdownFade {
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
