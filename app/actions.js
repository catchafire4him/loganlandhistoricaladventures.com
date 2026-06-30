"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { sql } from "../lib/db";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";

// Helper to check if admin is authenticated
export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated";
}

// Helper to upload a file (either to Vercel Blob or local public folder fallback)
async function uploadFileHelper(file) {
  if (!file || file.size === 0) return null;

  // 1. If Vercel Blob token is configured, use Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      console.log(`Uploading ${file.name} to Vercel Blob...`);
      const blob = await put(file.name, file, { access: "public" });
      return blob.url;
    } catch (err) {
      console.error("Vercel Blob upload failed, falling back to local:", err);
    }
  }

  // 2. Local Fallback (for offline/local dev)
  try {
    console.log(`Vercel Blob not configured. Saving ${file.name} to local public folder...`);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/wp-content/uploads/2026/06/
    const uploadsDir = path.join(process.cwd(), "public/wp-content/uploads/2026/06");
    
    // Ensure dir exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, file.name);
    fs.writeFileSync(filePath, buffer);

    return `/wp-content/uploads/2026/06/${file.name}`;
  } catch (err) {
    console.error("Local fallback upload failed:", err);
    throw new Error("Failed to upload file: " + err.message);
  }
}

// 1. Admin Login Action
export async function adminLogin(password) {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 2, // 2 hours session
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Invalid admin password" };
}

// 2. Admin Logout Action
export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}

// 3. Contact Form Submission Action
export async function submitContactForm(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  if (!name || !email || !message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    console.log(`NEW CONTACT FORM SUBMISSION:\nFrom: ${name} (${email})\nSubject: ${subject}\nMessage: ${message}`);
    return { success: true, message: "Thank you! Your message has been sent successfully. We will get back to you soon." };
  } catch (err) {
    console.error("Error submitting contact form:", err);
    return { success: false, error: "An error occurred while sending your message. Please try again." };
  }
}

// 4. Events CRUD Operations
export async function createEvent(formData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title");
  const date = formData.get("date");
  const time = formData.get("time");
  const location = formData.get("location");
  const description = formData.get("description");
  const link = formData.get("link");
  
  const imageFile = formData.get("imageFile");
  let image_url = formData.get("image_url") || "";

  // Upload file if selected
  const uploadedUrl = await uploadFileHelper(imageFile);
  if (uploadedUrl) {
    image_url = uploadedUrl;
  }

  await sql`
    INSERT INTO events (title, date, time, location, description, link, image_url)
    VALUES (${title}, ${date}, ${time}, ${location}, ${description}, ${link}, ${image_url})
  `;
  
  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}

export async function updateEvent(id, formData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title");
  const date = formData.get("date");
  const time = formData.get("time");
  const location = formData.get("location");
  const description = formData.get("description");
  const link = formData.get("link");
  
  const imageFile = formData.get("imageFile");
  let image_url = formData.get("image_url") || "";

  const uploadedUrl = await uploadFileHelper(imageFile);
  if (uploadedUrl) {
    image_url = uploadedUrl;
  }

  await sql`
    UPDATE events
    SET title = ${title}, date = ${date}, time = ${time}, location = ${location}, description = ${description}, link = ${link}, image_url = ${image_url}
    WHERE id = ${id}
  `;

  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}

export async function deleteEvent(id) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  await sql`DELETE FROM events WHERE id = ${id}`;
  
  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}

// 5. Presentations CRUD Operations
export async function createPresentation(formData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const excerpt = formData.get("excerpt");
  
  const imageFile = formData.get("imageFile");
  let image_url = formData.get("image_url") || "";

  const uploadedUrl = await uploadFileHelper(imageFile);
  if (uploadedUrl) {
    // If Vercel Blob returns a URL, use it. If local fallback, it returns '/wp-content/...', but wait!
    // The database column holds the filename or local path. We can save either!
    // Since our page does: `const imgSrc = p.image_url ? ... : ...;`
    // Let's see: if the image_url starts with http or /, we can use it directly in the frontend, or if it is just a filename we append /wp-content/...
    // Let's write a frontend helper in presentations/page.js and page.js to support both direct URL and local filename! That is extremely safe!
    image_url = uploadedUrl;
  }

  await sql`
    INSERT INTO presentations (title, image_url, description, excerpt)
    VALUES (${title}, ${image_url}, ${description}, ${excerpt})
  `;

  revalidatePath("/presentations");
  return { success: true };
}

export async function updatePresentation(id, formData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const excerpt = formData.get("excerpt");
  
  const imageFile = formData.get("imageFile");
  let image_url = formData.get("image_url") || "";

  const uploadedUrl = await uploadFileHelper(imageFile);
  if (uploadedUrl) {
    image_url = uploadedUrl;
  }

  await sql`
    UPDATE presentations
    SET title = ${title}, image_url = ${image_url}, description = ${description}, excerpt = ${excerpt}
    WHERE id = ${id}
  `;

  revalidatePath("/presentations");
  return { success: true };
}

export async function deletePresentation(id) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  await sql`DELETE FROM presentations WHERE id = ${id}`;

  revalidatePath("/presentations");
  return { success: true };
}

// 6. FAQs CRUD Operations
export async function createFaq(faqData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const { category, question, answer, display_order } = faqData;
  await sql`
    INSERT INTO faqs (category, question, answer, display_order)
    VALUES (${category}, ${question}, ${answer}, ${display_order})
  `;

  revalidatePath("/faq");
  return { success: true };
}

export async function updateFaq(id, faqData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const { category, question, answer, display_order } = faqData;
  await sql`
    UPDATE faqs
    SET category = ${category}, question = ${question}, answer = ${answer}, display_order = ${display_order}
    WHERE id = ${id}
  `;

  revalidatePath("/faq");
  return { success: true };
}

export async function deleteFaq(id) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  await sql`DELETE FROM faqs WHERE id = ${id}`;

  revalidatePath("/faq");
  return { success: true };
}

// 7. Videos CRUD Operations
export async function createVideo(formData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title");
  const display_order = parseInt(formData.get("display_order")) || 0;
  
  const videoFile = formData.get("videoFile");
  let video_url = formData.get("video_url") || "";

  // Upload file if selected
  const uploadedUrl = await uploadFileHelper(videoFile);
  if (uploadedUrl) {
    video_url = uploadedUrl;
  }

  await sql`
    INSERT INTO videos (title, video_url, display_order)
    VALUES (${title}, ${video_url}, ${display_order})
  `;

  revalidatePath("/dancing");
  return { success: true };
}

export async function updateVideo(id, formData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title");
  const display_order = parseInt(formData.get("display_order")) || 0;
  
  const videoFile = formData.get("videoFile");
  let video_url = formData.get("video_url") || "";

  const uploadedUrl = await uploadFileHelper(videoFile);
  if (uploadedUrl) {
    video_url = uploadedUrl;
  }

  await sql`
    UPDATE videos
    SET title = ${title}, video_url = ${video_url}, display_order = ${display_order}
    WHERE id = ${id}
  `;

  revalidatePath("/dancing");
  return { success: true };
}

export async function deleteVideo(id) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  await sql`DELETE FROM videos WHERE id = ${id}`;

  revalidatePath("/dancing");
  return { success: true };
}
