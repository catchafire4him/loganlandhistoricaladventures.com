import "./globals.css";
import Header from "../components/Header";
import Link from "next/link";
import { Playfair_Display, Outfit } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "Logan Land Historical Adventures",
  description: "Experience history brought to life through presentations and family folk dancing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        
        <footer className="site-footer">
          <div className="container footer-container">
            <div className="footer-brand">
              <h3>Logan Land</h3>
              <p>
                Experience history brought to life. We deliver engaging, educational, and inspiring living history presentations and family folk dancing events.
              </p>
            </div>
            
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/presentations">Presentations</Link></li>
                <li><Link href="/dancing">Folk Dancing</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h4>Engage</h4>
              <ul>
                <li><Link href="/events">Upcoming Events</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
                <li><Link href="/admin">Admin Login</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="container footer-bottom">
            <p>&copy; {new Date().getFullYear()} Logan Land Historical Adventures. All Rights Reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
