/**
 * index.ts
 * Centralized Barrel Export para sa lahat ng Feedback & Rating API Types
 */

// 1. Core API & Pagination Contracts
export * from './api';

// 2. Authentication & User Profile
export * from './auth';

// 3. Business Entities, Analytics & Quotas
export * from './business';

// 4. Reviews & Submissions
export * from './review';

// 5. Anti-Spam & Eligibility Verification
export * from './eligibility';

// 6. Business Owner Review Management & Moderation
export * from './managereview';

// 7. Google Analytics 4 (GA4) Telemetry Contracts
export * from './googleAnalytics';

// 8. Platform Admin & Founder Governance Contracts
export * from './admin';

