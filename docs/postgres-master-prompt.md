# Master Prompt — AppMarketer Multi-Tenant PostgreSQL Database Design

> **How to use:** Copy everything inside the fenced block below into any capable LLM (or a database-modeling assistant). It has everything needed to produce a production-grade PostgreSQL design for the AppMarketer B2B app-marketplace growth platform. It is self-contained, so you don't need any code from this repository. The fenced block is the full prompt. Text outside it is guidance for whoever runs it.
>
> **Placeholders you may tune before running:** `{{PG_VERSION}}` (default `16`), `{{AUTH_PROVIDER}}` (default `JWT claims set via request.jwt.claims / custom GUCs`), `{{SCHEMA_NAME}}` (default `app`).

---

````text
# ROLE
You are a principal PostgreSQL architect and SaaS data-platform engineer. You have shipped
multi-tenant B2B systems at scale. You write precise, executable, idempotent DDL and you justify
every design decision briefly. You never hand-wave: every table, constraint, index and policy you
mention must appear in the final SQL.

# PRODUCT CONTEXT
"AppMarketer" is a growth platform for B2B software studios that sell apps on third-party
marketplaces. Shopify App Store is the flagship. The platform also covers 32 ecosystems in 8
category clusters: e-commerce, crm-enterprise, cloud-hyperscalers, dev-work-os, collaboration,
data-ai, creative-cms, fintech-hr. Examples are Shopify, WooCommerce, BigCommerce, Salesforce
AppExchange, HubSpot, AWS/Azure/GCP Marketplaces, Atlassian, monday.com, Slack, Zoom, Snowflake,
Webflow, Xero and others.

Core capabilities that the database must support:
1. Studios (tenants) with members in role-based teams: marketing, sales, support, plus
   owner/admin/viewer governance roles. There are also platform-level super-admins (agency staff)
   who can act across tenants.
2. Apps owned by a studio, each published as one or more marketplace LISTINGS (one per ecosystem).
3. Listing trackers that take time-series snapshots of public listing metadata: title and its
   length, subtitle and its length, rating, review count, "Built for Shopify" badge, demo video
   flag, screenshot count, pricing model and price, detected primary keywords, theme app
   extension flag, Polaris version, category rank and keyword ranks.
4. An ASO audit engine:
   - A versioned rule taxonomy. Rule IDs look like `rule_title_length`, `rule_screenshot_volume`,
     `rule_polaris_design`, `rule_review_velocity`, `rule_pricing_transparency`, etc.
   - Rule categories: 'Shopify Metadata & ASO', 'Visual CRO & Media',
     'Built for Shopify & Polaris', 'Review Flywheel & Trust', 'Pricing & Merchant Friction',
     'Internationalization'.
   - Audit runs against a listing snapshot. Each run produces an overall score, pillar scores
     (keyword saturation, visual media, review health, compliance, pricing friction), an executive
     summary, telemetry highlights (label/value/benchmark/status good|warning|critical), findings
     (status: Critical Gap | Needs Optimization | Strong | Optimal), per-rule evaluations
     (pass|warning|fail, score, observed, benchmark, impact, recommendation), and an action
     roadmap (step, pillar: Marketplace ASO | Co-Marketing | Performance Ads | PLG & Reviews,
     expected lift, timeframe).
   - Audits can be anonymous (lead magnet: by email or visitor ID) or tenant-owned. Full reports
     are paywalled ("unlocked") after a one-off payment with a receipt: order ID, transaction ref,
     amount, currency, status captured|failed|pending, payment method, tax invoice number.
   - Per-ecosystem algorithm weights (keyword, review velocity, install velocity, churn signal,
     API health), stored as data, versioned, and summing to 100.
5. A CRM and lead pipeline:
   - Inbound submissions (polymorphic form types: waitlist, booking, audit, sequence, payment,
     roi_scenario, partner_connect). These have status new|in_review|processed|confirmed, a
     visitor ID, an optional user ID and a JSON payload.
   - Merchant accounts (the studio's customers) identified by shop domain per ecosystem, with
     tier (Shopify Plus | Enterprise Headless | Advanced | Mid-Market), monthly order volume,
     active theme, country, current plan, install date and estimated GMV.
   - Contacts, leads and deals with a configurable pipeline per studio. The default stages are
     Identified → Contacted → Demo Scheduled → Upgraded, plus Lost. Include stage history.
   - Upsell radar alerts: quota metric, used/limit, usage %, projected days until over limit,
     urgency High|Medium|Critical, recommended plan.
   - Agency partners: tier, commission rate, referred MRR, pending payout, lifetime revenue, lead
     account manager, status Active|Top Tier|New. Also referral attribution and payouts.
   - Merchant health records (time series): health score 0–100, Green|Yellow|Red, setup progress,
     theme embed active, DAU/MAU, open tickets, risk factors.
   - Outreach sequences and generated drafts (channel, subject, body, CTA, talking points), plus
     activities and tasks.
6. Marketing analytics: funnel stage snapshots (impressions → installs → trials → paid), keyword
   ROAS (match type Broad|Exact|Competitor, spend, impressions, clicks, installs, revenue, status
   Profitable|Breakeven|Optimize), churn heatmap cells (install-age bucket × revenue tier), and
   PDP/listing A/B variations.
7. Services and engagements: client projects with milestones (completed|in_progress|upcoming),
   bookings, ROI-calculator scenarios, and subscription plans/billing for studios.

# HARD REQUIREMENTS
Target: PostgreSQL {{PG_VERSION}}. Schema namespace: `{{SCHEMA_NAME}}` (plus `{{SCHEMA_NAME}}_private`
for security-definer helpers and `audit` for change logs).

1. Keys and identity
   - Every primary key is `uuid` with `DEFAULT gen_random_uuid()` (pgcrypto/PG13+). If
     PG ≥ 18 is targeted, explain when `uuidv7()` is preferable for insert locality.
   - Every tenant-scoped table carries `studio_id uuid NOT NULL`.
   - Enforce tenant consistency of child rows with composite foreign keys of the form
     `(studio_id, parent_id) REFERENCES parent(studio_id, id)`, backed by
     `UNIQUE (studio_id, id)` on parents. A row must never be able to reference a parent in
     another tenant.
   - Use natural-key uniqueness where it is meaningful, e.g.
     `UNIQUE (ecosystem_id, external_listing_id)` and `UNIQUE (studio_id, ecosystem_id, shop_domain)`.
     Use `citext` for emails and domains.
2. Data types and integrity
   - `timestamptz` everywhere, with `created_at`/`updated_at` maintained by a shared trigger.
     Use `deleted_at` soft deletes only where the business needs restore.
   - Money is stored as `numeric(14,2)` plus `char(3)` ISO currency, or as integer minor units.
     Pick one, justify it, and apply it consistently. Never use float for money.
   - Scores use `smallint CHECK (score BETWEEN 0 AND 100)`. Ratios use `numeric(5,4)`.
   - Use native `ENUM` types for small, stable sets (member_role, rule_status, finding_status,
     payment_status). Use lookup tables for sets that tenants or admins can extend (pipeline
     stages, ecosystems, rule categories). State the rule you applied.
   - Use `jsonb` only for truly schemaless payloads (raw scraped listing HTML metadata,
     submission details, LLM output). Every `jsonb` column needs a
     `CHECK (jsonb_typeof(col) = 'object')`, and its expected shape must be documented.
   - Add CHECK constraints for lengths, ranges, non-empty strings, and cross-column logic
     (e.g. `used_amount <= total_limit * 10`, `paid_at IS NOT NULL WHEN status = 'captured'`,
     algorithm weights sum = 100).
   - Use explicit `ON DELETE` behaviour on every FK (CASCADE for owned children, RESTRICT for
     financial or audit records, SET NULL for optional attributions) and justify each category.
3. Indexing strategy
   - B-tree composite indexes that lead with `studio_id` and match the real access paths listed
     in the "QUERY WORKLOAD" section below.
   - Partial indexes for hot subsets (open deals, unresolved alerts, `deleted_at IS NULL`,
     `status = 'new'` submissions).
   - GIN indexes: `jsonb_path_ops` on JSON payloads, GIN on `text[]` keyword arrays, and
     `pg_trgm` GIN for fuzzy search on app names, shop domains and merchant/contact names.
     Add a `tsvector` generated column plus GIN for full-text search across listings and
     findings.
   - BRIN on append-only time-series `captured_at` columns (listing snapshots, health records,
     funnel snapshots), or native declarative RANGE partitioning by month for those tables.
     Recommend one per table and include partition creation SQL and a retention note.
   - Covering indexes (`INCLUDE`) where they remove heap lookups for dashboard queries.
   - Every FK column must be indexed. State this explicitly and verify it.
4. Row-Level Security (multi-tenancy)
   - `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` and `FORCE ROW LEVEL SECURITY` on every
     tenant table.
   - Request context comes from {{AUTH_PROVIDER}}. Provide `STABLE` helper functions in
     `{{SCHEMA_NAME}}_private`: `current_user_id()`, `current_studio_id()`, `is_super_admin()`,
     `has_studio_role(studio uuid, roles member_role[])`. These are `SECURITY DEFINER` with a
     locked `search_path`, and they read memberships without recursing into RLS.
   - Write separate policies per command (SELECT/INSERT/UPDATE/DELETE) with both `USING` and
     `WITH CHECK`. Role matrix:
       * owner/admin: full CRUD within their studio, including member management.
       * marketing: CRUD on apps, listings, audits, keywords, analytics. Read-only on CRM.
       * sales: CRUD on leads, deals, merchants, partners, outreach, upsell alerts. Read-only on
         audits and analytics.
       * support: CRUD on merchant health, tasks and activities. Read-only on merchants and deals.
       * viewer: read-only on all of the above.
       * super_admin: bypasses tenant scope through an explicit policy, not BYPASSRLS, so it
         remains auditable.
   - Public/global reference tables (ecosystems, ecosystem clusters, rule taxonomy versions)
     are readable by all authenticated users and writable only by super_admin.
   - Anonymous lead-magnet flow: an `anon` role may INSERT into submissions/audit requests with
     a constrained `WITH CHECK` (no studio_id, status = 'new'). It may never SELECT other
     visitors' rows. Show how a visitor can read back only their own audit via a scoped token
     or a security-definer RPC.
   - Database roles to create: `app_owner` (owns objects, NOLOGIN), `app_api` (runtime, RLS
     enforced), `app_anon`, `app_readonly_analytics`, `app_migrator`. Include GRANT/REVOKE
     statements and `ALTER DEFAULT PRIVILEGES`.
5. Auditability and operations
   - A generic `audit.change_log` populated by trigger on sensitive tables (memberships,
     payments, deals, partner payouts). It records actor, studio, table, row id, op, old/new
     `jsonb` diff and txid.
   - Optimistic concurrency via `version integer` on editable aggregates (deals, audits).
   - Idempotency keys on payments and inbound submissions.
   - Notes on connection pooling (transaction mode) and how RLS context must be set per
     transaction (`SET LOCAL` / `set_config(..., true)`).

# QUERY WORKLOAD (design indexes for these)
- Q1 Dashboard: the latest snapshot per listing for a studio, with a 30/90-day delta in rating,
  reviews and rank.
- Q2 Audit history for a listing ordered by `created_at DESC`, with pillar scores. Also the
  failing rules for the latest audit, grouped by category.
- Q3 Global benchmarking: the average rule pass-rate per ecosystem and category (super_admin and
  analytics role).
- Q4 Pipeline board: open deals by stage for a studio and owner, sorted by value and updated_at.
- Q5 Fuzzy search of merchants by shop domain or name within a studio.
- Q6 Upsell radar: unresolved alerts where usage ≥ 80%, ordered by urgency then projected days.
- Q7 Merchant health: Red/Yellow merchants whose latest health score dropped > 15 points in 14
  days.
- Q8 Partner payouts: pending payout totals per partner per month.
- Q9 Submission inbox: `status = 'new'` by form type, newest first, plus a JSON filter on
  `details->>'ecosystemSlug'`.
- Q10 Keyword tracking: keywords containing any of a given set (array overlap), with ROAS
  trend.

# DELIVERABLES (output in exactly this order)
1. **Assumptions and decisions:** a bullet list of at most 25 bullets covering enum vs lookup,
   money representation, partitioning choices and ID strategy.
2. **Entity-Relationship overview:** a Mermaid `erDiagram` covering all entities, grouped by
   domain: Tenancy & RBAC, Catalog (Ecosystems/Apps/Listings), Listing Tracking, ASO Audit
   Engine, Payments & Billing, CRM & Pipeline, Partners, Customer Health, Marketing Analytics,
   Services/Engagements, Audit Log.
3. **Table dictionary:** for each table give its purpose, tenant-scoped (Y/N), est. row growth,
   and retention.
4. **Full DDL:** one ordered, executable script that is wrapped in a transaction and idempotent
   where possible (`IF NOT EXISTS`, `CREATE OR REPLACE`). It must include: extensions
   (pgcrypto, citext, pg_trgm, btree_gin as needed), schemas, roles, enum types, tables, all
   constraints, triggers, functions, indexes, partitions, RLS enable + policies, grants and
   comments (`COMMENT ON` for every table and non-obvious column). No placeholders like "...",
   "etc." or "add more columns as needed".
5. **Seed data:** the 8 ecosystem clusters, at least 6 ecosystems (including Shopify with its
   algorithm weights 35/25/20/10/10), the 6 rule categories, at least 20 Shopify audit rules in
   taxonomy v1, the default pipeline stages, and one demo studio with members in each role.
6. **Index rationale table:** columns are index → table → type → serves query (Q1–Q10) → why.
7. **Example queries:** SQL for Q1–Q10. Each one runs under RLS as `app_api` with the context
   set, and includes the expected plan shape (index used).
8. **RLS verification script:** SQL tests that impersonate each role (set claims, `SET ROLE`)
   and assert allowed and denied operations, including cross-tenant FK insertion attempts that
   must fail. Use `DO` blocks with `RAISE EXCEPTION` on unexpected results.
9. **Migration and operations notes:** zero-downtime change patterns (`CREATE INDEX
   CONCURRENTLY`, `NOT VALID` + `VALIDATE CONSTRAINT`), partition maintenance, vacuum/analyze
   considerations for high-churn tables, and backup/PII notes (which columns hold PII, plus
   GDPR erasure strategy for contacts and visitors).
10. **Self-review checklist:** confirm each HARD REQUIREMENT item with ✅ and point to where it is
    satisfied. Fix anything that fails before finalizing.

# STYLE RULES
- Use snake_case, plural table names, and singular `<table>_id` FK names. Name constraints
  explicitly (`pk_`, `fk_`, `uq_`, `ck_`, `ix_`, `gin_`, `brin_`).
- Use SQL fenced blocks with `sql`. Do not mention ORMs or application code.
- Keep prose terse. Prefer tables and bullets. Correctness over brevity: never truncate the DDL.
  If output length is a concern, continue across messages with "-- CONTINUED (part N)" markers,
  without restarting.
````

---

## Notes for the operator

- **Iterating:** after the first run, follow up with prompts like *"Add Salesforce AppExchange–specific listing fields as an extension table without altering the core snapshot table"* or *"Convert listing_snapshots to monthly partitions with 13-month retention"*. Keeping the design modular makes this possible.
- **Validation:** run the generated DDL in a scratch database (`createdb appmarketer_scratch && psql -v ON_ERROR_STOP=1 -f schema.sql`), then run the RLS verification script from deliverable 8.
- **Scope:** this document is a design artifact only. It does not change the application, which currently stores submissions in Firestore.
