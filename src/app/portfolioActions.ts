"use server";

import { Client } from "@notionhq/client";
import nodemailer from "nodemailer";

// Initialize Notion Client with a stable version
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: "2022-06-28",
});

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  linkedin: string;
  message: string;
}

/**
 * Server action to submit contact details to Notion database and send an email notification.
 */
export async function submitContactForm(data: ContactFormData) {
  const { name, email, company, linkedin, message } = data;

  if (!name || !email || !message) {
    return {
      success: false,
      message: "Please fill in Name, Email, and Message fields before submitting.",
    };
  }

  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    console.error("[DEBUG] NOTION_DATABASE_ID is missing from environment variables.");
    return {
      success: false,
      message: "Invalid database ID. Please configure NOTION_DATABASE_ID in your environment.",
    };
  }

  try {
    // 1. Create page inside Notion using the confirmed schema mapping
    const pageResponse = await createNotionPage(databaseId, data);
    
    // 2. Send email notification to mayankray224@gmail.com
    await sendEmailNotification(data);

    return {
      success: true,
      message: "🦉 Your owl has reached Mayank.",
    };
  } catch (notionError: any) {
    console.error("[DEBUG] Notion integration failed:", notionError.message || notionError);
    return {
      success: false,
      message: notionError.message || "An unexpected error occurred during submission.",
    };
  }
}

/**
 * Finds a matching property key in the Notion schema case-insensitively and ignoring spacing/special characters.
 */
function findPropertyKey(properties: Record<string, any>, possibleNames: string[]): string | undefined {
  const keys = Object.keys(properties);
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalizedPossibles = possibleNames.map(normalize);

  // 1. Exact match first
  for (const name of possibleNames) {
    if (properties[name]) {
      return name;
    }
  }

  // 2. Normalized match
  for (const key of keys) {
    if (normalizedPossibles.includes(normalize(key))) {
      return key;
    }
  }

  return undefined;
}

/**
 * Maps standard API error messages into user-friendly diagnostic notices.
 */
function parseNotionError(error: any): string {
  if (!error) return "An unknown database error occurred.";

  const message = error.message || "";
  const code = error.code || "";
  const status = error.status || 0;

  console.error(`[DEBUG] Parsing Notion API error (status=${status}, code=${code}): ${message}`);

  if (code === "unauthorized" || status === 401 || message.toLowerCase().includes("api key") || message.toLowerCase().includes("token")) {
    return "Invalid API key. Please check your NOTION_API_KEY.";
  }

  if (code === "object_not_found" || status === 404) {
    return "Database not found or missing Notion permissions. Ensure your Notion integration has access to the 'Owlery Inbox' database.";
  }

  if (code === "restricted_resource" || status === 403) {
    return "Missing Notion permissions. The integration is blocked from reading or writing to this database.";
  }

  if (code === "validation_error" || message.toLowerCase().includes("validation") || message.toLowerCase().includes("uuid")) {
    return "Invalid database ID. Please verify your NOTION_DATABASE_ID.";
  }

  return `Notion CRM Error: ${message || "Connection failed."}`;
}

/**
 * Connects to Notion, checks schema, maps fields, and inserts the contact form submission.
 */
async function createNotionPage(databaseId: string, data: ContactFormData) {
  let db;
  
  // 1. Retrieve Database Schema
  try {
    db = await notion.databases.retrieve({ database_id: databaseId });
  } catch (error: any) {
    const userMsg = parseNotionError(error);
    throw new Error(userMsg);
  }

  const properties = db.properties || {};

  // 2. Find mapped property keys (Name, Email, Company, Linkedin, Message, Status, Date)
  const nameKey = findPropertyKey(properties, ["Name", "Full Name", "Sender Name"]);
  const emailKey = findPropertyKey(properties, ["Email", "Email Address", "Sender Address", "Mail"]);
  const companyKey = findPropertyKey(properties, ["Company", "Organization", "Firm", "Company Name"]);
  const linkedinKey = findPropertyKey(properties, ["Linkedin", "LinkedIn", "Linked In", "LinkedIn Profile"]);
  const messageKey = findPropertyKey(properties, ["Message", "Scroll Contents", "Message Contents", "Description", "Inquiry"]);
  const statusKey = findPropertyKey(properties, ["Status", "State"]);
  const dateKey = findPropertyKey(properties, ["Date", "Created Time", "Created Date", "Timestamp"]);

  // 3. Validate required properties exist in schema before submission
  if (!nameKey) {
    throw new Error("Missing 'Name' (title) property in Notion database schema.");
  }
  if (!emailKey) {
    throw new Error("Missing 'Email' (email) property in Notion database schema.");
  }
  if (!messageKey) {
    throw new Error("Missing 'Message' (rich_text) property in Notion database schema.");
  }

  // 4. Construct payload according to confirmed property types
  const pageProperties: Record<string, any> = {};

  // A. Name (title type)
  pageProperties[nameKey] = {
    title: [{ text: { content: data.name } }]
  };

  // B. Email (email type)
  pageProperties[emailKey] = {
    email: data.email
  };

  // C. Company (rich_text type, optional)
  if (companyKey) {
    pageProperties[companyKey] = {
      rich_text: [{ text: { content: data.company || "" } }]
    };
  }

  // D. Linkedin (url type, optional)
  if (linkedinKey) {
    const cleanLinkedin = data.linkedin
      ? (data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`)
      : "";
    pageProperties[linkedinKey] = {
      url: cleanLinkedin || null
    };
  }

  // E. Message (rich_text type)
  pageProperties[messageKey] = {
    rich_text: [{ text: { content: data.message } }]
  };

  // F. Status (select type, optional)
  if (statusKey) {
    pageProperties[statusKey] = {
      select: { name: "New" }
    };
  }

  // G. Date (date type, optional - mapped to current timestamp)
  if (dateKey) {
    pageProperties[dateKey] = {
      date: {
        start: new Date().toISOString()
      }
    };
  }

  // 5. Log Database ID and Payload
  console.log(`[DEBUG] Database ID: ${databaseId}`);
  console.log("[DEBUG] Payload sent to Notion:", JSON.stringify(pageProperties, null, 2));

  // 6. Submit to Notion
  let response;
  try {
    response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: pageProperties,
    });
  } catch (error: any) {
    console.error("[DEBUG] Page creation failed in Notion:", error);
    const userMsg = parseNotionError(error);
    throw new Error(userMsg);
  }

  // 7. Log Created Page ID and URL
  console.log(`[DEBUG] Created Page ID: ${response.id}`);
  console.log(`[DEBUG] Created Page URL: ${response.url}`);

  // 8. Verify the row exists in Notion (retrieve page immediately)
  try {
    console.log(`[DEBUG] Verifying created page ${response.id} exists in Notion...`);
    const verifiedPage = await notion.pages.retrieve({ page_id: response.id });
    if (verifiedPage) {
      console.log(`[DEBUG] Verified row exists in Notion: true (Object type: ${verifiedPage.object})`);
    } else {
      console.warn(`[DEBUG] Verification failed: Could not retrieve page ${response.id}`);
    }
  } catch (verifyError) {
    console.warn("[DEBUG] Gracefully handled post-creation verification failure:", verifyError);
  }

  return response;
}

/**
 * Sends a notification email to mayankray224@gmail.com about the new submission.
 */
async function sendEmailNotification(data: ContactFormData) {
  const toEmail = "mayankray224@gmail.com";
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const textContent = `
🦉 New Owlery Scroll Received!

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || "Not provided"}
Linkedin: ${data.linkedin || "Not provided"}

Message:
${data.message}
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #333333;">
      <h2 style="color: #D4AF37; font-family: Georgia, serif; border-bottom: 2px solid #D4AF37; padding-bottom: 12px; margin-top: 0;">🦉 New Owlery Scroll Received</h2>
      <p style="font-size: 14px; line-height: 1.6; margin: 6px 0;"><strong>Name:</strong> ${data.name}</p>
      <p style="font-size: 14px; line-height: 1.6; margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #8b5cf6; text-decoration: none;">${data.email}</a></p>
      <p style="font-size: 14px; line-height: 1.6; margin: 6px 0;"><strong>Company:</strong> ${data.company || "<em>Not provided</em>"}</p>
      <p style="font-size: 14px; line-height: 1.6; margin: 6px 0;"><strong>Linkedin:</strong> ${
        data.linkedin
          ? `<a href="${data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`}" style="color: #8b5cf6; text-decoration: none;">${data.linkedin}</a>`
          : "<em>Not provided</em>"
      }</p>
      <div style="background-color: #f7f7f8; padding: 18px; border-radius: 8px; border-left: 4px solid #D4AF37; margin-top: 20px;">
        <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 13px; text-transform: uppercase; color: #666; letter-spacing: 0.05em;">Scroll Contents:</p>
        <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
      </div>
    </div>
  `;

  if (!host || !user || !pass) {
    console.log("--------------------------------------------------------------------------------");
    console.log("[SMTP SERVER NOT CONFIGURED] - Logging Owlery Form Submission detail to stdout:");
    console.log(`Email Target: ${toEmail}`);
    console.log(textContent);
    console.log("--------------------------------------------------------------------------------");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Owlery Dispatch" <${user}>`,
    to: toEmail,
    subject: `🦉 Owlery Scroll from ${data.name}`,
    text: textContent,
    html: htmlContent,
  });

  console.log(`Successfully sent contact notification email to ${toEmail}`);
}
