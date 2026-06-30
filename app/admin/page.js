import { sql } from "../../lib/db";
import { isAdminAuthenticated } from "../actions";
import AdminLogin from "../../components/AdminLogin";
import AdminDashboard from "../../components/AdminDashboard";

export const revalidate = 0;

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <AdminLogin />;
  }

  // Fetch all database records to supply to the AdminDashboard
  let eventsList = [];
  let presentationsList = [];
  let faqsList = [];
  let videosList = [];
  let postsList = [];

  try {
    eventsList = await sql`SELECT * FROM events ORDER BY date ASC, id DESC`;
    presentationsList = await sql`SELECT * FROM presentations ORDER BY id ASC`;
    faqsList = await sql`SELECT * FROM faqs ORDER BY category, display_order ASC, id ASC`;
    videosList = await sql`SELECT * FROM videos ORDER BY display_order ASC, id ASC`;
    postsList = await sql`SELECT * FROM posts ORDER BY created_at DESC, id DESC`;
  } catch (err) {
    console.error("Database query error in admin page:", err);
  }

  return (
    <AdminDashboard 
      events={eventsList} 
      presentations={presentationsList} 
      faqs={faqsList} 
      videos={videosList}
      posts={postsList}
    />
  );
}
