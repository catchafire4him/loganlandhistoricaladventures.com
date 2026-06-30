"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { sql } from "../lib/db";
import { put } from "@vercel/blob";
import sharp from "sharp";
import crypto from "crypto";
import fs from "fs";
import path from "path";

// Helper to generate the cryptographically signed cookie value
function getSignedSessionValue() {
  const secret = process.env.ADMIN_PASSWORD || "fallback-secret-hash-salt-2026";
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update("authenticated-admin-session-signature");
  return hmac.digest("hex");
}

// Helper to check if admin is authenticated
export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session) return false;
  
  // Verify cookie signature matches the HMAC hash
  const expectedValue = getSignedSessionValue();
  return session.value === expectedValue;
}

// Helper to slugify titles
function generateSlug(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-")         // replace spaces with -
    .replace(/-+/g, "-")          // replace multiple - with single -
    .replace(/(^-|-$)/g, "");     // remove leading/trailing -
}

// Helper to upload a file (either to Vercel Blob or local public folder fallback)
// Now includes sharp image optimization (WebP format compression)
async function uploadFileHelper(file) {
  if (!file || file.size === 0) return null;

  let fileName = file.name;
  let fileBuffer = Buffer.from(await file.arrayBuffer());
  let mimeType = file.type;

  // Optimize image if it is a common web format (excluding gifs/svgs)
  if (file.type.startsWith("image/") && file.type !== "image/gif" && !file.name.toLowerCase().endsWith(".svg")) {
    try {
      console.log(`Optimizing image ${file.name} using sharp...`);
      fileBuffer = await sharp(fileBuffer)
        .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true }) // reasonable size limit
        .webp({ quality: 80 }) // convert to WebP, 80% quality
        .toBuffer();
      
      // Update extension to .webp
      const baseName = path.basename(file.name, path.extname(file.name));
      fileName = `${baseName}.webp`;
      mimeType = "image/webp";
      console.log(`✓ Image optimized successfully to ${fileName} (${fileBuffer.length} bytes)`);
    } catch (err) {
      console.error("Image optimization failed, proceeding with original:", err);
      // Re-read file buffer in case arrayBuffer stream was consumed
      fileBuffer = Buffer.from(await file.arrayBuffer());
    }
  }

  // 1. If Vercel Blob token is configured, upload to Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      console.log(`Uploading ${fileName} to Vercel Blob...`);
      const blob = await put(fileName, fileBuffer, { 
        access: "public",
        contentType: mimeType
      });
      return blob.url;
    } catch (err) {
      console.error("Vercel Blob upload failed, falling back to local storage:", err);
    }
  }

  // 2. Local Fallback (for offline/local dev)
  try {
    console.log(`Saving ${fileName} to local public folder...`);
    const uploadsDir = path.join(process.cwd(), "public/wp-content/uploads/2026/06");
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, fileBuffer);

    return `/wp-content/uploads/2026/06/${fileName}`;
  } catch (err) {
    console.error("Local fallback upload failed:", err);
    throw new Error("Failed to upload file: " + err.message);
  }
}

// 1. Admin Login Action
export async function adminLogin(password) {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    const sessionVal = getSignedSessionValue();
    cookieStore.set("admin_session", sessionVal, {
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

// 3. Contact Form Submission Action (Option 1: Saves to Neon Database)
export async function submitContactForm(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject") || "";
  const message = formData.get("message");

  if (!name || !email || !message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    await sql`
      INSERT INTO contact_submissions (name, email, subject, message)
      VALUES (${name}, ${email}, ${subject}, ${message})
    `;
    
    revalidatePath("/admin");
    return { success: true, message: "Thank you! Your message has been sent successfully. We will get back to you soon." };
  } catch (err) {
    console.error("Error submitting contact form:", err);
    return { success: false, error: "An error occurred while sending your message. Please try again." };
  }
}

// 3b. Admin Contact Message Management Actions
export async function markMessageRead(id, read) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  await sql`
    UPDATE contact_submissions
    SET read = ${read}
    WHERE id = ${id}
  `;

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteMessage(id) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  await sql`DELETE FROM contact_submissions WHERE id = ${id}`;

  revalidatePath("/admin");
  return { success: true };
}

// 4. Events CRUD Operations
export async function createEvent(formData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title");
  const location = formData.get("location");
  const description = formData.get("description");
  const link = formData.get("link");
  
  // Format Date Picker value from YYYY-MM-DD to "Month DD, YYYY"
  const rawDate = formData.get("eventDate");
  let date = formData.get("date") || "";
  if (rawDate) {
    const d = new Date(rawDate + "T00:00:00Z");
    date = d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    });
  }

  // Format Time Pickers value from HH:MM to "H:MM AM/PM" time range
  const startTime = formData.get("startTime");
  const endTime = formData.get("endTime");
  let time = formData.get("time") || "";
  if (startTime && endTime) {
    const formatTime = (tStr) => {
      const [h, m] = tStr.split(":");
      const hr = parseInt(h);
      const ampm = hr >= 12 ? "PM" : "AM";
      const formattedHr = hr % 12 || 12;
      return `${formattedHr}:${m} ${ampm}`;
    };
    time = `${formatTime(startTime)} - ${formatTime(endTime)}`;
  }

  const imageFile = formData.get("imageFile");
  let image_url = formData.get("image_url") || "";

  // Upload file if selected
  const uploadedUrl = await uploadFileHelper(imageFile);
  if (uploadedUrl) {
    image_url = uploadedUrl;
  }

  let event_date = rawDate || null;
  if (!event_date && date) {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      event_date = d.toISOString().split("T")[0];
    }
  }

  await sql`
    INSERT INTO events (title, date, time, location, description, link, image_url, event_date)
    VALUES (${title}, ${date}, ${time}, ${location}, ${description}, ${link}, ${image_url}, ${event_date})
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
  const location = formData.get("location");
  const description = formData.get("description");
  const link = formData.get("link");

  // Format Date Picker
  const rawDate = formData.get("eventDate");
  let date = formData.get("date") || "";
  if (rawDate) {
    const d = new Date(rawDate + "T00:00:00Z");
    date = d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    });
  }

  // Format Time Pickers
  const startTime = formData.get("startTime");
  const endTime = formData.get("endTime");
  let time = formData.get("time") || "";
  if (startTime && endTime) {
    const formatTime = (tStr) => {
      const [h, m] = tStr.split(":");
      const hr = parseInt(h);
      const ampm = hr >= 12 ? "PM" : "AM";
      const formattedHr = hr % 12 || 12;
      return `${formattedHr}:${m} ${ampm}`;
    };
    time = `${formatTime(startTime)} - ${formatTime(endTime)}`;
  }

  // Fetch current event to preserve image_url if no new file is uploaded
  const currentEvent = await sql`SELECT image_url FROM events WHERE id = ${id}`;
  let image_url = currentEvent.length > 0 ? currentEvent[0].image_url : "";

  const imageFile = formData.get("imageFile");
  const uploadedUrl = await uploadFileHelper(imageFile);
  if (uploadedUrl) {
    image_url = uploadedUrl;
  }

  let event_date = rawDate || null;
  if (!event_date && date) {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      event_date = d.toISOString().split("T")[0];
    }
  }

  await sql`
    UPDATE events
    SET title = ${title}, date = ${date}, time = ${time}, location = ${location}, description = ${description}, link = ${link}, image_url = ${image_url}, event_date = ${event_date}
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

// 5. Presentations CRUD Operations (with Visibility toggle)
export async function createPresentation(formData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const excerpt = formData.get("excerpt");
  const visible = formData.get("visible") === "true";
  
  const imageFile = formData.get("imageFile");
  let image_url = "";

  const uploadedUrl = await uploadFileHelper(imageFile);
  if (uploadedUrl) {
    image_url = uploadedUrl;
  }

  await sql`
    INSERT INTO presentations (title, image_url, description, excerpt, visible)
    VALUES (${title}, ${image_url}, ${description}, ${excerpt}, ${visible})
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
  const visible = formData.get("visible") === "true";
  
  // Fetch current presentation to preserve image_url if no new file is uploaded
  const currentPres = await sql`SELECT image_url FROM presentations WHERE id = ${id}`;
  let image_url = currentPres.length > 0 ? currentPres[0].image_url : "";

  const imageFile = formData.get("imageFile");
  const uploadedUrl = await uploadFileHelper(imageFile);
  if (uploadedUrl) {
    image_url = uploadedUrl;
  }

  await sql`
    UPDATE presentations
    SET title = ${title}, image_url = ${image_url}, description = ${description}, excerpt = ${excerpt}, visible = ${visible}
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
  
  // Fetch current video to preserve video_url if no new file is uploaded
  const currentVideo = await sql`SELECT video_url FROM videos WHERE id = ${id}`;
  let video_url = currentVideo.length > 0 ? currentVideo[0].video_url : "";

  const videoFile = formData.get("videoFile");
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

// 8. Blog Posts CRUD Operations
export async function createPost(formData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title");
  let slug = formData.get("slug") || generateSlug(title);
  if (!slug) {
    slug = "post-" + Date.now();
  }
  const content = formData.get("content");
  const excerpt = formData.get("excerpt") || "";
  const status = formData.get("status") || "draft";
  
  const imageFile = formData.get("imageFile");
  let image_url = "";

  const uploadedUrl = await uploadFileHelper(imageFile);
  if (uploadedUrl) {
    image_url = uploadedUrl;
  }

  const published_at = status === "published" ? new Date() : null;

  // Ensure slug uniqueness
  let finalSlug = slug;
  let slugExists = true;
  let counter = 0;
  while (slugExists) {
    const res = await sql`SELECT id FROM posts WHERE slug = ${finalSlug}`;
    if (res.length === 0) {
      slugExists = false;
    } else {
      counter++;
      finalSlug = `${slug}-${counter}`;
    }
  }

  await sql`
    INSERT INTO posts (title, slug, content, excerpt, image_url, status, published_at)
    VALUES (${title}, ${finalSlug}, ${content}, ${excerpt}, ${image_url}, ${status}, ${published_at})
  `;

  revalidatePath("/blog");
  revalidatePath("/");
  return { success: true };
}

export async function updatePost(id, formData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title");
  let slug = formData.get("slug") || generateSlug(title);
  if (!slug) {
    slug = "post-" + id;
  }
  const content = formData.get("content");
  const excerpt = formData.get("excerpt") || "";
  const status = formData.get("status") || "draft";

  // Fetch current post
  const currentPost = await sql`SELECT image_url, status, published_at FROM posts WHERE id = ${id}`;
  if (currentPost.length === 0) {
    throw new Error("Blog post not found");
  }

  let image_url = currentPost[0].image_url;
  const imageFile = formData.get("imageFile");
  const uploadedUrl = await uploadFileHelper(imageFile);
  if (uploadedUrl) {
    image_url = uploadedUrl;
  }

  let published_at = currentPost[0].published_at;
  if (status === "published" && currentPost[0].status !== "published") {
    published_at = new Date();
  } else if (status === "draft") {
    published_at = null;
  }

  // Ensure slug uniqueness
  let finalSlug = slug;
  let slugExists = true;
  let counter = 0;
  while (slugExists) {
    const res = await sql`SELECT id FROM posts WHERE slug = ${finalSlug} AND id != ${id}`;
    if (res.length === 0) {
      slugExists = false;
    } else {
      counter++;
      finalSlug = `${slug}-${counter}`;
    }
  }

  await sql`
    UPDATE posts
    SET title = ${title}, slug = ${finalSlug}, content = ${content}, excerpt = ${excerpt}, image_url = ${image_url}, status = ${status}, published_at = ${published_at}
    WHERE id = ${id}
  `;

  revalidatePath("/blog");
  revalidatePath(`/blog/${finalSlug}`);
  revalidatePath("/");
  return { success: true };
}

export async function deletePost(id) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const post = await sql`SELECT slug FROM posts WHERE id = ${id}`;
  await sql`DELETE FROM posts WHERE id = ${id}`;

  revalidatePath("/blog");
  if (post.length > 0) {
    revalidatePath(`/blog/${post[0].slug}`);
  }
  revalidatePath("/");
  return { success: true };
}
