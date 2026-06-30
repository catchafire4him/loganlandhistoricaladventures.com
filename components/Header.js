"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "History Presentations", path: "/presentations" },
    { name: "Family Folk Dancing", path: "/dancing" },
    { name: "Blog", path: "/blog" },
    { name: "FAQ", path: "/faq" },
    { name: "Upcoming Events", path: "/events" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <header className="site-header">
      <div className="container header-container">
        <Link href="/" className="logo-area">
          <img 
            src="/wp-content/uploads/2026/03/cropped-Tourism-Company-Logo-1.png" 
            alt="Logan Land Historical Adventures Logo" 
            className="logo-img"
            onError={(e) => {
              // Fallback if logo is moved/missing
              e.target.style.display = 'none';
            }}
          />
          <span>Logan Land</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <ul className="nav-menu">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link 
                    href={item.path} 
                    className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile menu toggle */}
        <button 
          className="mobile-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {isOpen ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>

        {/* Mobile menu overlay */}
        {isOpen && (
          <div className="mobile-menu-overlay" onClick={() => setIsOpen(false)}>
            <nav className="mobile-nav" onClick={(e) => e.stopPropagation()}>
              <ul>
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link 
                        href={item.path} 
                        className={`mobile-link ${isActive ? "mobile-link-active" : ""}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
