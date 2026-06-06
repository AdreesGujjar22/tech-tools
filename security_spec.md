# Security Specification - Blog System

This document outlines the security invariants, the "Dirty Dozen" rogue payloads designed to probe for authorization loopholes, and the validation gates designed to resist them.

## 1. Data Invariants

- **Role Separation**: Blogs, categories, and tags can only be created, modified, or deleted by authenticated administrator accounts verified under the `/admins/{userId}` collection.
- **Strict Typing & Schema Validation**:
  - `blog`: Must contain `title`, `slug`, `content`, `status`, `createdAt`, and `updatedAt`.
  - `status` must strictly be either `"draft"` or `"published"`.
  - `createdAt` is immutable and must equal `request.time` on creation.
  - `updatedAt` must equal `request.time` on creation and modification.
- **Slug Integrity**: Slugs must be between 3 and 100 characters, lowercase, and follow URL-safe naming structures `^[a-z0-9-]+$`.
- **Public Sandbox**: Authentication is NOT required to view published posts, categories, or tags. Authentication IS required for viewing draft posts.
- **Denial of Wallet Defense**: Any string size or array length must be strictly bounded to prevent resource exhaustion attacks.

---

## 2. The "Dirty Dozen" Malicious Payloads

The rules are engineered to prevent the following 12 rogue actions:

1. **Anonymous Blog Write**: An unauthenticated user tries to create a blog post.
2. **Standard User Privilege Escalation**: A standard signed-in user without administrator clearance tries to write a post.
3. **Draft Reader Spy**: An unauthenticated or standard verified user attempts to read draft blog posts.
4. **Id Poisoning Injection**: An attacker attempts to create a blog post with a huge 2MB string as the document ID.
5. **Timestamp Forge on Create**: An admin tries to forge their `createdAt` field using a past date instead of `request.time`.
6. **Timestamp Forge on Update**: An admin attempts to update `updatedAt` with a future date rather than `request.time`.
7. **Created-At Modification (Immortal Field Bypass)**: An admin attempts to change the `createdAt` timestamp of an existing blog document.
8. **Invalid Status Injection**: An admin tries to write a blog with `status: "archived"`.
9. **Missing Mandatory Fields**: An admin attempts to save a blog without the `content` or `slug` fields.
10. **Shadow Key Exploit (Value Poisoning)**: An attacker attempts to inject a hidden state field (e.g., `isVerified: true` or `featured: true`) that isn't in the schema.
11. **Malicious Empty Values**: An administrator saves a post with an empty string for the slug, violating the format constraint.
12. **Recursive Query Scraping**: A client attempts to fetch listing data without filtering by public publish status, trying to bypass drafted states.

---

## 3. Security Rules Plan

We will secure the system by defining a robust layout in `firestore.rules`:
- A default `allow read, write: if false;` catch-all.
- An `isAdmin()` helper that verifies administrative status by checking `exists(/databases/$(database)/documents/admins/$(request.auth.uid))`.
- Detailed `isValidBlog()`, `isValidCategory()`, and `isValidTag()` helpers validating types, structures, size boundaries, and exact allowed keys.
- Action-based update routes with `affectedKeys().hasOnly(...)` gates.
