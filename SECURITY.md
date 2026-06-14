# Security Policy - Nazaraana Wellness Platform

This document describes the security protocols, policies, and architecture implemented in Nazaraana.

---

## 1. Password Protection & Cryptographic Hashing
- **Zero Plain-Text Storage:** User passwords are never saved in plain text.
- **Bcrypt Hashing:** All passwords are crytographically hashed in the client environment using `bcryptjs` with a cost factor (salt rounds) of 10 prior to writing to browser storage.
- **Authentication Verifications:** Login validations verify input passwords against stored bcrypt hashes.

---

## 2. Client-Side Session Isolation & Storage
- **Zustand Persistence:** Sessions and profile attributes are serialized and stored securely in the browser's `localStorage` namespace under the key `nazaraana-store`.
- **Session Lifecycles:** Session validation persists across browser page updates. Sessions are destroyed immediately when a user clicks the "Sign Out" button.
- **Private Timeline Mode:** Journal entry logs, chat message records, and weekly reflections are sandboxed inside local state scopes and index-filtered by `userId`. Users can switch on the "Anonymous Journal Logs" flag in settings to prevent syncing logs with public channels.

---

## 3. Inputs Sanitization & Validation
- **Structured Schemas:** Forms (Registration, Login, Onboarding wizard, Settings fields) validate input attributes against strict validation rules:
  - Name: Must be non-empty text.
  - Email: Must follow standardized email formats.
  - Passwords: Minimum length of 8 characters.
  - Confessions: Minimum length of 10 characters to prevent spam.

---

## 4. API Security & Privacy Protocols
- **Claude Moderation Safety:** The Anonymous Confession Wall filters and moderates submissions before rendering. If high-severity crisis distress is detected, Claude flags the post, prevents publication, and triggers the Global Helpline Support modal for the user.
- **Helpline Protocols:** System contains dedicated crisis triggers for suicide, self-harm, or extreme distress keywords. If flagged, national support resources (iCall and Vandrevala Foundation) are immediately overlayed in a prominent modal.
- **Zero Exposed Stack Traces:** Server API endpoints catch runtime failures and return sanitised status messages (`500 Internal Server Error` or generic summaries) to ensure system structures or stack traces are never leaked to client responses.
