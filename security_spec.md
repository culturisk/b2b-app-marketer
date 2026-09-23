# Security Specification: Form Submissions & Organized Details

## 1. Data Invariants
1. **Submission Integrity**: Every submission must have a valid formType ('waitlist', 'booking', 'audit', 'sequence', 'payment', 'roi_scenario', 'partner_connect') and a non-empty unique ID.
2. **Visitor & User Accountability**: Submissions must record a visitorId and (if authenticated) match the user's verified UID.
3. **Data Protection & Non-Tampering**: Submissions cannot be updated or overwritten by arbitrary third parties. Once created, a submission is immutable from client writes unless modified by an authorized admin.
4. **Admin Authority**: Only authenticated administrators (specifically `culturisk@gmail.com`) or the authoring user can inspect submission details.

## 2. The "Dirty Dozen" Threat Payloads
1. **Payload 1 (Ghost Field / Shadow Injection)**: Attempt to inject `isAdmin: true` or `verified: true` into a submission.
2. **Payload 2 (Identity Spoofing)**: Submitting a form with a fake `userId` belonging to another user while authenticated.
3. **Payload 3 (Arbitrary Form Type Poisoning)**: Submitting with `formType: "malicious_script"`.
4. **Payload 4 (Denial of Wallet ID Oversize)**: Attempting to create a submission with a 2MB string as `submissionId`.
5. **Payload 5 (Unbounded Payload Injection)**: Submitting a 5MB payload in `details`.
6. **Payload 6 (Unauthorized Deletion)**: A non-admin visitor attempting to delete another visitor's booking or waitlist entry.
7. **Payload 7 (Status Tampering)**: A user attempting to update their submission status from `"new"` to `"approved"`.
8. **Payload 8 (Blanket Scraping)**: A non-admin user querying `collection("submissions")` without scoping to their own UID or visitorId.
9. **Payload 9 (Email Spoofing)**: An unverified email claim attempting admin escalation.
10. **Payload 10 (Timestamp Fraud)**: Submitting a future-dated or past-dated fabricated server timestamp.
11. **Payload 11 (Empty Key Bypass)**: Omitting required contact details like `userEmail` or `appName`.
12. **Payload 12 (Cross-Tenant Modification)**: Attempting to overwrite an existing submission using a standard update.

## 3. Mitigation Strategy
- Explicit validation helpers `isValidSubmission(data)` verifying allowed keys, types, maximum sizes, and enum constraints.
- Admin recognition verified against `request.auth.token.email == 'culturisk@gmail.com' && request.auth.token.email_verified == true`.
- Strict default-deny rule at the root.
- Document ID length restricted via `isValidId(submissionId)`.
