"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { sql } from "../lib/db";

// Helper to check if admin is authenticated
export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session && session.value === "authenticated";
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

  // Validate inputs
  if (!name || !email || !message) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    // In a real application, you might use a mail service like Nodemailer or Resend here.
    // For now, we'll log it and return success.
    console.log(`NEW CONTACT FORM SUBMISSION:\nFrom: ${name} (${email})\nSubject: ${subject}\nMessage: ${message}`);
    
    return { success: true, message: "Thank you! Your message has been sent successfully. We will get back to you soon." };
  } catch (err) {
    console.error("Error submitting contact form:", err);
    return { success: false, error: "An error occurred while sending your message. Please try again." };
  }
}

// 4. Events CRUD Operations
export async function createEvent(eventData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const { title, date, time, location, description, link, image_url } = eventData;
  await sql`
    INSERT INTO events (title, date, time, location, description, link, image_url)
    VALUES (${title}, ${date}, ${time}, ${location}, ${description}, ${link}, ${image_url})
  `;
  
  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}

export async function updateEvent(id, eventData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const { title, date, time, location, description, link, image_url } = eventData;
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
export async function createPresentation(presData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const { title, image_url, description, excerpt } = presData;
  await sql`
    INSERT INTO presentations (title, image_url, description, excerpt)
    VALUES (${title}, ${image_url}, ${description}, ${excerpt})
  `;

  revalidatePath("/presentations");
  return { success: true };
}

export async function updatePresentation(id, presData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const { title, image_url, description, excerpt } = presData;
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
export async function createVideo(videoData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const { title, video_url, display_order } = videoData;
  await sql`
    INSERT INTO videos (title, video_url, display_order)
    VALUES (${title}, ${video_url}, ${display_order})
  `;

  revalidatePath("/dancing");
  return { success: true };
}

export async function updateVideo(id, videoData) {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }

  const { title, video_url, display_order } = videoData;
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
