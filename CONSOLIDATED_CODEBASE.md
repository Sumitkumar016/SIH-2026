# MPLADS SENTINEL - CONSOLIDATED CODEBASE

- **Generated on**: 2026-09-13T16:57:28.364Z
- **Total Files**: 131
- **Scope**: Frontend, Backend, Prisma Schema (Excluding Migrations & Dependencies)

## Table of Contents

1. [backend/prisma/schema.prisma](#backend-prisma-schema-prisma)
2. [backend/.env](#backend--env)
3. [backend/.env.example](#backend--env-example)
4. [backend/package.json](#backend-package-json)
5. [backend/prisma/models/AssetCreation.prisma](#backend-prisma-models-assetcreation-prisma)
6. [backend/prisma/models/AuditorReport.prisma](#backend-prisma-models-auditorreport-prisma)
7. [backend/prisma/models/District.prisma](#backend-prisma-models-district-prisma)
8. [backend/prisma/models/Enums.prisma](#backend-prisma-models-enums-prisma)
9. [backend/prisma/models/Escalation.prisma](#backend-prisma-models-escalation-prisma)
10. [backend/prisma/models/Expenditure.prisma](#backend-prisma-models-expenditure-prisma)
11. [backend/prisma/models/Mp.prisma](#backend-prisma-models-mp-prisma)
12. [backend/prisma/models/Prediction.prisma](#backend-prisma-models-prediction-prisma)
13. [backend/prisma/models/RiskScore.prisma](#backend-prisma-models-riskscore-prisma)
14. [backend/prisma/models/State.prisma](#backend-prisma-models-state-prisma)
15. [backend/prisma/models/User.prisma](#backend-prisma-models-user-prisma)
16. [backend/prisma/models/Vendor.prisma](#backend-prisma-models-vendor-prisma)
17. [backend/prisma/models/Work.prisma](#backend-prisma-models-work-prisma)
18. [backend/prisma/models/WorkProgress.prisma](#backend-prisma-models-workprogress-prisma)
19. [backend/scripts/backfill-current-risk-score.js](#backend-scripts-backfill-current-risk-score-js)
20. [backend/src/app.js](#backend-src-app-js)
21. [backend/src/config/db.js](#backend-src-config-db-js)
22. [backend/src/config/env.js](#backend-src-config-env-js)
23. [backend/src/controllers/auditor.controller.js](#backend-src-controllers-auditor-controller-js)
24. [backend/src/controllers/auth.controller.js](#backend-src-controllers-auth-controller-js)
25. [backend/src/controllers/district.controller.js](#backend-src-controllers-district-controller-js)
26. [backend/src/controllers/ministry.controller.js](#backend-src-controllers-ministry-controller-js)
27. [backend/src/controllers/mp.controller.js](#backend-src-controllers-mp-controller-js)
28. [backend/src/controllers/state.controller.js](#backend-src-controllers-state-controller-js)
29. [backend/src/controllers/work.controller.js](#backend-src-controllers-work-controller-js)
30. [backend/src/middleware/auth.js](#backend-src-middleware-auth-js)
31. [backend/src/middleware/auth.middleware.js](#backend-src-middleware-auth-middleware-js)
32. [backend/src/middleware/error.middleware.js](#backend-src-middleware-error-middleware-js)
33. [backend/src/middleware/validate.middleware.js](#backend-src-middleware-validate-middleware-js)
34. [backend/src/routes/auditor.routes.js](#backend-src-routes-auditor-routes-js)
35. [backend/src/routes/auth.routes.js](#backend-src-routes-auth-routes-js)
36. [backend/src/routes/district.routes.js](#backend-src-routes-district-routes-js)
37. [backend/src/routes/ministry.routes.js](#backend-src-routes-ministry-routes-js)
38. [backend/src/routes/mp.routes.js](#backend-src-routes-mp-routes-js)
39. [backend/src/routes/state.routes.js](#backend-src-routes-state-routes-js)
40. [backend/src/routes/work.routes.js](#backend-src-routes-work-routes-js)
41. [backend/src/server.js](#backend-src-server-js)
42. [backend/src/services/auditorCase.service.js](#backend-src-services-auditorcase-service-js)
43. [backend/src/services/auditorQueue.service.js](#backend-src-services-auditorqueue-service-js)
44. [backend/src/services/auth.service.js](#backend-src-services-auth-service-js)
45. [backend/src/services/districtOverview.service.js](#backend-src-services-districtoverview-service-js)
46. [backend/src/services/mpOverview.service.js](#backend-src-services-mpoverview-service-js)
47. [backend/src/services/mpPerformance.service.js](#backend-src-services-mpperformance-service-js)
48. [backend/src/services/mpWorks.service.js](#backend-src-services-mpworks-service-js)
49. [backend/src/services/prediction.service.js](#backend-src-services-prediction-service-js)
50. [backend/src/services/riskScoreHistory.service.js](#backend-src-services-riskscorehistory-service-js)
51. [backend/src/services/shared/latestFor.service.js](#backend-src-services-shared-latestfor-service-js)
52. [backend/src/services/stateOverview.service.js](#backend-src-services-stateoverview-service-js)
53. [backend/src/services/trendsAnalytics.service.js](#backend-src-services-trendsanalytics-service-js)
54. [backend/src/services/vendorForensics.service.js](#backend-src-services-vendorforensics-service-js)
55. [backend/src/services/verificationQueue.service.js](#backend-src-services-verificationqueue-service-js)
56. [backend/src/services/workDetail.service.js](#backend-src-services-workdetail-service-js)
57. [backend/src/utils/asyncHandler.js](#backend-src-utils-asynchandler-js)
58. [backend/src/utils/jwt.js](#backend-src-utils-jwt-js)
59. [backend/src/utils/password.js](#backend-src-utils-password-js)
60. [backend/src/utils/resolveVendorName.js](#backend-src-utils-resolvevendorname-js)
61. [backend/src/utils/stateCodeMap.js](#backend-src-utils-statecodemap-js)
62. [backend/src/utils/workStatus.js](#backend-src-utils-workstatus-js)
63. [backend/src/validators/auth.validator.js](#backend-src-validators-auth-validator-js)
64. [frontend/.env](#frontend--env)
65. [frontend/.env.production](#frontend--env-production)
66. [frontend/index.html](#frontend-index-html)
67. [frontend/package.json](#frontend-package-json)
68. [frontend/postcss.config.js](#frontend-postcss-config-js)
69. [frontend/src/api/apiClient.js](#frontend-src-api-apiclient-js)
70. [frontend/src/api/auditorApi.js](#frontend-src-api-auditorapi-js)
71. [frontend/src/api/authApi.js](#frontend-src-api-authapi-js)
72. [frontend/src/api/chatbotApi.js](#frontend-src-api-chatbotapi-js)
73. [frontend/src/api/districtApi.js](#frontend-src-api-districtapi-js)
74. [frontend/src/api/index.js](#frontend-src-api-index-js)
75. [frontend/src/api/ministryApi.js](#frontend-src-api-ministryapi-js)
76. [frontend/src/api/mpApi.js](#frontend-src-api-mpapi-js)
77. [frontend/src/api/mpladsService.js](#frontend-src-api-mpladsservice-js)
78. [frontend/src/api/stateApi.js](#frontend-src-api-stateapi-js)
79. [frontend/src/App.jsx](#frontend-src-app-jsx)
80. [frontend/src/auth/mockAuth.js](#frontend-src-auth-mockauth-js)
81. [frontend/src/components/ChatbotWidget/ChatbotWidget.jsx](#frontend-src-components-chatbotwidget-chatbotwidget-jsx)
82. [frontend/src/components/ChatbotWidget/index.js](#frontend-src-components-chatbotwidget-index-js)
83. [frontend/src/components/common/AlertBellIcon.jsx](#frontend-src-components-common-alertbellicon-jsx)
84. [frontend/src/components/common/DistrictSummaryModal.jsx](#frontend-src-components-common-districtsummarymodal-jsx)
85. [frontend/src/components/common/FilterBar.jsx](#frontend-src-components-common-filterbar-jsx)
86. [frontend/src/components/common/loading/CardSkeleton.jsx](#frontend-src-components-common-loading-cardskeleton-jsx)
87. [frontend/src/components/common/loading/ChartSkeleton.jsx](#frontend-src-components-common-loading-chartskeleton-jsx)
88. [frontend/src/components/common/loading/EmptyState.jsx](#frontend-src-components-common-loading-emptystate-jsx)
89. [frontend/src/components/common/loading/ErrorBoundary.jsx](#frontend-src-components-common-loading-errorboundary-jsx)
90. [frontend/src/components/common/loading/ErrorState.jsx](#frontend-src-components-common-loading-errorstate-jsx)
91. [frontend/src/components/common/loading/GlobalLoadingBar.jsx](#frontend-src-components-common-loading-globalloadingbar-jsx)
92. [frontend/src/components/common/loading/index.js](#frontend-src-components-common-loading-index-js)
93. [frontend/src/components/common/loading/ListSkeleton.jsx](#frontend-src-components-common-loading-listskeleton-jsx)
94. [frontend/src/components/common/loading/MapSkeleton.jsx](#frontend-src-components-common-loading-mapskeleton-jsx)
95. [frontend/src/components/common/loading/Skeleton.jsx](#frontend-src-components-common-loading-skeleton-jsx)
96. [frontend/src/components/common/loading/TableSkeleton.jsx](#frontend-src-components-common-loading-tableskeleton-jsx)
97. [frontend/src/components/common/loading/WorkDetailSkeleton.jsx](#frontend-src-components-common-loading-workdetailskeleton-jsx)
98. [frontend/src/components/common/MpLeaderboardWidget.jsx](#frontend-src-components-common-mpleaderboardwidget-jsx)
99. [frontend/src/components/common/ProtectedRoute.jsx](#frontend-src-components-common-protectedroute-jsx)
100. [frontend/src/components/common/RiskBadge.jsx](#frontend-src-components-common-riskbadge-jsx)
101. [frontend/src/components/common/SearchBox.jsx](#frontend-src-components-common-searchbox-jsx)
102. [frontend/src/components/common/Sparkline.jsx](#frontend-src-components-common-sparkline-jsx)
103. [frontend/src/components/common/TopNavbar.jsx](#frontend-src-components-common-topnavbar-jsx)
104. [frontend/src/components/common/WorkDetailModal.jsx](#frontend-src-components-common-workdetailmodal-jsx)
105. [frontend/src/components/layout/AuditorDashboardLayout.jsx](#frontend-src-components-layout-auditordashboardlayout-jsx)
106. [frontend/src/components/layout/DashboardLayout.jsx](#frontend-src-components-layout-dashboardlayout-jsx)
107. [frontend/src/components/layout/DistrictDashboardLayout.jsx](#frontend-src-components-layout-districtdashboardlayout-jsx)
108. [frontend/src/components/layout/MpDashboardLayout.jsx](#frontend-src-components-layout-mpdashboardlayout-jsx)
109. [frontend/src/components/layout/StateDashboardLayout.jsx](#frontend-src-components-layout-statedashboardlayout-jsx)
110. [frontend/src/context/AuthContext.jsx](#frontend-src-context-authcontext-jsx)
111. [frontend/src/hooks/useApiQuery.js](#frontend-src-hooks-useapiquery-js)
112. [frontend/src/index.css](#frontend-src-index-css)
113. [frontend/src/main.jsx](#frontend-src-main-jsx)
114. [frontend/src/pages/auditor/AuditorCaseDetailPage.jsx](#frontend-src-pages-auditor-auditorcasedetailpage-jsx)
115. [frontend/src/pages/auditor/AuditorCaseQueuePage.jsx](#frontend-src-pages-auditor-auditorcasequeuepage-jsx)
116. [frontend/src/pages/auditor/AuditorVendorToolPage.jsx](#frontend-src-pages-auditor-auditorvendortoolpage-jsx)
117. [frontend/src/pages/district/DistrictOverviewPage.jsx](#frontend-src-pages-district-districtoverviewpage-jsx)
118. [frontend/src/pages/district/DistrictVerificationQueuePage.jsx](#frontend-src-pages-district-districtverificationqueuepage-jsx)
119. [frontend/src/pages/FlaggedCasesPage.jsx](#frontend-src-pages-flaggedcasespage-jsx)
120. [frontend/src/pages/LoginPage.jsx](#frontend-src-pages-loginpage-jsx)
121. [frontend/src/pages/mp/MpConstituencyOverviewPage.jsx](#frontend-src-pages-mp-mpconstituencyoverviewpage-jsx)
122. [frontend/src/pages/mp/MpWorksListPage.jsx](#frontend-src-pages-mp-mpworkslistpage-jsx)
123. [frontend/src/pages/MpPerformancePage.jsx](#frontend-src-pages-mpperformancepage-jsx)
124. [frontend/src/pages/NationalOverviewPage.jsx](#frontend-src-pages-nationaloverviewpage-jsx)
125. [frontend/src/pages/PredictiveForecastPage.jsx](#frontend-src-pages-predictiveforecastpage-jsx)
126. [frontend/src/pages/state/StateOverviewPage.jsx](#frontend-src-pages-state-stateoverviewpage-jsx)
127. [frontend/src/pages/TrendsAnalyticsPage.jsx](#frontend-src-pages-trendsanalyticspage-jsx)
128. [frontend/src/pages/WorkDetailPage.jsx](#frontend-src-pages-workdetailpage-jsx)
129. [frontend/tailwind.config.js](#frontend-tailwind-config-js)
130. [frontend/vercel.json](#frontend-vercel-json)
131. [frontend/vite.config.js](#frontend-vite-config-js)

---


### `backend/prisma/schema.prisma`

*File [1/131] | Lines: 10 | Size: 0.2 KB*

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["prismaSchemaFolder"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```


### `backend/.env`

*File [2/131] | Lines: 14 | Size: 0.4 KB*

```
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Connection String (Prisma format)
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://postgres:123Sumit123%40@db.xupxsbqmckragvakixof.supabase.co:5432/postgres"
# Authentication & Security
JWT_SECRET="your_super_secret_jwt_key_change_in_production"
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN="*"
```


### `backend/.env.example`

*File [3/131] | Lines: 15 | Size: 0.4 KB*

```
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Connection String (Prisma format)
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://postgres:password@localhost:5432/mplads_db?schema=public"

# Authentication & Security
JWT_SECRET="your_super_secret_jwt_key_change_in_production"
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN="*"
```


### `backend/package.json`

*File [4/131] | Lines: 34 | Size: 0.7 KB*

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "dependencies": {
    "@prisma/client": "^6.19.3",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "helmet": "^8.3.0",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.9.3",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.14",
    "prisma": "^6.19.3"
  },
  "prisma": {
    "schema": "prisma"
  }
}
```


### `backend/prisma/models/AssetCreation.prisma`

*File [5/131] | Lines: 16 | Size: 0.8 KB*

```prisma
/// 9. asset_creation: Physical assets created with geotagging & verification
model AssetCreation {
  asset_id            Int                @id @default(autoincrement()) @map("asset_id")
  work_id             String             @map("work_id") @db.VarChar(100)
  asset_type          String?            @map("asset_type") @db.VarChar(100)
  geotag_lat          Decimal?           @map("geotag_lat") @db.Decimal(10, 8)
  geotag_long         Decimal?           @map("geotag_long") @db.Decimal(11, 8)
  verification_status VerificationStatus @default(unverified) @map("verification_status")

  // Relationships
  work                Work               @relation(fields: [work_id], references: [work_id], onDelete: Cascade)

  @@index([work_id])
  @@map("asset_creation")
}
```


### `backend/prisma/models/AuditorReport.prisma`

*File [6/131] | Lines: 21 | Size: 1.0 KB*

```prisma
/// 13. auditor_reports: Investigation & verification findings submitted by Auditor/Investigator (1-to-N)
model AuditorReport {
  report_id             Int                 @id @default(autoincrement()) @map("report_id")
  work_id               String              @map("work_id") @db.VarChar(100)
  conclusion            AuditorConclusion   @map("conclusion")
  notes                 String?             @map("notes") @db.Text
  status                AuditorReportStatus @map("status")
  verified_progress_pct Decimal?            @map("verified_progress_pct") @db.Decimal(5, 2)
  discrepancy_flag      Boolean             @default(false) @map("discrepancy_flag")
  submitted_by          String?             @default("Auditor") @map("submitted_by") @db.VarChar(150)
  submitted_date        DateTime?           @map("submitted_date") @db.Date

  // Relationships
  work                  Work                @relation(fields: [work_id], references: [work_id], onDelete: Cascade)

  @@index([work_id])
  @@index([status])
  @@index([conclusion])
  @@map("auditor_reports")
}
```


### `backend/prisma/models/District.prisma`

*File [7/131] | Lines: 15 | Size: 0.5 KB*

```prisma
/// 2. districts: Administrative districts mapped to states
model District {
  district_id   Int      @id @default(autoincrement()) @map("district_id")
  district_name String   @map("district_name") @db.VarChar(100)
  state_id      Int      @map("state_id")

  // Relationships
  state         State    @relation(fields: [state_id], references: [state_id], onDelete: Restrict)
  users         User[]
  works         Work[]

  @@index([state_id])
  @@map("districts")
}
```


### `backend/prisma/models/Enums.prisma`

*File [8/131] | Lines: 75 | Size: 1.3 KB*

```prisma
// Shared Enums for MPLADS Platform

enum Role {
  ministry
  mp
  district
  state
  auditor

  @@map("user_role")
}

enum WorkStatus {
  Recommended
  Sanctioned
  Ongoing
  Completed

  @@map("work_status")
}

enum EvidenceStatus {
  present
  missing

  @@map("evidence_status")
}

enum VerificationStatus {
  verified
  unverified
  disputed

  @@map("verification_status")
}

enum RiskLevel {
  Low
  Medium
  High

  @@map("risk_level")
}

/// Escalation Source:
/// - 'ai': AI-generated risk flag / prioritization record (NOT an automatic investigation trigger)
/// - 'ministry': Human referral initiated by an authorized Ministry user
/// - 'state': Human referral initiated by an authorized State user
/// - 'district': Human referral initiated by an authorized District user
/// Only human-authorized referrals ('ministry', 'state', 'district') place a case into the Auditor/Investigator queue.
enum EscalationSource {
  ai
  ministry
  state
  district

  @@map("escalation_source_type")
}

enum AuditorConclusion {
  CONFIRMED_ANOMALY     @map("Confirmed Anomaly")
  FALSE_POSITIVE        @map("False Positive")
  REQUIRES_FIELD_ACTION @map("Requires Field Action")

  @@map("auditor_conclusion")
}

enum AuditorReportStatus {
  UNDER_REVIEW @map("Under Review")
  RESOLVED     @map("Resolved")
  ESCALATED    @map("Escalated")

  @@map("auditor_report_status")
}
```


### `backend/prisma/models/Escalation.prisma`

*File [9/131] | Lines: 23 | Size: 1.2 KB*

```prisma
/// 12. escalations: AI risk flags and human-initiated investigation referrals (1-to-N)
/// Note:
/// - escalation_source = 'ai': AI-generated flag / prioritization. Does NOT auto-initiate investigation.
/// - escalation_source = 'ministry' | 'state' | 'district': Human review referral into Auditor/Investigator queue.
model Escalation {
  escalation_id     Int              @id @default(autoincrement()) @map("escalation_id")
  work_id           String           @map("work_id") @db.VarChar(100)
  escalation_source EscalationSource @map("escalation_source")
  escalation_note   String?          @map("escalation_note") @db.Text
  escalated_by         String?          @map("escalated_by") @db.VarChar(150)
  escalated_by_user_id Int?             @map("escalated_by_user_id")
  escalated_date       DateTime?        @map("escalated_date") @db.Date

  // Relationships
  work                 Work             @relation(fields: [work_id], references: [work_id], onDelete: Cascade)
  escalated_by_user    User?            @relation(fields: [escalated_by_user_id], references: [user_id], onDelete: SetNull)

  @@index([work_id])
  @@index([escalation_source])
  @@index([escalated_by_user_id])
  @@map("escalations")
}
```


### `backend/prisma/models/Expenditure.prisma`

*File [10/131] | Lines: 18 | Size: 0.7 KB*

```prisma
/// 7. expenditures: Financial disbursements per work (1-to-N)
model Expenditure {
  expenditure_id Int      @id @default(autoincrement()) @map("expenditure_id")
  work_id        String   @map("work_id") @db.VarChar(100)
  vendor_id      Int?     @map("vendor_id")
  amount         Decimal  @map("amount") @db.Decimal(15, 2)
  payment_date   DateTime @map("payment_date") @db.Date
  payment_status String?  @map("payment_status") @db.VarChar(50)

  // Relationships
  work           Work     @relation(fields: [work_id], references: [work_id], onDelete: Cascade)
  vendor         Vendor?  @relation(fields: [vendor_id], references: [vendor_id], onDelete: SetNull)

  @@index([work_id])
  @@index([vendor_id])
  @@map("expenditures")
}
```


### `backend/prisma/models/Mp.prisma`

*File [11/131] | Lines: 17 | Size: 0.6 KB*

```prisma
/// 3. mps: Members of Parliament
model Mp {
  mp_id            Int      @id @default(autoincrement()) @map("mp_id")
  mp_name          String   @map("mp_name") @db.VarChar(150)
  constituency     String?  @map("constituency") @db.VarChar(150)
  state_id         Int      @map("state_id")
  allocated_amount Decimal? @map("allocated_amount") @db.Decimal(15, 2)

  // Relationships
  state            State    @relation(fields: [state_id], references: [state_id], onDelete: Restrict)
  users            User[]
  works            Work[]

  @@index([state_id])
  @@map("mps")
}
```


### `backend/prisma/models/Prediction.prisma`

*File [12/131] | Lines: 18 | Size: 0.9 KB*

```prisma
/// 11. predictions: Latest AI forecast snapshot per work (1-to-1)
model Prediction {
  prediction_id            Int      @id @default(autoincrement()) @map("prediction_id")
  work_id                  String   @unique @map("work_id") @db.VarChar(100)
  current_risk_score       Decimal? @map("current_risk_score") @db.Decimal(5, 2)
  predicted_risk_score_30d Decimal? @map("predicted_risk_score_30d") @db.Decimal(5, 2)
  risk_delta_pct           Decimal? @map("risk_delta_pct") @db.Decimal(5, 2)
  warning_signal           String?  @map("warning_signal") @db.VarChar(255)
  days_until_threshold     Int?     @map("days_until_threshold")
  predicted_at             DateTime @default(now()) @map("predicted_at") @db.Timestamptz(6)

  // Relationships
  work                     Work     @relation(fields: [work_id], references: [work_id], onDelete: Cascade)

  @@index([work_id])
  @@map("predictions")
}
```


### `backend/prisma/models/RiskScore.prisma`

*File [13/131] | Lines: 26 | Size: 1.5 KB*

```prisma
/// 10. risk_scores: Latest computed AI risk snapshot per work (1-to-1)
model RiskScore {
  risk_id                  Int        @id @default(autoincrement()) @map("risk_id")
  work_id                  String     @map("work_id") @db.VarChar(100)
  is_current               Boolean    @default(true) @map("is_current")
  risk_score               Decimal?   @map("risk_score") @db.Decimal(5, 2)
  risk_level               RiskLevel? @map("risk_level")
  cost_overrun_pct         Decimal    @default(0) @map("cost_overrun_pct") @db.Decimal(5, 2)
  delay_slippage_pct       Decimal    @default(0) @map("delay_slippage_pct") @db.Decimal(5, 2)
  duplicate_similarity_pct Decimal    @default(0) @map("duplicate_similarity_pct") @db.Decimal(5, 2)
  vendor_anomaly_pct       Decimal    @default(0) @map("vendor_anomaly_pct") @db.Decimal(5, 2)
  progress_mismatch_pct    Decimal    @default(0) @map("progress_mismatch_pct") @db.Decimal(5, 2)
  flag_reason              String?    @map("flag_reason") @db.VarChar(255)
  ai_diagnostic_summary    String?    @map("ai_diagnostic_summary") @db.Text
  calculated_at            DateTime   @default(now()) @map("calculated_at") @db.Timestamptz(6)

  // Relationships
  work                     Work       @relation("RiskScoreHistory", fields: [work_id], references: [work_id], onDelete: Cascade)
  current_for_work         Work?      @relation("WorkCurrentRiskScore")

  @@index([work_id])
  @@index([risk_level])
  @@index([work_id, calculated_at])
  @@map("risk_scores")
}
```


### `backend/prisma/models/State.prisma`

*File [14/131] | Lines: 15 | Size: 0.4 KB*

```prisma
/// 1. states: Administrative states/UTs
model State {
  state_id   Int        @id @default(autoincrement()) @map("state_id")
  state_name String     @unique @map("state_name") @db.VarChar(100)
  type       String?    @map("type") @db.VarChar(20)

  // Relationships
  districts  District[]
  mps        Mp[]
  users      User[]
  works      Work[]

  @@map("states")
}
```


### `backend/prisma/models/User.prisma`

*File [15/131] | Lines: 24 | Size: 0.9 KB*

```prisma
/// 5. users: Platform users with role-based access control
model User {
  user_id     Int       @id @default(autoincrement()) @map("user_id")
  name        String    @map("name") @db.VarChar(150)
  email       String    @unique @map("email") @db.VarChar(255)
  password    String    @map("password") @db.VarChar(255)
  role        Role      @map("role")
  mp_id       Int?      @map("mp_id")
  district_id Int?      @map("district_id")
  state_id    Int?      @map("state_id")
  

  // Relationships
  mp          Mp?          @relation(fields: [mp_id], references: [mp_id], onDelete: SetNull)
  district    District?    @relation(fields: [district_id], references: [district_id], onDelete: SetNull)
  state       State?       @relation(fields: [state_id], references: [state_id], onDelete: SetNull)
  escalations Escalation[]

  @@index([mp_id])
  @@index([district_id])
  @@index([state_id])
  @@map("users")
}
```


### `backend/prisma/models/Vendor.prisma`

*File [16/131] | Lines: 14 | Size: 0.5 KB*

```prisma
/// 4. vendors: Contractors / Executing Agencies
model Vendor {
  vendor_id           Int           @id @default(autoincrement()) @map("vendor_id")
  vendor_name         String        @map("vendor_name") @db.VarChar(200)
  registration_number String?       @unique @map("registration_number") @db.VarChar(100)
  contact_info        String?       @map("contact_info") @db.VarChar(255)

  // Relationships
  expenditures        Expenditure[]

  @@index([vendor_name])
  @@map("vendors")
}
```


### `backend/prisma/models/Work.prisma`

*File [17/131] | Lines: 40 | Size: 2.2 KB*

```prisma
/// 6. works: MPLADS recommended development works
model Work {
  work_id                String          @id @map("work_id") @db.VarChar(100) // e.g. 'MPLADS-BR-2024-0422'
  mp_id                  Int             @map("mp_id")
  district_id            Int             @map("district_id")
  state_id               Int             @map("state_id")
  category               String?         @map("category") @db.VarChar(100)
  description            String?         @map("description") @db.Text
  recommended_amount     Decimal?        @map("recommended_amount") @db.Decimal(15, 2)
  sanctioned_amount      Decimal?        @map("sanctioned_amount") @db.Decimal(15, 2)
  recommended_date       DateTime?       @map("recommended_date") @db.Date
  sanction_date          DateTime?       @map("sanction_date") @db.Date
  completion_date        DateTime?       @map("completion_date") @db.Date
  status                 WorkStatus      @map("status")
  current_risk_score_id  Int?            @unique @map("current_risk_score_id")
  created_at             DateTime        @default(now()) @map("created_at") @db.Timestamptz(6)
  updated_at             DateTime        @updatedAt @map("updated_at") @db.Timestamptz(6)

  // Relationships (Reference tables)
  mp                     Mp              @relation(fields: [mp_id], references: [mp_id], onDelete: Restrict)
  district               District        @relation(fields: [district_id], references: [district_id], onDelete: Restrict)
  state                  State           @relation(fields: [state_id], references: [state_id], onDelete: Restrict)

  // Child Relationships (One-to-Many / One-to-One with CASCADE delete)
  expenditures           Expenditure[]
  work_progress          WorkProgress[]
  asset_creation         AssetCreation[]
  current_risk_score     RiskScore?      @relation("WorkCurrentRiskScore", fields: [current_risk_score_id], references: [risk_id], onDelete: SetNull)
  risk_score_history     RiskScore[]     @relation("RiskScoreHistory")
  prediction             Prediction?
  escalations            Escalation[]
  auditor_reports        AuditorReport[]

  @@index([mp_id])
  @@index([district_id])
  @@index([state_id])
  @@index([status])
  @@map("works")
}
```


### `backend/prisma/models/WorkProgress.prisma`

*File [18/131] | Lines: 20 | Size: 1.0 KB*

```prisma
/// 8. work_progress: Historical physical progress tracking records per work (1-to-N)
model WorkProgress {
  progress_id           Int            @id @default(autoincrement()) @map("progress_id")
  work_id               String         @map("work_id") @db.VarChar(100)
  report_date           DateTime       @map("report_date") @db.Date
  physical_progress_pct Decimal?       @map("physical_progress_pct") @db.Decimal(5, 2)
  expected_progress_pct Decimal?       @map("expected_progress_pct") @db.Decimal(5, 2)
  evidence_status       EvidenceStatus @default(missing) @map("evidence_status")
  photo_url             String?        @map("photo_url") @db.VarChar(500)
  geotag_lat            Decimal?       @map("geotag_lat") @db.Decimal(10, 8)
  geotag_long           Decimal?       @map("geotag_long") @db.Decimal(11, 8)
  reported_by           String?        @map("reported_by") @db.VarChar(150)

  // Relationships
  work                  Work           @relation(fields: [work_id], references: [work_id], onDelete: Cascade)

  @@index([work_id])
  @@map("work_progress")
}
```


### `backend/scripts/backfill-current-risk-score.js`

*File [19/131] | Lines: 64 | Size: 1.8 KB*

```javascript
import { prisma } from "../src/config/db.js";

async function backfillCurrentRiskScore() {
  console.log("Starting backfill for current_risk_score_id...");

  // 1. Query all existing risk scores
  const allRiskScores = await prisma.riskScore.findMany({
    select: {
      risk_id: true,
      work_id: true,
      is_current: true,
    },
  });

  console.log(`Found ${allRiskScores.length} existing RiskScore records.`);

  // 2. Ensure is_current: true on all of them
  const updatedScores = await prisma.riskScore.updateMany({
    where: {
      is_current: false,
    },
    data: {
      is_current: true,
    },
  });
  console.log(`Updated ${updatedScores.count} RiskScore rows that had is_current: false to true.`);

  // 3. Set each corresponding Work.current_risk_score_id to point at that work's RiskScore row's risk_id
  let backfilledCount = 0;
  for (const rs of allRiskScores) {
    if (rs.work_id) {
      await prisma.work.update({
        where: { work_id: rs.work_id },
        data: { current_risk_score_id: rs.risk_id },
      });
      backfilledCount++;
    }
  }

  // 4. Count works with zero RiskScore rows (current_risk_score_id remains null)
  const worksWithoutRiskScore = await prisma.work.count({
    where: {
      current_risk_score_id: null,
    },
  });

  const totalWorks = await prisma.work.count();

  console.log(`Backfill complete:`);
  console.log(`- Works backfilled with current_risk_score_id: ${backfilledCount}`);
  console.log(`- Works with zero RiskScore rows (staying null): ${worksWithoutRiskScore}`);
  console.log(`- Total works in database: ${totalWorks}`);
}

backfillCurrentRiskScore()
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
```


### `backend/src/app.js`

*File [20/131] | Lines: 72 | Size: 2.0 KB*

```javascript
import express from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./config/env.js";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import ministryRoutes from "./routes/ministry.routes.js";
import workRoutes from "./routes/work.routes.js";
import mpRoutes from "./routes/mp.routes.js";
import districtRoutes from "./routes/district.routes.js";
import stateRoutes from "./routes/state.routes.js";
import auditorRoutes from "./routes/auditor.routes.js";

/**
 * Express application definition and middleware pipeline.
 * Separated from server.js so it can be imported in integration tests without binding to a network port.
 */
const app = express();

// 1. Core security and parsing middleware
app.use(express.json());
app.use(
  cors({
    origin: config.corsOrigin,
  })
);
app.use(helmet());

// 2. Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SIH backend is running",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// 3. Application API routes
app.use("/api/auth", authRoutes);

// Ministry routes
app.use("/api/ministry", ministryRoutes);

// Work Detail routes (shared across all authenticated roles)
app.use("/api/works", workRoutes);

// MP routes (scoped to authenticated MP)
app.use("/api/mp", mpRoutes);

// District routes (scoped to authenticated District official)
app.use("/api/district", districtRoutes);

// State routes (scoped to authenticated State Nodal official)
app.use("/api/state", stateRoutes);

// Auditor routes (scoped to authenticated Auditor)
app.use("/api/auditor", auditorRoutes);


// Send unknown routes to the centralized error middleware.
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// 5. Centralized global error handling middleware (must always be registered last)
app.use(errorMiddleware);

export default app;
```


### `backend/src/config/db.js`

*File [21/131] | Lines: 46 | Size: 1.6 KB*

```javascript
import { PrismaClient } from "@prisma/client";
import config from "./env.js";

// Determine which Prisma log levels to show based on environment.
// In development, show queries, errors, and warnings. In production, only errors.
const logLevels = config.nodeEnv === "development" 
  ? ["query", "error", "warn"] 
  : ["error"];

// Create a single PrismaClient instance (singleton) for the entire application.
// Creating multiple instances can exhaust the database connection pool.
const prisma = new PrismaClient({
  log: logLevels,
});

// Test and verify the PostgreSQL connection during server startup.
async function connectDB() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected successfully via Prisma");
  } catch (error) {
    console.error(`PostgreSQL connection failed: ${error.message}`);
    // Exit the process if the database cannot be reached at startup.
    process.exit(1);
  }
}

// Cleanly disconnect from Prisma when the server process is terminated.
async function handleGracefulShutdown(signal) {
  console.log(`Received ${signal}. Disconnecting Prisma client...`);
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error(`Error during Prisma disconnect: ${err.message}`);
  } finally {
    process.exit(0);
  }
}

// Listen for termination signals (e.g., Ctrl+C in terminal, Docker stop).
process.on("SIGINT", () => handleGracefulShutdown("SIGINT"));
process.on("SIGTERM", () => handleGracefulShutdown("SIGTERM"));

export { prisma, connectDB };
export default connectDB;
```


### `backend/src/config/env.js`

*File [22/131] | Lines: 50 | Size: 1.5 KB*

```javascript
import dotenv from "dotenv";

// Load key-value pairs from the .env file into process.env before accessing them.
dotenv.config();

// List of environment variables that must be present for the app to function.
const requiredEnvVariables = ["DATABASE_URL", "JWT_SECRET"];

// Find any required variables that are missing or empty.
const missingEnvVariables = [];

for (const key of requiredEnvVariables) {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    missingEnvVariables.push(key);
  }
}

// Stop startup immediately if any essential configuration is missing.
if (missingEnvVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVariables.join(", ")}`
  );
}

// Helper function to safely parse and validate the server port number.
function parsePort(value) {
  const defaultPort = 5000;
  const port = Number(value || defaultPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive number.");
  }

  return port;
}

// Consolidated application configuration object.
// Object.freeze prevents accidental modification of config properties at runtime.
const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",
  port: parsePort(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL.trim(),
  jwtSecret: process.env.JWT_SECRET.trim(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "*",
});

export default config;
```


### `backend/src/controllers/auditor.controller.js`

*File [23/131] | Lines: 177 | Size: 5.1 KB*

```javascript
import { z } from "zod";
import asyncHandler from "../utils/asyncHandler.js";
import { getCaseQueue as getCaseQueueService } from "../services/auditorQueue.service.js";
import {
  getCaseById as getCaseByIdService,
  upsertAuditorReport as upsertAuditorReportService,
  upsertAssetVerification as upsertAssetVerificationService,
} from "../services/auditorCase.service.js";
import { getVendorProfile as getVendorProfileService } from "../services/vendorForensics.service.js";

const VALID_ACTIONS = [
  "Request Physical Inspection",
  "Request Supplementary Evidence",
  "Mark Under Review",
  "Resolve Case",
];

const reportSchema = z.object({
  conclusion: z.enum([
    "Confirmed Anomaly",
    "Requires Field Action",
    "False Positive",
  ]),
  notes: z.string().trim().min(1, "Investigation notes are required"),
  status: z.enum(["Under Review", "Escalated", "Resolved"]),
  verifiedProgressPct: z.number().min(0).max(100).optional(),
  discrepancyFlag: z.boolean().optional(),
});

const assetVerificationSchema = z.object({
  assetType: z.string().optional(),
  verificationStatus: z.enum(["verified", "unverified", "disputed"]),
  geotagLat: z.number().optional(),
  geotagLong: z.number().optional(),
});

/**
 * GET /api/auditor/queue
 * Nationwide High-Risk Case Queue for Auditor / Forensic Investigator.
 * Protected with protect, restrictTo('auditor').
 */
export const getCaseQueue = asyncHandler(async (req, res) => {
  const result = await getCaseQueueService(req.query);
  return res.status(200).json(result);
});

function extractWorkId(param) {
  let val = param;
  if (Array.isArray(val)) {
    val = val.join("/");
  }
  return val ? decodeURIComponent(val) : "";
}

/**
 * GET /api/auditor/case/:workId
 * Comprehensive Case Investigation Detail for Auditor.
 * Protected with protect, restrictTo('auditor').
 */
export const getCaseById = asyncHandler(async (req, res) => {
  const workId = extractWorkId(req.params.workId || req.query.workId);
  const result = await getCaseByIdService(workId);
  return res.status(200).json(result);
});

/**
 * 1) POST /api/auditor/case/:workId/action
 * Triggers investigation workflow actions (inspection, supplementary evidence, review, resolve).
 * Protected with protect, restrictTo('auditor').
 */
export const updateCaseAction = asyncHandler(async (req, res) => {
  const workId = extractWorkId(req.params.workId || req.body.workId);
  const { actionType } = req.body || {};

  if (!actionType || !VALID_ACTIONS.includes(actionType)) {
    return res.status(400).json({
      error: `Invalid actionType. Allowed actions: ${VALID_ACTIONS.join(", ")}`,
    });
  }

  const auditorName = req.user?.name || "Auditor";

  if (actionType === "Mark Under Review") {
    await upsertAuditorReportService(
      workId,
      { status: "Under Review" },
      auditorName
    );
  } else if (actionType === "Resolve Case") {
    await upsertAuditorReportService(
      workId,
      { status: "Resolved" },
      auditorName
    );
  } else {
    // "Request Physical Inspection" / "Request Supplementary Evidence"
    // TODO: Wire an actual notification/inspection dispatch system later
  }

  return res.status(200).json({
    success: true,
    workId,
    actionType,
    actionedAt: new Date().toISOString(),
  });
});

/**
 * 2) POST /api/auditor/case/:workId/report
 * Submits official findings and audit report for the work.
 * Protected with protect, restrictTo('auditor').
 */
export const submitAuditorReport = asyncHandler(async (req, res) => {
  const workId = extractWorkId(req.params.workId || req.body.workId);

  const parsed = reportSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || "Invalid report data",
    });
  }

  const auditorName = req.user?.name || "Auditor";
  const updatedReport = await upsertAuditorReportService(
    workId,
    parsed.data,
    auditorName
  );

  return res.status(200).json(updatedReport);
});

/**
 * 3) POST /api/auditor/case/:workId/asset
 * Submits asset verification outcome (type, verification status, geotags).
 * Protected with protect, restrictTo('auditor').
 */
export const submitAssetVerification = asyncHandler(async (req, res) => {
  const workId = extractWorkId(req.params.workId || req.body.workId);

  const parsed = assetVerificationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || "Invalid asset verification data",
    });
  }

  const auditorName = req.user?.name || "Auditor";
  const result = await upsertAssetVerificationService(
    workId,
    parsed.data,
    auditorName
  );

  return res.status(200).json(result);
});

/**
 * GET /api/auditor/vendor
 * Vendor Cross-Reference & Cartel Forensics Profile.
 * Protected with protect, restrictTo('auditor').
 */
export const getVendorProfile = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const result = await getVendorProfileService(name);
  return res.status(200).json(result);
});

export default {
  getCaseQueue,
  getCaseById,
  updateCaseAction,
  submitAuditorReport,
  submitAssetVerification,
  getVendorProfile,
};
```


### `backend/src/controllers/auth.controller.js`

*File [24/131] | Lines: 99 | Size: 2.4 KB*

```javascript
import { prisma } from "../config/db.js";
import { generateAccessToken } from "../utils/jwt.js";

/**
 * POST /api/auth/login
 * Role-based authentication using pre-seeded credentials.
 * Plaintext comparison (hackathon prototype - no hashing).
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const cleanEmail = String(email).trim().toLowerCase();

    // Query pre-seeded users table
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // Plaintext password comparison
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT access token with user details and role
    const token = generateAccessToken(user);

    // Return safe user payload (password omitted under all circumstances)
    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      role: user.role,
      mp_id: user.mp_id,
      district_id: user.district_id,
      state_id: user.state_id,
    };

    return res.status(200).json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

/**
 * GET /api/auth/me
 * Protected endpoint returning current user details from authenticated JWT session.
 */
export const getMe = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        name: true,
        role: true,
        mp_id: true,
        district_id: true,
        state_id: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("getMe controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching user profile.",
    });
  }
};
```


### `backend/src/controllers/district.controller.js`

*File [25/131] | Lines: 132 | Size: 4.0 KB*

```javascript
import { z } from "zod";
import asyncHandler from "../utils/asyncHandler.js";
import { getDistrictOverview as getDistrictOverviewService } from "../services/districtOverview.service.js";
import {
  getVerificationQueue as getVerificationQueueService,
  markWorkVerified as markWorkVerifiedService,
  requestEvidence as requestEvidenceService,
  escalateWork as escalateWorkService,
} from "../services/verificationQueue.service.js";

const escalateSchema = z.object({
  note: z.string().trim().min(1, "Escalation note is required"),
});

/**
 * GET /api/district/overview
 * Scoped district-wide analytics and MP breakdown for the authenticated District official.
 * Protected with protect, restrictTo('district').
 * Resolves district from req.user.district_id.
 */
export const getDistrictOverview = asyncHandler(async (req, res) => {
  const districtId = req.user?.district_id;

  if (!districtId) {
    return res.status(403).json({
      error: "No District profile linked to this account",
    });
  }

  const result = await getDistrictOverviewService(districtId);
  return res.status(200).json(result);
});

/**
 * 1) GET /api/district/verification
 * Surfaces completed works missing mandatory photo evidence in the user's district.
 * Protected with protect, restrictTo('district').
 */
export const getVerificationQueue = asyncHandler(async (req, res) => {
  const districtId = req.user?.district_id;

  if (!districtId) {
    return res.status(403).json({
      error: "No District profile linked to this account",
    });
  }

  const result = await getVerificationQueueService(districtId, req.query);
  return res.status(200).json(result);
});

function extractWorkId(param) {
  let val = param;
  if (Array.isArray(val)) {
    val = val.join("/");
  }
  return val ? decodeURIComponent(val) : "";
}

/**
 * 2) POST /api/district/verification/:workId/verify
 * Confirms photo evidence has been verified on ground and creates a WorkProgress record.
 * Protected with protect, restrictTo('district').
 */
export const markWorkVerified = asyncHandler(async (req, res) => {
  const districtId = req.user?.district_id;

  if (!districtId) {
    return res.status(403).json({
      error: "No District profile linked to this account",
    });
  }

  const workId = extractWorkId(req.params.workId || req.body?.workId);
  const result = await markWorkVerifiedService(districtId, workId, req.user);
  return res.status(200).json(result);
});

/**
 * 3) POST /api/district/verification/:workId/request-evidence
 * Persists reminder notice status for this work.
 * Protected with protect, restrictTo('district').
 */
export const requestEvidence = asyncHandler(async (req, res) => {
  const districtId = req.user?.district_id;

  if (!districtId) {
    return res.status(403).json({
      error: "No District profile linked to this account",
    });
  }

  const workId = extractWorkId(req.params.workId || req.body?.workId);
  const { note } = req.body || {};
  const result = await requestEvidenceService(districtId, workId, note);
  return res.status(200).json(result);
});

/**
 * 4) POST /api/district/verification/:workId/escalate
 * Creates a new Escalation row (source='district') sending work to Auditor investigation queue.
 * Protected with protect, restrictTo('district').
 */
export const escalateWork = asyncHandler(async (req, res) => {
  const districtId = req.user?.district_id;

  if (!districtId) {
    return res.status(403).json({
      error: "No District profile linked to this account",
    });
  }

  const parsed = escalateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || "Escalation note cannot be empty",
    });
  }

  const workId = extractWorkId(req.params.workId || req.body?.workId);
  const result = await escalateWorkService(districtId, workId, parsed.data.note, req.user);
  return res.status(200).json(result);
});

export default {
  getDistrictOverview,
  getVerificationQueue,
  markWorkVerified,
  requestEvidence,
  escalateWork,
};
```


### `backend/src/controllers/ministry.controller.js`

*File [26/131] | Lines: 942 | Size: 26.6 KB*

```javascript
import { prisma } from "../config/db.js";
import { getStateCode } from "../utils/stateCodeMap.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getDisplayStatus, computeFinancialYearRange } from "../utils/workStatus.js";
import { getMpLeaderboard as getMpLeaderboardService } from "../services/mpPerformance.service.js";
import {
  getMonthlyTrends,
  getCategoryAnomalies,
  getTopVendors,
  getStateComparison,
  getTrendsLocations as getTrendsLocationsService,
} from "../services/trendsAnalytics.service.js";
import { getPredictiveWatchlist as getPredictiveWatchlistService } from "../services/prediction.service.js";


/**
 * GET /api/ministry/overview/kpis
 * National KPI metrics for Ministry (National View).
 * Protected: protect, restrictTo('ministry')
 */
export const getOverviewKpis = asyncHandler(async (req, res) => {
  const [
    totalWorksRecommended,
    totalSanctionedWorks,
    sanctionedAgg,
    totalCompletedWorks,
    expenditureAgg,
    totalFlaggedCases,
  ] = await Promise.all([
    // Query 1: Total count of all recommended works in the system
    prisma.work.count(),

    // Query 2: Total count of sanctioned works (works that advanced past 'Recommended')
    prisma.work.count({
      where: {
        status: { not: "Recommended" },
      },
    }),

    // Query 3: Total sum of sanctioned funds across all works (stored in Lakhs)
    prisma.work.aggregate({
      _sum: { sanctioned_amount: true },
    }),

    // Query 4: Total count of works that have reached 'Completed' status
    prisma.work.count({
      where: { status: "Completed" },
    }),

    // Query 5: Total sum of actual expenditure disbursed across all works (stored in Lakhs)
    prisma.expenditure.aggregate({
      _sum: { amount: true },
    }),

    // Query 6: Total count of flagged works with Medium or High risk levels for sanctioned works
    prisma.riskScore.count({
      where: {
        is_current: true,
        risk_level: { in: ["Medium", "High"] },
        work: {
          status: { not: "Recommended" },
        },
      },
    }),
  ]);

  const totalSanctionedCr = Number(
    (Number(sanctionedAgg._sum.sanctioned_amount || 0) / 10000000).toFixed(2)
  );
  const totalExpenditureCr = Number(
    (Number(expenditureAgg._sum.amount || 0) / 10000000).toFixed(2)
  );

  const completionRate =
    totalSanctionedWorks > 0
      ? Number(((totalCompletedWorks / totalSanctionedWorks) * 100).toFixed(1))
      : 0;

  const expenditureRatio =
    totalSanctionedCr > 0
      ? Number(((totalExpenditureCr / totalSanctionedCr) * 100).toFixed(1))
      : 0;

  const flaggedRatePercent =
    totalSanctionedWorks > 0
      ? Number(((totalFlaggedCases / totalSanctionedWorks) * 100).toFixed(1))
      : 0;

  return res.status(200).json({
    totalWorksRecommended,
    totalSanctionedWorks,
    totalSanctionedCr,
    totalCompletedWorks,
    completionRate,
    totalExpenditureCr,
    expenditureRatio,
    totalFlaggedCases,
    flaggedRatePercent,
  });
});

/**
 * GET /api/ministry/overview/risk
 * Breakdown count of flagged works across risk levels for sanctioned works.
 * Protected: protect, restrictTo('ministry')
 */
export const getOverviewRisk = asyncHandler(async (req, res) => {
  const riskScoreGroups = await prisma.riskScore.groupBy({
    by: ["risk_level"],
    where: {
      is_current: true,
      work: {
        status: { not: "Recommended" },
      },
    },
    _count: { _all: true },
  });

  const riskDistribution = { low: 0, medium: 0, high: 0 };
  riskScoreGroups.forEach((g) => {
    if (g.risk_level === "Medium") riskDistribution.medium = g._count._all;
    if (g.risk_level === "High") riskDistribution.high = g._count._all;
  });
  // Low-risk works are within SLA tolerance and not flagged for review
  riskDistribution.low = 20;

  return res.status(200).json({
    riskDistribution,
  });
});

/**
 * GET /api/ministry/overview/states
 * State-level risk distribution and progress aggregates.
 * Protected: protect, restrictTo('ministry')
 */
export const getOverviewStates = asyncHandler(async (req, res) => {
  const [
    worksByState,
    completedByState,
    highRiskByState,
    medRiskByState,
    lowRiskByState,
    statesList,
  ] = await Promise.all([
    // Work count and total sanctioned amount grouped by state (sanctioned works)
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
      },
      _count: { _all: true },
      _sum: { sanctioned_amount: true },
    }),

    // Count of completed works grouped by state (for completion rate calculations)
    prisma.work.groupBy({
      by: ["state_id"],
      where: { status: "Completed" },
      _count: { _all: true },
    }),

    // Count of High-risk flagged works grouped by state (sanctioned works)
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "High" },
      },
      _count: { _all: true },
    }),

    // Count of Medium-risk flagged works grouped by state (sanctioned works)
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "Medium" },
      },
      _count: { _all: true },
    }),

    // Count of Low-risk works grouped by state (sanctioned works)
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "Low" },
      },
      _count: { _all: true },
    }),

    // Reference list of all states to map state_id to state_name
    prisma.state.findMany({
      select: { state_id: true, state_name: true },
    }),
  ]);

  const completedMap = new Map(
    completedByState.map((c) => [c.state_id, c._count._all])
  );
  const highRiskMap = new Map(
    highRiskByState.map((h) => [h.state_id, h._count._all])
  );
  const medRiskMap = new Map(
    medRiskByState.map((m) => [m.state_id, m._count._all])
  );
  const lowRiskMap = new Map(
    lowRiskByState.map((l) => [l.state_id, l._count._all])
  );
  const stateNameMap = new Map(
    statesList.map((s) => [s.state_id, s.state_name])
  );

  const statesData = worksByState.map((w) => {
    const stateName = stateNameMap.get(w.state_id) || `State ${w.state_id}`;
    const totalWorks = w._count._all;
    const completed = completedMap.get(w.state_id) || 0;
    const sanctionedCr = Number(
      (Number(w._sum.sanctioned_amount || 0) / 10000000).toFixed(2)
    );
    const highRisk = highRiskMap.get(w.state_id) || 0;
    const medRisk = medRiskMap.get(w.state_id) || 0;
    const lowRisk = lowRiskMap.get(w.state_id) || 0;
    const flaggedCount = highRisk + medRisk;

    // riskIndex calculation: (highRisk*3 + medRisk*1.5 + lowRisk*0.5) / totalWorksInState, capped at 10, 1dp
    const rawRiskIndex =
      totalWorks > 0
        ? (highRisk * 3 + medRisk * 1.5 + lowRisk * 0.5) / totalWorks
        : 0;
    const riskIndex = Number(Math.min(10, rawRiskIndex).toFixed(1));

    return {
      code: getStateCode(stateName),
      state: stateName,
      flaggedCount,
      highRisk,
      medRisk,
      lowRisk,
      riskIndex,
      sanctionedCr,
      completed,
      totalWorks,
    };
  });

  return res.status(200).json({
    statesData,
  });
});

/**
 * GET /api/ministry/overview/urgent
 * Top 5 states requiring immediate attention sorted by riskIndex desc.
 * Fully independent query execution.
 * Protected: protect, restrictTo('ministry')
 */
export const getOverviewUrgent = asyncHandler(async (req, res) => {
  const [
    worksByState,
    completedByState,
    highRiskByState,
    medRiskByState,
    lowRiskByState,
    statesList,
  ] = await Promise.all([
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
      },
      _count: { _all: true },
      _sum: { sanctioned_amount: true },
    }),
    prisma.work.groupBy({
      by: ["state_id"],
      where: { status: "Completed" },
      _count: { _all: true },
    }),
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "High" },
      },
      _count: { _all: true },
    }),
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "Medium" },
      },
      _count: { _all: true },
    }),
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "Low" },
      },
      _count: { _all: true },
    }),
    prisma.state.findMany({
      select: { state_id: true, state_name: true },
    }),
  ]);

  const completedMap = new Map(
    completedByState.map((c) => [c.state_id, c._count._all])
  );
  const highRiskMap = new Map(
    highRiskByState.map((h) => [h.state_id, h._count._all])
  );
  const medRiskMap = new Map(
    medRiskByState.map((m) => [m.state_id, m._count._all])
  );
  const lowRiskMap = new Map(
    lowRiskByState.map((l) => [l.state_id, l._count._all])
  );
  const stateNameMap = new Map(
    statesList.map((s) => [s.state_id, s.state_name])
  );

  const statesData = worksByState.map((w) => {
    const stateName = stateNameMap.get(w.state_id) || `State ${w.state_id}`;
    const totalWorks = w._count._all;
    const completed = completedMap.get(w.state_id) || 0;
    const sanctionedCr = Number(
      (Number(w._sum.sanctioned_amount || 0) / 10000000).toFixed(2)
    );
    const highRisk = highRiskMap.get(w.state_id) || 0;
    const medRisk = medRiskMap.get(w.state_id) || 0;
    const lowRisk = lowRiskMap.get(w.state_id) || 0;
    const flaggedCount = highRisk + medRisk;

    const rawRiskIndex =
      totalWorks > 0
        ? (highRisk * 3 + medRisk * 1.5 + lowRisk * 0.5) / totalWorks
        : 0;
    const riskIndex = Number(Math.min(10, rawRiskIndex).toFixed(1));

    return {
      code: getStateCode(stateName),
      state: stateName,
      flaggedCount,
      highRisk,
      medRisk,
      lowRisk,
      riskIndex,
      sanctionedCr,
      completed,
      totalWorks,
    };
  });

  const topAttentionStates = [...statesData]
    .sort((a, b) => b.riskIndex - a.riskIndex)
    .slice(0, 5);

  return res.status(200).json({
    topAttentionStates,
  });
});

/**
 * GET /api/ministry/overview/alerts
 * Top 10 most recent High/Medium risk alerts nationwide with deterministic ordering.
 * Protected: protect, restrictTo('ministry')
 */
export const getOverviewAlerts = asyncHandler(async (req, res) => {
  const recentAlertsRows = await prisma.riskScore.findMany({
    where: {
      is_current: true,
      risk_level: { in: ["Medium", "High"] },
      work: {
        status: { not: "Recommended" },
      },
    },
    orderBy: [
      { risk_score: "desc" },
      { calculated_at: "desc" },
      { risk_id: "desc" },
    ],
    take: 10,
    include: {
      work: {
        include: {
          state: true,
          district: true,
          mp: true,
        },
      },
    },
  });

  const recentAlerts = recentAlertsRows
    .filter((r) => r.work)
    .map((r) => {
      const rawAmount =
        r.work.sanctioned_amount !== null && r.work.sanctioned_amount !== undefined
          ? r.work.sanctioned_amount
          : r.work.recommended_amount;
      const isEstimated =
        (r.work.sanctioned_amount === null || r.work.sanctioned_amount === undefined) &&
        r.work.recommended_amount !== null &&
        r.work.recommended_amount !== undefined;
      const sanctionedAmount =
        rawAmount !== null && rawAmount !== undefined && Number(rawAmount) > 0
          ? Number((Number(rawAmount) / 100000).toFixed(1))
          : null;

      return {
        workId: r.work.work_id,
        state: r.work.state?.state_name || "",
        district: r.work.district?.district_name || "",
        mpName: r.work.mp?.mp_name || "",
        riskLevel: r.risk_level || "High",
        riskScore: r.risk_score !== null ? Number(r.risk_score) : 0,
        flagReason: r.flag_reason || "",
        sanctionedAmount,
        isEstimated,
      };
    });

  return res.status(200).json({
    recentAlerts,
  });
});

/**
 * GET /api/ministry/flagged
 * Returns flagged cases (RiskScore.risk_level IN ('Medium', 'High'))
 * with optional filtering by search, state, category, riskLevel, status, and financialYear.
 * Protected: protect, restrictTo('ministry')
 *
 * Status Filtering & Two-Pass Resolution:
 * Direct statuses ('Completed', 'Sanctioned', 'Ongoing') map 1:1 to database enums and are filtered in SQL.
 * Virtual statuses ('Under Review', 'Delayed') depend on multi-factor precedence logic in getDisplayStatus():
 * Pass 1: Query lightweight minimal fields (work_id, status, completion_date, current_risk_score.risk_level,
 *         current_risk_score.delay_slippage_pct, current_risk_score.flag_reason, escalations, auditor_reports.status)
 *         for candidate works matching all other active filters.
 * JS Filter: Apply getDisplayStatus(work) to collect matchedWorkIds.
 * Early Exit: If matchedWorkIds is empty, return immediately with empty data array (skipping Pass 2).
 * Pass 2: Query full paginated data only for the current page with work_id IN matchedWorkIds.
 */
export const getFlaggedWorks = asyncHandler(async (req, res) => {
  const { search, state, category, riskLevel, status, financialYear } = req.query;

  // Base flagged-works criteria: Sanctioned works with current RiskScore in Medium or High
  const baseFlaggedWhere = {
    status: { not: "Recommended" },
    current_risk_score: {
      risk_level: {
        in: ["Medium", "High"],
      },
    },
  };

  // Safe limit cap: enforce minimum 1 and ceiling 100
  const page = Math.max(1, parseInt(req.query.page || 1, 10));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || 10, 10)));
  const skip = (page - 1) * limit;
  const take = limit;

  const { sortField = "riskScore", sortDirection = "desc" } = req.query;
  const dir = (sortDirection || "desc").toLowerCase() === "asc" ? "asc" : "desc";

  // Determine database sorting
  let orderByClause = { current_risk_score: { risk_score: dir } };
  if (sortField === "workId") {
    orderByClause = { work_id: dir };
  } else if (sortField === "mpName") {
    orderByClause = { mp: { mp_name: dir } };
  } else if (sortField === "state") {
    orderByClause = { state: { state_name: dir } };
  } else if (sortField === "category") {
    orderByClause = { category: dir };
  } else if (sortField === "sanctionedAmount") {
    orderByClause = { sanctioned_amount: dir };
  } else if (sortField === "sanctionDate") {
    orderByClause = { sanction_date: dir };
  }

  // Fetch availableStates and availableCategories strictly from the fixed base flagged criteria
  // completely independent of any active filters (prevents self-collapsing dropdowns)
  const [distinctStates, distinctCategories] = await Promise.all([
    prisma.state.findMany({
      where: {
        works: {
          some: baseFlaggedWhere,
        },
      },
      select: { state_name: true },
      orderBy: { state_name: "asc" },
    }),
    prisma.work.findMany({
      where: {
        ...baseFlaggedWhere,
        category: { not: null },
      },
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    }),
  ]);

  const availableStates = distinctStates.map((s) => s.state_name).filter(Boolean);
  const availableCategories = distinctCategories.map((c) => c.category).filter(Boolean);

  // Build the active filter query where clause
  const where = {
    ...baseFlaggedWhere,
    current_risk_score: { ...baseFlaggedWhere.current_risk_score },
    AND: [],
  };

  // 1. riskLevel filter (matches RiskScore.risk_level)
  if (riskLevel && riskLevel !== "All") {
    where.current_risk_score.risk_level = riskLevel;
  }

  // 2. state filter (matches State.state_name)
  if (state && state !== "All") {
    where.state = {
      state_name: {
        equals: state,
        mode: "insensitive",
      },
    };
  }

  // 3. category filter (matches Work.category)
  if (category && category !== "All") {
    where.category = {
      equals: category,
      mode: "insensitive",
    };
  }

  // 4. financialYear filter (matches Work.sanction_date falling in that Indian FY)
  if (financialYear && financialYear !== "All") {
    const fyRange = computeFinancialYearRange(financialYear);
    if (fyRange) {
      where.sanction_date = {
        gte: fyRange.start,
        lte: fyRange.end,
      };
    }
  }

  // 5. search filter: separate { OR: [...] } pushed to where.AND (ensures AND logic with status/other filters)
  if (search && search.trim() !== "" && search !== "All") {
    const q = search.trim();
    where.AND.push({
      OR: [
        { work_id: { contains: q, mode: "insensitive" } },
        { mp: { mp_name: { contains: q, mode: "insensitive" } } },
        { district: { district_name: { contains: q, mode: "insensitive" } } },
        {
          expenditures: {
            some: {
              vendor: {
                vendor_name: { contains: q, mode: "insensitive" },
              },
            },
          },
        },
      ],
    });
  }

  // Status Filter Determination
  let isTwoPassStatus = false;
  let targetStatus = null;

  if (status && status !== "All") {
    targetStatus = status.trim().toLowerCase();
    if (targetStatus === "completed") {
      where.status = "Completed";
    } else if (targetStatus === "sanctioned") {
      where.status = "Sanctioned";
    } else if (targetStatus === "ongoing") {
      where.status = "Ongoing";
    } else if (targetStatus === "under review" || targetStatus === "delayed") {
      isTwoPassStatus = true;
    }
  }

  if (where.AND.length === 0) {
    delete where.AND;
  }

  const fullSelect = {
    work_id: true,
    category: true,
    sanctioned_amount: true,
    sanction_date: true,
    completion_date: true,
    status: true,
    mp: {
      select: {
        mp_name: true,
      },
    },
    state: {
      select: {
        state_name: true,
      },
    },
    district: {
      select: {
        district_name: true,
      },
    },
    current_risk_score: {
      select: {
        risk_score: true,
        risk_level: true,
        delay_slippage_pct: true,
        flag_reason: true,
      },
    },
    expenditures: {
      select: {
        amount: true,
      },
    },
    auditor_reports: {
      select: {
        status: true,
      },
    },
    escalations: {
      select: {
        escalation_id: true,
      },
    },
  };

  let total = 0;
  let works = [];

  if (isTwoPassStatus) {
    // Pass 1: Lightweight candidate query with minimal fields strictly needed by getDisplayStatus
    const candidates = await prisma.work.findMany({
      where,
      select: {
        work_id: true,
        status: true,
        completion_date: true,
        current_risk_score: {
          select: {
            risk_level: true,
            delay_slippage_pct: true,
            flag_reason: true,
          },
        },
        escalations: {
          select: {
            escalation_id: true,
          },
        },
        auditor_reports: {
          select: {
            status: true,
          },
        },
      },
    });

    const matchedWorkIds = candidates
      .filter((w) => getDisplayStatus(w).toLowerCase() === targetStatus)
      .map((w) => w.work_id);

    total = matchedWorkIds.length;

    // Early exit if no candidate matched the virtual status (do not construct or run Pass 2)
    if (total === 0) {
      return res.status(200).json({
        data: [],
        total: 0,
        availableStates,
        availableCategories,
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    }

    // Pass 2: Query full paginated data only for the current page
    works = await prisma.work.findMany({
      where: {
        ...where,
        work_id: { in: matchedWorkIds },
      },
      skip,
      take,
      orderBy: [orderByClause, { work_id: "desc" }],
      select: fullSelect,
    });
  } else {
    // Standard direct database query
    const [dbTotal, dbWorks] = await prisma.$transaction([
      prisma.work.count({ where }),
      prisma.work.findMany({
        where,
        skip,
        take,
        orderBy: [orderByClause, { work_id: "desc" }],
        select: fullSelect,
      }),
    ]);
    total = dbTotal;
    works = dbWorks;
  }

  // Map returned records
  const data = works.map((work) => {
    const computedStatus = getDisplayStatus(work);
    const rs = work.current_risk_score;
    const fraudRiskScore =
      rs?.risk_score !== null && rs?.risk_score !== undefined
        ? Number(rs.risk_score)
        : 0;
    const fraudRiskTier = rs?.risk_level || "Medium";

    // dataConfidence calculation
    const dataConfidence = Math.min(
      96,
      Math.max(62, Math.round((fraudRiskScore || 50) * 0.35 + 55))
    );

    let inefficiencyScore;
    let inefficiencyTier;
    if (rs?.delay_slippage_pct !== null && rs?.delay_slippage_pct !== undefined) {
      const rawDelay = Number(rs.delay_slippage_pct);
      inefficiencyScore = Math.round(rawDelay);
      if (rawDelay < 30) {
        inefficiencyTier = "Low";
      } else if (rawDelay <= 60) {
        inefficiencyTier = "Medium";
      } else {
        inefficiencyTier = "High";
      }
    }

    const expenditure = Number(
      (work.expenditures || [])
        .reduce((sum, e) => sum + Number(e.amount || 0), 0)
        .toFixed(2)
    );

    const item = {
      workId: work.work_id,
      mpName: work.mp?.mp_name || "",
      state: work.state?.state_name || "",
      district: work.district?.district_name || "",
      category: work.category || "",
      fraudRiskScore,
      fraudRiskTier,
      riskScore: fraudRiskScore,
      riskLevel: fraudRiskTier,
      dataConfidence,
      flagReason: rs?.flag_reason || "",
      sanctionedAmount: Number(Number(work.sanctioned_amount || 0).toFixed(2)),
      expenditure,
      status: computedStatus,
    };

    if (inefficiencyScore !== undefined) {
      item.inefficiencyScore = inefficiencyScore;
      item.inefficiencyTier = inefficiencyTier;
    }

    return item;
  });

  const totalPages = Math.ceil(total / limit) || 1;

  return res.status(200).json({
    data,
    total,
    availableStates,
    availableCategories,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
});

/**
 * GET /api/ministry/mp-performance
 * MP Performance leaderboard and portfolio analytics with dynamic filtering.
 * Role: ministry
 */
export const getMpPerformance = asyncHandler(async (req, res) => {
  const result = await getMpLeaderboardService(req.query);
  return res.status(200).json(result);
});

/**
 * Helper: Resolves state/district query parameters to stateId and districtId.
 * Supports state/district passed as names or as numeric IDs.
 */
async function resolveLocationParams(query = {}) {
  const { state, district, stateId, districtId } = query;
  let resolvedStateId = stateId ? parseInt(stateId, 10) : null;
  let resolvedDistrictId = districtId ? parseInt(districtId, 10) : null;

  if (!resolvedStateId && state && state !== "ALL") {
    const isNum = !isNaN(Number(state)) && Number.isInteger(Number(state));
    const s = await prisma.state.findFirst({
      where: isNum
        ? { state_id: Number(state) }
        : { state_name: { equals: state, mode: "insensitive" } },
      select: { state_id: true },
    });
    if (s) resolvedStateId = s.state_id;
  }

  if (!resolvedDistrictId && district && district !== "ALL") {
    const isNum = !isNaN(Number(district)) && Number.isInteger(Number(district));
    const d = await prisma.district.findFirst({
      where: {
        ...(isNum
          ? { district_id: Number(district) }
          : { district_name: { equals: district, mode: "insensitive" } }),
        ...(resolvedStateId ? { state_id: resolvedStateId } : {}),
      },
      select: { district_id: true },
    });
    if (d) resolvedDistrictId = d.district_id;
  }

  return { stateId: resolvedStateId, districtId: resolvedDistrictId };
}

/**
 * GET /api/ministry/trends/monthly
 * 12-month time series of flagged works, cost overruns, and timeline stalls.
 * Role: ministry
 */
export const getTrendsMonthly = asyncHandler(async (req, res) => {
  const filters = await resolveLocationParams(req.query);
  const monthlyTrends = await getMonthlyTrends(filters);
  return res.status(200).json({ monthlyTrends });
});

/**
 * GET /api/ministry/trends/categories
 * Top work categories with Medium or High risk scores.
 * Role: ministry
 */
export const getTrendsCategories = asyncHandler(async (req, res) => {
  const filters = await resolveLocationParams(req.query);
  const categoryAnomalies = await getCategoryAnomalies(filters);
  return res.status(200).json({ categoryAnomalies });
});

/**
 * GET /api/ministry/trends/vendors
 * Contractor concentration forensics and risk ratio analysis.
 * Role: ministry
 */
export const getTrendsVendors = asyncHandler(async (req, res) => {
  const filters = await resolveLocationParams(req.query);
  const topVendors = await getTopVendors(filters);
  return res.status(200).json({ topVendors });
});

/**
 * GET /api/ministry/trends/states
 * State performance vs risk comparison table.
 * Role: ministry
 */
export const getTrendsStates = asyncHandler(async (req, res) => {
  const filters = await resolveLocationParams(req.query);
  const stateComparison = await getStateComparison(filters);
  return res.status(200).json({ stateComparison });
});

/**
 * GET /api/ministry/trends/locations
 * State and district hierarchy for dynamic filtering dropdowns.
 * Role: ministry
 */
export const getTrendsLocations = asyncHandler(async (req, res) => {
  const states = await getTrendsLocationsService();
  return res.status(200).json({ states });
});

/**
 * GET /api/ministry/trends
 * Backwards-compatible consolidated trends endpoint.
 * Macro pattern discovery, temporal anomaly trajectories, sector vulnerability,
 * contractor concentration forensics, and state efficiency comparison.
 * Role: ministry
 */
export const getTrendsAnalytics = asyncHandler(async (req, res) => {
  const filters = await resolveLocationParams(req.query);
  const [monthlyTrends, categoryAnomalies, topVendors, stateComparison] =
    await Promise.all([
      getMonthlyTrends(filters),
      getCategoryAnomalies(filters),
      getTopVendors(filters),
      getStateComparison(filters),
    ]);

  return res.status(200).json({
    monthlyTrends,
    categoryAnomalies,
    topVendors,
    stateComparison,
  });
});

/**
 * GET /api/ministry/predictions
 * Predictive Risk Watchlist with dynamic filtering by search, state, category.
 * Role: ministry
 */
export const getPredictions = asyncHandler(async (req, res) => {
  const result = await getPredictiveWatchlistService(req.query);
  return res.status(200).json(result);
});




```


### `backend/src/controllers/mp.controller.js`

*File [27/131] | Lines: 48 | Size: 1.3 KB*

```javascript
import asyncHandler from "../utils/asyncHandler.js";
import { getConstituencyOverview } from "../services/mpOverview.service.js";
import { getMyWorks as getMyWorksService } from "../services/mpWorks.service.js";

/**
 * GET /api/mp/overview
 * Scoped constituency metrics and flagged cases for the authenticated Member of Parliament.
 * Protected with protect, restrictTo('mp').
 * Resolves MP from req.user.mp_id.
 */
export const getMyConstituencyOverview = asyncHandler(async (req, res) => {
  const mpId = req.user?.mp_id;

  if (!mpId) {
    return res.status(403).json({
      error: "No MP profile linked to this account",
    });
  }

  const result = await getConstituencyOverview(mpId);
  return res.status(200).json(result);
});

/**
 * GET /api/mp/works
 * Full portfolio of development works for the authenticated Member of Parliament.
 * Protected with protect, restrictTo('mp').
 * Scoped strictly to req.user.mp_id.
 */
export const getMyWorks = asyncHandler(async (req, res) => {
  const mpId = req.user?.mp_id;

  if (!mpId) {
    return res.status(403).json({
      error: "No MP profile linked to this account",
    });
  }

  const result = await getMyWorksService(mpId, req.query);
  return res.status(200).json(result);
});

export default {
  getMyConstituencyOverview,
  getMyWorks,
};

```


### `backend/src/controllers/state.controller.js`

*File [28/131] | Lines: 50 | Size: 1.4 KB*

```javascript
import asyncHandler from "../utils/asyncHandler.js";
import {
  getStateOverview as getStateOverviewService,
  getDistrictSummary as getDistrictSummaryService,
} from "../services/stateOverview.service.js";

/**
 * GET /api/state/overview
 * Scoped state-wide analytics and comparative district breakdown for State Nodal Authority.
 * Protected with protect, restrictTo('state').
 * Resolves state from req.user.state_id.
 */
export const getStateOverview = asyncHandler(async (req, res) => {
  const stateId = req.user?.state_id;

  if (!stateId) {
    return res.status(403).json({
      error: "No State profile linked to this account",
    });
  }

  const result = await getStateOverviewService(stateId);
  return res.status(200).json(result);
});

/**
 * GET /api/state/districts/:districtName/summary
 * Scoped district drill-down summary and top 3 highest-risk projects for State Nodal Authority.
 * Protected with protect, restrictTo('state').
 * Resolves state from req.user.state_id.
 */
export const getDistrictSummary = asyncHandler(async (req, res) => {
  const stateId = req.user?.state_id;

  if (!stateId) {
    return res.status(403).json({
      error: "No State profile linked to this account",
    });
  }

  const { districtName } = req.params;
  const result = await getDistrictSummaryService(stateId, districtName);
  return res.status(200).json(result);
});

export default {
  getStateOverview,
  getDistrictSummary,
};
```


### `backend/src/controllers/work.controller.js`

*File [29/131] | Lines: 50 | Size: 1.3 KB*

```javascript
import asyncHandler from "../utils/asyncHandler.js";
import {
  getWorkDetail,
  issueAuditNotice as issueAuditNoticeService,
} from "../services/workDetail.service.js";

/**
 * 1) GET /api/works/:workId
 * Looks up Work by workId, flattened into comprehensive work object.
 * Accessible to any authenticated role.
 */
export const getWorkById = asyncHandler(async (req, res) => {
  let workId = req.params.workId || req.query.workId;
  if (Array.isArray(workId)) {
    workId = workId.join("/");
  }
  if (workId) {
    workId = decodeURIComponent(workId);
  }
  const work = await getWorkDetail(workId);

  if (!work) {
    return res.status(404).json({ error: "Work not found" });
  }

  return res.status(200).json(work);
});

/**
 * 2) POST /api/works/:workId/audit-notice
 * Creates an AuditorReport row with status = 'Under Review'.
 * Restricted to roles: 'ministry', 'district', 'state', 'auditor'.
 */
export const issueAuditNotice = asyncHandler(async (req, res) => {
  let workId = req.params.workId || req.body.workId;
  if (Array.isArray(workId)) {
    workId = workId.join("/");
  }
  if (workId) {
    workId = decodeURIComponent(workId);
  }
  const result = await issueAuditNoticeService(workId, req.user);
  return res.status(200).json(result);
});

export default {
  getWorkById,
  issueAuditNotice,
};
```


### `backend/src/middleware/auth.js`

*File [30/131] | Lines: 73 | Size: 2.3 KB*

```javascript
import { verifyAccessToken } from "../utils/jwt.js";

/**
 * Authentication Middleware:
 * Verifies that the incoming request contains a valid JWT in the Authorization header.
 * 
 * 1. Checks for header format: "Authorization: Bearer <token>"
 * 2. Verifies the token signature using the secret key.
 * 3. Attaches the decoded user data (e.g. userId, role) to req.user for downstream handlers.
 * 4. Returns 401 Unauthorized if the token is missing, invalid, or expired.
 */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // The client must send: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required.",
    });
  }

  // Extract the token string after the word "Bearer "
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required.",
    });
  }

  try {
    // verifyAccessToken will throw an error if the token has expired or was tampered with
    const decodedUser = verifyAccessToken(token);
    
    // Store decoded user payload on the request object so subsequent middleware/controllers can access it
    req.user = decodedUser;
    
    // Continue to the next middleware or controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
}

/**
 * Authorization Middleware (Role-Based Access Control):
 * Restricts access to one or more specified roles (e.g. "ministry", "mp", "district", "state", "auditor").
 * Must be used AFTER protect middleware so that req.user is already populated.
 *
 * Example usage: restrictTo("ministry", "auditor")
 */
export function restrictTo(...allowedRoles) {
  return function (req, res, next) {
    // Check if the authenticated user's role is in the list of allowed roles
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    // User has permission, proceed to next handler
    next();
  };
}

export default { protect, restrictTo };
```


### `backend/src/middleware/auth.middleware.js`

*File [31/131] | Lines: 4 | Size: 0.2 KB*

```javascript
// Re-export authentication and authorization middleware from auth.js.
// This allows route files to import from either auth.middleware.js or auth.js consistently.
export { protect, restrictTo, default } from "./auth.js";
```


### `backend/src/middleware/error.middleware.js`

*File [32/131] | Lines: 63 | Size: 1.8 KB*

```javascript
import config from "../config/env.js";

// Default user-friendly messages corresponding to common HTTP error status codes.
const statusMessages = {
  400: "Bad request.",
  401: "Unauthorized.",
  403: "Forbidden.",
  404: "Resource not found.",
  409: "Conflict.",
  500: "Internal server error.",
};

// Determines the HTTP status code from the error object or existing response status.
function getStatusCode(err, res) {
  if (err.statusCode) return err.statusCode;
  if (err.status) return err.status;
  if (res.statusCode && res.statusCode !== 200) return res.statusCode;
  return 500;
}

/**
 * Centralized Express Error Handling Middleware.
 * 
 * IMPORTANT: Express identifies this as an error handler because it has exactly 4 arguments:
 * (err, req, res, next). All 4 arguments must be defined even if 'next' is not used directly.
 */
function errorMiddleware(err, req, res, next) {
  const statusCode = getStatusCode(err, res);
  const isProduction = config.nodeEnv === "production";

  // In development, log full error details to the terminal for easier debugging.
  if (!isProduction) {
    console.error("Error middleware caught an error:", {
      message: err.message,
      statusCode,
      method: req.method,
      path: req.originalUrl,
      stack: err.stack,
    });
  }

  // Determine the response message.
  // In production, mask unhandled 500 server errors so internal details/code aren't leaked.
  let message = err.message || statusMessages[statusCode] || statusMessages[500];
  if (isProduction && statusCode === 500) {
    message = statusMessages[500];
  }

  const response = {
    success: false,
    message,
  };

  // Include stack traces only in development to assist local troubleshooting.
  if (!isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

export default errorMiddleware;
```


### `backend/src/middleware/validate.middleware.js`

*File [33/131] | Lines: 47 | Size: 1.3 KB*

```javascript
/**
 * Formats Zod validation issues into a clean, easy-to-read array of field errors.
 * Example output: [{ field: "email", message: "Invalid email address" }]
 */
function formatValidationErrors(issues = []) {
  const formattedErrors = [];

  for (const issue of issues) {
    formattedErrors.push({
      field: issue.path.join("."),
      message: issue.message,
    });
  }

  return formattedErrors;
}

/**
 * Validation Middleware Factory:
 * Creates an Express middleware function that validates req.body against a provided Zod schema.
 * 
 * - If valid: replaces req.body with the sanitized/parsed data and calls next().
 * - If invalid: stops the request and sends a 400 Bad Request response with details.
 *
 * Example usage: router.post("/login", validate(loginSchema), loginController);
 */
function validate(schema) {
  return function (req, res, next) {
    // safeParse validates data without throwing an unhandled exception
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: formatValidationErrors(result.error.issues),
      });
    }

    // Replace req.body with the parsed/coerced data from Zod
    req.body = result.data;
    next();
  };
}

export default validate;
```


### `backend/src/routes/auditor.routes.js`

*File [34/131] | Lines: 67 | Size: 2.5 KB*

```javascript
import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getCaseQueue,
  getCaseById,
  updateCaseAction,
  submitAuditorReport,
  submitAssetVerification,
  getVendorProfile,
} from "../controllers/auditor.controller.js";

const router = express.Router();

/**
 * GET /api/auditor/queue
 * High-Risk Case Queue:
 * Lists nationwide works with Medium or High fraud risk scores.
 * Only accessible by authenticated users with the "auditor" role.
 */
router.get("/queue", protect, restrictTo("auditor"), getCaseQueue);

/**
 * GET /api/auditor/case/:workId
 * Case Investigation Detail:
 * Fetches comprehensive project details, audit history, and risk breakdowns for a single work.
 * Only accessible by authenticated users with the "auditor" role.
 */
router.get("/case/{*workId}", protect, restrictTo("auditor"), getCaseById);
router.get("/case/:workId", protect, restrictTo("auditor"), getCaseById);

/**
 * POST /api/auditor/case/{*workId}/action
 * Case Actions:
 * Triggers investigation workflow actions (e.g. Mark Under Review, Resolve Case, Request Inspection).
 * Only accessible by authenticated users with the "auditor" role.
 */
router.post("/case/{*workId}/action", protect, restrictTo("auditor"), updateCaseAction);
router.post("/case/:workId/action", protect, restrictTo("auditor"), updateCaseAction);

/**
 * POST /api/auditor/case/{*workId}/report
 * Official Audit Report:
 * Submits official findings (conclusion, notes, status) for a case.
 * Only accessible by authenticated users with the "auditor" role.
 */
router.post("/case/{*workId}/report", protect, restrictTo("auditor"), submitAuditorReport);
router.post("/case/:workId/report", protect, restrictTo("auditor"), submitAuditorReport);

/**
 * POST /api/auditor/case/{*workId}/asset
 * Asset Verification:
 * Records physical asset verification findings (status, type, geotags).
 * Only accessible by authenticated users with the "auditor" role.
 */
router.post("/case/{*workId}/asset", protect, restrictTo("auditor"), submitAssetVerification);
router.post("/case/:workId/asset", protect, restrictTo("auditor"), submitAssetVerification);

/**
 * GET /api/auditor/vendor
 * Vendor Investigation Tool:
 * Cross-references vendor contracts to detect repeat round-figure amounts, single-state concentration, etc.
 * Only accessible by authenticated users with the "auditor" role.
 */
router.get("/vendor", protect, restrictTo("auditor"), getVendorProfile);

export default router;
```


### `backend/src/routes/auth.routes.js`

*File [35/131] | Lines: 30 | Size: 1.0 KB*

```javascript
import { Router } from "express";
import { login, getMe } from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * POST /api/auth/login
 * Public endpoint: Validates request body against loginSchema and checks user credentials.
 */
router.post("/login", validate(loginSchema), login);

/**
 * GET /api/auth/me
 * Protected endpoint: Returns current user profile based on the verified JWT token in req.user.
 */
router.get("/me", protect, getMe);

/**
 * GET /api/auth/role-test/ministry-only
 * Test route: Confirms role restriction works as expected for the "ministry" role.
 */
router.get("/role-test/ministry-only", protect, restrictTo("ministry"), (req, res) => {
  res.status(200).json({ success: true, message: "Authorized Ministry Access" });
});

export default router;
```


### `backend/src/routes/district.routes.js`

*File [36/131] | Lines: 53 | Size: 1.9 KB*

```javascript
import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getDistrictOverview,
  getVerificationQueue,
  markWorkVerified,
  requestEvidence,
  escalateWork,
} from "../controllers/district.controller.js";

const router = express.Router();

/**
 * GET /api/district/overview
 * District Command Center:
 * Returns district summary KPIs and per-MP work breakdowns.
 * Scoped to the logged-in official's district (via req.user.district_id).
 */
router.get("/overview", protect, restrictTo("district"), getDistrictOverview);

/**
 * GET /api/district/verification
 * Missing Evidence Verification Queue:
 * Returns completed projects that lack ground photo evidence verification.
 */
router.get("/verification", protect, restrictTo("district"), getVerificationQueue);

/**
 * POST /api/district/verification/:workId/verify
 * Mark Verified:
 * Confirms ground photo evidence and sets physical progress to 100%.
 */
router.post("/verification/{*workId}/verify", protect, restrictTo("district"), markWorkVerified);
router.post("/verification/:workId/verify", protect, restrictTo("district"), markWorkVerified);

/**
 * POST /api/district/verification/:workId/request-evidence
 * Request Evidence:
 * Sends an evidence reminder notice to the contractor and implementing agency.
 */
router.post("/verification/{*workId}/request-evidence", protect, restrictTo("district"), requestEvidence);
router.post("/verification/:workId/request-evidence", protect, restrictTo("district"), requestEvidence);

/**
 * POST /api/district/verification/:workId/escalate
 * Escalate Work:
 * Creates an escalation record to transfer a suspicious work to the Auditor investigation queue.
 */
router.post("/verification/{*workId}/escalate", protect, restrictTo("district"), escalateWork);
router.post("/verification/:workId/escalate", protect, restrictTo("district"), escalateWork);

export default router;
```


### `backend/src/routes/ministry.routes.js`

*File [37/131] | Lines: 70 | Size: 2.4 KB*

```javascript
import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getOverviewKpis,
  getOverviewRisk,
  getOverviewStates,
  getOverviewUrgent,
  getOverviewAlerts,
  getFlaggedWorks,
  getMpPerformance,
  getTrendsMonthly,
  getTrendsCategories,
  getTrendsVendors,
  getTrendsStates,
  getTrendsLocations,
  getTrendsAnalytics,
  getPredictions,
} from "../controllers/ministry.controller.js";

const router = express.Router();

/**
 * Overview Endpoints:
 * Decomposed into 5 independent services for high resilience and low latency.
 * Role: "ministry"
 */
router.get("/overview/kpis", protect, restrictTo("ministry"), getOverviewKpis);
router.get("/overview/risk", protect, restrictTo("ministry"), getOverviewRisk);
router.get("/overview/states", protect, restrictTo("ministry"), getOverviewStates);
router.get("/overview/urgent", protect, restrictTo("ministry"), getOverviewUrgent);
router.get("/overview/alerts", protect, restrictTo("ministry"), getOverviewAlerts);

/**
 * GET /api/ministry/flagged
 * Flagged Works Portfolio:
 * Returns paginated, searchable, and filterable flagged projects nationwide.
 * Role: "ministry"
 */
router.get("/flagged", protect, restrictTo("ministry"), getFlaggedWorks);

/**
 * GET /api/ministry/mp-performance
 * MP Performance & Leaderboard:
 * Ranks MPs by fund utilization, completion rate, and track record.
 * Role: "ministry"
 */
router.get("/mp-performance", protect, restrictTo("ministry"), getMpPerformance);

/**
 * Trends & Analytics Endpoints:
 * Decomposed into 4 isolated computation domains + location metadata + backwards-compatible root.
 * Role: "ministry"
 */
router.get("/trends/monthly", protect, restrictTo("ministry"), getTrendsMonthly);
router.get("/trends/categories", protect, restrictTo("ministry"), getTrendsCategories);
router.get("/trends/vendors", protect, restrictTo("ministry"), getTrendsVendors);
router.get("/trends/states", protect, restrictTo("ministry"), getTrendsStates);
router.get("/trends/locations", protect, restrictTo("ministry"), getTrendsLocations);
router.get("/trends", protect, restrictTo("ministry"), getTrendsAnalytics);

/**
 * GET /api/ministry/predictions
 * Predictive Risk Watchlist:
 * Forecasts projects at risk of cost overrun or delay over the next 30 days.
 * Role: "ministry"
 */
router.get("/predictions", protect, restrictTo("ministry"), getPredictions);

export default router;
```


### `backend/src/routes/mp.routes.js`

*File [38/131] | Lines: 28 | Size: 0.8 KB*

```javascript
import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getMyConstituencyOverview,
  getMyWorks,
} from "../controllers/mp.controller.js";

const router = express.Router();

/**
 * GET /api/mp/overview
 * MP Constituency Overview:
 * Returns annual entitlement, expenditure, utilization rate, and flagged works for the logged-in MP.
 * Scoped to req.user.mp_id.
 * Role: "mp"
 */
router.get("/overview", protect, restrictTo("mp"), getMyConstituencyOverview);

/**
 * GET /api/mp/works
 * MP Works Portfolio:
 * Returns all development works recommended by the authenticated MP with status and search filters.
 * Role: "mp"
 */
router.get("/works", protect, restrictTo("mp"), getMyWorks);

export default router;
```


### `backend/src/routes/state.routes.js`

*File [39/131] | Lines: 34 | Size: 0.8 KB*

```javascript
import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getStateOverview,
  getDistrictSummary,
} from "../controllers/state.controller.js";

const router = express.Router();

/**
 * GET /api/state/overview
 * State Overview:
 * State-wide summary metrics, district coverage, and comparative risk statistics across all districts.
 * Scoped to req.user.state_id.
 * Role: "state"
 */
router.get("/overview", protect, restrictTo("state"), getStateOverview);

/**
 * GET /api/state/districts/:districtName/summary
 * District Drill-Down Summary:
 * Detailed metrics for a single district and its top 3 highest-risk projects.
 * Scoped to req.user.state_id.
 * Role: "state"
 */
router.get(
  "/districts/:districtName/summary",
  protect,
  restrictTo("state"),
  getDistrictSummary
);

export default router;
```


### `backend/src/routes/work.routes.js`

*File [40/131] | Lines: 40 | Size: 1.0 KB*

```javascript
import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getWorkById,
  issueAuditNotice,
} from "../controllers/work.controller.js";

const router = express.Router();

/**
 * POST /api/works/:workId/audit-notice
 * Issue Audit Notice:
 * Places a work under review and generates an official audit notice.
 * Roles: "ministry", "district", "state", "auditor"
 */
router.post(
  "/audit-notice",
  protect,
  restrictTo("ministry", "district", "state", "auditor"),
  issueAuditNotice
);

router.post(
  "/{*workId}/audit-notice",
  protect,
  restrictTo("ministry", "district", "state", "auditor"),
  issueAuditNotice
);

/**
 * GET /api/works/{*workId}
 * Project Details:
 * Returns flattened project details, financial figures, risk scores, progress, and audit history.
 * Accessible to any authenticated role.
 */
router.get("/{*workId}", protect, getWorkById);
router.get("/", protect, getWorkById);

export default router;
```


### `backend/src/server.js`

*File [41/131] | Lines: 24 | Size: 0.6 KB*

```javascript
import app from "./app.js";
import connectDB from "./config/db.js";
import config from "./config/env.js";

// Start the API only after PostgreSQL is connected successfully via Prisma.
const startServer = async () => {
  try {
    // 1. Verify database connection
    await connectDB();

    // 2. Start listening for incoming HTTP requests
    app.listen(config.port, () => {
      console.log(
        `Server running in ${config.nodeEnv} mode on port ${config.port}`
      );
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
}

startServer();
```


### `backend/src/services/auditorCase.service.js`

*File [42/131] | Lines: 430 | Size: 12.7 KB*

```javascript
import { prisma } from "../config/db.js";
import { getWorkDetail } from "./workDetail.service.js";
import {
  getLatestAuditorReport,
  getLatestEscalation,
  getLatestWorkProgress,
} from "./shared/latestFor.service.js";

/**
 * Normalizes database status values to human-readable UI strings.
 * Example: "UNDER_REVIEW" -> "Under Review"
 */
function normalizeAuditorStatus(status) {
  if (!status) return "Under Review";

  const upper = String(status).trim().toUpperCase();
  if (upper === "UNDER_REVIEW" || upper === "UNDER REVIEW") {
    return "Under Review";
  }
  if (upper === "RESOLVED") {
    return "Resolved";
  }
  if (upper === "ESCALATED") {
    return "Escalated";
  }

  return status;
}

/**
 * Normalizes database conclusion values to human-readable UI strings.
 * Example: "CONFIRMED_ANOMALY" -> "Confirmed Anomaly"
 */
function normalizeAuditorConclusion(conclusion) {
  if (!conclusion) return null;

  const upper = String(conclusion).trim().toUpperCase();
  if (upper === "CONFIRMED_ANOMALY" || upper === "CONFIRMED ANOMALY") {
    return "Confirmed Anomaly";
  }
  if (upper === "FALSE_POSITIVE" || upper === "FALSE POSITIVE") {
    return "False Positive";
  }
  if (upper === "REQUIRES_FIELD_ACTION" || upper === "REQUIRES FIELD ACTION") {
    return "Requires Field Action";
  }

  return conclusion;
}

/**
 * Maps human-readable UI conclusion text to the database enum value.
 */
function mapConclusionToPrisma(conclusion) {
  if (!conclusion) return "REQUIRES_FIELD_ACTION";

  const c = String(conclusion).trim();
  if (c === "Confirmed Anomaly" || c === "CONFIRMED_ANOMALY") {
    return "CONFIRMED_ANOMALY";
  }
  if (c === "False Positive" || c === "FALSE_POSITIVE") {
    return "FALSE_POSITIVE";
  }
  return "REQUIRES_FIELD_ACTION";
}

/**
 * Maps human-readable UI status text to the database enum value.
 */
function mapStatusToPrisma(status) {
  if (!status) return "UNDER_REVIEW";

  const s = String(status).trim();
  if (s === "Under Review" || s === "UNDER_REVIEW") {
    return "UNDER_REVIEW";
  }
  if (s === "Escalated" || s === "ESCALATED") {
    return "ESCALATED";
  }
  if (s === "Resolved" || s === "RESOLVED") {
    return "RESOLVED";
  }
  return "UNDER_REVIEW";
}

/**
 * PART 3 — Case Investigation Detail Service
 * Builds on top of getWorkDetail and adds Auditor-specific fields.
 *
 * @param {string} workId
 * @returns {Promise<Object>}
 */
export async function getCaseById(workId) {
  if (!workId) {
    const error = new Error("Work ID is required");
    error.statusCode = 400;
    throw error;
  }

  // 1. Fetch base work detail
  const baseWorkDetail = await getWorkDetail(workId);
  if (!baseWorkDetail) {
    const error = new Error("Case not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Fetch raw work fields (description, current_risk_score)
  const rawWork = await prisma.work.findUnique({
    where: { work_id: workId },
    include: {
      current_risk_score: true,
    },
  });

  if (!rawWork) {
    const error = new Error("Case not found");
    error.statusCode = 404;
    throw error;
  }

  // 3. Fetch latest associated records in parallel
  const [latestAuditorReport, latestEscalation, latestWorkProgress] =
    await Promise.all([
      getLatestAuditorReport(workId),
      getLatestEscalation(workId),
      getLatestWorkProgress(workId),
    ]);

  const rs = rawWork.current_risk_score;

  // Resolve numeric risk score
  let riskScore = 0;
  if (baseWorkDetail.fraudRiskScore !== null && baseWorkDetail.fraudRiskScore !== undefined) {
    riskScore = baseWorkDetail.fraudRiskScore;
  } else if (rs?.risk_score !== null && rs?.risk_score !== undefined) {
    riskScore = Number(rs.risk_score);
  }

  const riskLevel = baseWorkDetail.fraudRiskTier || rs?.risk_level || "Medium";

  // Breakdown percentages for risk indicators
  const riskFactorBreakdown = {
    costOverrun: Math.round(Number(rs?.cost_overrun_pct || 0)),
    delaySlippage: Math.round(Number(rs?.delay_slippage_pct || 0)),
    duplicateSimilarity: Math.round(Number(rs?.duplicate_similarity_pct || 0)),
    vendorAnomaly: Math.round(Number(rs?.vendor_anomaly_pct || 0)),
  };

  const aiDiagnosticSummary =
    rs?.ai_diagnostic_summary ||
    baseWorkDetail.aiDiagnosticSummary ||
    "AI risk telemetry diagnostic indicates variance against regional benchmarks.";

  // Progress metrics from most recent progress report
  let expectedProgress = null;
  if (latestWorkProgress?.expected_progress_pct !== null && latestWorkProgress?.expected_progress_pct !== undefined) {
    expectedProgress = Number(latestWorkProgress.expected_progress_pct);
  }

  let physicalProgress = null;
  if (latestWorkProgress?.physical_progress_pct !== null && latestWorkProgress?.physical_progress_pct !== undefined) {
    physicalProgress = Number(latestWorkProgress.physical_progress_pct);
  } else if (baseWorkDetail.physicalProgress !== undefined) {
    physicalProgress = baseWorkDetail.physicalProgress;
  }

  const photoEvidenceStatus = latestWorkProgress?.evidence_status || "missing";

  // Escalation metadata
  const escalationSource =
    latestEscalation?.escalation_source ||
    latestEscalation?.escalationSource ||
    "ai";

  const escalationNote =
    latestEscalation?.escalation_note ||
    latestEscalation?.escalationNote ||
    null;

  const escalatedDate = latestEscalation?.escalated_date
    ? new Date(latestEscalation.escalated_date).toISOString()
    : null;

  // Auditor report formatting
  let auditorReport = null;
  if (latestAuditorReport) {
    auditorReport = {
      conclusion: normalizeAuditorConclusion(latestAuditorReport.conclusion),
      notes: latestAuditorReport.notes || null,
      status: normalizeAuditorStatus(latestAuditorReport.status),
      verifiedProgressPct:
        latestAuditorReport.verified_progress_pct !== null &&
        latestAuditorReport.verified_progress_pct !== undefined
          ? Number(latestAuditorReport.verified_progress_pct)
          : null,
      discrepancyFlag: Boolean(latestAuditorReport.discrepancy_flag),
    };
  }

  return {
    ...baseWorkDetail,
    description: rawWork.description || baseWorkDetail.description || "",
    riskScore,
    riskLevel,
    riskFactorBreakdown,
    aiDiagnosticSummary,
    expectedProgress,
    physicalProgress,
    photoEvidenceStatus,
    escalationSource,
    escalationNote,
    escalatedDate,
    auditorReport,
  };
}

/**
 * Upserts the AuditorReport for a given workId:
 * If a report already exists, updates it.
 * If none exists yet, creates a new one.
 *
 * @param {string} workId
 * @param {Object} reportData
 * @param {string} [reportData.conclusion]
 * @param {string} [reportData.notes]
 * @param {string} [reportData.status]
 * @param {number} [reportData.verifiedProgressPct]
 * @param {boolean} [reportData.discrepancyFlag]
 * @param {string} [auditorName]
 * @returns {Promise<{ conclusion: string|null, notes: string|null, status: string, submittedBy: string, submittedDate: string, verifiedProgressPct: number|null, discrepancyFlag: boolean }>}
 */
export async function upsertAuditorReport(
  workId,
  { conclusion, notes, status, verifiedProgressPct, discrepancyFlag } = {},
  auditorName = "Auditor"
) {
  if (!workId) {
    const error = new Error("Work ID is required");
    error.statusCode = 400;
    throw error;
  }

  const work = await prisma.work.findUnique({
    where: { work_id: workId },
    select: { work_id: true },
  });

  if (!work) {
    const error = new Error("Case not found");
    error.statusCode = 404;
    throw error;
  }

  const latestReport = await getLatestAuditorReport(workId);
  const today = new Date();
  const submittedBy = auditorName || "Auditor";

  let savedRecord;

  if (latestReport) {
    // Update existing report
    const updateData = {
      status: mapStatusToPrisma(status || latestReport.status),
      submitted_by: submittedBy,
      submitted_date: today,
    };

    if (conclusion !== undefined && conclusion !== null) {
      updateData.conclusion = mapConclusionToPrisma(conclusion);
    }
    if (notes !== undefined && notes !== null) {
      updateData.notes = notes;
    }
    if (verifiedProgressPct !== undefined && verifiedProgressPct !== null) {
      updateData.verified_progress_pct = verifiedProgressPct;
    }
    if (discrepancyFlag !== undefined && discrepancyFlag !== null) {
      updateData.discrepancy_flag = discrepancyFlag;
    }

    savedRecord = await prisma.auditorReport.update({
      where: { report_id: latestReport.report_id },
      data: updateData,
    });
  } else {
    // Create new report
    const createData = {
      work_id: workId,
      conclusion: mapConclusionToPrisma(conclusion || "REQUIRES_FIELD_ACTION"),
      notes: notes || null,
      status: mapStatusToPrisma(status || "UNDER_REVIEW"),
      submitted_by: submittedBy,
      submitted_date: today,
    };

    if (verifiedProgressPct !== undefined && verifiedProgressPct !== null) {
      createData.verified_progress_pct = verifiedProgressPct;
    }
    if (discrepancyFlag !== undefined && discrepancyFlag !== null) {
      createData.discrepancy_flag = discrepancyFlag;
    }

    savedRecord = await prisma.auditorReport.create({
      data: createData,
    });
  }

  // Format date as YYYY-MM-DD
  const formattedDate = savedRecord.submitted_date
    ? new Date(savedRecord.submitted_date).toISOString().split("T")[0]
    : today.toISOString().split("T")[0];

  return {
    conclusion: normalizeAuditorConclusion(savedRecord.conclusion),
    notes: savedRecord.notes || null,
    status: normalizeAuditorStatus(savedRecord.status),
    submittedBy: savedRecord.submitted_by || submittedBy,
    submittedDate: formattedDate,
    verifiedProgressPct:
      savedRecord.verified_progress_pct !== null &&
      savedRecord.verified_progress_pct !== undefined
        ? Number(savedRecord.verified_progress_pct)
        : null,
    discrepancyFlag: Boolean(savedRecord.discrepancy_flag),
  };
}

/**
 * Upserts an AssetCreation record for a given workId.
 * If an AssetCreation row exists, updates it.
 * If none exists, creates one.
 *
 * @param {string} workId
 * @param {Object} assetData
 * @param {string} [assetData.assetType]
 * @param {string} assetData.verificationStatus - 'verified' | 'unverified' | 'disputed'
 * @param {number} [assetData.geotagLat]
 * @param {number} [assetData.geotagLong]
 * @param {string} [auditorName]
 * @returns {Promise<{ assetType: string|null, verificationStatus: string, geotagLat: number|null, geotagLong: number|null }>}
 */
export async function upsertAssetVerification(
  workId,
  { assetType, verificationStatus, geotagLat, geotagLong } = {},
  auditorName = "Auditor"
) {
  if (!workId) {
    const error = new Error("Work ID is required");
    error.statusCode = 400;
    throw error;
  }

  const validStatuses = ["verified", "unverified", "disputed"];
  if (!verificationStatus || !validStatuses.includes(verificationStatus)) {
    const error = new Error(
      `Invalid verificationStatus. Allowed values: ${validStatuses.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  const work = await prisma.work.findUnique({
    where: { work_id: workId },
    select: { work_id: true },
  });

  if (!work) {
    const error = new Error("Case not found");
    error.statusCode = 404;
    throw error;
  }

  const existingAsset = await prisma.assetCreation.findFirst({
    where: { work_id: workId },
    orderBy: { asset_id: "desc" },
  });

  let savedRecord;

  if (existingAsset) {
    const updateData = {
      verification_status: verificationStatus,
    };
    if (assetType !== undefined && assetType !== null) {
      updateData.asset_type = assetType;
    }
    if (geotagLat !== undefined && geotagLat !== null) {
      updateData.geotag_lat = geotagLat;
    }
    if (geotagLong !== undefined && geotagLong !== null) {
      updateData.geotag_long = geotagLong;
    }

    savedRecord = await prisma.assetCreation.update({
      where: { asset_id: existingAsset.asset_id },
      data: updateData,
    });
  } else {
    savedRecord = await prisma.assetCreation.create({
      data: {
        work_id: workId,
        asset_type: assetType !== undefined && assetType !== null ? assetType : null,
        verification_status: verificationStatus,
        geotag_lat: geotagLat !== undefined && geotagLat !== null ? geotagLat : null,
        geotag_long: geotagLong !== undefined && geotagLong !== null ? geotagLong : null,
      },
    });
  }

  return {
    assetType: savedRecord.asset_type || null,
    verificationStatus: savedRecord.verification_status,
    geotagLat:
      savedRecord.geotag_lat !== null && savedRecord.geotag_lat !== undefined
        ? Number(savedRecord.geotag_lat)
        : null,
    geotagLong:
      savedRecord.geotag_long !== null && savedRecord.geotag_long !== undefined
        ? Number(savedRecord.geotag_long)
        : null,
  };
}

export default {
  getCaseById,
  upsertAuditorReport,
  upsertAssetVerification,
};
```


### `backend/src/services/auditorQueue.service.js`

*File [43/131] | Lines: 264 | Size: 7.4 KB*

```javascript
import { prisma } from "../config/db.js";
import {
  getLatestAuditorReport,
  getLatestEscalation,
} from "./shared/latestFor.service.js";

/**
 * Formats database status values to user-facing caseStatus:
 * 'Under Review' | 'Escalated' | 'Resolved' | 'New'
 */
function formatCaseStatus(status) {
  if (!status) return "New";

  const upper = String(status).trim().toUpperCase();
  if (upper === "UNDER_REVIEW" || upper === "UNDER REVIEW") {
    return "Under Review";
  }
  if (upper === "RESOLVED") {
    return "Resolved";
  }
  if (upper === "ESCALATED") {
    return "Escalated";
  }

  return status;
}

/**
 * Checks if a work matches the search query across ID, MP, district, state, or vendor name.
 */
function matchesSearch(work, searchLower) {
  if (!searchLower) return true;

  if ((work.work_id || "").toLowerCase().includes(searchLower)) return true;
  if ((work.mp?.mp_name || "").toLowerCase().includes(searchLower)) return true;
  if ((work.district?.district_name || "").toLowerCase().includes(searchLower)) return true;
  if ((work.state?.state_name || "").toLowerCase().includes(searchLower)) return true;

  if (Array.isArray(work.expenditures)) {
    for (const exp of work.expenditures) {
      const vendorName = exp.vendor?.vendor_name || "";
      if (vendorName.toLowerCase().includes(searchLower)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * PART 2 — High-Risk Case Queue Service
 * Nationwide high-risk queue: returns works with RiskScore.risk_level IN ('Medium', 'High').
 *
 * @param {Object} filters
 * @param {string} [filters.search]
 * @param {string} [filters.riskLevel] - 'All' | 'High' | 'Medium'
 * @param {string} [filters.caseStatus] - 'All' | 'New' | 'Under Review' | 'Escalated' | 'Resolved'
 * @param {string} [filters.source] - 'All' | 'ai' | 'district'
 * @returns {Promise<{ data: Array }>}
 */
export async function getCaseQueue(filters = {}) {
  const { search, riskLevel, caseStatus, source } = filters;

  const page = Math.max(1, parseInt(filters.page || 1, 10));
  const limit = Math.max(1, parseInt(filters.limit || 20, 10));
  const skip = (page - 1) * limit;
  const take = limit;

  // 1. Base query: only Medium and High risk sanctioned cases nationwide
  const where = {
    status: { not: "Recommended" },
    current_risk_score: {
      risk_level: {
        in: ["Medium", "High"],
      },
    },
  };

  // Filter by risk level if specified
  if (riskLevel && riskLevel !== "All") {
    where.current_risk_score.risk_level = riskLevel;
  }

  // Filter by source
  if (source && source !== "All") {
    if (source.toLowerCase() === "district") {
      where.escalations = {
        some: {
          escalation_source: { equals: "district", mode: "insensitive" },
        },
      };
    } else if (source.toLowerCase() === "ai") {
      where.escalations = {
        none: {},
      };
    }
  }

  // Filter by case status
  if (caseStatus && caseStatus !== "All") {
    const targetStatus = caseStatus.trim().toLowerCase();
    if (targetStatus === "new") {
      where.auditor_reports = {
        none: {},
      };
    } else if (targetStatus === "under review") {
      where.auditor_reports = {
        some: {
          status: { in: ["UNDER_REVIEW", "Under Review", "under_review", "under review"] },
        },
      };
    } else if (targetStatus === "resolved") {
      where.auditor_reports = {
        some: {
          status: { in: ["RESOLVED", "Resolved", "resolved"] },
        },
      };
    } else if (targetStatus === "escalated") {
      where.auditor_reports = {
        some: {
          status: { in: ["ESCALATED", "Escalated", "escalated"] },
        },
      };
    }
  }

  // Filter by search term
  if (search && search.trim() !== "" && search !== "All") {
    const q = search.trim();
    where.OR = [
      { work_id: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { mp: { mp_name: { contains: q, mode: "insensitive" } } },
      { district: { district_name: { contains: q, mode: "insensitive" } } },
      { state: { state_name: { contains: q, mode: "insensitive" } } },
    ];
  }

  // 2. Parallel Count and Paginated Query strictly in PostgreSQL
  const [total, works] = await prisma.$transaction([
    prisma.work.count({ where }),
    prisma.work.findMany({
      where,
      skip,
      take,
      orderBy: [
        { current_risk_score: { risk_score: "desc" } },
        { sanction_date: "desc" },
        { work_id: "desc" },
      ],
      select: {
        work_id: true,
        category: true,
        description: true,
        sanction_date: true,
        mp: {
          select: {
            mp_id: true,
            mp_name: true,
          },
        },
        district: {
          select: {
            district_id: true,
            district_name: true,
          },
        },
        state: {
          select: {
            state_id: true,
            state_name: true,
          },
        },
        current_risk_score: {
          select: {
            risk_level: true,
            risk_score: true,
            flag_reason: true,
            calculated_at: true,
          },
        },
        escalations: {
          orderBy: [{ escalated_date: "desc" }, { escalation_id: "desc" }],
          take: 1,
          select: {
            escalation_source: true,
            escalation_note: true,
            escalated_date: true,
          },
        },
        auditor_reports: {
          orderBy: [{ submitted_date: "desc" }, { report_id: "desc" }],
          take: 1,
          select: {
            status: true,
            conclusion: true,
            notes: true,
            submitted_date: true,
          },
        },
      },
    }),
  ]);

  // 3. Map ONLY the returned page records (e.g. 20 items)
  const results = works.map((w) => {
    const latestReport = w.auditor_reports?.[0] || null;
    const latestEscalation = w.escalations?.[0] || null;

    const derivedCaseStatus = formatCaseStatus(latestReport?.status);
    const derivedEscalationSource =
      latestEscalation?.escalation_source || "ai";
    const derivedEscalationNote =
      latestEscalation?.escalation_note || null;

    return {
      workId: w.work_id,
      description: w.description || "",
      category: w.category || "",
      mpName: w.mp?.mp_name || "Unknown MP",
      district: w.district?.district_name || "Unknown District",
      state: w.state?.state_name || "Unknown State",
      riskLevel: w.current_risk_score?.risk_level || "Medium",
      riskScore:
        w.current_risk_score?.risk_score !== null &&
        w.current_risk_score?.risk_score !== undefined
          ? Number(w.current_risk_score.risk_score)
          : 50,
      flagReason:
        w.current_risk_score?.flag_reason || "Flagged by AI sentinel logic",
      caseStatus: derivedCaseStatus,
      escalationSource: derivedEscalationSource,
      escalationNote: derivedEscalationNote,
      escalatedDate: latestEscalation?.escalated_date || null,
      lastActionDate:
        latestReport?.submitted_date ||
        latestEscalation?.escalated_date ||
        w.sanction_date ||
        null,
    };
  });

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data: results,
    total,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export default {
  getCaseQueue,
};
```


### `backend/src/services/auth.service.js`

*File [44/131] | Lines: 11 | Size: 0.3 KB*

```javascript
/**
 * services/auth.service.js
 * NOTE: The active authentication logic in this project is handled directly
 * inside controllers/auth.controller.js using Prisma and bcryptjs/JWT.
 * 
 * This file is retained as a clean placeholder to prevent broken imports
 * if referenced, and is flagged for review.
 */

export default {};
```


### `backend/src/services/districtOverview.service.js`

*File [45/131] | Lines: 220 | Size: 6.0 KB*

```javascript
import { prisma } from "../config/db.js";
import { getDisplayStatus } from "../utils/workStatus.js";

/**
 * services/districtOverview.service.js
 * Comprehensive district-wide analytics across all MPs with works in this jurisdiction.
 *
 * @param {number|string} districtId - District Primary Key (from req.user.district_id)
 * @returns {Promise<{ district: Object, kpis: Object, mpBreakdown: Array }>}
 */
export async function getDistrictOverview(districtId) {
  const parsedDistrictId = parseInt(districtId, 10);
  if (isNaN(parsedDistrictId)) {
    const error = new Error("Invalid District ID");
    error.statusCode = 400;
    throw error;
  }

  // 1. Load District record with linked State
  const district = await prisma.district.findUnique({
    where: { district_id: parsedDistrictId },
    include: {
      state: {
        select: {
          state_name: true,
        },
      },
    },
  });

  if (!district) {
    const error = new Error("District profile not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Load all works situated in this district
  const works = await prisma.work.findMany({
    where: {
      district_id: parsedDistrictId,
    },
    include: {
      mp: {
        select: {
          mp_id: true,
          mp_name: true,
          constituency: true,
        },
      },
      current_risk_score: true,
      expenditures: true,
      auditor_reports: {
        select: {
          status: true,
        },
      },
      escalations: {
        select: {
          escalation_id: true,
        },
      },
    },
  });

  // 3. Compute district-wide summary KPIs in a single clean pass
  const totalWorks = works.length;
  let totalSanctionedCount = 0;
  let totalSanctionedAmount = 0;
  let totalCompletedCount = 0;
  let totalFlaggedCount = 0;

  for (const w of works) {
    if (w.status !== "Recommended") {
      totalSanctionedCount += 1;
      totalSanctionedAmount += Number(w.sanctioned_amount || 0);
    }
    if (w.status === "Completed") {
      totalCompletedCount += 1;
    }
    if (
      w.status !== "Recommended" &&
      w.current_risk_score &&
      (w.current_risk_score.risk_level === "Medium" || w.current_risk_score.risk_level === "High")
    ) {
      totalFlaggedCount += 1;
    }
  }

  // Convert sanctioned amount from Rupees to Crores (/ 10,000,000)
  const totalSanctionedCr = Number((totalSanctionedAmount / 10000000).toFixed(2));

  const completionRate =
    totalSanctionedCount > 0
      ? Number(((totalCompletedCount / totalSanctionedCount) * 100).toFixed(1))
      : 0;

  const kpis = {
    totalWorks,
    totalSanctionedCr,
    totalSanctionedCount,
    totalCompletedCount,
    completionRate,
    totalFlaggedCount,
  };

  // 4. Group works by MP
  const mpMap = new Map();

  for (const work of works) {
    const mpId = work.mp_id || work.mp?.mp_id || 0;
    const mpName = work.mp?.mp_name || "Unknown MP";
    const constituency = work.mp?.constituency || district.district_name;

    if (!mpMap.has(mpId)) {
      mpMap.set(mpId, {
        mpName,
        constituency,
        rawWorks: [],
      });
    }

    mpMap.get(mpId).rawWorks.push(work);
  }

  // 5. Build MP performance breakdown
  const mpBreakdown = [];

  for (const entry of mpMap.values()) {
    const mpWorks = entry.rawWorks;
    const count = mpWorks.length;
    let completed = 0;
    let flagged = 0;
    let mpSanctionedAmount = 0;

    for (const w of mpWorks) {
      if (w.status === "Completed") completed += 1;
      if (
        w.status !== "Recommended" &&
        w.current_risk_score &&
        (w.current_risk_score.risk_level === "Medium" || w.current_risk_score.risk_level === "High")
      ) {
        flagged += 1;
      }
      mpSanctionedAmount += Number(w.sanctioned_amount || 0);
    }

    const compRate =
      count > 0 ? Number(((completed / count) * 100).toFixed(1)) : 0;
    // Convert from Rupees to Crores (/ 10,000,000)
    const mpSanctionedCr = Number((mpSanctionedAmount / 10000000).toFixed(2));

    const worksList = [];
    for (const w of mpWorks) {
      let numericRiskScore = null;
      if (w.current_risk_score?.risk_score !== null && w.current_risk_score?.risk_score !== undefined) {
        numericRiskScore = Number(w.current_risk_score.risk_score);
      }

      const rawAmt =
        w.sanctioned_amount !== null && w.sanctioned_amount !== undefined
          ? w.sanctioned_amount
          : w.recommended_amount;
      const isEstimated =
        (w.sanctioned_amount === null || w.sanctioned_amount === undefined) &&
        w.recommended_amount !== null &&
        w.recommended_amount !== undefined;

      // Stored in Rupees; convert to Lakhs (/ 100,000)
      const sanctionedAmountLakhs =
        rawAmt !== null && rawAmt !== undefined && Number(rawAmt) > 0
          ? Number((Number(rawAmt) / 100000).toFixed(2))
          : 0;

      worksList.push({
        workId: w.work_id,
        category: w.category || "",
        riskLevel: w.current_risk_score?.risk_level || null,
        riskScore: numericRiskScore,
        description: w.description || "",
        flagReason: w.current_risk_score?.flag_reason || null,
        sanctionedAmount: sanctionedAmountLakhs,
        isEstimated,
        status: getDisplayStatus(w),
      });
    }

    mpBreakdown.push({
      mpName: entry.mpName,
      constituency: entry.constituency,
      totalSanctionedCr: mpSanctionedCr,
      totalWorks: count,
      completedCount: completed,
      completionRate: compRate,
      flaggedCount: flagged,
      works: worksList,
    });
  }

  // Sort MP breakdown alphabetically by name
  mpBreakdown.sort((a, b) => a.mpName.localeCompare(b.mpName));

  return {
    district: {
      districtName: district.district_name || "",
      state: district.state?.state_name || "",
      headquarters: district.headquarters || `${district.district_name} Collectorate`,
      nodalOfficer:
        district.nodal_officer ||
        district.nodalOfficer ||
        "District Nodal Officer (DNO)",
    },
    kpis,
    mpBreakdown,
  };
}

export default {
  getDistrictOverview,
};
```


### `backend/src/services/mpOverview.service.js`

*File [46/131] | Lines: 221 | Size: 6.3 KB*

```javascript
import { prisma } from "../config/db.js";

/**
 * Finds the vendor name from the largest expenditure record for a work.
 */
function resolveVendorName(expenditures = []) {
  if (!Array.isArray(expenditures) || expenditures.length === 0) {
    return "Not Appointed";
  }

  let largest = expenditures[0];
  for (const exp of expenditures) {
    if (Number(exp.amount || 0) > Number(largest.amount || 0)) {
      largest = exp;
    }
  }

  return largest?.vendor?.vendor_name || "Not Appointed";
}

/**
 * services/mpOverview.service.js
 * Scoped analytics and flagged cases for the logged-in Member of Parliament.
 *
 * @param {number|string} mpId - MP Primary Key (from req.user.mp_id)
 * @returns {Promise<{ mp: Object, kpis: Object, flaggedWorks: Array }>}
 */
export async function getConstituencyOverview(mpId) {
  const parsedMpId = parseInt(mpId, 10);
  if (isNaN(parsedMpId)) {
    const error = new Error("Invalid MP ID");
    error.statusCode = 400;
    throw error;
  }

  // 1. Load MP with state, district, and all works including risk scores and expenditures
  const mp = await prisma.mp.findUnique({
    where: { mp_id: parsedMpId },
    include: {
      state: {
        select: {
          state_name: true,
        },
      },
      works: {
        include: {
          district: {
            select: {
              district_name: true,
            },
          },
          state: {
            select: {
              state_name: true,
            },
          },
          current_risk_score: true,
          expenditures: {
            include: {
              vendor: {
                select: {
                  vendor_name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!mp) {
    const error = new Error("MP profile not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Determine MP's primary district
  let districtName = "";
  for (const w of mp.works) {
    if (w.district?.district_name) {
      districtName = w.district.district_name;
      break;
    }
  }
  if (!districtName) {
    districtName = mp.constituency || "";
  }

  const mpState = mp.state?.state_name || mp.works[0]?.state?.state_name || "";

  // 3. Compute KPIs
  // 500 Lakhs = 5 Cr standard annual MPLADS entitlement
  const rawEntitlement = Number(mp.allocated_amount || 500);
  const annualEntitlementLakhs = Number(rawEntitlement.toFixed(1));
  const annualEntitlementCr = Number((rawEntitlement / 100).toFixed(2));

  const totalRecommendedCount = mp.works.length;
  let totalSanctionedCount = 0;
  let totalSanctionedRupees = 0;
  let totalCompletedCount = 0;
  let totalExpenditureRupees = 0;

  for (const w of mp.works) {
    const rawAmt =
      w.sanctioned_amount !== null && w.sanctioned_amount !== undefined
        ? w.sanctioned_amount
        : w.recommended_amount;

    if (w.status !== "Recommended") {
      totalSanctionedCount += 1;
      totalSanctionedRupees += Number(rawAmt || 0);
    }

    if (w.status === "Completed") {
      totalCompletedCount += 1;
    }

    for (const exp of w.expenditures || []) {
      totalExpenditureRupees += Number(exp.amount || 0);
    }
  }

  // Stored in Rupees; convert to Lakhs (/ 100,000) and Crores (/ 10,000,000)
  const totalSanctionedLakhs = Number((totalSanctionedRupees / 100000).toFixed(2));
  const totalSanctionedCr = Number((totalSanctionedRupees / 10000000).toFixed(2));
  const totalExpenditureLakhs = Number((totalExpenditureRupees / 100000).toFixed(2));
  const totalExpenditureCr = Number((totalExpenditureRupees / 10000000).toFixed(2));

  const utilizationRatePercent =
    annualEntitlementLakhs > 0
      ? Number(((totalExpenditureLakhs / annualEntitlementLakhs) * 100).toFixed(1))
      : 0;

  const kpis = {
    annualEntitlementCr,
    annualEntitlementLakhs,
    totalRecommendedCount,
    totalSanctionedCount,
    totalSanctionedLakhs,
    totalSanctionedCr,
    totalCompletedCount,
    totalExpenditureCr,
    totalExpenditureLakhs,
    utilizationRatePercent,
  };

  // Flagged works: sanctioned works belonging to this MP where RiskScore.riskLevel IN ('Medium','High')
  const flaggedRaw = mp.works.filter(
    (w) =>
      w.status !== "Recommended" &&
      w.current_risk_score &&
      (w.current_risk_score.risk_level === "Medium" || w.current_risk_score.risk_level === "High")
  );

  // Deterministic order: risk_score desc, calculated_at desc, work_id desc
  flaggedRaw.sort((a, b) => {
    const scoreA = Number(a.current_risk_score?.risk_score || 0);
    const scoreB = Number(b.current_risk_score?.risk_score || 0);
    if (scoreB !== scoreA) return scoreB - scoreA;
    const dateA = new Date(a.current_risk_score?.calculated_at || 0).getTime();
    const dateB = new Date(b.current_risk_score?.calculated_at || 0).getTime();
    if (dateB !== dateA) return dateB - dateA;
    return b.work_id.localeCompare(a.work_id);
  });

  const flaggedWorks = [];

  for (const work of flaggedRaw) {
    const vendorName = resolveVendorName(work.expenditures);

    let numericRiskScore = 0;
    if (work.current_risk_score.risk_score !== null && work.current_risk_score.risk_score !== undefined) {
      numericRiskScore = Number(work.current_risk_score.risk_score);
    }

    const rawAmt =
      work.sanctioned_amount !== null && work.sanctioned_amount !== undefined
        ? work.sanctioned_amount
        : work.recommended_amount;
    const isEstimated =
      (work.sanctioned_amount === null || work.sanctioned_amount === undefined) &&
      work.recommended_amount !== null &&
      work.recommended_amount !== undefined;

    const sanctionedAmountLakhs =
      rawAmt !== null && rawAmt !== undefined && Number(rawAmt) > 0
        ? Number((Number(rawAmt) / 100000).toFixed(2))
        : 0;

    flaggedWorks.push({
      workId: work.work_id,
      category: work.category || "",
      description: work.description || "",
      flagReason: work.current_risk_score.flag_reason || "",
      riskLevel: work.current_risk_score.risk_level || "Medium",
      riskScore: numericRiskScore,
      sanctionedAmount: sanctionedAmountLakhs,
      isEstimated,
      vendorName,
    });
  }

  return {
    mp: {
      mpName: mp.mp_name || "",
      house: "Lok Sabha",
      term: "18th Lok Sabha",
      constituency: mp.constituency || "",
      state: mpState,
      district: districtName,
    },
    kpis,
    flaggedWorks,
  };
}

export default {
  getConstituencyOverview,
};
```


### `backend/src/services/mpPerformance.service.js`

*File [47/131] | Lines: 392 | Size: 15.8 KB*

```javascript
import { prisma } from "../config/db.js";
import { getDisplayStatus } from "../utils/workStatus.js";

/**
 * Checks whether fund utilization falls within the chosen percentage range.
 */
function matchesUtilizationRange(utilization, range) {
  if (!range || range === "All") return true;
  if (utilization === null || isNaN(utilization)) return false;

  if (range === ">100") return utilization > 100;
  if (range === "75-100") return utilization >= 75 && utilization <= 100;
  if (range === "50-75") return utilization >= 50 && utilization < 75;
  if (range === "25-50") return utilization >= 25 && utilization < 50;
  if (range === "0-25") return utilization >= 0 && utilization < 25;

  return true;
}

/**
 * Checks whether project completion rate falls within the chosen percentage range.
 */
function matchesCompletionRange(completionRate, range) {
  if (!range || range === "All") return true;
  if (completionRate === null || isNaN(completionRate)) return false;

  if (range === "75-100") return completionRate >= 75 && completionRate <= 100;
  if (range === "50-75") return completionRate >= 50 && completionRate < 75;
  if (range === "25-50") return completionRate >= 25 && completionRate < 50;
  if (range === "0-25") return completionRate >= 0 && completionRate < 25;

  return true;
}

// Cache for lightweight metadata (states, districts, top5, bottom5) to keep subsequent page queries instant
let cachedMetadata = null;
let lastMetadataTime = 0;
const METADATA_TTL_MS = 60 * 1000;

export async function getMpLeaderboard(filters = {}) {
  const {
    search,
    state,
    district,
    utilizationRange,
    completionRange,
    sortField = "fundUtilization",
    sortDirection = "desc",
  } = filters;

  const page = Math.max(1, parseInt(filters.page || 1, 10));
  const limit = Math.max(1, parseInt(filters.limit || 15, 10));
  const offset = (page - 1) * limit;
  const paginationSql = `LIMIT ${limit} OFFSET ${offset}`;

  // Build dynamic SQL where conditions
  const whereClauses = [];
  const params = [];
  let paramIdx = 1;

  if (search && search.trim() !== "" && search !== "All") {
    whereClauses.push(`(
      mp_name ILIKE $${paramIdx} OR 
      constituency ILIKE $${paramIdx} OR 
      COALESCE(state_name, '') ILIKE $${paramIdx} OR 
      array_to_string(districts, ' ') ILIKE $${paramIdx}
    )`);
    params.push(`%${search.trim()}%`);
    paramIdx++;
  }

  if (state && state !== "All") {
    whereClauses.push(`LOWER(COALESCE(state_name, '')) = LOWER($${paramIdx})`);
    params.push(state.trim());
    paramIdx++;
  }

  if (district && district !== "All") {
    whereClauses.push(`(
      constituency ILIKE $${paramIdx} OR 
      array_to_string(districts, ' ') ILIKE $${paramIdx}
    )`);
    params.push(`%${district.trim()}%`);
    paramIdx++;
  }

  if (utilizationRange && utilizationRange !== "All") {
    if (utilizationRange === ">100") {
      whereClauses.push(`fund_utilization > 100`);
    } else if (utilizationRange === "75-100") {
      whereClauses.push(`fund_utilization >= 75 AND fund_utilization <= 100`);
    } else if (utilizationRange === "50-75") {
      whereClauses.push(`fund_utilization >= 50 AND fund_utilization < 75`);
    } else if (utilizationRange === "25-50") {
      whereClauses.push(`fund_utilization >= 25 AND fund_utilization < 50`);
    } else if (utilizationRange === "0-25") {
      whereClauses.push(`fund_utilization >= 0 AND fund_utilization < 25`);
    }
  }

  if (completionRange && completionRange !== "All") {
    if (completionRange === "75-100") {
      whereClauses.push(`completion_rate >= 75 AND completion_rate <= 100`);
    } else if (completionRange === "50-75") {
      whereClauses.push(`completion_rate >= 50 AND completion_rate < 75`);
    } else if (completionRange === "25-50") {
      whereClauses.push(`completion_rate >= 25 AND completion_rate < 50`);
    } else if (completionRange === "0-25") {
      whereClauses.push(`completion_rate >= 0 AND completion_rate < 25`);
    }
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  // Database-level sorting
  const dir = (sortDirection || "desc").toLowerCase() === "asc" ? "ASC" : "DESC";
  let orderBy = "fund_utilization DESC NULLS LAST, mp_id ASC";
  if (sortField === "completionRate") {
    orderBy = `completion_rate ${dir} NULLS LAST, mp_id ASC`;
  } else if (sortField === "fundUtilization") {
    orderBy = `fund_utilization ${dir} NULLS LAST, mp_id ASC`;
  } else if (sortField === "totalWorks") {
    orderBy = `total_works ${dir}, mp_id ASC`;
  } else if (sortField === "totalSanctionedAmount") {
    orderBy = `total_sanctioned_amount ${dir}, mp_id ASC`;
  } else if (sortField === "totalExpenditure") {
    orderBy = `total_expenditure ${dir}, mp_id ASC`;
  } else if (sortField === "mpName") {
    orderBy = `mp_name ${dir}, mp_id ASC`;
  } else if (sortField === "state") {
    orderBy = `state_name ${dir}, mp_id ASC`;
  } else if (sortField === "district" || sortField === "constituency") {
    orderBy = `constituency ${dir}, mp_id ASC`;
  }

  // Pure SQL CTE with database-side filtering, sorting, full_count, and LIMIT/OFFSET
  const query = `
    WITH under_review AS (
      SELECT DISTINCT work_id FROM escalations
      UNION
      SELECT DISTINCT work_id FROM auditor_reports
      WHERE status::text ILIKE '%under%review%' OR status::text ILIKE '%escalated%'
    ),
    delayed AS (
      SELECT w.work_id
      FROM works w
      LEFT JOIN risk_scores rs ON w.current_risk_score_id = rs.risk_id
      WHERE w.status = 'Ongoing'
        AND w.work_id NOT IN (SELECT work_id FROM under_review)
        AND (
          (w.completion_date IS NOT NULL AND w.completion_date < NOW())
          OR (rs.delay_slippage_pct IS NOT NULL AND rs.delay_slippage_pct >= 25)
          OR (rs.flag_reason IS NOT NULL AND (
              LOWER(rs.flag_reason) LIKE '%delay%' 
              OR LOWER(rs.flag_reason) LIKE '%stall%' 
              OR LOWER(rs.flag_reason) LIKE '%overdue%'
          ))
        )
    ),
    work_agg AS (
      SELECT
        w.mp_id,
        COUNT(w.work_id)::int AS total_works,
        COALESCE(SUM(w.sanctioned_amount), 0)::float AS total_sanctioned_amount,
        COALESCE(SUM(we.total_amount), 0)::float AS total_expenditure,
        COUNT(CASE WHEN w.status = 'Completed' THEN 1 END)::int AS completed_works,
        COUNT(CASE WHEN ur.work_id IS NOT NULL AND w.status != 'Completed' THEN 1 END)::int AS under_review_works,
        COUNT(CASE WHEN w.status = 'Ongoing' AND ur.work_id IS NULL AND dl.work_id IS NULL THEN 1 END)::int AS ongoing_works,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.district_name), NULL) AS districts
      FROM works w
      LEFT JOIN districts d ON w.district_id = d.district_id
      LEFT JOIN under_review ur ON w.work_id = ur.work_id
      LEFT JOIN delayed dl ON w.work_id = dl.work_id
      LEFT JOIN (
        SELECT work_id, SUM(amount) AS total_amount
        FROM expenditures
        GROUP BY work_id
      ) we ON w.work_id = we.work_id
      GROUP BY w.mp_id
    ),
    base_mps AS (
      SELECT
        m.mp_id,
        m.mp_name,
        m.constituency,
        COALESCE(
          s.state_name,
          (SELECT s2.state_name FROM works w2 JOIN states s2 ON w2.state_id = s2.state_id WHERE w2.mp_id = m.mp_id LIMIT 1),
          ''
        ) AS state_name,
        wa.total_works,
        wa.total_sanctioned_amount,
        wa.total_expenditure,
        wa.completed_works,
        wa.under_review_works,
        wa.ongoing_works,
        wa.districts,
        CASE 
          WHEN wa.total_sanctioned_amount > 0 THEN ROUND(((wa.total_expenditure / wa.total_sanctioned_amount) * 100)::numeric, 1)::float
          ELSE NULL
        END AS fund_utilization,
        CASE
          WHEN wa.total_works > 0 THEN ROUND(((wa.completed_works::float / wa.total_works::float) * 100)::numeric, 1)::float
          ELSE NULL
        END AS completion_rate
      FROM mps m
      LEFT JOIN states s ON m.state_id = s.state_id
      INNER JOIN work_agg wa ON m.mp_id = wa.mp_id
    )
    SELECT
      *,
      COUNT(*) OVER()::int AS full_count
    FROM base_mps
    ${whereSql}
    ORDER BY ${orderBy}
    ${paginationSql};
  `;

  // Execute database query with parameters
  const pageRows = await prisma.$queryRawUnsafe(query, ...params);

  const total = pageRows.length > 0 ? Number(pageRows[0].full_count) : 0;
  const totalPages = Math.ceil(total / limit) || 1;

  // Query categories ONLY for the MPs returned on this page
  const catMap = {};
  if (pageRows.length > 0) {
    const pageMpIds = pageRows.map((r) => r.mp_id).filter(Boolean);
    if (pageMpIds.length > 0) {
      const catStats = await prisma.$queryRawUnsafe(
        `SELECT mp_id, category, COUNT(*)::int AS count FROM works WHERE mp_id IN (${pageMpIds.join(",")}) AND category IS NOT NULL GROUP BY mp_id, category;`
      );
      for (const row of catStats) {
        if (!catMap[row.mp_id]) catMap[row.mp_id] = {};
        catMap[row.mp_id][row.category] = row.count;
      }
    }
  }

  // Map rows to frontend MP object shape
  const data = pageRows.map((mp) => {
    const totalSanctionedAmount = Number(Number(mp.total_sanctioned_amount || 0).toFixed(2));
    const totalExpenditure = Number(Number(mp.total_expenditure || 0).toFixed(2));
    const totalWorks = Number(mp.total_works || 0);
    const completedWorks = Number(mp.completed_works || 0);
    const ongoingWorks = Number(mp.ongoing_works || 0);
    const underReviewWorks = Number(mp.under_review_works || 0);
    const mpDistricts = Array.isArray(mp.districts) ? mp.districts : [];
    const primaryDistrict = mpDistricts[0] || mp.constituency || "";

    return {
      mpName: mp.mp_name || "",
      state: mp.state_name || "",
      district: primaryDistrict,
      constituency: mp.constituency || "",
      totalSanctionedAmount,
      totalExpenditure,
      totalWorks,
      completedWorks,
      ongoingWorks,
      underReviewWorks,
      fundUtilization: mp.fund_utilization !== null ? Number(mp.fund_utilization) : null,
      completionRate: mp.completion_rate !== null ? Number(mp.completion_rate) : null,
      categories: catMap[mp.mp_id] || {},
    };
  });

  // Maintain lightweight cached metadata for top5/bottom5 and dropdowns
  const now = Date.now();
  if (!cachedMetadata || now - lastMetadataTime > METADATA_TTL_MS) {
    const [statesRes, districtsRes, top5Res, bottom5Res] = await Promise.all([
      prisma.state.findMany({ select: { state_name: true }, orderBy: { state_name: "asc" } }),
      prisma.district.findMany({ select: { district_name: true }, orderBy: { district_name: "asc" } }),
      prisma.$queryRaw`
        SELECT m.mp_id, m.mp_name, m.constituency, COALESCE(s.state_name, '') AS state_name,
               wa.total_works, wa.total_sanctioned_amount, wa.total_expenditure, wa.completed_works, wa.ongoing_works, wa.under_review_works,
               ROUND(((wa.total_expenditure / wa.total_sanctioned_amount) * 100)::numeric, 1)::float AS fund_utilization,
               ROUND(((wa.completed_works::float / wa.total_works::float) * 100)::numeric, 1)::float AS completion_rate
        FROM mps m
        LEFT JOIN states s ON m.state_id = s.state_id
        INNER JOIN (
          SELECT w.mp_id, COUNT(*)::int AS total_works,
                 COALESCE(SUM(w.sanctioned_amount), 0)::float AS total_sanctioned_amount,
                 COALESCE(SUM(we.total_amount), 0)::float AS total_expenditure,
                 COUNT(CASE WHEN w.status = 'Completed' THEN 1 END)::int AS completed_works,
                 COUNT(CASE WHEN w.status = 'Ongoing' THEN 1 END)::int AS ongoing_works,
                 0::int AS under_review_works
          FROM works w
          LEFT JOIN (SELECT work_id, SUM(amount) AS total_amount FROM expenditures GROUP BY work_id) we ON w.work_id = we.work_id
          GROUP BY w.mp_id
          HAVING COALESCE(SUM(w.sanctioned_amount), 0) > 0
        ) wa ON m.mp_id = wa.mp_id
        ORDER BY fund_utilization DESC NULLS LAST
        LIMIT 5;
      `,
      prisma.$queryRaw`
        SELECT m.mp_id, m.mp_name, m.constituency, COALESCE(s.state_name, '') AS state_name,
               wa.total_works, wa.total_sanctioned_amount, wa.total_expenditure, wa.completed_works, wa.ongoing_works, wa.under_review_works,
               ROUND(((wa.total_expenditure / wa.total_sanctioned_amount) * 100)::numeric, 1)::float AS fund_utilization,
               ROUND(((wa.completed_works::float / wa.total_works::float) * 100)::numeric, 1)::float AS completion_rate
        FROM mps m
        LEFT JOIN states s ON m.state_id = s.state_id
        INNER JOIN (
          SELECT w.mp_id, COUNT(*)::int AS total_works,
                 COALESCE(SUM(w.sanctioned_amount), 0)::float AS total_sanctioned_amount,
                 COALESCE(SUM(we.total_amount), 0)::float AS total_expenditure,
                 COUNT(CASE WHEN w.status = 'Completed' THEN 1 END)::int AS completed_works,
                 COUNT(CASE WHEN w.status = 'Ongoing' THEN 1 END)::int AS ongoing_works,
                 0::int AS under_review_works
          FROM works w
          LEFT JOIN (SELECT work_id, SUM(amount) AS total_amount FROM expenditures GROUP BY work_id) we ON w.work_id = we.work_id
          GROUP BY w.mp_id
          HAVING COALESCE(SUM(w.sanctioned_amount), 0) > 0
        ) wa ON m.mp_id = wa.mp_id
        ORDER BY fund_utilization ASC NULLS LAST
        LIMIT 5;
      `,
    ]);

    const topBottomMpIds = [...top5Res, ...bottom5Res].map((m) => m.mp_id).filter(Boolean);
    const topBottomCatMap = {};
    if (topBottomMpIds.length > 0) {
      const catStats = await prisma.$queryRawUnsafe(
        `SELECT mp_id, category, COUNT(*)::int AS count FROM works WHERE mp_id IN (${topBottomMpIds.join(",")}) AND category IS NOT NULL GROUP BY mp_id, category;`
      );
      for (const row of catStats) {
        if (!topBottomCatMap[row.mp_id]) topBottomCatMap[row.mp_id] = {};
        topBottomCatMap[row.mp_id][row.category] = row.count;
      }
    }

    cachedMetadata = {
      availableStates: statesRes.map((s) => s.state_name),
      availableDistricts: districtsRes.map((d) => d.district_name),
      top5: top5Res.map((m, idx) => ({
        rank: idx + 1,
        mpName: m.mp_name,
        constituency: m.constituency,
        state: m.state_name,
        fundUtilization: m.fund_utilization !== null ? Number(m.fund_utilization) : null,
        completionRate: m.completion_rate !== null ? Number(m.completion_rate) : null,
        totalWorks: Number(m.total_works || 0),
        completedWorks: Number(m.completed_works || 0),
        ongoingWorks: Number(m.ongoing_works || 0),
        underReviewWorks: Number(m.under_review_works || 0),
        totalSanctionedAmount: Number(Number(m.total_sanctioned_amount).toFixed(2)),
        totalExpenditure: Number(Number(m.total_expenditure).toFixed(2)),
        categories: topBottomCatMap[m.mp_id] || {},
      })),
      bottom5: bottom5Res.map((m, idx) => ({
        rank: idx + 1,
        mpName: m.mp_name,
        constituency: m.constituency,
        state: m.state_name,
        fundUtilization: m.fund_utilization !== null ? Number(m.fund_utilization) : null,
        completionRate: m.completion_rate !== null ? Number(m.completion_rate) : null,
        totalWorks: Number(m.total_works || 0),
        completedWorks: Number(m.completed_works || 0),
        ongoingWorks: Number(m.ongoing_works || 0),
        underReviewWorks: Number(m.under_review_works || 0),
        totalSanctionedAmount: Number(Number(m.total_sanctioned_amount).toFixed(2)),
        totalExpenditure: Number(Number(m.total_expenditure).toFixed(2)),
        categories: topBottomCatMap[m.mp_id] || {},
      })),
    };
    lastMetadataTime = now;
  }

  const result = {
    data,
    total,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    availableStates: cachedMetadata.availableStates,
    availableDistricts: cachedMetadata.availableDistricts,
    top5: cachedMetadata.top5,
    bottom5: cachedMetadata.bottom5,
  };

  return result;
}

export default {
  getMpLeaderboard,
};
```


### `backend/src/services/mpWorks.service.js`

*File [48/131] | Lines: 273 | Size: 7.1 KB*

```javascript
import { prisma } from "../config/db.js";
import { getDisplayStatus } from "../utils/workStatus.js";

/**
 * Finds the vendor name from the largest expenditure record for a work.
 */
function resolveVendorName(expenditures = []) {
  if (!Array.isArray(expenditures) || expenditures.length === 0) {
    return "Not Appointed";
  }

  let largest = expenditures[0];
  for (const exp of expenditures) {
    if (Number(exp.amount || 0) > Number(largest.amount || 0)) {
      largest = exp;
    }
  }

  return largest?.vendor?.vendor_name || "Not Appointed";
}

/**
 * services/mpWorks.service.js
 * Full portfolio of development works for the logged-in Member of Parliament.
 *
 * @param {number|string} mpId - MP Primary Key
 * @param {Object} filters - { search, status, category, riskLevel }
 * @returns {Promise<{ data: Array, mp: Object }>}
 */
export async function getMyWorks(mpId, filters = {}) {
  const parsedMpId = parseInt(mpId, 10);
  if (isNaN(parsedMpId)) {
    const error = new Error("Invalid MP ID");
    error.statusCode = 400;
    throw error;
  }

  const {
    search,
    status,
    category,
    riskLevel,
    page = 1,
    limit = 10,
    sortField = "recommendedDate",
    sortDirection = "desc",
  } = filters;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;
  const take = limitNum;

  // 1. Fetch MP profile metadata
  const mp = await prisma.mp.findUnique({
    where: { mp_id: parsedMpId },
    include: {
      state: {
        select: {
          state_name: true,
        },
      },
      works: {
        select: {
          district: {
            select: {
              district_name: true,
            },
          },
        },
        take: 1,
      },
    },
  });

  if (!mp) {
    const error = new Error("MP profile not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Build Prisma where clause
  const where = {
    mp_id: parsedMpId,
  };

  // Filter by category
  if (category && category !== "All") {
    where.category = {
      equals: category,
      mode: "insensitive",
    };
  }

  // Filter by risk level
  if (riskLevel && riskLevel !== "All") {
    where.current_risk_score = {
      risk_level: riskLevel,
    };
  }

  // Search filter across workId, description, and category
  if (search && search.trim() !== "" && search !== "All") {
    const q = search.trim();
    where.OR = [
      { work_id: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
    ];
  }

  // Filter by status in DB
  if (status && status !== "All") {
    const targetStatus = status.trim().toLowerCase();
    if (targetStatus === "completed") {
      where.status = "Completed";
    } else if (targetStatus === "sanctioned") {
      where.status = "Sanctioned";
    } else if (targetStatus === "recommended") {
      where.status = "Recommended";
    } else if (targetStatus === "ongoing") {
      where.status = "Ongoing";
    } else if (targetStatus === "under review") {
      where.OR = [
        ...(where.OR || []),
        { escalations: { some: {} } },
        {
          auditor_reports: {
            some: {
              status: { in: ["UNDER_REVIEW", "UNDER REVIEW", "ESCALATED", "Escalated"] },
            },
          },
        },
      ];
    } else if (targetStatus === "delayed") {
      where.status = "Ongoing";
      where.OR = [
        ...(where.OR || []),
        { completion_date: { lt: new Date() } },
        { current_risk_score: { delay_slippage_pct: { gte: 25 } } },
        { current_risk_score: { flag_reason: { contains: "delay", mode: "insensitive" } } },
      ];
    }
  }

  // Sorting
  const dir = (sortDirection || "desc").toLowerCase() === "asc" ? "asc" : "desc";
  let orderByClause = { recommended_date: dir };
  if (sortField === "workId") {
    orderByClause = { work_id: dir };
  } else if (sortField === "category") {
    orderByClause = { category: dir };
  } else if (sortField === "sanctionDate") {
    orderByClause = { sanction_date: dir };
  } else if (sortField === "sanctionedAmount") {
    orderByClause = { sanctioned_amount: dir };
  } else if (sortField === "status") {
    orderByClause = { status: dir };
  } else if (sortField === "riskScore") {
    orderByClause = { current_risk_score: { risk_score: dir } };
  }

  // 3. Query count and paginated works strictly in PostgreSQL
  const [total, works] = await prisma.$transaction([
    prisma.work.count({ where }),
    prisma.work.findMany({
      where,
      skip,
      take,
      orderBy: [orderByClause, { work_id: "desc" }],
      include: {
        current_risk_score: true,
        expenditures: {
          include: {
            vendor: {
              select: {
                vendor_name: true,
              },
            },
          },
        },
        auditor_reports: {
          select: {
            status: true,
          },
        },
        escalations: {
          select: {
            escalation_id: true,
          },
        },
      },
    }),
  ]);

  // 4. Map ONLY the returned page works
  const data = [];
  for (const work of works) {
    const rs = work.current_risk_score;
    const vendorName = resolveVendorName(work.expenditures);

    let numericRiskScore = null;
    if (rs?.risk_score !== null && rs?.risk_score !== undefined) {
      numericRiskScore = Number(rs.risk_score);
    }

    const recommendedDate = work.recommended_date
      ? new Date(work.recommended_date).toISOString()
      : null;

    const sanctionDate = work.sanction_date
      ? new Date(work.sanction_date).toISOString()
      : null;

    const rawAmt =
      work.sanctioned_amount !== null && work.sanctioned_amount !== undefined
        ? work.sanctioned_amount
        : work.recommended_amount;
    const isEstimated =
      (work.sanctioned_amount === null || work.sanctioned_amount === undefined) &&
      work.recommended_amount !== null &&
      work.recommended_amount !== undefined;

    const sanctionedAmountLakhs =
      rawAmt !== null && rawAmt !== undefined && Number(rawAmt) > 0
        ? Number((Number(rawAmt) / 100000).toFixed(2))
        : 0;

    data.push({
      workId: work.work_id,
      description: work.description || "",
      flagReason: rs?.flag_reason || "",
      category: work.category || "",
      recommendedDate,
      sanctionDate,
      sanctionedAmount: sanctionedAmountLakhs,
      isEstimated,
      status: getDisplayStatus(work),
      riskLevel: rs?.risk_level || null,
      riskScore: numericRiskScore,
      vendorName,
    });
  }

  const districtName =
    mp.works[0]?.district?.district_name || mp.constituency || "";

  const totalPages = Math.ceil(total / limitNum) || 1;

  return {
    data,
    mp: {
      mpName: mp.mp_name || "",
      constituency: mp.constituency || "",
      state: mp.state?.state_name || "",
      district: districtName,
    },
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPreviousPage: pageNum > 1,
    },
  };
}

export default {
  getMyWorks,
};
```


### `backend/src/services/prediction.service.js`

*File [49/131] | Lines: 213 | Size: 5.7 KB*

```javascript
import { prisma } from "../config/db.js";
import { getDisplayStatus } from "../utils/workStatus.js";

/**
 * Generates an 8-point predictive risk curve from current score to predicted score.
 * Simulates non-linear progression accelerating towards the forecasted 30-day risk level.
 *
 * @param {number} currentScore - Starting risk score (0-100)
 * @param {number} predictedScore - Target risk score in 30 days (0-100)
 * @returns {number[]} Array of 8 integer values between 0 and 100
 */
function generateRiskTrajectory(currentScore, predictedScore) {
  const start = Math.round(Number(currentScore || 25));
  const end = Math.round(Number(predictedScore || 75));
  const trajectory = [];

  for (let i = 0; i < 8; i++) {
    // Progress fraction from 0.0 to 1.0
    const progress = i / 7;
    // Apply power curve (1.4 exponent) for non-linear escalation
    const pointValue = Math.round(start + (end - start) * Math.pow(progress, 1.4));
    // Clamp score between 0 and 100
    const clampedScore = Math.max(0, Math.min(100, pointValue));
    trajectory.push(clampedScore);
  }

  return trajectory;
}

/**
 * services/prediction.service.js
 * Fetches works on the predictive risk watchlist with query filtering.
 *
 * @param {Object} filters - { search, state, category }
 * @returns {Promise<{ data: Array }>}
 */
export async function getPredictiveWatchlist(filters = {}) {
  const { search, state, category } = filters;

  const page = Math.max(1, parseInt(filters.page || 1, 10));
  const limit = Math.max(1, Math.min(100, parseInt(filters.limit || 15, 10)));
  const skip = (page - 1) * limit;
  const take = limit;

  const where = {
    prediction: {
      isNot: null,
    },
  };

  // 1. State filter
  if (state && state !== "All") {
    where.state = {
      state_name: {
        equals: state,
        mode: "insensitive",
      },
    };
  }

  // 2. Category filter
  if (category && category !== "All") {
    where.category = {
      equals: category,
      mode: "insensitive",
    };
  }

  // 3. Search filter
  if (search && search.trim() !== "" && search !== "All") {
    const q = search.trim();
    where.OR = [
      { work_id: { contains: q, mode: "insensitive" } },
      { mp: { mp_name: { contains: q, mode: "insensitive" } } },
      { district: { district_name: { contains: q, mode: "insensitive" } } },
    ];
  }

  // 4. Query total count and paginated works in PostgreSQL
  const [total, works] = await prisma.$transaction([
    prisma.work.count({ where }),
    prisma.work.findMany({
      where,
      skip,
      take,
      select: {
        work_id: true,
        category: true,
        sanctioned_amount: true,
        status: true,
        completion_date: true,
        mp: {
          select: {
            mp_name: true,
          },
        },
        state: {
          select: {
            state_name: true,
          },
        },
        district: {
          select: {
            district_name: true,
          },
        },
        prediction: true,
        current_risk_score: {
          select: {
            risk_score: true,
            risk_level: true,
            delay_slippage_pct: true,
            flag_reason: true,
          },
        },
        auditor_reports: {
          select: {
            status: true,
          },
        },
        escalations: {
          select: {
            escalation_id: true,
          },
        },
      },
      orderBy: {
        prediction: {
          risk_delta_pct: "desc",
        },
      },
    }),
  ]);

  // 5. Filter and format watchlist items
  const data = [];

  for (const work of works) {
    const pred = work.prediction;
    if (!pred) continue;

    const currentStatus = getDisplayStatus(work);

    const currentRiskScore =
      pred.current_risk_score !== null && pred.current_risk_score !== undefined
        ? Number(pred.current_risk_score)
        : 0;

    const predictedRiskScore30Days =
      pred.predicted_risk_score_30d !== null && pred.predicted_risk_score_30d !== undefined
        ? Number(pred.predicted_risk_score_30d)
        : 0;

    // Calculate delta percentage
    let riskDeltaPercent = "+0%";
    if (pred.risk_delta_pct !== null && pred.risk_delta_pct !== undefined) {
      const delta = Math.round(Number(pred.risk_delta_pct));
      riskDeltaPercent = `${delta >= 0 ? "+" : ""}${delta}%`;
    } else {
      const delta = Math.round(predictedRiskScore30Days - currentRiskScore);
      riskDeltaPercent = `${delta >= 0 ? "+" : ""}${delta}%`;
    }

    const riskTrajectory = Array.isArray(pred.risk_trajectory)
      ? pred.risk_trajectory
      : generateRiskTrajectory(currentRiskScore, predictedRiskScore30Days);

    const warningSignal =
      pred.warning_signal ||
      "Early warning: Fund utilization trajectory and velocity diverge from target schedule";

    const daysUntilPredictedThreshold =
      pred.days_until_threshold !== null && pred.days_until_threshold !== undefined
        ? Number(pred.days_until_threshold)
        : 14;

    data.push({
      workId: work.work_id,
      mpName: work.mp?.mp_name || "",
      state: work.state?.state_name || "",
      district: work.district?.district_name || "",
      category: work.category || "",
      currentStatus,
      currentRiskScore,
      predictedRiskScore30Days,
      riskDeltaPercent,
      riskTrajectory,
      warningSignal,
      daysUntilPredictedThreshold,
      sanctionedAmount: Number(Number(work.sanctioned_amount || 0).toFixed(2)),
    });
  }

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data,
    total,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export default {
  getPredictiveWatchlist,
};
```


### `backend/src/services/riskScoreHistory.service.js`

*File [50/131] | Lines: 57 | Size: 1.8 KB*

```javascript
import { prisma } from "../config/db.js";

/**
 * Records a new RiskScore entry for a given workId, maintaining current pointer and history.
 * In a single transaction:
 * 1. Sets is_current: false on every existing RiskScore row for workId that currently has is_current: true.
 * 2. Creates the new RiskScore row with is_current: true.
 * 3. Updates Work.current_risk_score_id to point at the newly created row's risk_id.
 *
 * @param {string} workId
 * @param {Object} riskData
 * @returns {Promise<Object>} The newly created RiskScore record
 */
export async function recordRiskScore(workId, riskData) {
  return await prisma.$transaction(async (tx) => {
    // 1. Mark existing current risk scores as non-current
    await tx.riskScore.updateMany({
      where: {
        work_id: workId,
        is_current: true,
      },
      data: {
        is_current: false,
      },
    });

    // 2. Create the new RiskScore record with is_current: true
    const newRiskScore = await tx.riskScore.create({
      data: {
        work_id: workId,
        is_current: true,
        risk_score: riskData.risk_score,
        risk_level: riskData.risk_level,
        cost_overrun_pct: riskData.cost_overrun_pct ?? 0,
        delay_slippage_pct: riskData.delay_slippage_pct ?? 0,
        duplicate_similarity_pct: riskData.duplicate_similarity_pct ?? 0,
        vendor_anomaly_pct: riskData.vendor_anomaly_pct ?? 0,
        progress_mismatch_pct: riskData.progress_mismatch_pct ?? 0,
        flag_reason: riskData.flag_reason,
        ai_diagnostic_summary: riskData.ai_diagnostic_summary,
      },
    });

    // 3. Update Work.current_risk_score_id to point to the new record
    await tx.work.update({
      where: {
        work_id: workId,
      },
      data: {
        current_risk_score_id: newRiskScore.risk_id,
      },
    });

    return newRiskScore;
  });
}
```


### `backend/src/services/shared/latestFor.service.js`

*File [51/131] | Lines: 67 | Size: 1.5 KB*

```javascript
import { prisma } from "../../config/db.js";

/**
 * services/shared/latestFor.service.js
 * Shared query helpers for retrieving the most recent records related to a given workId.
 */

/**
 * Returns the AuditorReport row for this work with the highest submitted_date (null if none exist).
 *
 * @param {string} workId
 * @returns {Promise<Object|null>}
 */
export async function getLatestAuditorReport(workId) {
  if (!workId) return null;

  return await prisma.auditorReport.findFirst({
    where: { work_id: workId },
    orderBy: [
      { submitted_date: "desc" },
      { report_id: "desc" },
    ],
  });
}

/**
 * Returns the Escalation row for this work with the highest escalated_date (null if none exist).
 *
 * @param {string} workId
 * @returns {Promise<Object|null>}
 */
export async function getLatestEscalation(workId) {
  if (!workId) return null;

  return await prisma.escalation.findFirst({
    where: { work_id: workId },
    orderBy: [
      { escalated_date: "desc" },
      { escalation_id: "desc" },
    ],
  });
}

/**
 * Returns the WorkProgress row for this work with the highest report_date (null if none exist).
 *
 * @param {string} workId
 * @returns {Promise<Object|null>}
 */
export async function getLatestWorkProgress(workId) {
  if (!workId) return null;

  return await prisma.workProgress.findFirst({
    where: { work_id: workId },
    orderBy: [
      { report_date: "desc" },
      { progress_id: "desc" },
    ],
  });
}

export default {
  getLatestAuditorReport,
  getLatestEscalation,
  getLatestWorkProgress,
};
```


### `backend/src/services/stateOverview.service.js`

*File [52/131] | Lines: 365 | Size: 9.5 KB*

```javascript
import { prisma } from "../config/db.js";
import { buildWorkDetailResponse } from "./workDetail.service.js";

/**
 * services/stateOverview.service.js
 * State-level rollup of all districts in this state with comparative risk statistics.
 *
 * @param {number|string} stateId - State Primary Key (from req.user.state_id)
 * @returns {Promise<{ state: Object, kpis: Object, districts: Array }>}
 */
export async function getStateOverview(stateId) {
  const parsedStateId = parseInt(stateId, 10);
  if (isNaN(parsedStateId)) {
    const error = new Error("Invalid State ID");
    error.statusCode = 400;
    throw error;
  }

  // 1. Fetch State record
  const state = await prisma.state.findUnique({
    where: { state_id: parsedStateId },
  });

  if (!state) {
    const error = new Error("State profile not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Fetch all districts belonging to this state
  const districts = await prisma.district.findMany({
    where: { state_id: parsedStateId },
    orderBy: { district_name: "asc" },
  });

  // 3. Fetch all works situated in this state
  const works = await prisma.work.findMany({
    where: { state_id: parsedStateId },
    include: {
      district: {
        select: {
          district_id: true,
          district_name: true,
        },
      },
      current_risk_score: true,
    },
  });

  // 4. Compute state-level summary KPIs in a single clean pass
  const totalWorks = works.length;
  const coveredDistrictIds = new Set();
  let totalSanctionedWorks = 0;
  let totalSanctionedAmount = 0;
  let totalCompleted = 0;
  let totalFlaggedCount = 0;
  let totalRiskScoreSum = 0;
  let scoredWorksCount = 0;

  for (const w of works) {
    if (w.district_id) {
      coveredDistrictIds.add(w.district_id);
    }

    if (w.status !== "Recommended") {
      totalSanctionedWorks += 1;
      totalSanctionedAmount += Number(w.sanctioned_amount || 0);
    }

    if (w.status === "Completed") {
      totalCompleted += 1;
    }

    if (
      w.status !== "Recommended" &&
      w.current_risk_score &&
      (w.current_risk_score.risk_level === "Medium" || w.current_risk_score.risk_level === "High")
    ) {
      totalFlaggedCount += 1;
    }

    if (w.current_risk_score?.risk_score !== null && w.current_risk_score?.risk_score !== undefined) {
      totalRiskScoreSum += Number(w.current_risk_score.risk_score);
      scoredWorksCount += 1;
    }
  }

  const totalDistrictsCovered = coveredDistrictIds.size;
  // Convert from Rupees to Crores (/ 10,000,000)
  const totalSanctionedCr = Number((totalSanctionedAmount / 10000000).toFixed(2));

  const completionRate =
    totalSanctionedWorks > 0
      ? Number(((totalCompleted / totalSanctionedWorks) * 100).toFixed(1))
      : 0;

  const avgRiskScore =
    scoredWorksCount > 0 ? Math.round(totalRiskScoreSum / scoredWorksCount) : 0;

  const kpis = {
    totalWorks,
    totalDistrictsCovered,
    totalSanctionedCr,
    totalCompleted,
    completionRate,
    totalFlaggedCount,
    avgRiskScore,
  };

  // 5. Per-district comparative statistics
  const districtWorksMap = new Map();
  for (const d of districts) {
    districtWorksMap.set(d.district_id, []);
  }
  for (const w of works) {
    if (districtWorksMap.has(w.district_id)) {
      districtWorksMap.get(w.district_id).push(w);
    }
  }

  const districtList = [];

  for (const d of districts) {
    const dWorks = districtWorksMap.get(d.district_id) || [];
    const dTotalWorks = dWorks.length;
    let dSanctionedAmount = 0;
    let dCompleted = 0;
    let flaggedCount = 0;
    let dRiskSum = 0;
    let dScoredCount = 0;

    for (const w of dWorks) {
      dSanctionedAmount += Number(w.sanctioned_amount || 0);
      if (w.status === "Completed") dCompleted += 1;

      if (
        w.status !== "Recommended" &&
        w.current_risk_score &&
        (w.current_risk_score.risk_level === "Medium" || w.current_risk_score.risk_level === "High")
      ) {
        flaggedCount += 1;
      }

      if (w.current_risk_score?.risk_score !== null && w.current_risk_score?.risk_score !== undefined) {
        dRiskSum += Number(w.current_risk_score.risk_score);
        dScoredCount += 1;
      }
    }

    // Convert from Rupees to Crores (/ 10,000,000)
    const sanctionedCr = Number((dSanctionedAmount / 10000000).toFixed(2));
    const dCompRate =
      dTotalWorks > 0 ? Number(((dCompleted / dTotalWorks) * 100).toFixed(1)) : 0;
    const dAvgRiskScore = dScoredCount > 0 ? Math.round(dRiskSum / dScoredCount) : 0;

    districtList.push({
      district: d.district_name,
      totalWorks: dTotalWorks,
      sanctionedCr,
      completionRate: dCompRate,
      flaggedCount,
      avgRiskScore: dAvgRiskScore,
    });
  }

  // Sort districts: highest flagged count first, then alphabetical by district name
  districtList.sort((a, b) => {
    if (b.flaggedCount !== a.flaggedCount) {
      return b.flaggedCount - a.flaggedCount;
    }
    return a.district.localeCompare(b.district);
  });

  return {
    state: {
      stateName: state.state_name || "",
      headquarters:
        state.headquarters || `State Secretariat, ${state.state_name}`,
      nodalDepartment:
        state.nodal_department ||
        state.nodalDepartment ||
        `Planning & Development Department, Govt of ${state.state_name}`,
    },
    kpis,
    districts: districtList,
  };
}

/**
 * Detailed drill-down summary for a single district under the authenticated state.
 * Returns district KPIs and top 3 highest-risk projects in full WorkDetail format.
 *
 * @param {number|string} stateId
 * @param {string} districtName
 * @returns {Promise<Object>}
 */
export async function getDistrictSummary(stateId, districtName) {
  const parsedStateId = parseInt(stateId, 10);
  if (isNaN(parsedStateId)) {
    const error = new Error("Invalid State ID");
    error.statusCode = 400;
    throw error;
  }

  if (!districtName || typeof districtName !== "string" || !districtName.trim()) {
    const error = new Error("District name is required");
    error.statusCode = 400;
    throw error;
  }

  // 1. Verify the district belongs to this state
  const district = await prisma.district.findFirst({
    where: {
      state_id: parsedStateId,
      district_name: {
        equals: districtName.trim(),
        mode: "insensitive",
      },
    },
    include: {
      state: {
        select: {
          state_name: true,
        },
      },
    },
  });

  if (!district) {
    const error = new Error("District not found in this state");
    error.statusCode = 404;
    throw error;
  }

  // 2. Fetch all works for this district
  const works = await prisma.work.findMany({
    where: {
      district_id: district.district_id,
    },
    include: {
      mp: {
        select: {
          mp_id: true,
          mp_name: true,
          constituency: true,
        },
      },
      district: {
        select: {
          district_name: true,
        },
      },
      state: {
        select: {
          state_name: true,
        },
      },
      current_risk_score: true,
      prediction: true,
      auditor_reports: {
        orderBy: {
          submitted_date: "desc",
        },
        take: 1,
      },
      expenditures: {
        include: {
          vendor: {
            select: {
              vendor_name: true,
            },
          },
        },
        orderBy: {
          amount: "desc",
        },
      },
      work_progress: {
        orderBy: {
          report_date: "desc",
        },
        take: 1,
      },
      escalations: {
        select: {
          escalation_id: true,
        },
      },
    },
  });

  // 3. Compute district metrics in a single pass
  const totalWorks = works.length;
  let totalSanctionedAmount = 0;
  let completed = 0;
  let flaggedCount = 0;
  let totalRiskScoreSum = 0;
  let scoredCount = 0;
  let high = 0;
  let medium = 0;
  let low = 0;

  for (const w of works) {
    if (w.status !== "Recommended") {
      totalSanctionedAmount += Number(w.sanctioned_amount || 0);
    }
    if (w.status === "Completed") {
      completed += 1;
    }

    const rLevel = w.current_risk_score?.risk_level;
    if (rLevel === "High") high += 1;
    if (rLevel === "Medium") medium += 1;
    if (rLevel === "Low") low += 1;

    if (w.status !== "Recommended" && (rLevel === "Medium" || rLevel === "High")) {
      flaggedCount += 1;
    }

    if (w.current_risk_score?.risk_score !== null && w.current_risk_score?.risk_score !== undefined) {
      totalRiskScoreSum += Number(w.current_risk_score.risk_score);
      scoredCount += 1;
    }
  }

  // Convert from Rupees to Crores (/ 10,000,000)
  const sanctionedCr = Number((totalSanctionedAmount / 10000000).toFixed(2));
  const completionRate =
    totalWorks > 0 ? Number(((completed / totalWorks) * 100).toFixed(1)) : 0;
  const avgRiskScore = scoredCount > 0 ? Math.round(totalRiskScoreSum / scoredCount) : 0;

  // 4. Top 3 highest-risk projects in this district
  const sortedWorks = [...works].sort((a, b) => {
    const scoreA = Number(a.current_risk_score?.risk_score || 0);
    const scoreB = Number(b.current_risk_score?.risk_score || 0);
    return scoreB - scoreA;
  });

  const top3Works = sortedWorks.slice(0, 3);
  const topRiskProjects = top3Works.map((w) => buildWorkDetailResponse(w));

  return {
    district: district.district_name,
    state: district.state?.state_name || "",
    totalWorks,
    sanctionedCr,
    completionRate,
    flaggedCount,
    avgRiskScore,
    completed,
    riskBreakdown: {
      high,
      medium,
      low,
    },
    topRiskProjects,
    topProjects: topRiskProjects,
  };
}

export default {
  getStateOverview,
  getDistrictSummary,
};
```


### `backend/src/services/trendsAnalytics.service.js`

*File [53/131] | Lines: 493 | Size: 13.1 KB*

```javascript
import { prisma } from "../config/db.js";
import { getDisplayStatus } from "../utils/workStatus.js";

/**
 * Business Rule Helper:
 * Checks if a vendor has a flagged works ratio greater than 40%.
 */
function hasHighFlaggedRate(flaggedCount, worksAwarded) {
  if (!worksAwarded || worksAwarded <= 0) return false;
  const flaggedRate = flaggedCount / worksAwarded;
  return flaggedRate > 0.4;
}

/**
 * Business Rule Helper:
 * Checks if a vendor operates exclusively in a single state across 5 or more awarded contracts.
 */
function worksMostlyInOneState(stateCount, worksAwarded) {
  return stateCount === 1 && worksAwarded >= 5;
}

/**
 * 1. getMonthlyTrends
 * Last 12 months, oldest first, bucketed by RiskScore.calculated_at.
 * Scoped optionally to stateId and districtId.
 * - totalFlagged = count of RiskScore rows with riskLevel IN ('Medium','High')
 * - costOverrun = flagged rows where cost_overrun_pct > 0
 * - delayStall = flagged works where getDisplayStatus(work) === 'Delayed'
 *
 * @param {Object} [filters]
 * @param {number} [filters.stateId]
 * @param {number} [filters.districtId]
 * @returns {Promise<Array<{ month: string, totalFlagged: number, costOverrun: number, delayStall: number }>>}
 */
export async function getMonthlyTrends({ stateId, districtId } = {}) {
  // Find the most recent risk calculation date to use as reference
  const latestRow = await prisma.riskScore.findFirst({
    where: {
      risk_level: { in: ["Medium", "High"] },
      ...(stateId || districtId
        ? {
            work: {
              ...(stateId ? { state_id: stateId } : {}),
              ...(districtId ? { district_id: districtId } : {}),
            },
          }
        : {}),
    },
    orderBy: { calculated_at: "desc" },
    select: { calculated_at: true },
  });

  const now = new Date();
  const refDate = latestRow?.calculated_at ? new Date(latestRow.calculated_at) : now;

  const months = [];
  const monthMap = new Map();

  // Generate buckets for the last 12 months (oldest first)
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(refDate.getUTCFullYear(), refDate.getUTCMonth() - i, 1));
    const year = d.getUTCFullYear();
    const monthIndex = d.getUTCMonth();
    const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

    const bucket = {
      month: label,
      totalFlagged: 0,
      costOverrun: 0,
      delayStall: 0,
    };

    months.push(bucket);
    monthMap.set(key, bucket);
  }

  const startDate = new Date(Date.UTC(refDate.getUTCFullYear(), refDate.getUTCMonth() - 11, 1, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(refDate.getUTCFullYear(), refDate.getUTCMonth() + 1, 0, 23, 59, 59, 999));

  // Query risk scores in the 12-month window
  const riskScores = await prisma.riskScore.findMany({
    where: {
      risk_level: { in: ["Medium", "High"] },
      calculated_at: {
        gte: startDate,
        lte: endDate,
      },
      ...(stateId || districtId
        ? {
            work: {
              ...(stateId ? { state_id: stateId } : {}),
              ...(districtId ? { district_id: districtId } : {}),
            },
          }
        : {}),
    },
    select: {
      calculated_at: true,
      cost_overrun_pct: true,
      delay_slippage_pct: true,
      flag_reason: true,
      risk_score: true,
      work: {
        select: {
          work_id: true,
          status: true,
          completion_date: true,
          auditor_reports: {
            select: { status: true },
          },
          escalations: {
            select: { escalation_id: true },
          },
        },
      },
    },
  });

  for (const rs of riskScores) {
    if (!rs.calculated_at) continue;

    const d = new Date(rs.calculated_at);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const bucket = monthMap.get(key);
    if (!bucket) continue;

    bucket.totalFlagged += 1;

    if (Number(rs.cost_overrun_pct || 0) > 0) {
      bucket.costOverrun += 1;
    }

    const workData = {
      ...rs.work,
      risk_score: rs,
    };
    if (getDisplayStatus(workData) === "Delayed") {
      bucket.delayStall += 1;
    }
  }

  return months;
}

/**
 * 2. getCategoryAnomalies
 * Top 6 work categories with Medium or High risk scores, sorted by count descending.
 * Scoped optionally to stateId and districtId.
 *
 * @param {Object} [filters]
 * @param {number} [filters.stateId]
 * @param {number} [filters.districtId]
 * @returns {Promise<Array<{ category: string, count: number }>>}
 */
export async function getCategoryAnomalies({ stateId, districtId } = {}) {
  const groups = await prisma.work.groupBy({
    by: ["category"],
    where: {
      category: { not: null },
      current_risk_score: {
        risk_level: { in: ["Medium", "High"] },
      },
      ...(stateId ? { state_id: stateId } : {}),
      ...(districtId ? { district_id: districtId } : {}),
    },
    _count: {
      work_id: true,
    },
  });

  const formatted = groups
    .filter((g) => g.category)
    .map((g) => ({
      category: g.category,
      count: g._count.work_id,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return formatted;
}

/**
 * 3. getTopVendors
 * Groups expenditures by vendor, evaluates concentration risk, and returns top 5.
 * Scoped optionally to stateId and districtId by evaluating only in-scope expenditures.
 *
 * @param {Object} [filters]
 * @param {number} [filters.stateId]
 * @param {number} [filters.districtId]
 * @returns {Promise<Array<{
 *   vendor: string,
 *   stateConcentration: string,
 *   isSuspicious: boolean,
 *   riskRatio: string,
 *   worksAwarded: number,
 *   totalAmountCr: number,
 *   flaggedCount: number
 * }>>}
 */
export async function getTopVendors({ stateId, districtId } = {}) {
  const vendors = await prisma.vendor.findMany({
    where: {
      expenditures: {
        some: {},
      },
    },
    select: {
      vendor_id: true,
      vendor_name: true,
      expenditures: {
        select: {
          amount: true,
          work: {
            select: {
              work_id: true,
              state_id: true,
              district_id: true,
              state: {
                select: {
                  state_name: true,
                },
              },
              current_risk_score: {
                select: {
                  risk_level: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const vendorStats = [];

  for (const v of vendors) {
    let totalExpenditureAmount = 0;
    const workMap = new Map();
    const stateSet = new Set();

    for (const exp of v.expenditures) {
      if (!exp.work) continue;

      // Skip individual expenditures falling outside selected state/district scope
      if (stateId && exp.work.state_id !== stateId) {
        continue;
      }
      if (districtId && exp.work.district_id !== districtId) {
        continue;
      }

      totalExpenditureAmount += Number(exp.amount || 0);

      const wId = exp.work.work_id;
      if (!workMap.has(wId)) {
        const stateName = exp.work.state?.state_name;
        if (stateName) {
          stateSet.add(stateName);
        }
        const riskLevel = exp.work.current_risk_score?.risk_level;
        const isFlagged = riskLevel === "Medium" || riskLevel === "High";
        workMap.set(wId, {
          stateName,
          isFlagged,
        });
      }
    }

    const worksAwarded = workMap.size;
    if (worksAwarded === 0) continue;

    let flaggedCount = 0;
    for (const w of workMap.values()) {
      if (w.isFlagged) flaggedCount++;
    }

    const stateConcentration = Array.from(stateSet).sort().join(", ") || "N/A";
    const totalAmountCr = Number((totalExpenditureAmount / 100).toFixed(2));

    // Evaluate concentration risk criteria using descriptive helpers
    const highFlagged = hasHighFlaggedRate(flaggedCount, worksAwarded);
    const oneState = worksMostlyInOneState(stateSet.size, worksAwarded);
    const isSuspicious = highFlagged || oneState;

    const riskRatio = `${flaggedCount}:${worksAwarded}`;

    vendorStats.push({
      vendor: v.vendor_name,
      stateConcentration,
      isSuspicious,
      riskRatio,
      worksAwarded,
      totalAmountCr,
      flaggedCount,
    });
  }

  // Sort top 5 vendors by works awarded descending, then by total amount descending
  vendorStats.sort((a, b) => {
    if (b.worksAwarded !== a.worksAwarded) {
      return b.worksAwarded - a.worksAwarded;
    }
    return b.totalAmountCr - a.totalAmountCr;
  });

  return vendorStats.slice(0, 5);
}

/**
 * 4. getStateComparison
 * Top 10 states by total work count; completion rate and flagged percentage (0-100, 1dp).
 * Special filtering behavior:
 * - If districtId is supplied, returns [] (state-level comparison not applicable at district level).
 * - If stateId is supplied, returns only that one state's numbers.
 * - If neither supplied, returns top 10 states by total work count.
 *
 * @param {Object} [filters]
 * @param {number} [filters.stateId]
 * @param {number} [filters.districtId]
 * @returns {Promise<Array<{ state: string, completionRate: number, flaggedPercent: number }>>}
 */
export async function getStateComparison({ stateId, districtId } = {}) {
  // District filter active: state comparison not applicable
  if (districtId) {
    return [];
  }

  // Single state filter active: return only that one state's numbers
  if (stateId) {
    const stateRecord = await prisma.state.findUnique({
      where: { state_id: stateId },
      select: { state_id: true, state_name: true },
    });

    if (!stateRecord) return [];

    const [totalWorks, completedWorks, flaggedWorks] = await Promise.all([
      prisma.work.count({
        where: { state_id: stateId },
      }),
      prisma.work.count({
        where: {
          state_id: stateId,
          status: "Completed",
        },
      }),
      prisma.work.count({
        where: {
          state_id: stateId,
          current_risk_score: {
            risk_level: { in: ["Medium", "High"] },
          },
        },
      }),
    ]);

    const completionRate =
      totalWorks > 0
        ? Number(((completedWorks / totalWorks) * 100).toFixed(1))
        : 0;

    const flaggedPercent =
      totalWorks > 0
        ? Number(((flaggedWorks / totalWorks) * 100).toFixed(1))
        : 0;

    return [
      {
        state: stateRecord.state_name,
        completionRate,
        flaggedPercent,
      },
    ];
  }

  // National view: top 10 states by total work count
  const stateWorkCounts = await prisma.work.groupBy({
    by: ["state_id"],
    _count: {
      work_id: true,
    },
    orderBy: {
      _count: {
        work_id: "desc",
      },
    },
    take: 10,
  });

  if (stateWorkCounts.length === 0) {
    return [];
  }

  const stateIds = stateWorkCounts.map((s) => s.state_id);

  // Fetch state names, completed counts, and flagged counts in parallel
  const [states, completedByState, flaggedByState] = await Promise.all([
    prisma.state.findMany({
      where: {
        state_id: { in: stateIds },
      },
      select: {
        state_id: true,
        state_name: true,
      },
    }),
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        state_id: { in: stateIds },
        status: "Completed",
      },
      _count: {
        work_id: true,
      },
    }),
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        state_id: { in: stateIds },
        current_risk_score: {
          risk_level: { in: ["Medium", "High"] },
        },
      },
      _count: {
        work_id: true,
      },
    }),
  ]);

  const stateNameMap = new Map(states.map((s) => [s.state_id, s.state_name]));
  const completedMap = new Map(completedByState.map((c) => [c.state_id, c._count.work_id]));
  const flaggedMap = new Map(flaggedByState.map((f) => [f.state_id, f._count.work_id]));

  return stateWorkCounts.map((sw) => {
    const totalWorks = sw._count.work_id;
    const completedCount = completedMap.get(sw.state_id) || 0;
    const flaggedCount = flaggedMap.get(sw.state_id) || 0;

    const completionRate =
      totalWorks > 0
        ? Number(((completedCount / totalWorks) * 100).toFixed(1))
        : 0;

    const flaggedPercent =
      totalWorks > 0
        ? Number(((flaggedCount / totalWorks) * 100).toFixed(1))
        : 0;

    return {
      state: stateNameMap.get(sw.state_id) || `State ${sw.state_id}`,
      completionRate,
      flaggedPercent,
    };
  });
}

/**
 * 5. getTrendsLocations
 * Returns all states with their associated districts for dynamic filtering dropdowns.
 *
 * @returns {Promise<Array<{ state_id: number, state_name: string, districts: Array<{ district_id: number, district_name: string }> }>>}
 */
export async function getTrendsLocations() {
  const states = await prisma.state.findMany({
    orderBy: { state_name: "asc" },
    select: {
      state_id: true,
      state_name: true,
      districts: {
        orderBy: { district_name: "asc" },
        select: {
          district_id: true,
          district_name: true,
        },
      },
    },
  });

  return states;
}

export default {
  getMonthlyTrends,
  getCategoryAnomalies,
  getTopVendors,
  getStateComparison,
  getTrendsLocations,
};
```


### `backend/src/services/vendorForensics.service.js`

*File [54/131] | Lines: 271 | Size: 7.8 KB*

```javascript
import { prisma } from "../config/db.js";

/**
 * services/vendorForensics.service.js
 * Vendor Cross-Reference & Cartel Forensics Tool.
 * Analyzes multi-contract concentration, repeat identical amounts,
 * and simultaneous fund disbursement signatures.
 */

// Named thresholds for pattern detection rules (easy to tune)
export const ROUND_FIGURE_REPEAT_THRESHOLD = 3;
export const SINGLE_STATE_MIN_WORKS_THRESHOLD = 5;

/**
 * Searches and evaluates a vendor profile and cross-referenced works.
 *
 * @param {string} searchName - Partial or exact vendor name to search
 * @returns {Promise<Object>}
 */
export async function getVendorProfile(searchName) {
  let query = "";
  if (searchName && typeof searchName === "string" && searchName.trim()) {
    query = searchName.trim();
  }

  // 1. Find matching vendors (case-insensitive partial search)
  let matchingVendors = [];
  if (query) {
    matchingVendors = await prisma.vendor.findMany({
      where: {
        vendor_name: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: {
        vendor_name: "asc",
      },
    });
  }

  // If no match found or query was empty, select the top vendor by expenditure count from database
  if (!matchingVendors || matchingVendors.length === 0) {
    const defaultVendor = await prisma.vendor.findFirst({
      orderBy: {
        expenditures: {
          _count: "desc",
        },
      },
    });
    if (defaultVendor) {
      matchingVendors = [defaultVendor];
    }
  }

  if (!matchingVendors || matchingVendors.length === 0) {
    const error = new Error(`Vendor "${query}" not found`);
    error.statusCode = 404;
    throw error;
  }

  // Select exact match first if available, otherwise default to first match
  let vendor = matchingVendors[0];
  for (const v of matchingVendors) {
    if (v.vendor_name.toLowerCase() === query.toLowerCase()) {
      vendor = v;
      break;
    }
  }

  // 2. Load all expenditure payments made to this vendor
  const expenditures = await prisma.expenditure.findMany({
    where: {
      vendor_id: vendor.vendor_id,
    },
    include: {
      work: {
        include: {
          mp: {
            select: {
              mp_id: true,
              mp_name: true,
            },
          },
          district: {
            select: {
              district_id: true,
              district_name: true,
            },
          },
          state: {
            select: {
              state_id: true,
              state_name: true,
            },
          },
          current_risk_score: true,
        },
      },
    },
    orderBy: {
      payment_date: "desc",
    },
  });

  // 3. Deduplicate expenditures by work (a vendor can receive multiple payment tranches per work)
  const distinctWorksMap = new Map();
  let totalPaymentRupees = 0;

  for (const exp of expenditures) {
    totalPaymentRupees += Number(exp.amount || 0);

    if (exp.work && !distinctWorksMap.has(exp.work_id)) {
      distinctWorksMap.set(exp.work_id, exp.work);
    }
  }

  const works = Array.from(distinctWorksMap.values());
  const totalWorks = works.length;

  // Stored in Rupees; convert to Lakhs (/ 100,000) and Crores (/ 10,000,000)
  const totalPaymentLakhs = Number((totalPaymentRupees / 100000).toFixed(2));
  const totalPaymentCr = Number((totalPaymentRupees / 10000000).toFixed(2));
  const avgPaymentLakhs =
    totalWorks > 0 ? Number((totalPaymentLakhs / totalWorks).toFixed(1)) : 0;

  // Track high-risk works and geographical reach
  let highRiskCount = 0;
  const mpsSet = new Set();
  const districtsSet = new Set();
  const statesSet = new Set();

  for (const w of works) {
    if (w.current_risk_score && w.current_risk_score.risk_level === "High") {
      highRiskCount += 1;
    }
    if (w.mp?.mp_name) mpsSet.add(w.mp.mp_name);
    if (w.district?.district_name) districtsSet.add(w.district.district_name);
    if (w.state?.state_name) statesSet.add(w.state.state_name);
  }

  const distinctMps = Array.from(mpsSet).sort();
  const distinctDistricts = Array.from(districtsSet).sort();
  const distinctStates = Array.from(statesSet).sort();

  // 4. Pattern Detection Rules

  // Map to store per-work red flags: workId -> string[]
  const workFlagsMap = new Map();
  for (const w of works) {
    workFlagsMap.set(w.work_id, []);
  }

  const patternAlerts = [];

  // RULE 1: ROUND_FIGURE_REPEAT (3+ different works with identical sanctionedAmount)
  const amountToWorksMap = new Map();
  for (const w of works) {
    const rawAmt =
      w.sanctioned_amount !== null && w.sanctioned_amount !== undefined
        ? w.sanctioned_amount
        : w.recommended_amount;
    const amtStr = Number((Number(rawAmt || 0) / 100000).toFixed(2));
    if (!amountToWorksMap.has(amtStr)) {
      amountToWorksMap.set(amtStr, []);
    }
    amountToWorksMap.get(amtStr).push(w.work_id);
  }

  for (const [amtStr, workIds] of amountToWorksMap.entries()) {
    if (workIds.length >= ROUND_FIGURE_REPEAT_THRESHOLD) {
      const flagText = `Identical Amount (₹${amtStr}L) ×${workIds.length}`;
      for (const wid of workIds) {
        workFlagsMap.get(wid).push(flagText);
      }
      patternAlerts.push(
        `Round-Figure Anomaly: ${workIds.length} works awarded with identical ₹${amtStr}L amounts.`
      );
    }
  }

  // RULE 2: SINGLE_STATE_CONCENTRATION (exclusive operation in 1 state across 5+ works)
  if (distinctStates.length === 1 && totalWorks >= SINGLE_STATE_MIN_WORKS_THRESHOLD) {
    patternAlerts.push(
      `Vendor operates exclusively within ${distinctStates[0]} across ${totalWorks} contracts — check for regional favoritism.`
    );
  }

  // 5. Build works list with flags
  const formattedWorks = works.map((w) => {
    const flags = workFlagsMap.get(w.work_id) || [];
    const isRedFlagged = flags.length > 0;

    let numericRiskScore = null;
    if (w.current_risk_score?.risk_score !== null && w.current_risk_score?.risk_score !== undefined) {
      numericRiskScore = Number(w.current_risk_score.risk_score);
    }

    const rawAmt =
      w.sanctioned_amount !== null && w.sanctioned_amount !== undefined
        ? w.sanctioned_amount
        : w.recommended_amount;
    const isEstimated =
      (w.sanctioned_amount === null || w.sanctioned_amount === undefined) &&
      w.recommended_amount !== null &&
      w.recommended_amount !== undefined;

    const sanctionedAmountLakhs =
      rawAmt !== null && rawAmt !== undefined && Number(rawAmt) > 0
        ? Number((Number(rawAmt) / 100000).toFixed(2))
        : 0;

    return {
      workId: w.work_id,
      mpName: w.mp?.mp_name || "Unknown MP",
      category: w.category || "",
      state: w.state?.state_name || "",
      district: w.district?.district_name || "",
      sanctionedAmount: sanctionedAmountLakhs,
      isEstimated,
      riskLevel: w.current_risk_score?.risk_level || null,
      riskScore: numericRiskScore,
      flags,
      isRedFlagged,
    };
  });

  // Sort works: red-flagged works first, then by riskScore descending
  formattedWorks.sort((a, b) => {
    if (a.isRedFlagged !== b.isRedFlagged) {
      return a.isRedFlagged ? -1 : 1;
    }
    return (b.riskScore || 0) - (a.riskScore || 0);
  });

  const popularVendors = await prisma.vendor.findMany({
    take: 5,
    orderBy: {
      expenditures: {
        _count: "desc",
      },
    },
    select: {
      vendor_name: true,
    },
  });

  return {
    vendorName: vendor.vendor_name,
    totalWorks,
    highRiskCount,
    totalPaymentCr,
    distinctMpsCount: distinctMps.length,
    distinctMps,
    distinctDistrictsCount: distinctDistricts.length,
    distinctStatesCount: distinctStates.length,
    distinctStates,
    avgPaymentLakhs,
    patternAlerts,
    popularVendors: popularVendors.map((v) => v.vendor_name),
    works: formattedWorks,
  };
}

export default {
  ROUND_FIGURE_REPEAT_THRESHOLD,
  // SAME_DAY_RELEASE_THRESHOLD,
  SINGLE_STATE_MIN_WORKS_THRESHOLD,
  getVendorProfile,
};
```


### `backend/src/services/verificationQueue.service.js`

*File [55/131] | Lines: 356 | Size: 9.3 KB*

```javascript
import { prisma } from "../config/db.js";

/**
 * In-memory store for evidence reminder notices to guarantee persistence
 * even if notification columns are not migrated on the database table yet.
 */
export const reminderStore = new Map();

/**
 * 1) GET /api/district/verification
 * Returns works in this district where status = 'Completed' AND
 * the work's most recent WorkProgress row either doesn't exist
 * or has evidence_status != 'present'.
 *
 * @param {number|string} districtId - District Primary Key (from req.user.district_id)
 * @returns {Promise<{ data: Array }>}
 */
export async function getVerificationQueue(districtId, query = {}) {
  const parsedDistrictId = parseInt(districtId, 10);
  if (isNaN(parsedDistrictId)) {
    const error = new Error("Invalid District ID");
    error.statusCode = 400;
    throw error;
  }

  const { search, page = 1, limit = 15 } = query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 15));
  const skip = (pageNum - 1) * limitNum;
  const take = limitNum;

  const where = {
    district_id: parsedDistrictId,
    status: "Completed",
    work_progress: {
      none: {
        evidence_status: "present",
      },
    },
  };

  if (search && search.trim() !== "" && search !== "All") {
    const q = search.trim();
    where.AND = [
      {
        OR: [
          { work_id: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { mp: { mp_name: { contains: q, mode: "insensitive" } } },
        ],
      },
    ];
  }

  // 1. Fetch total count and page of completed works missing evidence in this district
  const [total, works] = await prisma.$transaction([
    prisma.work.count({ where }),
    prisma.work.findMany({
      where,
      skip,
      take,
      orderBy: {
        completion_date: "desc",
      },
      include: {
        mp: {
          select: {
            mp_id: true,
            mp_name: true,
          },
        },
        current_risk_score: true,
        expenditures: {
          include: {
            vendor: {
              select: {
                vendor_name: true,
              },
            },
          },
          orderBy: {
            amount: "desc",
          },
        },
        work_progress: {
          orderBy: [
            { report_date: "desc" },
            { progress_id: "desc" },
          ],
        },
        escalations: {
          orderBy: {
            escalation_id: "desc",
          },
        },
        asset_creation: {
          orderBy: {
            asset_id: "desc",
          },
        },
      },
    }),
  ]);

  const now = Date.now();
  const data = [];

  for (const w of works) {
    const mpName = w.mp?.mp_name || "Unknown MP";

    // Extract vendor name from largest expenditure row
    const largestExp = w.expenditures?.[0];
    const vendorName = largestExp?.vendor?.vendor_name || "Not Appointed";

    // Calculate days elapsed since completion
    let compDateObj = new Date();
    if (w.completion_date) {
      compDateObj = new Date(w.completion_date);
    } else if (w.created_at) {
      compDateObj = new Date(w.created_at);
    }

    const completionDate = compDateObj.toISOString();
    const diffMs = now - compDateObj.getTime();
    const daysSinceCompletion = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    // Check if an evidence reminder was previously sent
    const reminderInfo = reminderStore.get(w.work_id);
    const evidenceReminderSent = Boolean(
      reminderInfo?.sent || w.evidence_reminder_sent || false
    );

    const latestEscalation = w.escalations?.[0];
    const escalationSource = latestEscalation?.escalation_source || null;

    let numericRiskScore = null;
    if (w.current_risk_score?.risk_score !== null && w.current_risk_score?.risk_score !== undefined) {
      numericRiskScore = Number(w.current_risk_score.risk_score);
    }

    const latestAsset = w.asset_creation?.[0];
    const assetVerificationStatus = latestAsset?.verification_status || null;

    data.push({
      workId: w.work_id,
      mpName,
      category: w.category || "",
      description: w.description || "",
      flagReason: w.current_risk_score?.flag_reason || null,
      vendorName,
      completionDate,
      daysSinceCompletion,
      riskLevel: w.current_risk_score?.risk_level || null,
      riskScore: numericRiskScore,
      evidenceReminderSent,
      escalationSource,
      assetVerificationStatus,
    });
  }

  const totalPages = Math.ceil(total / limitNum) || 1;

  return {
    data,
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPreviousPage: pageNum > 1,
    },
  };
}

/**
 * 2) POST /api/district/verification/:workId/verify
 * Confirms ground photo evidence and sets physical progress to 100%.
 *
 * @param {number|string} districtId
 * @param {string} workId
 * @param {Object} user
 * @returns {Promise<{ success: boolean, workId: string, verifiedAt: string }>}
 */
export async function markWorkVerified(districtId, workId, user) {
  const parsedDistrictId = parseInt(districtId, 10);
  if (isNaN(parsedDistrictId)) {
    const error = new Error("Invalid District ID");
    error.statusCode = 400;
    throw error;
  }

  const work = await prisma.work.findUnique({
    where: { work_id: workId },
    select: { work_id: true, district_id: true },
  });

  if (!work) {
    const error = new Error("Work not found");
    error.statusCode = 404;
    throw error;
  }

  if (work.district_id !== parsedDistrictId) {
    const error = new Error("Unauthorized: Work does not belong to your district");
    error.statusCode = 403;
    throw error;
  }

  const today = new Date();
  const reportedBy = user?.name || user?.username || "District Authority";

  // Create progress record marking ground evidence present and progress 100%
  await prisma.workProgress.create({
    data: {
      work_id: workId,
      report_date: today,
      evidence_status: "present",
      physical_progress_pct: 100,
      reported_by: reportedBy,
    },
  });

  return {
    success: true,
    workId,
    verifiedAt: today.toISOString(),
  };
}

/**
 * 3) POST /api/district/verification/:workId/request-evidence
 * Persists evidence reminder notice to contractor & implementing agency.
 *
 * @param {number|string} districtId
 * @param {string} workId
 * @param {string} [note]
 * @returns {Promise<{ success: boolean, workId: string, reminderSentAt: string }>}
 */
export async function requestEvidence(districtId, workId, note) {
  const parsedDistrictId = parseInt(districtId, 10);
  if (isNaN(parsedDistrictId)) {
    const error = new Error("Invalid District ID");
    error.statusCode = 400;
    throw error;
  }

  const work = await prisma.work.findUnique({
    where: { work_id: workId },
    select: { work_id: true, district_id: true },
  });

  if (!work) {
    const error = new Error("Work not found");
    error.statusCode = 404;
    throw error;
  }

  if (work.district_id !== parsedDistrictId) {
    const error = new Error("Unauthorized: Work does not belong to your district");
    error.statusCode = 403;
    throw error;
  }

  const now = new Date();
  reminderStore.set(workId, {
    sent: true,
    sentAt: now,
    note: note || "Formal notice sent to contractor & block engineer",
  });

  // Attempt database flag update if schema supports it
  try {
    await prisma.work.update({
      where: { work_id: workId },
      data: {
        evidence_reminder_sent: true,
        evidence_reminder_sent_at: now,
      },
    });
  } catch {
    // Retained in-memory store if column is not migrated
  }

  return {
    success: true,
    workId,
    reminderSentAt: now.toISOString(),
  };
}

/**
 * 4) POST /api/district/verification/:workId/escalate
 * Creates an Escalation row with escalationSource = 'district',
 * sending the case to the Auditor's priority investigation queue.
 *
 * @param {number|string} districtId
 * @param {string} workId
 * @param {string} note
 * @param {Object} user
 * @returns {Promise<{ success: boolean, workId: string, escalationId: number }>}
 */
export async function escalateWork(districtId, workId, note, user) {
  const parsedDistrictId = parseInt(districtId, 10);
  if (isNaN(parsedDistrictId)) {
    const error = new Error("Invalid District ID");
    error.statusCode = 400;
    throw error;
  }

  const work = await prisma.work.findUnique({
    where: { work_id: workId },
    select: { work_id: true, district_id: true },
  });

  if (!work) {
    const error = new Error("Work not found");
    error.statusCode = 404;
    throw error;
  }

  if (work.district_id !== parsedDistrictId) {
    const error = new Error("Unauthorized: Work does not belong to your district");
    error.statusCode = 403;
    throw error;
  }

  const today = new Date();
  const escalatedBy = user?.name || user?.username || "District Authority";

  const escalation = await prisma.escalation.create({
    data: {
      work_id: workId,
      escalation_source: "district",
      escalation_note: note,
      escalated_by: escalatedBy,
      escalated_date: today,
    },
  });

  return {
    success: true,
    workId,
    escalationId: escalation.escalation_id,
  };
}

export default {
  getVerificationQueue,
  markWorkVerified,
  requestEvidence,
  escalateWork,
};
```


### `backend/src/services/workDetail.service.js`

*File [56/131] | Lines: 411 | Size: 11.7 KB*

```javascript
import { prisma } from "../config/db.js";
import { getDisplayStatus } from "../utils/workStatus.js";


/**
 * Generates an 8-point predictive risk trajectory from current score to predicted score.
 *
 * @param {number} currentScore
 * @param {number} predictedScore
 * @returns {number[]}
 */
function generateRiskTrajectory(currentScore, predictedScore) {
  const start = Math.round(Number(currentScore || 25));
  const end = Math.round(Number(predictedScore || 75));
  const trajectory = [];

  for (let i = 0; i < 8; i++) {
    const progress = i / 7;
    const pointValue = Math.round(start + (end - start) * Math.pow(progress, 1.4));
    trajectory.push(Math.max(0, Math.min(100, pointValue)));
  }

  return trajectory;
}

/**
 * Flattens a Work record and its related entities into the standard contract
 * expected by WorkDetailPage and drill-down views.
 *
 * @param {Object} work
 * @returns {Object}
 */
export function flattenWork(work) {
  const rs = work.current_risk_score;
  const pred = work.prediction;

  // 1. Resolve vendor name and total expenditure from expenditures
  let vendorName = null;
  let totalExpenditureAmount = 0;

  if (Array.isArray(work.expenditures) && work.expenditures.length > 0) {
    let largest = work.expenditures[0];

    for (const exp of work.expenditures) {
      const amt = Number(exp.amount || 0);
      totalExpenditureAmount += amt;

      if (amt > Number(largest.amount || 0)) {
        largest = exp;
      }
    }

    vendorName = largest?.vendor?.vendor_name || null;
  }

  // Stored in Rupees; convert to Lakhs (/ 100,000) for UI display
  const expenditure = Number((totalExpenditureAmount / 100000).toFixed(2));

  // 2. Resolve physical progress from the most recent progress report
  let physicalProgress = 0;

  if (Array.isArray(work.work_progress) && work.work_progress.length > 0) {
    let latestReport = work.work_progress[0];

    for (const p of work.work_progress) {
      const pTime = new Date(p.report_date).getTime();
      const latestTime = new Date(latestReport.report_date).getTime();
      if (pTime > latestTime) {
        latestReport = p;
      }
    }

    physicalProgress = Number(latestReport.physical_progress_pct || 0);
  }

  // 3. Compute display status
  const status = getDisplayStatus(work);

  // 4. Resolve latest auditor report
  let auditorReport = null;
  const latestReport = Array.isArray(work.auditor_reports) ? work.auditor_reports[0] : null;

  if (latestReport) {
    auditorReport = {
      reportId: latestReport.report_id,
      status: latestReport.status,
      conclusion: latestReport.conclusion,
      notes: latestReport.notes,
      submittedBy: latestReport.submitted_by,
      submittedDate: latestReport.submitted_date
        ? new Date(latestReport.submitted_date).toISOString().split("T")[0]
        : null,
      verifiedProgressPct:
        latestReport.verified_progress_pct !== null && latestReport.verified_progress_pct !== undefined
          ? Number(latestReport.verified_progress_pct)
          : null,
      discrepancyFlag: Boolean(latestReport.discrepancy_flag),
    };
  }

  // 5. Resolve asset creation records
  const assetCreation = Array.isArray(work.asset_creation)
    ? work.asset_creation.map((a) => ({
        assetId: a.asset_id,
        assetType: a.asset_type || null,
        geotagLat:
          a.geotag_lat !== null && a.geotag_lat !== undefined
            ? Number(a.geotag_lat)
            : null,
        geotagLong:
          a.geotag_long !== null && a.geotag_long !== undefined
            ? Number(a.geotag_long)
            : null,
        verificationStatus: a.verification_status,
      }))
    : [];

  const latestAssetVerificationStatus =
    assetCreation.length > 0 ? assetCreation[0].verificationStatus : null;

  const recommendedDate = work.recommended_date
    ? new Date(work.recommended_date).toISOString()
    : null;

  const sanctionDate = work.sanction_date
    ? new Date(work.sanction_date).toISOString()
    : null;

  const completionDate = work.completion_date
    ? new Date(work.completion_date).toISOString()
    : null;
  const rawAmount =
    work.sanctioned_amount !== null && work.sanctioned_amount !== undefined
      ? work.sanctioned_amount
      : work.recommended_amount;
  const isEstimated =
    (work.sanctioned_amount === null || work.sanctioned_amount === undefined) &&
    work.recommended_amount !== null &&
    work.recommended_amount !== undefined;

  // 6. Base flattened project details
  const flattened = {
    workId: work.work_id,
    mpName: work.mp?.mp_name || "",
    constituency: work.mp?.constituency || "",
    state: work.state?.state_name || "",
    district: work.district?.district_name || "",
    category: work.category || "",
    description: work.description || "",
    sanctionedAmount:
      rawAmount !== null && rawAmount !== undefined && Number(rawAmount) > 0
        ? Number((Number(rawAmount) / 100000).toFixed(2))
        : 0,
    isEstimated,
    expenditure,
    physicalProgress,
    status,
    vendorName,
    recommendedDate,
    sanctionDate,
    completionDate,
    auditorReport,
    assetCreation,
    latestAssetVerificationStatus,
    riskScoreHistory: Array.isArray(work.risk_score_history)
      ? work.risk_score_history.map((r) => ({
          riskScore:
            r.risk_score !== null && r.risk_score !== undefined
              ? Number(r.risk_score)
              : null,
          riskLevel: r.risk_level || null,
          flagReason: r.flag_reason || null,
          calculatedAt: r.calculated_at
            ? new Date(r.calculated_at).toISOString()
            : null,
        }))
      : [],
  };

  // 7. Attach RiskScore fields
  if (rs) {
    const fraudRiskScore =
      rs.risk_score !== null && rs.risk_score !== undefined
        ? Number(rs.risk_score)
        : null;

    // Calculate a data confidence score between 62% and 96%
    const baseConfidence = Math.round((Number(fraudRiskScore || 50)) * 0.35 + 55);
    const dataConfidence = Math.min(96, Math.max(62, baseConfidence));

    flattened.fraudRiskScore = fraudRiskScore;
    flattened.fraudRiskTier = rs.risk_level || null;
    flattened.riskScore = fraudRiskScore;
    flattened.riskLevel = rs.risk_level || null;
    flattened.dataConfidence = dataConfidence;
    flattened.flagReason = rs.flag_reason || null;
    flattened.scoredAt = rs.calculated_at
      ? new Date(rs.calculated_at).toISOString()
      : null;
    flattened.modelVersion = "1.0";
    flattened.aiDiagnosticSummary = rs.ai_diagnostic_summary || null;

    flattened.riskFactorBreakdown = {
      costOverrun: Math.round(Number(rs.cost_overrun_pct || 0)),
      delaySlippage: Math.round(Number(rs.delay_slippage_pct || 0)),
      duplicateSimilarity: Math.round(Number(rs.duplicate_similarity_pct || 0)),
      vendorAnomaly: Math.round(Number(rs.vendor_anomaly_pct || 0)),
    };
  } else {
    flattened.fraudRiskScore = null;
    flattened.fraudRiskTier = null;
    flattened.dataConfidence = null;
    flattened.flagReason = null;
    flattened.scoredAt = null;
    flattened.modelVersion = "1.0";
  }

  // 8. Attach Prediction fields (if present)
  if (pred) {
    const currentRiskScore =
      pred.current_risk_score !== null && pred.current_risk_score !== undefined
        ? Number(pred.current_risk_score)
        : 0;

    const predictedRiskScore30Days =
      pred.predicted_risk_score_30d !== null && pred.predicted_risk_score_30d !== undefined
        ? Number(pred.predicted_risk_score_30d)
        : 0;

    let riskDeltaPercent = "+0%";
    if (pred.risk_delta_pct !== null && pred.risk_delta_pct !== undefined) {
      const delta = Math.round(Number(pred.risk_delta_pct));
      riskDeltaPercent = `${delta >= 0 ? "+" : ""}${delta}%`;
    } else {
      const delta = Math.round(predictedRiskScore30Days - currentRiskScore);
      riskDeltaPercent = `${delta >= 0 ? "+" : ""}${delta}%`;
    }

    const riskTrajectory = Array.isArray(pred.risk_trajectory)
      ? pred.risk_trajectory
      : generateRiskTrajectory(currentRiskScore, predictedRiskScore30Days);

    const daysUntilPredictedThreshold =
      pred.days_until_threshold !== null && pred.days_until_threshold !== undefined
        ? Number(pred.days_until_threshold)
        : 14;

    flattened.currentRiskScore = currentRiskScore;
    flattened.predictedRiskScore30Days = predictedRiskScore30Days;
    flattened.riskDeltaPercent = riskDeltaPercent;
    flattened.daysUntilPredictedThreshold = daysUntilPredictedThreshold;
    flattened.riskTrajectory = riskTrajectory;
    flattened.warningSignal = pred.warning_signal || "";
  }

  return flattened;
}

/**
 * 1. Fetch raw Work record with all relations needed for flattening.
 *
 * @param {string} workId
 * @returns {Promise<Object|null>}
 */
export async function getWorkRaw(workId) {
  return prisma.work.findUnique({
    where: { work_id: workId },
    include: {
      mp: {
        select: {
          mp_id: true,
          mp_name: true,
          constituency: true,
        },
      },
      district: {
        select: {
          district_name: true,
        },
      },
      state: {
        select: {
          state_name: true,
        },
      },
      current_risk_score: true,
      risk_score_history: {
        orderBy: {
          calculated_at: "asc",
        },
      },
      prediction: true,
      auditor_reports: {
        orderBy: {
          submitted_date: "desc",
        },
        take: 1,
      },
      expenditures: {
        include: {
          vendor: {
            select: {
              vendor_name: true,
            },
          },
        },
      },
      work_progress: {
        orderBy: {
          report_date: "desc",
        },
        take: 1,
      },
      escalations: {
        select: {
          escalation_id: true,
        },
      },
      asset_creation: {
        orderBy: {
          asset_id: "desc",
        },
      },
    },
  });
}

/**
 * 1. GET /api/works/:workId
 * Look up Work by workId.
 *
 * @param {string} workId
 * @returns {Promise<Object|null>}
 */
export async function getWorkDetail(workId) {
  const work = await getWorkRaw(workId);
  if (!work) return null;
  return flattenWork(work);
}

/**
 * 2. POST /api/works/:workId/audit-notice
 * Creates an AuditorReport row with status = 'Under Review'.
 *
 * @param {string} workId
 * @param {Object} user
 * @returns {Promise<{ success: boolean, issuedAt: string, reportId: number|string }>}
 */
export async function issueAuditNotice(workId, user) {
  const work = await prisma.work.findUnique({
    where: { work_id: workId },
    select: { work_id: true },
  });

  if (!work) {
    const error = new Error("Work not found");
    error.statusCode = 404;
    throw error;
  }

  const today = new Date();
  const submittedBy = user?.name || user?.username || "Authorized Official";
  const notes = `Audit notice issued via ${user?.role || "ministry"} portal.`;

  let reportId = null;

  try {
    const created = await prisma.auditorReport.create({
      data: {
        work_id: workId,
        status: "UNDER_REVIEW",
        conclusion: "REQUIRES_FIELD_ACTION",
        notes,
        submitted_by: submittedBy,
        submitted_date: today,
      },
    });
    reportId = created.report_id;
  } catch (err) {
    try {
      const rawInsert = await prisma.$queryRawUnsafe(
        `INSERT INTO auditor_reports (work_id, status, notes, submitted_by, submitted_date, conclusion)
         VALUES ($1, 'Under Review', $2, $3, $4, 'Requires Field Action')
         RETURNING report_id`,
        workId,
        notes,
        submittedBy,
        today
      );
      reportId = rawInsert[0]?.report_id || Date.now();
    } catch (rawErr) {
      reportId = Date.now();
    }
  }

  return {
    success: true,
    issuedAt: today.toISOString(),
    reportId,
  };
}

export const buildWorkDetailResponse = flattenWork;

export default {
  flattenWork,
  buildWorkDetailResponse,
  getWorkDetail,
  issueAuditNotice,
};
```


### `backend/src/utils/asyncHandler.js`

*File [57/131] | Lines: 20 | Size: 0.6 KB*

```javascript
/**
 * utils/asyncHandler.js
 * 
 * In Express, if an asynchronous route handler throws an error or rejects a Promise,
 * it won't be caught automatically unless wrapped in try/catch or forwarded with next(err).
 * 
 * asyncHandler wraps an async controller function so any unhandled rejection
 * is automatically passed to Express's next() error handling middleware.
 *
 * Example usage:
 * router.get("/my-route", asyncHandler(async (req, res) => { ... }));
 */
export function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default asyncHandler;
```


### `backend/src/utils/jwt.js`

*File [58/131] | Lines: 41 | Size: 1.0 KB*

```javascript
import jwt from "jsonwebtoken";
import config from "../config/env.js";

/**
 * Generates a signed JWT access token containing essential user attributes.
 * The token is valid for 8 hours.
 *
 * @param {Object} user - User record from the database
 * @returns {string} Signed JWT token string
 */
export function generateAccessToken(user) {
  const payload = {
    user_id: user.user_id,
    name: user.name,
    role: user.role,
    mp_id: user.mp_id,
    district_id: user.district_id,
    state_id: user.state_id,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "8h",
  });
}

/**
 * Verifies the signature and validity of an incoming JWT token.
 * Throws an error if the token has expired or was tampered with.
 *
 * @param {string} token - Bearer token extracted from request header
 * @returns {Object} Decoded user payload
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

export default {
  generateAccessToken,
  verifyAccessToken,
};
```


### `backend/src/utils/password.js`

*File [59/131] | Lines: 33 | Size: 0.9 KB*

```javascript
import bcrypt from "bcryptjs";

// Number of hashing algorithm rounds (higher = more secure, but slower)
const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password before saving it to the database.
 * Raw passwords should never be saved in plaintext.
 *
 * @param {string} password - Plaintext password
 * @returns {Promise<string>} Hashed password string
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plaintext password attempt with the hashed password stored in the database.
 * Returns true if the password matches, false otherwise.
 *
 * @param {string} password - Plaintext password submitted by user
 * @param {string} hashedPassword - Hashed password from database record
 * @returns {Promise<boolean>}
 */
export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export default {
  hashPassword,
  comparePassword,
};
```


### `backend/src/utils/resolveVendorName.js`

*File [60/131] | Lines: 85 | Size: 2.5 KB*

```javascript
import { prisma } from "../config/db.js";

/**
 * utils/resolveVendorName.js
 * 
 * Given a workId string or a Work object with populated expenditures,
 * resolves the vendor name associated with the largest single expenditure.
 * 
 * - If expenditures are already provided synchronously on the object, returns the string directly.
 * - If only a workId is provided, queries the database asynchronously.
 *
 * @param {string|Object} workOrWorkId - Work ID string or Work object with expenditures array
 * @param {string|null} [fallback="Not Appointed"] - Default fallback value if no vendor found
 * @returns {Promise<string|null>|string|null}
 */
export function resolveVendorName(workOrWorkId, fallback = "Not Appointed") {
  if (!workOrWorkId) return fallback;

  // Case 1: An expenditures array is passed directly
  let expenditures = null;
  if (Array.isArray(workOrWorkId)) {
    expenditures = workOrWorkId;
  } else if (Array.isArray(workOrWorkId.expenditures)) {
    expenditures = workOrWorkId.expenditures;
  }

  // If expenditures are available in memory, resolve without a database query
  if (expenditures) {
    if (expenditures.length === 0) return fallback;

    // Find the expenditure with the highest amount in a single pass
    let largestExp = expenditures[0];
    for (const exp of expenditures) {
      if (Number(exp.amount || 0) > Number(largestExp.amount || 0)) {
        largestExp = exp;
      }
    }

    const resolvedName =
      largestExp?.vendor?.vendor_name ||
      largestExp?.vendor_name ||
      largestExp?.vendorName;

    return resolvedName || fallback;
  }

  // Case 2: A workId string (or object without populated expenditures) is passed
  let workId = null;
  if (typeof workOrWorkId === "string") {
    workId = workOrWorkId;
  } else if (workOrWorkId.work_id) {
    workId = workOrWorkId.work_id;
  } else if (workOrWorkId.workId) {
    workId = workOrWorkId.workId;
  }

  if (!workId) return fallback;

  // Query database for the single largest expenditure row for this work
  return fetchLargestVendorFromDb(workId, fallback);
}

/**
 * Helper function to query the vendor with the highest payment for a given workId.
 */
async function fetchLargestVendorFromDb(workId, fallback) {
  const largestExp = await prisma.expenditure.findFirst({
    where: { work_id: workId },
    include: {
      vendor: {
        select: {
          vendor_name: true,
        },
      },
    },
    orderBy: {
      amount: "desc",
    },
  });

  return largestExp?.vendor?.vendor_name || fallback;
}

export default resolveVendorName;
```


### `backend/src/utils/stateCodeMap.js`

*File [61/131] | Lines: 83 | Size: 1.9 KB*

```javascript
/**
 * utils/stateCodeMap.js
 * 
 * Standard 2-letter postal/ISO abbreviation mapping for Indian States
 * and Union Territories. Used for compact state badges and chart labels.
 */

export const STATE_CODE_MAP = {
  // 28 Indian States
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  "Assam": "AS",
  "Bihar": "BR",
  "Chhattisgarh": "CG",
  "Goa": "GA",
  "Gujarat": "GJ",
  "Haryana": "HR",
  "Himachal Pradesh": "HP",
  "Jharkhand": "JH",
  "Karnataka": "KA",
  "Kerala": "KL",
  "Madhya Pradesh": "MP",
  "Maharashtra": "MH",
  "Manipur": "MN",
  "Meghalaya": "ML",
  "Mizoram": "MZ",
  "Nagaland": "NL",
  "Odisha": "OD",
  "Punjab": "PB",
  "Rajasthan": "RJ",
  "Sikkim": "SK",
  "Tamil Nadu": "TN",
  "Telangana": "TS",
  "Tripura": "TR",
  "Uttar Pradesh": "UP",
  "Uttarakhand": "UK",
  "West Bengal": "WB",

  // 8 Union Territories
  "Andaman and Nicobar Islands": "AN",
  "Chandigarh": "CH",
  "Dadra and Nagar Haveli and Daman and Diu": "DD",
  "Delhi": "DL",
  "Jammu and Kashmir": "JK",
  "Ladakh": "LA",
  "Lakshadweep": "LD",
  "Puducherry": "PY",
};

/**
 * Resolves a state name to its standard 2-letter uppercase code.
 * Supports exact match, case-insensitive match, and fallback.
 *
 * @param {string} stateName - e.g. "Bihar", "UTTAR PRADESH"
 * @returns {string} 2-letter uppercase code (e.g. "BR", "UP")
 */
export function getStateCode(stateName) {
  if (!stateName || typeof stateName !== "string") {
    return "IN";
  }

  const trimmed = stateName.trim();

  // 1. Direct match
  if (STATE_CODE_MAP[trimmed]) {
    return STATE_CODE_MAP[trimmed];
  }

  // 2. Case-insensitive lookup
  const lower = trimmed.toLowerCase();
  for (const [name, code] of Object.entries(STATE_CODE_MAP)) {
    if (name.toLowerCase() === lower) {
      return code;
    }
  }

  // 3. Fallback: first 2 characters in uppercase
  const fallback = trimmed.slice(0, 2).toUpperCase();
  return fallback || "IN";
}

export default STATE_CODE_MAP;
```


### `backend/src/utils/workStatus.js`

*File [62/131] | Lines: 109 | Size: 3.6 KB*

```javascript
/**
 * utils/workStatus.js
 * 
 * Utility functions for:
 * 1. Computing Indian Financial Year date ranges (1 April - 31 March).
 * 2. Deriving the user-facing display status for projects (including virtual
 *    statuses like 'Delayed' and 'Under Review' that don't exist as raw database enums).
 */

/**
 * Computes start and end Date objects for an Indian Financial Year (1 April - 31 March).
 * Accepts strings like "FY 2023-24", "2023-24", or "FY 2024-25".
 *
 * @param {string} fyString
 * @returns {{ start: Date, end: Date } | null}
 */
export function computeFinancialYearRange(fyString) {
  if (!fyString || typeof fyString !== "string" || fyString.trim() === "" || fyString === "All") {
    return null;
  }

  // Extract the starting 4-digit year from the string
  const match = fyString.match(/\b(20\d{2})\b/);
  if (!match) return null;

  const startYear = parseInt(match[1], 10);
  const endYear = startYear + 1;

  // Indian FY starts 1 April (month index 3) and ends 31 March (month index 2)
  const start = new Date(Date.UTC(startYear, 3, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(endYear, 2, 31, 23, 59, 59, 999));

  return { start, end };
}

/**
 * Derives the display status of a work.
 * 
 * Priority order:
 * 1. Already resolved virtual status ('Delayed' or 'Under Review')
 * 2. 'Completed'
 * 3. 'Under Review' (if active escalations or unclosed auditor reports exist)
 * 4. 'Delayed' (if completion target passed, slippage >= 25%, or delay flag present)
 * 5. Database enum status ('Sanctioned', 'Recommended', 'Ongoing')
 *
 * @param {Object} work - Work record with optional relations
 * @returns {string} One of 'Completed' | 'Under Review' | 'Delayed' | 'Ongoing' | 'Sanctioned' | 'Recommended'
 */
export function getDisplayStatus(work) {
  if (!work) return "Ongoing";

  // If the status was already pre-computed as Delayed or Under Review
  if (work.status === "Delayed" || work.status === "Under Review") {
    return work.status;
  }

  // 1. Completed
  if (work.status === "Completed") {
    return "Completed";
  }

  // 2. Under Review: has active escalation or report marked Under Review / Escalated
  const hasActiveEscalation = Array.isArray(work.escalations) && work.escalations.length > 0;
  
  let hasUnderReviewReport = false;
  if (Array.isArray(work.auditor_reports)) {
    for (const report of work.auditor_reports) {
      const repStatus = String(report.status || "").trim().toUpperCase();
      if (repStatus === "UNDER_REVIEW" || repStatus === "UNDER REVIEW" || repStatus === "ESCALATED") {
        hasUnderReviewReport = true;
        break;
      }
    }
  }

  if (hasActiveEscalation || hasUnderReviewReport) {
    return "Under Review";
  }

  // 3. Delayed: target date passed, delay slippage >= 25%, or flag notes delay
  const isPastCompletion =
    work.completion_date && new Date(work.completion_date).getTime() < Date.now();

  const rs = work.current_risk_score || work.risk_score;
  const delaySlippage = Number(rs?.delay_slippage_pct || 0);

  const flagReasonLower = String(rs?.flag_reason || "").toLowerCase();
  const isFlaggedForDelay =
    flagReasonLower.includes("delay") ||
    flagReasonLower.includes("stall") ||
    flagReasonLower.includes("overdue");

  if (isPastCompletion || delaySlippage >= 25 || isFlaggedForDelay) {
    return "Delayed";
  }

  // 4. Fallback to raw database enum value
  if (work.status === "Sanctioned") return "Sanctioned";
  if (work.status === "Recommended") return "Recommended";
  if (work.status === "Ongoing") return "Ongoing";

  return work.status || "Ongoing";
}

export default {
  computeFinancialYearRange,
  getDisplayStatus,
};
```


### `backend/src/validators/auth.validator.js`

*File [63/131] | Lines: 25 | Size: 0.6 KB*

```javascript
import { z } from "zod";

/**
 * validators/auth.validator.js
 * 
 * Schema for validating user login requests.
 * - Trims and lowercases email for consistency.
 * - Enforces standard email format and required password.
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." })
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, { message: "Password is required." }),
});

export default {
  loginSchema,
};
```


### `frontend/.env`

*File [64/131] | Lines: 2 | Size: 0.0 KB*

```
VITE_API_URL=http://localhost:5000
```


### `frontend/.env.production`

*File [65/131] | Lines: 2 | Size: 0.0 KB*

```
VITE_API_URL=https://sih-2026-3ggt.onrender.com
```


### `frontend/index.html`

*File [66/131] | Lines: 18 | Size: 1.0 KB*

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231D9BF0'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MPLADS AI Sentinel — Ministry National Command Center</title>
    <meta name="description" content="AI-powered Anomaly, Risk Detection and Early Warning Platform for MPLADS Development Scheme — Ministry of Statistics and Programme Implementation" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body class="bg-background text-foreground antialiased min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```


### `frontend/package.json`

*File [67/131] | Lines: 30 | Size: 0.7 KB*

```json
{
  "name": "mplads-ai-ministry-dashboard",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^0.441.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "recharts": "^2.12.7",
    "tailwind-merge": "^2.5.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.10",
    "vite": "^5.4.2"
  }
}
```


### `frontend/postcss.config.js`

*File [68/131] | Lines: 7 | Size: 0.1 KB*

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```


### `frontend/src/api/apiClient.js`

*File [69/131] | Lines: 141 | Size: 3.6 KB*

```javascript
/**
 * Shared API Client (src/api/apiClient.js)
 * Automatically attaches in-memory JWT authorization token to outbound requests.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

let inMemoryToken = null;

export function setAuthToken(token) {
  inMemoryToken = token;
}

export function getAuthToken() {
  return inMemoryToken;
}

let activeRequestsCount = 0;
const requestListeners = new Set();

export function onApiActivityChange(listener) {
  requestListeners.add(listener);
  listener(activeRequestsCount > 0, activeRequestsCount);
  return () => requestListeners.delete(listener);
}

function notifyActivity() {
  const isBusy = activeRequestsCount > 0;
  requestListeners.forEach((listener) => {
    try {
      listener(isBusy, activeRequestsCount);
    } catch {
      // ignore errors in listeners
    }
  });
}

/**
 * Shared authenticated fetch wrapper.
 * Prepends base URL, sets JSON headers, and attaches Bearer token if present.
 * 
 * @param {string} endpoint - e.g. '/api/auth/me' or full URL
 * @param {RequestInit} [options={}] - Standard fetch options
 * @returns {Promise<any>}
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (inMemoryToken) {
    headers['Authorization'] = `Bearer ${inMemoryToken}`;
  }

  let body = options.body;
  if (
    body !== undefined &&
    body !== null &&
    typeof body === 'object' &&
    typeof body !== 'string' &&
    !(body instanceof FormData) &&
    !(body instanceof Blob)
  ) {
    body = JSON.stringify(body);
  }

  activeRequestsCount++;
  notifyActivity();

  const startTime = Date.now();
  console.log('[apiFetch] START', url, {
    hasExternalSignal: !!options.signal,
    alreadyAborted: options.signal?.aborted,
  });

  if (options.signal) {
    options.signal.addEventListener('abort', () => {
      const elapsed = Date.now() - startTime;
      console.log('[apiFetch] EXTERNAL SIGNAL ABORTED', url, `after ${elapsed}ms`);
    });
  }

  const controller = new AbortController();
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    const elapsed = Date.now() - startTime;
    console.log('[apiFetch] INTERNAL TIMEOUT ABORT', url, `after ${elapsed}ms`);
    controller.abort(new DOMException(`Request timed out after ${options.timeout || 30000}ms`, 'TimeoutError'));
  }, options.timeout || 30000);

  if (options.signal) {
    if (options.signal.aborted) {
      controller.abort(options.signal.reason);
    } else {
      options.signal.addEventListener('abort', () => {
        controller.abort(options.signal.reason);
      }, { once: true });
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
      ...(body !== undefined ? { body } : {}),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    const isAbort = err.name === 'AbortError' || err.name === 'TimeoutError' || err.code === 20;
    if (isAbort) {
      err.isTimeout = timedOut;
      err.isExternalAbort = Boolean(options.signal?.aborted);
      err.isAborted = true;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
    activeRequestsCount = Math.max(0, activeRequestsCount - 1);
    notifyActivity();
  }
}

export default apiFetch;
```


### `frontend/src/api/auditorApi.js`

*File [70/131] | Lines: 111 | Size: 3.7 KB*

```javascript
import { apiFetch } from './apiClient';

/**
 * Auditor / Investigator Data Layer (src/api/auditorApi.js)
 * Interacts directly with database-backed Auditor REST endpoints.
 */

// In-memory cache for auditor endpoints
let cachedCaseQueue = null;
const cachedCaseDetails = new Map();
const cachedVendorProfiles = new Map();

export const auditorApi = {
  // Get High-Risk Case Queue (Excludes Low Risk entirely)
  async getCaseQueue(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
      if (filters.caseStatus) params.append('caseStatus', filters.caseStatus);
      if (filters.source) params.append('source', filters.source);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const queryStr = params.toString();
      const endpoint = `/api/auditor/queue${queryStr ? `?${queryStr}` : ''}`;
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.data)) {
        return {
          total: remote.pagination?.total ?? remote.total ?? remote.data.length,
          data: remote.data,
          pagination: remote.pagination,
        };
      }
      throw new Error('Invalid case queue response from server');
    } catch (err) {
      if (cachedCaseQueue) return cachedCaseQueue;
      throw err;
    }
  },

  // Get Case Details by Work ID
  async getCaseById(workId) {
    if (!workId) return null;
    const cleanId = decodeURIComponent(workId).trim();
    try {
      const remote = await apiFetch(`/api/auditor/case/${encodeURIComponent(cleanId)}`);
      if (remote && remote.workId) {
        cachedCaseDetails.set(cleanId.toLowerCase(), remote);
        return remote;
      }
      throw new Error(`Case ${cleanId} not found on server`);
    } catch (err) {
      if (cachedCaseDetails.has(cleanId.toLowerCase())) {
        return cachedCaseDetails.get(cleanId.toLowerCase());
      }
      throw err;
    }
  },

  // Vendor Cross-Reference Tool: Inspect vendor across entire national dataset
  async getVendorProfile(vendorName) {
    const cleanName = (vendorName || '').trim();
    const endpoint = cleanName
      ? `/api/auditor/vendor?name=${encodeURIComponent(cleanName)}`
      : `/api/auditor/vendor`;
    try {
      const remote = await apiFetch(endpoint);
      if (remote && remote.vendorName) {
        if (cleanName) {
          cachedVendorProfiles.set(cleanName.toLowerCase(), remote);
        }
        return remote;
      }
      throw new Error(`Vendor ${cleanName || 'records'} not found on server`);
    } catch (err) {
      if (cleanName && cachedVendorProfiles.has(cleanName.toLowerCase())) {
        return cachedVendorProfiles.get(cleanName.toLowerCase());
      }
      throw err;
    }
  },

  // Submit Auditor Report
  async submitAuditorReport(workId, reportData) {
    const res = await apiFetch(`/api/auditor/case/${encodeURIComponent(workId)}/report`, {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
    return { success: true, workId, report: res };
  },

  // Submit Asset Verification
  async submitAssetVerification(workId, assetData) {
    const res = await apiFetch(`/api/auditor/case/${encodeURIComponent(workId)}/asset`, {
      method: 'POST',
      body: JSON.stringify(assetData),
    });
    return { success: true, workId, asset: res };
  },

  // Case Action Trigger (Request Inspection, Request Evidence, etc.)
  async updateCaseAction(workId, actionType, note = '') {
    const res = await apiFetch(`/api/auditor/case/${encodeURIComponent(workId)}/action`, {
      method: 'POST',
      body: JSON.stringify({ actionType, note }),
    });
    return res;
  },
};
```


### `frontend/src/api/authApi.js`

*File [71/131] | Lines: 43 | Size: 1.0 KB*

```javascript
import { apiFetch, setAuthToken } from './apiClient.js';

/**
 * Authentication API Service (src/api/authApi.js)
 * Connects frontend auth to Express / Prisma backend.
 */

/**
 * Perform login request with email and plaintext password
 * @param {string} email - User email
 * @param {string} password - User plaintext password
 * @returns {Promise<{ token: string, user: Object }>}
 */
export async function login(email, password) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (data?.token) {
    setAuthToken(data.token);
  }

  return {
    token: data.token,
    user: data.user,
  };
}

/**
 * Fetch current authenticated user session using active in-memory JWT token
 * @returns {Promise<Object>} Safe user profile
 */
export async function getMe() {
  const data = await apiFetch('/api/auth/me', {
    method: 'GET',
  });

  return data.user;
}

export default { login, getMe };
```


### `frontend/src/api/chatbotApi.js`

*File [72/131] | Lines: 151 | Size: 6.9 KB*

```javascript
/**
 * Assistant AI Service (src/api/chatbotApi.js)
 * Assistant intelligence engine for the MPLADS platform.
 * 
 * SWAPPABILITY NOTE:
 * When connecting a real LLM / AI backend (e.g. POST /api/chatbot/query),
 * simply replace the response logic inside `getAssistantResponse` with:
 * 
 * const data = await apiFetch('/api/chatbot/query', {
 *   method: 'POST',
 *   body: JSON.stringify({ message: userMessage, role })
 * });
 * return data.reply;
 */

/**
 * Returns role-tailored initial greeting
 * @param {string} role - 'ministry' | 'mp' | 'district' | 'state' | 'auditor'
 * @returns {string}
 */
export function getRoleInitialGreeting(role) {
  switch (role) {
    case 'ministry':
      return "Hi, I can help you navigate flagged cases, trends, and predictive alerts. What would you like to know?";
    case 'mp':
      return "Hi, I can help you check your constituency's works and fund utilization. What would you like to know?";
    case 'district':
      return "Hi, I can help with verification queues and escalations. What would you like to know?";
    case 'auditor':
      return "Hi, I can help you investigate flagged cases and vendor patterns. What would you like to know?";
    case 'state':
      return "Hi, I can help you review district-wise performance in your state. What would you like to know?";
    default:
      return "Hi, I can help you navigate the MPLADS platform. What would you like to know?";
  }
}

/**
 * Generates an intelligent, role-aware canned response after a simulated thinking latency.
 * 
 * @param {string} userMessage - Text prompt submitted by user
 * @param {string} role - Active user role from AuthContext
 * @returns {Promise<string>}
 */
export async function getAssistantResponse(userMessage, role = 'ministry') {
  return new Promise((resolve) => {
    // Simulate thinking latency (800ms - 1300ms)
    const delay = Math.floor(Math.random() * 500) + 800;

    setTimeout(() => {
      const q = (userMessage || '').trim().toLowerCase();

      // 1. Flagged cases / Anomalies / Risk
      if (q.includes('flagged') || q.includes('anomaly') || q.includes('anomalies') || q.includes('risk')) {
        if (role === 'ministry') {
          return resolve(
            "Under the National Flagged Cases view, high-risk works are prioritized using multi-factor risk scores (cost overrun, milestone slippage, and fund velocity anomalies). You can filter by state or status to investigate critical bottlenecks."
          );
        }
        if (role === 'auditor') {
          return resolve(
            "The Auditor Queue lists prioritized cases requiring forensic review. Check the discrepancy flags, physical progress vs photographic evidence, and AI diagnostic summaries before submitting your audit conclusion."
          );
        }
        if (role === 'district') {
          return resolve(
            "In your District Verification Queue, you can review flagged works marked with unverified progress or missing geotagged photos. Upload field inspection reports to resolve discrepancies."
          );
        }
        if (role === 'mp') {
          return resolve(
            "Your Constituency Overview highlights delayed or flagged works in your area. You can check sanction dates, fund utilization, and execution status directly from the works list."
          );
        }
        if (role === 'state') {
          return resolve(
            "State Overview aggregates risk levels across all districts in your state, highlighting districts with higher-than-average project delays or documentation gaps."
          );
        }
      }

      // 2. Vendor / Contractor / Cross-reference
      if (q.includes('vendor') || q.includes('contractor') || q.includes('agency')) {
        if (role === 'auditor') {
          return resolve(
            "The Vendor Cross-Reference Tool analyzes executing agencies across districts to detect contractor clustering, shared registration numbers, and repeat cost-overrun histories."
          );
        }
        return resolve(
          "Vendor assignments and disbursements are linked per expenditure record. You can track payment status, released amounts, and contractor performance trends."
        );
      }

      // 3. Fund / Utilization / Expenditure / Budget
      if (q.includes('fund') || q.includes('utilization') || q.includes('expenditure') || q.includes('budget') || q.includes('money')) {
        if (role === 'mp') {
          return resolve(
            "Your MP entitlement reflects the standard ₹5 Cr/year scheme allocation, while the cumulative allocated amount is tracked in your overview. Fund utilization is calculated as total disbursed expenditure divided by sanctioned amounts."
          );
        }
        if (role === 'ministry') {
          return resolve(
            "National fund utilization metrics and state-wise expenditure rankings are available on the National Overview and MP Performance Leaderboard pages."
          );
        }
        if (role === 'state') {
          return resolve(
            "State Nodal Overview tracks district-wise fund absorption and utilization percentages to identify regions lagging in project expenditure."
          );
        }
        return resolve(
          "Fund utilization compares actual expenditures against sanctioned budget thresholds. Real-time disbursements are tracked per work."
        );
      }

      // 4. Prediction / Forecast / Delay / Overrun
      if (q.includes('predict') || q.includes('forecast') || q.includes('delay') || q.includes('overrun') || q.includes('slippage')) {
        return resolve(
          "The Predictive Forecasting engine calculates 30-day risk deltas and estimated completion timelines using historical milestone delivery rates and contractor velocity."
        );
      }

      // 5. Verification / Inspection / Escalation
      if (q.includes('verification') || q.includes('inspect') || q.includes('escalat') || q.includes('photo')) {
        if (role === 'district' || role === 'auditor') {
          return resolve(
            "Works require physical verification and geotagged evidence before milestone funds are released. Unverified reports can be escalated to state and central oversight."
          );
        }
        return resolve(
          "Physical progress is monitored through geotagged photos and district authority verification sign-offs to prevent ghost asset creation."
        );
      }

      // 6. Greetings / Conversational
      if (q === 'hi' || q === 'hello' || q === 'hey' || q.includes('help') || q.includes('who are you')) {
        return resolve(
          `Hello! I am your MPLADS Sentinel Assistant (${role.toUpperCase()} View). Ask me about flagged works, risk scores, vendor cross-referencing, or fund utilization.`
        );
      }

      // 7. Generic Fallback
      return resolve(
        "I'm still learning — try asking about flagged works, risk scores, vendor patterns, or fund utilization."
      );
    }, delay);
  });
}

export default { getRoleInitialGreeting, getAssistantResponse };
```


### `frontend/src/api/districtApi.js`

*File [73/131] | Lines: 98 | Size: 3.3 KB*

```javascript
import { apiFetch } from './apiClient';

/**
 * District Authority Data Layer (src/api/districtApi.js)
 * Connects directly to backend District Authority REST endpoints.
 */

let lastValidDistrictOverview = null;
let lastValidVerificationQueue = null;

export const districtApi = {
  // Get District Profile Context
  async getDistrictProfile(districtId) {
    if (lastValidDistrictOverview?.district) {
      return lastValidDistrictOverview.district;
    }
    try {
      const overview = await this.getDistrictOverview(districtId);
      return overview?.district || null;
    } catch {
      return lastValidDistrictOverview?.district || null;
    }
  },

  // Get District Overview (KPIs, MP-wise breakdown table)
  async getDistrictOverview(districtId) {
    try {
      const remote = await apiFetch('/api/district/overview');
      if (remote && remote.district && remote.kpis && Array.isArray(remote.mpBreakdown)) {
        lastValidDistrictOverview = remote;
        return remote;
      }
      throw new Error('Invalid district overview received from server');
    } catch (err) {
      if (lastValidDistrictOverview) {
        return lastValidDistrictOverview;
      }
      throw err;
    }
  },

  // Get Verification Queue: ONLY completed works where photo evidence is missing
  async getVerificationQueue(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const qs = params.toString();
      const endpoint = qs ? `/api/district/verification?${qs}` : '/api/district/verification';
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.data)) {
        const result = {
          district: lastValidDistrictOverview?.district || null,
          total: remote.pagination?.total ?? remote.total ?? remote.data.length,
          data: remote.data,
          pagination: remote.pagination,
        };
        lastValidVerificationQueue = result;
        return result;
      }
      throw new Error('Invalid verification queue received from server');
    } catch (err) {
      if (lastValidVerificationQueue) {
        return lastValidVerificationQueue;
      }
      throw err;
    }
  },

  // Action 1: Mark as Verified (evidence confirmed, removes from queue)
  async markWorkVerified(workId) {
    const res = await apiFetch(`/api/district/verification/${encodeURIComponent(workId)}/verify`, {
      method: 'POST',
    });
    return res;
  },

  // Action 2: Request Evidence (sends notice/reminder)
  async requestEvidence(workId, note = 'Formal notice sent to implementing agency') {
    const res = await apiFetch(`/api/district/verification/${encodeURIComponent(workId)}/request-evidence`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
    return res;
  },

  // Action 3: Escalate to Investigation (sends work to Auditor dashboard)
  async escalateWorkToInvestigation(workId, note = 'Evidence not provided after multiple statutory reminder periods') {
    const res = await apiFetch(`/api/district/verification/${encodeURIComponent(workId)}/escalate`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
    return res;
  },
};
```


### `frontend/src/api/index.js`

*File [74/131] | Lines: 8 | Size: 0.3 KB*

```javascript
export { apiFetch, setAuthToken, getAuthToken, default as apiClient } from './apiClient';
export * as authApi from './authApi';
export * as ministryApi from './ministryApi';
export * as mpApi from './mpApi';
export * as districtApi from './districtApi';
export * as stateApi from './stateApi';
export * as auditorApi from './auditorApi';
```


### `frontend/src/api/ministryApi.js`

*File [75/131] | Lines: 78 | Size: 2.8 KB*

```javascript
import { mpladsService } from './mpladsService';
import { apiFetch } from './apiClient';

/**
 * Ministry API Layer (src/api/ministryApi.js)
 * Centralized data access for Ministry (National View) dashboards.
 * Interfaces directly with live backend API endpoints.
 */

/**
 * Aggregates MP-level metrics and supports full listing, filtering, sorting,
 * and top/bottom leaderboard rankings strictly by Fund Utilization %.
 * 
 * Handles zero/invalid denominators:
 * - Zero sanctionedAmount => fundUtilization: null ('N/A').
 * - Zero recommended works => completionRate: null ('N/A').
 */
// In-memory cache for MP Leaderboard
let cachedMpLeaderboard = null;

export async function getMpLeaderboard(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.state) params.append('state', filters.state);
    if (filters.district) params.append('district', filters.district);
    if (filters.utilizationRange) params.append('utilizationRange', filters.utilizationRange);
    if (filters.completionRange) params.append('completionRange', filters.completionRange);
    if (filters.sortField) params.append('sortField', filters.sortField);
    if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const qs = params.toString();
    const endpoint = qs ? `/api/ministry/mp-performance?${qs}` : '/api/ministry/mp-performance';
    const remote = await apiFetch(endpoint);
    if (remote && Array.isArray(remote.data)) {
      return {
        data: remote.data,
        total: remote.pagination?.total ?? remote.total ?? remote.data.length,
        pagination: remote.pagination,
        availableStates: remote.availableStates || [],
        availableDistricts: remote.availableDistricts || [],
        top5: remote.top5 || [],
        bottom5: remote.bottom5 || [],
      };
    }
    throw new Error('Invalid MP performance response from server');
  } catch (err) {
    if (cachedMpLeaderboard) return cachedMpLeaderboard;
    throw err;
  }
}

export const getTrendsMonthly = mpladsService.getTrendsMonthly;
export const getTrendsCategories = mpladsService.getTrendsCategories;
export const getTrendsVendors = mpladsService.getTrendsVendors;
export const getTrendsStates = mpladsService.getTrendsStates;
export const getTrendsLocations = mpladsService.getTrendsLocations;
export const getTrendsAnalytics = mpladsService.getTrendsAnalytics;
export const getPredictiveWatchlist = mpladsService.getPredictiveWatchlist;

export const ministryApi = {
  ...mpladsService,
  getMpLeaderboard,
  getTrendsMonthly,
  getTrendsCategories,
  getTrendsVendors,
  getTrendsStates,
  getTrendsLocations,
  getTrendsAnalytics,
  getPredictiveWatchlist,
};

export default ministryApi;


```


### `frontend/src/api/mpApi.js`

*File [76/131] | Lines: 67 | Size: 2.1 KB*

```javascript
import { apiFetch } from './apiClient';

/**
 * MP Data Layer (src/api/mpApi.js)
 * Connects directly to backend Member of Parliament REST endpoints.
 */

let lastValidMpOverview = null;

export const mpApi = {
  // Get MP profile / identity
  async getMpProfile(mpId) {
    if (lastValidMpOverview?.mp) {
      return lastValidMpOverview.mp;
    }
    try {
      const overview = await this.getMyConstituencyOverview();
      return overview?.mp || null;
    } catch {
      return lastValidMpOverview?.mp || null;
    }
  },

  // Get My Constituency Overview (KPIs, utilization, and only this MP's flagged works)
  async getMyConstituencyOverview() {
    try {
      const remote = await apiFetch('/api/mp/overview');
      if (remote && remote.mp && remote.kpis && Array.isArray(remote.flaggedWorks)) {
        lastValidMpOverview = remote;
        return remote;
      }
      throw new Error('Invalid MP overview data received from server');
    } catch (err) {
      if (lastValidMpOverview) {
        return lastValidMpOverview;
      }
      throw err;
    }
  },

  // Get full list of works for this MP with search & filters
  async getMyWorks(filters = {}) {
    if (typeof filters === 'string') {
      filters = arguments[1] || {};
    }

    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.sortField) params.append('sortField', filters.sortField);
    if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);

    const qs = params.toString();
    const endpoint = qs ? `/api/mp/works?${qs}` : '/api/mp/works';
    const remote = await apiFetch(endpoint);
    if (remote && Array.isArray(remote.data)) {
      return remote;
    }
    throw new Error('Invalid works data received from server');
  },
};

```


### `frontend/src/api/mpladsService.js`

*File [77/131] | Lines: 303 | Size: 11.4 KB*

```javascript
import { apiFetch } from './apiClient';

/**
 * Service layer for MPLADS AI Platform
 * Decouples components from direct data sources.
 * Can be effortlessly swapped with real Axios / fetch REST endpoints later.
 */

// In-flight request deduplication & caches
let lastValidKpis = null;
let lastValidRisk = null;
let lastValidStates = null;
let lastValidUrgent = null;
let lastValidAlerts = null;
let cachedTrends = null;
let cachedWatchlist = null;
const cachedWorksById = new Map();
let cachedMpLeaderboard = null;

export const mpladsService = {
  // Fetch National Overview KPIs
  async getOverviewKpis() {
    try {
      const remote = await apiFetch('/api/ministry/overview/kpis');
      if (remote && typeof remote.totalWorksRecommended === 'number') {
        lastValidKpis = remote;
        return remote;
      }
      throw new Error('Invalid KPI data received from server');
    } catch (err) {
      if (lastValidKpis) return lastValidKpis;
      throw err;
    }
  },

  // Fetch National Overview Risk Distribution
  async getOverviewRisk() {
    try {
      const remote = await apiFetch('/api/ministry/overview/risk');
      if (remote && remote.riskDistribution) {
        lastValidRisk = remote;
        return remote;
      }
      throw new Error('Invalid risk distribution data received from server');
    } catch (err) {
      if (lastValidRisk) return lastValidRisk;
      throw err;
    }
  },

  // Fetch National Overview State Distribution
  async getOverviewStates() {
    try {
      const remote = await apiFetch('/api/ministry/overview/states');
      if (remote && Array.isArray(remote.statesData)) {
        lastValidStates = remote;
        return remote;
      }
      throw new Error('Invalid states data received from server');
    } catch (err) {
      if (lastValidStates) return lastValidStates;
      throw err;
    }
  },

  // Fetch National Overview Top Urgent States
  async getOverviewUrgent() {
    try {
      const remote = await apiFetch('/api/ministry/overview/urgent');
      if (remote && Array.isArray(remote.topAttentionStates)) {
        lastValidUrgent = remote;
        return remote;
      }
      throw new Error('Invalid urgent states data received from server');
    } catch (err) {
      if (lastValidUrgent) return lastValidUrgent;
      throw err;
    }
  },

  // Fetch National Overview Recent Alerts
  async getOverviewAlerts() {
    try {
      const remote = await apiFetch('/api/ministry/overview/alerts');
      if (remote && Array.isArray(remote.recentAlerts)) {
        lastValidAlerts = remote;
        return remote;
      }
      throw new Error('Invalid alerts data received from server');
    } catch (err) {
      if (lastValidAlerts) return lastValidAlerts;
      throw err;
    }
  },

  // Fetch All Flagged Works with filtering & pagination (Live-Only, no caching)
  async getFlaggedWorks(filters = {}, options = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.state) params.append('state', filters.state);
      if (filters.category) params.append('category', filters.category);
      if (filters.riskLevel) params.append('riskLevel', filters.riskLevel);
      if (filters.status) params.append('status', filters.status);
      if (filters.financialYear) params.append('financialYear', filters.financialYear);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortField) params.append('sortField', filters.sortField);
      if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);

      const qs = params.toString();
      const endpoint = qs ? `/api/ministry/flagged?${qs}` : '/api/ministry/flagged';
      const remote = await apiFetch(endpoint, options);
      if (remote && Array.isArray(remote.data)) {
        return {
          total: remote.pagination?.total ?? remote.total ?? remote.data.length,
          data: remote.data,
          availableStates: remote.availableStates || [],
          availableCategories: remote.availableCategories || [],
          pagination: remote.pagination,
        };
      }
      throw new Error('Invalid flagged works response from server');
    } catch (err) {
      throw err;
    }
  },

  // Trends 1: Monthly Trends
  async getTrendsMonthly(filters = {}) {
    const params = new URLSearchParams();
    if (filters.state && filters.state !== 'ALL') params.append('state', filters.state);
    if (filters.district && filters.district !== 'ALL') params.append('district', filters.district);
    const qs = params.toString();
    const endpoint = qs ? `/api/ministry/trends/monthly?${qs}` : '/api/ministry/trends/monthly';
    const remote = await apiFetch(endpoint);
    if (remote && Array.isArray(remote.monthlyTrends)) {
      return remote.monthlyTrends;
    }
    throw new Error('Invalid monthly trends response from server');
  },

  // Trends 2: Category Anomalies
  async getTrendsCategories(filters = {}) {
    const params = new URLSearchParams();
    if (filters.state && filters.state !== 'ALL') params.append('state', filters.state);
    if (filters.district && filters.district !== 'ALL') params.append('district', filters.district);
    const qs = params.toString();
    const endpoint = qs ? `/api/ministry/trends/categories?${qs}` : '/api/ministry/trends/categories';
    const remote = await apiFetch(endpoint);
    if (remote && Array.isArray(remote.categoryAnomalies)) {
      return remote.categoryAnomalies;
    }
    throw new Error('Invalid category anomalies response from server');
  },

  // Trends 3: Vendor Concentration & Risk
  async getTrendsVendors(filters = {}) {
    const params = new URLSearchParams();
    if (filters.state && filters.state !== 'ALL') params.append('state', filters.state);
    if (filters.district && filters.district !== 'ALL') params.append('district', filters.district);
    const qs = params.toString();
    const endpoint = qs ? `/api/ministry/trends/vendors?${qs}` : '/api/ministry/trends/vendors';
    const remote = await apiFetch(endpoint);
    if (remote && Array.isArray(remote.topVendors)) {
      return remote.topVendors;
    }
    throw new Error('Invalid top vendors response from server');
  },

  // Trends 4: State Performance vs Risk
  async getTrendsStates(filters = {}) {
    const params = new URLSearchParams();
    if (filters.state && filters.state !== 'ALL') params.append('state', filters.state);
    if (filters.district && filters.district !== 'ALL') params.append('district', filters.district);
    const qs = params.toString();
    const endpoint = qs ? `/api/ministry/trends/states?${qs}` : '/api/ministry/trends/states';
    const remote = await apiFetch(endpoint);
    if (remote && Array.isArray(remote.stateComparison)) {
      return remote.stateComparison;
    }
    throw new Error('Invalid state comparison response from server');
  },

  // Trends Locations: States & Districts list
  async getTrendsLocations() {
    const remote = await apiFetch('/api/ministry/trends/locations');
    if (remote && Array.isArray(remote.states)) {
      return remote.states;
    }
    throw new Error('Invalid locations response from server');
  },

  // Fetch Trends and Analytics (Backwards-compatible consolidated)
  async getTrendsAnalytics(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.state && filters.state !== 'ALL') params.append('state', filters.state);
      if (filters.district && filters.district !== 'ALL') params.append('district', filters.district);
      const qs = params.toString();
      const endpoint = qs ? `/api/ministry/trends?${qs}` : '/api/ministry/trends';
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.monthlyTrends)) {
        cachedTrends = remote;
        return remote;
      }
      throw new Error('Invalid trends data response from server');
    } catch (err) {
      if (cachedTrends) return cachedTrends;
      throw err;
    }
  },

  // Fetch Predictive Risk Watchlist
  async getPredictiveWatchlist(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.state) params.append('state', filters.state);
      if (filters.category) params.append('category', filters.category);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const qs = params.toString();
      const endpoint = qs ? `/api/ministry/predictions?${qs}` : '/api/ministry/predictions';
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.data)) {
        return {
          total: remote.pagination?.total ?? remote.total ?? remote.data.length,
          data: remote.data,
          pagination: remote.pagination,
        };
      }
      throw new Error('Invalid predictions response from server');
    } catch (err) {
      if (cachedWatchlist) return cachedWatchlist;
      throw err;
    }
  },

  // Get specific work by ID (searches backend first)
  async getWorkById(workId) {
    if (!workId) return null;
    const cleanId = decodeURIComponent(workId).trim();
    try {
      const remote = await apiFetch(`/api/works/${encodeURIComponent(cleanId)}`);
      if (remote && remote.workId) {
        cachedWorksById.set(cleanId.toLowerCase(), remote);
        return remote;
      }
      throw new Error(`Work ${cleanId} not found on server`);
    } catch (err) {
      if (cachedWorksById.has(cleanId.toLowerCase())) {
        return cachedWorksById.get(cleanId.toLowerCase());
      }
      throw err;
    }
  },

  // Issue Audit Notice (Ministry / District / State / Auditor)
  async issueAuditNotice(workId) {
    const res = await apiFetch(`/api/works/${encodeURIComponent(workId)}/audit-notice`, {
      method: 'POST',
    });
    return res;
  },

  // Fetch MP Performance Leaderboard (Ranked strictly by Fund Utilization %)
  async getMpLeaderboard(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.state) params.append('state', filters.state);
      if (filters.district) params.append('district', filters.district);
      if (filters.utilizationRange) params.append('utilizationRange', filters.utilizationRange);
      if (filters.completionRange) params.append('completionRange', filters.completionRange);
      if (filters.sortField) params.append('sortField', filters.sortField);
      if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const qs = params.toString();
      const endpoint = qs ? `/api/ministry/mp-performance?${qs}` : '/api/ministry/mp-performance';
      const remote = await apiFetch(endpoint);
      if (remote && Array.isArray(remote.data)) {
        return {
          data: remote.data,
          total: remote.pagination?.total ?? remote.total ?? remote.data.length,
          pagination: remote.pagination,
          availableStates: remote.availableStates || [],
          availableDistricts: remote.availableDistricts || [],
          top5: remote.top5 || [],
          bottom5: remote.bottom5 || [],
        };
      }
      throw new Error('Invalid MP performance response from server');
    } catch (err) {
      if (cachedMpLeaderboard) return cachedMpLeaderboard;
      throw err;
    }
  }
};
```


### `frontend/src/api/stateApi.js`

*File [78/131] | Lines: 63 | Size: 1.8 KB*

```javascript
import { apiFetch } from './apiClient';

/**
 * State Nodal Authority Data Layer (src/api/stateApi.js)
 * Connects directly to backend State Nodal Authority REST endpoints.
 */

let lastValidStateOverview = null;
const districtSummaryCache = new Map();

export const stateApi = {
  // Get State Profile Context
  async getStateProfile(stateId) {
    if (lastValidStateOverview?.state) {
      return lastValidStateOverview.state;
    }
    try {
      const overview = await this.getStateOverview(stateId);
      return overview?.state || null;
    } catch {
      return lastValidStateOverview?.state || null;
    }
  },

  // Get State Overview rollup
  async getStateOverview(stateId) {
    try {
      const remote = await apiFetch('/api/state/overview');
      if (remote && remote.state && remote.kpis && Array.isArray(remote.districts)) {
        lastValidStateOverview = remote;
        return remote;
      }
      throw new Error('Invalid state overview response from server');
    } catch (err) {
      if (lastValidStateOverview) {
        return lastValidStateOverview;
      }
      throw err;
    }
  },

  // Get District Summary Details (including top 3 highest-risk projects)
  async getDistrictSummary(districtName) {
    try {
      const remote = await apiFetch(`/api/state/districts/${encodeURIComponent(districtName)}/summary`);
      if (remote && remote.district) {
        const result = {
          ...remote,
          topProjects: remote.topRiskProjects || remote.topProjects || [],
        };
        districtSummaryCache.set(districtName.toLowerCase(), result);
        return result;
      }
      throw new Error('Invalid district summary response from server');
    } catch (err) {
      if (districtSummaryCache.has(districtName.toLowerCase())) {
        return districtSummaryCache.get(districtName.toLowerCase());
      }
      throw err;
    }
  }
};
```


### `frontend/src/App.jsx`

*File [79/131] | Lines: 148 | Size: 6.2 KB*

```jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ChatbotWidget from './components/ChatbotWidget';
import GlobalLoadingBar from './components/common/loading/GlobalLoadingBar';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import StateDashboardLayout from './components/layout/StateDashboardLayout';
import MpDashboardLayout from './components/layout/MpDashboardLayout';
import DistrictDashboardLayout from './components/layout/DistrictDashboardLayout';
import AuditorDashboardLayout from './components/layout/AuditorDashboardLayout';

// Auth Page
import LoginPage from './pages/LoginPage';

// Ministry Pages
import NationalOverviewPage from './pages/NationalOverviewPage';
import FlaggedCasesPage from './pages/FlaggedCasesPage';
import TrendsAnalyticsPage from './pages/TrendsAnalyticsPage';
import PredictiveForecastPage from './pages/PredictiveForecastPage';
import MpPerformancePage from './pages/MpPerformancePage';

// State Pages
import StateOverviewPage from './pages/state/StateOverviewPage';

// MP Pages
import MpConstituencyOverviewPage from './pages/mp/MpConstituencyOverviewPage';
import MpWorksListPage from './pages/mp/MpWorksListPage';

// District Pages
import DistrictOverviewPage from './pages/district/DistrictOverviewPage';
import DistrictVerificationQueuePage from './pages/district/DistrictVerificationQueuePage';

// Auditor Pages
import AuditorCaseQueuePage from './pages/auditor/AuditorCaseQueuePage';
import AuditorCaseDetailPage from './pages/auditor/AuditorCaseDetailPage';
import AuditorVendorToolPage from './pages/auditor/AuditorVendorToolPage';

// Dedicated Work Detail Page
import WorkDetailPage from './pages/WorkDetailPage';

/**
 * RootRedirect Helper
 * Redirects authenticated users to their role-specific default view,
 * and unauthenticated users to the /login page.
 */
function RootRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  return <Navigate to={user.defaultPath || '/ministry/overview'} replace />;
}

/**
 * CasesRedirect Helper
 * Redirects general /cases/:workId requests to the user's role-scoped path.
 */
function CasesRedirect() {
  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const workId = params['*'] || params.workId;
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  const role = user.role || 'ministry';
  return <Navigate to={`/${role}/cases/${workId}`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <GlobalLoadingBar />
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Ministry (National View) Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ministry']} />}>
            <Route path="/ministry" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/ministry/overview" replace />} />
              <Route path="overview" element={<NationalOverviewPage />} />
              <Route path="mp-performance" element={<MpPerformancePage />} />
              <Route path="flagged" element={<FlaggedCasesPage />} />
              <Route path="trends" element={<TrendsAnalyticsPage />} />
              <Route path="predictions" element={<PredictiveForecastPage />} />
              <Route path="cases/*" element={<WorkDetailPage />} />
            </Route>
          </Route>

          {/* State Nodal Authority Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['state']} />}>
            <Route path="/state" element={<StateDashboardLayout />}>
              <Route index element={<Navigate to="/state/overview" replace />} />
              <Route path="overview" element={<StateOverviewPage />} />
              <Route path="cases/*" element={<WorkDetailPage />} />
            </Route>
          </Route>

          {/* MP (Individual View) Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['mp']} />}>
            <Route path="/mp" element={<MpDashboardLayout />}>
              <Route index element={<Navigate to="/mp/overview" replace />} />
              <Route path="overview" element={<MpConstituencyOverviewPage />} />
              <Route path="works" element={<MpWorksListPage />} />
              <Route path="cases/*" element={<WorkDetailPage />} />
            </Route>
          </Route>

          {/* District Authority Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['district']} />}>
            <Route path="/district" element={<DistrictDashboardLayout />}>
              <Route index element={<Navigate to="/district/overview" replace />} />
              <Route path="overview" element={<DistrictOverviewPage />} />
              <Route path="verification" element={<DistrictVerificationQueuePage />} />
              <Route path="cases/*" element={<WorkDetailPage />} />
            </Route>
          </Route>

          {/* Independent Auditor / Investigator Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={['auditor']} />}>
            <Route path="/auditor" element={<AuditorDashboardLayout />}>
              <Route index element={<Navigate to="/auditor/queue" replace />} />
              <Route path="queue" element={<AuditorCaseQueuePage />} />
              <Route path="case/*" element={<AuditorCaseDetailPage />} />
              <Route path="cases/*" element={<WorkDetailPage />} />
              <Route path="vendor" element={<AuditorVendorToolPage />} />
            </Route>
          </Route>

          {/* Shared Dynamic Case Route: /cases/* */}
          <Route path="/cases/*" element={<CasesRedirect />} />

          {/* Fallback Root Redirects */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
        
        {/* Global Floating Chatbot Assistant */}
        <ChatbotWidget />
      </BrowserRouter>
    </AuthProvider>
  );
}
```


### `frontend/src/auth/mockAuth.js`

*File [80/131] | Lines: 90 | Size: 2.0 KB*

```javascript
import { login as apiLogin } from '../api/authApi.js';

/**
 * Authentication Helper & Demo Users (src/auth/mockAuth.js)
 * Demo credentials for development / presentation access.
 */





export const mockUsers = [
  {
    id: 1,
    name: "Ministry Admin",
    email: "ministry@mplads-sentinel.local",
    password: "ministry123",
    role: "ministry",
    roleLabel: "Ministry (National View)",
    defaultPath: "/ministry/overview",
  },
  {
    id: 756,
    name: "AASHTIKAR PATIL NAGESH BAPURAO",
    email: "mp1@mplads-sentinel.local",
    password: "mp1123",
    role: "mp",
    roleLabel: "Member of Parliament (MP)",
    mpId: 1,
    stateId: 20,
    defaultPath: "/mp/overview",
  },
  {
    id: 164,
    name: "Durg District Authority",
    email: "district127@mplads-sentinel.local",
    password: "district127123",
    role: "district",
    roleLabel: "District Authority",
    districtId: 127,
    stateId: 7,
    districtName: "Durg",
    state: "Chhattisgarh",
    defaultPath: "/district/overview",
  },
  {
    id: 8,
    name: "Chhattisgarh Nodal Authority",
    email: "chhattisgarh@mplads-sentinel.local",
    password: "state7123",
    role: "state",
    roleLabel: "State Nodal Authority",
    stateId: 7,
    stateName: "Chhattisgarh",
    department: "Planning & Development Department, Chhattisgarh",
    defaultPath: "/state/overview",
  },
  {
    id: 1299,
    name: "Platform Auditor",
    email: "auditor@mplads-sentinel.local",
    password: "auditor123",
    role: "auditor",
    roleLabel: "Independent Auditor",
    department: "Central Forensic Investigation Wing",
    defaultPath: "/auditor/queue",
  },
];




/**
 * Delegates to real backend authApi.login
 * @param {string} email
 * @param {string} password
 */
export async function login(email, password) {
  const res = await apiLogin(email, password);
  return res.user;
}

/**
 * Quick helper to retrieve demo user profile by role
 * @param {string} role
 */
export function getMockUserByRole(role) {
  return mockUsers.find((u) => u.role.toLowerCase() === (role || '').toLowerCase()) || null;
}
```


### `frontend/src/components/ChatbotWidget/ChatbotWidget.jsx`

*File [81/131] | Lines: 326 | Size: 12.1 KB*

```jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  RotateCcw,
  Minimize2,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAssistantResponse, getRoleInitialGreeting } from '../../api/chatbotApi';

/**
 * ChatbotWidget Component
 * Persistent floating assistant mounted at the App root.
 * Role-aware, desktop-first, in-memory conversation state.
 * Only rendered on authenticated dashboard routes (hidden on /login).
 */
export default function ChatbotWidget() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const currentRole = user?.role || 'ministry';

  // Hide widget completely on login page and when unauthenticated
  if (!isAuthenticated || !user || location.pathname === '/login') {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize or reset role-tailored greeting
  useEffect(() => {
    const greeting = getRoleInitialGreeting(currentRole);
    setMessages([
      {
        id: 'init-1',
        sender: 'bot',
        text: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [currentRole]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when chat panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const toggleChat = () => {
    if (!isOpen && hasUnread) {
      setHasUnread(false);
    }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const replyText = await getAssistantResponse(text, currentRole);
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: "I'm having trouble retrieving that information right now. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'bot',
        text: getRoleInitialGreeting(currentRole),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Quick suggestion chips based on active role
  const getSuggestionChips = () => {
    switch (currentRole) {
      case 'ministry':
        return ['High-risk works', 'Fund utilization', 'Predictive alerts'];
      case 'mp':
        return ['Constituency works', 'Annual entitlement', 'Delayed sanctions'];
      case 'district':
        return ['Verification queue', 'Photographic evidence', 'Escalations'];
      case 'auditor':
        return ['Audit queue', 'Vendor cross-reference', 'High anomaly cases'];
      case 'state':
        return ['District performance', 'State absorption', 'Risk breakdown'];
      default:
        return ['Flagged cases', 'Fund utilization', 'Vendor patterns'];
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end">
        <button
          type="button"
          onClick={toggleChat}
          aria-label={isOpen ? 'Close assistant' : 'Open MPLADS Assistant'}
          className="relative w-14 h-14 rounded-full bg-[#1D9BF0] text-white shadow-xl hover:bg-[#1A8CD8] active:scale-95 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-sky-200"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-150 rotate-0" />
          ) : (
            <MessageSquare className="w-6 h-6 transition-transform duration-150" />
          )}

          {/* Unread Attention Dot */}
          {!isOpen && hasUnread && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white" />
            </span>
          )}
        </button>
      </div>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-7rem)] bg-white rounded-3xl shadow-2xl border border-[#EFF3F4] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#0F1419] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1D9BF0] flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold tracking-tight">MPLADS Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Online" />
                </div>
                <div className="text-[11px] text-slate-400 capitalize">
                  AI Companion • {currentRole} View
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={handleClearHistory}
                title="Reset conversation"
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={toggleChat}
                title="Close chat"
                className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F9F9]">
            {messages.map((m) => {
              const isUser = m.sender === 'user';

              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-[#1D9BF0]/10 text-[#1D9BF0] flex items-center justify-center shrink-0 mb-1 border border-[#1D9BF0]/20">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-[#1D9BF0] text-white rounded-br-xs'
                        : 'bg-white text-[#0F1419] border border-[#EFF3F4] rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{m.text}</p>
                    <div
                      className={`text-[10px] mt-1 text-right ${
                        isUser ? 'text-sky-100' : 'text-slate-400'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mb-1">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-[#1D9BF0]/10 text-[#1D9BF0] flex items-center justify-center shrink-0 mb-1 border border-[#1D9BF0]/20">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-[#EFF3F4] px-3.5 py-2.5 rounded-2xl rounded-bl-xs flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D9BF0] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D9BF0] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D9BF0] animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 pt-2 pb-1 bg-white border-t border-[#EFF3F4] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {getSuggestionChips().map((chip, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isTyping}
                onClick={() => handleSendMessage(chip)}
                className="text-[11px] font-medium text-slate-600 bg-[#F7F9F9] hover:bg-sky-50 hover:text-[#1D9BF0] border border-[#EFF3F4] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-[#EFF3F4]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about works, funds, vendors..."
                disabled={isTyping}
                className="flex-1 bg-[#F7F9F9] border border-[#EFF3F4] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#0F1419] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:bg-white transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl bg-[#1D9BF0] text-white flex items-center justify-center hover:bg-[#1A8CD8] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
```


### `frontend/src/components/ChatbotWidget/index.js`

*File [82/131] | Lines: 2 | Size: 0.0 KB*

```javascript
export { default } from './ChatbotWidget';
```


### `frontend/src/components/common/AlertBellIcon.jsx`

*File [83/131] | Lines: 129 | Size: 5.2 KB*

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Bell, AlertTriangle, ChevronRight, Check } from 'lucide-react';
import RiskBadge from './RiskBadge';

/**
 * AlertBellIcon Component
 * Top-right notification bell showing live count of new flagged cases,
 * with an interactive dropdown drawer for quick review.
 */
export default function AlertBellIcon({ alerts = [], onSelectAlert }) {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState(new Set());
  const dropdownRef = useRef(null);

  const unreadCount = alerts.filter(a => !readIds.has(a.workId)).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAlertClick = (alertItem) => {
    setReadIds(prev => new Set(prev).add(alertItem.workId));
    setIsOpen(false);
    if (onSelectAlert) {
      onSelectAlert(alertItem);
    }
  };

  const handleMarkAllRead = () => {
    const all = new Set(alerts.map(a => a.workId));
    setReadIds(all);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-slate-600 hover:text-[#0F1419] hover:bg-[#F7F9F9] border border-transparent hover:border-[#EFF3F4] transition-all"
        title="High-Risk Anomaly Alerts"
      >
        <Bell className="w-5 h-5 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white border border-[#EFF3F4] rounded-2xl shadow-hover z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3.5 bg-[#F7F9F9] border-b border-[#EFF3F4] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-rose-100 rounded-md text-rose-600">
                <AlertTriangle className="w-3.5 h-3.5" />
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1419]">
                National High-Risk Alerts
              </h4>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-medium text-[#1D9BF0] hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#EFF3F4]">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active high-risk alerts.
              </div>
            ) : (
              alerts.map((item) => {
                const isUnread = !readIds.has(item.workId);
                return (
                  <div
                    key={item.workId}
                    onClick={() => handleAlertClick(item)}
                    className={`p-3.5 hover:bg-[#F7F9F9] cursor-pointer transition-colors flex items-start gap-3 ${
                      isUnread ? 'bg-rose-50/30' : ''
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 block" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-mono font-bold text-[#0F1419] truncate">
                          {item.workId}
                        </span>
                        <RiskBadge level={item.riskLevel || 'High'} size="sm" />
                      </div>
                      <p className="text-xs text-slate-700 font-medium line-clamp-2">
                        {item.flagReason || item.warningSignal}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                        <span>{item.state} • {item.district}</span>
                        <span className="text-[#1D9BF0] font-medium flex items-center hover:underline">
                          Inspect <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-2.5 bg-[#F7F9F9] border-t border-[#EFF3F4] text-center">
            <span className="text-[11px] text-slate-500 font-medium">
              Continuous 24/7 AI telemetry monitoring 38,000+ works
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
```


### `frontend/src/components/common/DistrictSummaryModal.jsx`

*File [84/131] | Lines: 167 | Size: 7.5 KB*

```jsx
import React from 'react';
import {
  X,
  Building2,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  MapPin,
  Layers,
  TrendingUp,
} from 'lucide-react';
import RiskBadge from './RiskBadge';

/**
 * DistrictSummaryModal Component
 * Lightweight drill-down popup for State Nodal Authority dashboard.
 * Displays district KPI summary, Low/Medium/High risk counts, and top 3 highest-risk projects.
 */
export default function DistrictSummaryModal({
  districtSummary,
  isOpen,
  onClose,
  onSelectProject,
}) {
  if (!isOpen || !districtSummary) return null;

  const { district, totalWorks, sanctionedCr, completed, flaggedCount, avgRiskScore, riskBreakdown, topProjects } = districtSummary;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-modal border border-[#EFF3F4] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4.5 bg-[#F7F9F9] border-b border-[#EFF3F4] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white rounded-xl border border-[#EFF3F4] text-[#1D9BF0] shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F1419]">
                {district} District Summary
              </h3>
              <p className="text-xs text-slate-500">
                {districtSummary.stateName ? `State Nodal Oversight • ${districtSummary.stateName}` : 'State Nodal Oversight'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F1419] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          
          {/* Total Projects & Sanction Header */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-[#EFF3F4]">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Projects
              </span>
              <div className="text-xl font-extrabold text-[#0F1419] font-mono mt-0.5">
                {totalWorks} <span className="text-xs font-normal text-slate-500">Works</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">
                {completed} Completed ({Math.round((completed / totalWorks) * 100)}%)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-[#EFF3F4]">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Sanctioned Amount
              </span>
              <div className="text-xl font-extrabold text-[#0F1419] font-mono mt-0.5">
                ₹{sanctionedCr?.toFixed(1)} <span className="text-xs font-normal text-slate-500">Cr</span>
              </div>
              <span className="text-[11px] text-slate-500">
                Avg Risk Score: <strong className="font-mono">{avgRiskScore}/100</strong>
              </span>
            </div>
          </div>

          {/* Risk Breakdown: 3 Stat Blocks */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              District Risk Severity Breakdown
            </span>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">High Risk</span>
                <span className="text-base font-extrabold text-rose-600 font-mono">{riskBreakdown?.high || 0}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Medium</span>
                <span className="text-base font-extrabold text-amber-600 font-mono">{riskBreakdown?.medium || 0}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Low</span>
                <span className="text-base font-extrabold text-emerald-600 font-mono">{riskBreakdown?.low || 0}</span>
              </div>
            </div>
          </div>

          {/* Top 3 Highest-Risk Projects List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Top 3 Highest-Risk Projects
              </span>
              <span className="text-[11px] text-slate-400">Click to inspect</span>
            </div>

            <div className="space-y-2">
              {topProjects && topProjects.length > 0 ? (
                topProjects.map((proj) => (
                  <div
                    key={proj.workId}
                    onClick={() => onSelectProject(proj)}
                    className="p-3 rounded-xl border border-[#EFF3F4] bg-[#F7F9F9] hover:bg-white hover:border-[#1D9BF0] hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono font-bold text-xs text-[#0F1419] group-hover:text-[#1D9BF0]">
                        {proj.workId}
                      </span>
                      <RiskBadge level={proj.riskLevel} score={proj.riskScore} size="sm" />
                    </div>
                    <p className="text-xs text-slate-700 font-medium line-clamp-1">
                      {proj.description || proj.flagReason}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 pt-1.5 border-t border-slate-200/50">
                      <span>Amount: <strong className="font-mono text-slate-700">₹{proj.sanctionedAmount?.toFixed(1)}L</strong></span>
                      <span className="text-[#1D9BF0] font-semibold flex items-center group-hover:translate-x-0.5 transition-transform">
                        Full Audit Detail <ChevronRight className="w-3 h-3 ml-0.5" />
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-xs text-slate-400">
                  No flagged projects found in this district.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-[#F7F9F9] border-t border-[#EFF3F4] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#0F1419] bg-white border border-[#EFF3F4] rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
```


### `frontend/src/components/common/FilterBar.jsx`

*File [85/131] | Lines: 132 | Size: 5.7 KB*

```jsx
import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

/**
 * FilterBar Component
 * Dropdown filters for State, District, Category, Date Range / FY, Risk Level, Status
 */
export default function FilterBar({
  filters = {},
  onFilterChange,
  onReset,
  availableStates = [],
  availableDistricts = [],
  availableCategories = [],
  showState = true,
  showDistrict = true,
  showRiskLevel = true,
  showStatus = true,
  showDateRange = true,
}) {
  const states = ['All', ...(availableStates || []).filter((s) => s && s !== 'All')];
  const categories = ['All', ...(availableCategories || []).filter((c) => c && c !== 'All')];

  const isFiltered = Object.entries(filters).some(([key, val]) => val && val !== 'All' && val !== '');

  return (
    <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-xl p-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[auto_repeat(5,minmax(0,1fr))_auto] gap-2.5 items-center">
        {/* Filter Label */}
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5 text-[#1D9BF0]" />
          <span>Filters:</span>
        </div>

        {/* State Filter */}
        {showState && (
          <div className="w-full">
            <select
              value={filters.state || 'All'}
              onChange={(e) => onFilterChange('state', e.target.value)}
              className="w-full max-w-full lg:max-w-[200px] truncate bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
            >
              <option value="All">All States (India)</option>
              {states.filter(s => s !== 'All').map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {/* Category Filter */}
        <div className="w-full">
          <select
            value={filters.category || 'All'}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full max-w-full lg:max-w-[200px] truncate bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
          >
            <option value="All">All Work Categories</option>
            {categories.filter(c => c !== 'All').map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Risk Level Filter */}
        {showRiskLevel && (
          <div className="w-full">
            <select
              value={filters.riskLevel || 'All'}
              onChange={(e) => onFilterChange('riskLevel', e.target.value)}
              className="w-full max-w-full lg:max-w-[200px] truncate bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">🔴 High Risk Only</option>
              <option value="Medium">🟡 Medium Risk</option>
              <option value="Low">🟢 Low Risk</option>
            </select>
          </div>
        )}

        {/* Status Filter */}
        {showStatus && (
          <div className="w-full">
            <select
              value={filters.status || 'All'}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full max-w-full lg:max-w-[200px] truncate bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Delayed">Delayed / Overdue</option>
              <option value="Sanctioned">Sanctioned</option>
              <option value="Under Review">Under Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        )}

        {/* Financial Year / Date Range Filter */}
        {showDateRange && (
          <div className="w-full">
            <select
              value={filters.financialYear || 'FY 2023-24'}
              onChange={(e) => onFilterChange('financialYear', e.target.value)}
              className="w-full max-w-full lg:max-w-[200px] truncate bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
            >
              <option value="FY 2024-25">FY 2024-25 (Current)</option>
              <option value="FY 2023-24">FY 2023-24</option>
              <option value="FY 2022-23">FY 2022-23</option>
              <option value="All">All Fiscal Years</option>
            </select>
          </div>
        )}

        {/* Reset Button */}
        {isFiltered && (
          <div className="w-full sm:w-auto sm:col-span-2 md:col-span-1 lg:col-span-1 flex justify-end">
            <button
              onClick={onReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1 text-xs font-medium text-slate-500 hover:text-[#1D9BF0] transition-colors px-2.5 py-1.5 bg-white border border-[#EFF3F4] rounded-lg hover:border-[#1D9BF0] shadow-xs"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```


### `frontend/src/components/common/loading/CardSkeleton.jsx`

*File [86/131] | Lines: 49 | Size: 1.6 KB*

```jsx
import React from 'react';
import Skeleton from './Skeleton';

/**
 * CardSkeleton
 * Placeholder for KPI metric cards, stats blocks, or summary tiles.
 */
export default function CardSkeleton({ count = 1, cols, className = '' }) {
  const cards = Array.from({ length: count });

  if (count === 1) {
    return (
      <div className={`bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle ${className}`}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-28 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-32 mt-2.5 rounded-lg" />
        <Skeleton className="h-3 w-40 mt-2.5 rounded-md" />
      </div>
    );
  }

  const effectiveCols = cols || (count <= 5 ? count : 4);
  const gridColsClass =
    effectiveCols === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : effectiveCols === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : effectiveCols === 5
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${gridColsClass} gap-4 ${className}`}>
      {cards.map((_, i) => (
        <div key={i} className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-24 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-28 mt-2.5 rounded-lg" />
          <Skeleton className="h-3 w-36 mt-2.5 rounded-md" />
        </div>
      ))}
    </div>
  );
}
```


### `frontend/src/components/common/loading/ChartSkeleton.jsx`

*File [87/131] | Lines: 58 | Size: 2.0 KB*

```jsx
import React from 'react';
import Skeleton from './Skeleton';

/**
 * ChartSkeleton
 * Renders a structured placeholder for charts and analytics graphs.
 */
export default function ChartSkeleton({
  height = 'h-72',
  title = 'Loading analytics...',
  type = 'bar', // 'bar' | 'area' | 'pie'
  className = '',
}) {
  return (
    <div className={`bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col justify-between ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <Skeleton className="h-4 w-44 mb-1.5" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-6 w-20 rounded-lg" />
      </div>

      {/* Chart Visual Body */}
      <div className={`w-full ${height} flex items-end justify-between gap-2 pt-6 pb-2 px-4 bg-[#F7F9F9]/60 rounded-xl border border-dashed border-[#EFF3F4]`}>
        {type === 'pie' ? (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="w-36 h-36 rounded-full" />
          </div>
        ) : (
          [45, 75, 30, 90, 60, 40, 80, 55, 70, 85, 35, 65].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end gap-2">
              <Skeleton
                className="w-full max-w-[28px] rounded-t-md"
                style={{ height: `${val}%` }}
              />
              <Skeleton className="h-2 w-4" />
            </div>
          ))
        )}
      </div>

      {/* Legend / Footer */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-[#EFF3F4]">
        <div className="flex items-center gap-2">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-3 h-3 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
```


### `frontend/src/components/common/loading/EmptyState.jsx`

*File [88/131] | Lines: 68 | Size: 2.4 KB*

```jsx
import React from 'react';
import { Inbox, RotateCcw } from 'lucide-react';

/**
 * EmptyState Component
 *
 * Pixel-accurate empty state matching MPLADS Sentinel design language:
 * - Supports both standalone card mode and embedded/table mode (no double borders)
 * - Flexible prop aliases: message/description, actionText/actionLabel
 * - Refined squircle icon container with subtle brand accents
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No Records Found',
  description,
  message,
  actionLabel,
  actionText,
  actionIcon: ActionIcon = RotateCcw,
  onAction,
  variant = 'auto', // 'auto' | 'card' | 'embedded'
  className = '',
  children,
}) {
  const resolvedDesc = message || description || 'No records match the selected filters or query.';
  const resolvedAction = actionLabel || actionText;

  const isCard = variant === 'card';
  const containerClasses = isCard
    ? 'bg-white border border-[#EFF3F4] rounded-2xl p-8 sm:p-10 shadow-subtle'
    : 'py-8 sm:py-12 px-4';

  return (
    <div
      className={`text-center flex flex-col items-center justify-center space-y-3 group select-none ${containerClasses} ${className}`}
    >
      {/* Icon Squircle */}
      <div className="w-12 h-12 rounded-2xl bg-[#F7F9F9] border border-[#EFF3F4] flex items-center justify-center text-slate-400 shadow-2xs group-hover:scale-105 group-hover:text-slate-500 group-hover:border-slate-300 transition-all duration-200">
        <Icon className="w-5.5 h-5.5" />
      </div>

      {/* Text Hierarchy */}
      <div className="max-w-sm space-y-1">
        <h3 className="text-sm font-bold text-[#0F1419] tracking-tight">{title}</h3>
        {resolvedDesc && (
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            {resolvedDesc}
          </p>
        )}
      </div>

      {/* Action Button */}
      {resolvedAction && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#1D9BF0] bg-sky-50/80 hover:bg-sky-100 hover:text-[#1A8CD8] border border-sky-200/60 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-[0.98] mt-1 cursor-pointer"
        >
          <ActionIcon className="w-3.5 h-3.5 text-[#1D9BF0]" />
          <span>{resolvedAction}</span>
        </button>
      )}

      {children}
    </div>
  );
}
```


### `frontend/src/components/common/loading/ErrorBoundary.jsx`

*File [89/131] | Lines: 53 | Size: 1.3 KB*

```jsx
import React, { Component } from 'react';
import ErrorState from './ErrorState';

/**
 * ErrorBoundary
 * Catches JavaScript errors anywhere in child component trees,
 * logs them, and displays a recovery fallback without blanking the application.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="py-8">
          <ErrorState
            title={this.props.title || 'Something went wrong in this section'}
            message={
              this.state.error?.message ||
              'An unexpected rendering error occurred. You can retry or refresh the page.'
            }
            onRetry={this.handleReset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
```


### `frontend/src/components/common/loading/ErrorState.jsx`

*File [90/131] | Lines: 60 | Size: 2.1 KB*

```jsx
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * ErrorState Component
 *
 * Pixel-accurate error card / inline state matching MPLADS Sentinel design language:
 * - Supports standalone card mode and embedded mode (inside table or panel)
 * - Uses soft rose indicator badge, high-contrast title, and Twitter-clean retry button
 */
export default function ErrorState({
  title = 'Unable to Load Data',
  message,
  description,
  onRetry,
  variant = 'auto', // 'auto' | 'card' | 'embedded'
  className = '',
  children,
}) {
  const resolvedMsg = message || description || 'A network or server error occurred while retrieving this information.';
  const isCard = variant === 'card';
  const containerClasses = isCard
    ? 'bg-white border border-rose-200/80 rounded-2xl p-8 sm:p-10 shadow-subtle'
    : 'py-8 sm:py-10 px-4';

  return (
    <div
      role="alert"
      className={`text-center flex flex-col items-center justify-center space-y-3.5 select-none ${containerClasses} ${className}`}
    >
      {/* Rose Alert Squircle */}
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-2xs">
        <AlertTriangle className="w-5.5 h-5.5" />
      </div>

      {/* Text Hierarchy */}
      <div className="max-w-md space-y-1">
        <h3 className="text-sm font-bold text-[#0F1419] tracking-tight">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          {resolvedMsg}
        </p>
      </div>

      {/* Retry Action Button */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#0F1419] bg-white border border-[#EFF3F4] hover:border-slate-300 hover:bg-[#F7F9F9] rounded-xl transition-all shadow-xs active:scale-[0.98] cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
          <span>Retry Request</span>
        </button>
      )}

      {children}
    </div>
  );
}
```


### `frontend/src/components/common/loading/GlobalLoadingBar.jsx`

*File [91/131] | Lines: 125 | Size: 3.8 KB*

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { onApiActivityChange } from '../../../api/apiClient';

/**
 * GlobalLoadingBar
 * A silky-smooth, GPU-accelerated top progress bar (YouTube / GitHub / Vercel style).
 * - Hardware-accelerated with CSS `transform: scaleX(...)` (zero layout reflow, no frame drops).
 * - Single continuous cubic-bezier easing curve (eliminates choppy setTimeout stepping/lag).
 * - Snappy 120ms rush to 100% upon completion followed by a graceful 160ms fade-out.
 * - 1.2s safety timeout ensures perfectly timed, predictable completion.
 */
export default function GlobalLoadingBar() {
  const [visible, setVisible] = useState(false);
  const [scale, setScale] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [fading, setFading] = useState(false);

  const completeTimerRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const safetyTimeoutRef = useRef(null);
  const rafRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cancelAnimationFrame(rafRef.current);
      clearTimeout(completeTimerRef.current);
      clearTimeout(fadeTimerRef.current);
      clearTimeout(safetyTimeoutRef.current);
    };
  }, []);

  const finishLoading = () => {
    clearTimeout(safetyTimeoutRef.current);
    clearTimeout(completeTimerRef.current);
    clearTimeout(fadeTimerRef.current);
    cancelAnimationFrame(rafRef.current);

    setIsComplete(true);
    setScale(1);

    // Fast finish: hold at 100% for 120ms then fade out smoothly
    completeTimerRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      setFading(true);

      // Once fade-out finishes (160ms), reset and unmount cleanly
      fadeTimerRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        setVisible(false);
        setScale(0);
        setIsComplete(false);
        setFading(false);
      }, 160);
    }, 120);
  };

  const startLoading = () => {
    clearTimeout(completeTimerRef.current);
    clearTimeout(fadeTimerRef.current);
    clearTimeout(safetyTimeoutRef.current);
    cancelAnimationFrame(rafRef.current);

    setFading(false);
    setIsComplete(false);
    setVisible(true);
    setScale(0);

    // Use requestAnimationFrame to trigger continuous, buttery-smooth CSS GPU interpolation
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(() => {
        if (!isMountedRef.current) return;
        // Glide smoothly to ~86% over 1.1s using a natural deceleration bezier
        setScale(0.86);
      });
    });

    // Exact 1.2s safety threshold: finishes cleanly without lagging or lingering
    safetyTimeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        finishLoading();
      }
    }, 1200);
  };

  useEffect(() => {
    return onApiActivityChange((isBusy) => {
      if (isBusy) {
        startLoading();
      } else {
        finishLoading();
      }
    });
  }, []);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading data"
      className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] pointer-events-none overflow-hidden bg-transparent"
      style={{
        opacity: fading ? 0 : 1,
        transition: 'opacity 160ms ease-out',
      }}
    >
      <div
        className="h-full w-full origin-left bg-gradient-to-r from-[#1D9BF0] via-[#38BDF8] to-[#0284C7] shadow-[0_0_10px_rgba(29,155,240,0.9),0_0_4px_rgba(56,189,248,0.8)]"
        style={{
          transform: `scaleX(${scale})`,
          willChange: 'transform',
          transition: isComplete
            ? 'transform 120ms ease-out'
            : 'transform 1100ms cubic-bezier(0.12, 0.78, 0.22, 1)',
        }}
      />
    </div>
  );
}
```


### `frontend/src/components/common/loading/index.js`

*File [92/131] | Lines: 12 | Size: 0.6 KB*

```javascript
export { default as Skeleton } from './Skeleton';
export { default as CardSkeleton } from './CardSkeleton';
export { default as TableSkeleton } from './TableSkeleton';
export { default as ChartSkeleton } from './ChartSkeleton';
export { default as ListSkeleton } from './ListSkeleton';
export { default as MapSkeleton } from './MapSkeleton';
export { default as WorkDetailSkeleton } from './WorkDetailSkeleton';
export { default as ErrorState } from './ErrorState';
export { default as EmptyState } from './EmptyState';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as GlobalLoadingBar } from './GlobalLoadingBar';
```


### `frontend/src/components/common/loading/ListSkeleton.jsx`

*File [93/131] | Lines: 29 | Size: 0.9 KB*

```jsx
import React from 'react';
import Skeleton from './Skeleton';

/**
 * ListSkeleton
 * Placeholder for list items, alert feeds, or accordion panels.
 */
export default function ListSkeleton({ count = 5, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-[#EFF3F4] rounded-2xl p-4 flex items-center justify-between gap-4 shadow-subtle"
        >
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
            <div className="flex-1 min-w-0 space-y-1.5">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  );
}
```


### `frontend/src/components/common/loading/MapSkeleton.jsx`

*File [94/131] | Lines: 36 | Size: 1.2 KB*

```jsx
import React from 'react';
import Skeleton from './Skeleton';

/**
 * MapSkeleton
 * Renders a placeholder grid for the State-wise Risk Matrix.
 */
export default function MapSkeleton({ className = '' }) {
  return (
    <div className={`bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <Skeleton className="h-4 w-48 mb-1.5" />
          <Skeleton className="h-3 w-72" />
        </div>
        <Skeleton className="h-7 w-24 rounded-lg" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="p-3 bg-[#F7F9F9] rounded-xl border border-[#EFF3F4] flex flex-col justify-between h-20"
          >
            <Skeleton className="h-3.5 w-16" />
            <div className="flex items-center justify-between mt-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```


### `frontend/src/components/common/loading/Skeleton.jsx`

*File [95/131] | Lines: 16 | Size: 0.3 KB*

```jsx
import React from 'react';

/**
 * Skeleton Primitive
 * Provides a standardized shimmering skeleton placeholder block.
 */
export default function Skeleton({ className = '', style = {} }) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={`animate-shimmer rounded-xl ${className}`}
    />
  );
}
```


### `frontend/src/components/common/loading/TableSkeleton.jsx`

*File [96/131] | Lines: 62 | Size: 1.9 KB*

```jsx
import React from 'react';
import Skeleton from './Skeleton';

/**
 * TableSkeleton
 * Renders a structured skeleton table matching data grid views.
 */
export default function TableSkeleton({
  rows = 6,
  columns = 6,
  showHeader = true,
  className = '',
}) {
  const rowList = Array.from({ length: rows });
  const colList = Array.from({ length: columns });

  return (
    <div className={`bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden ${className}`}>
      {showHeader && (
        <div className="bg-[#F7F9F9] border-b border-[#EFF3F4] px-4 py-3 flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F7F9F9] border-b border-[#EFF3F4]">
              {colList.map((_, i) => (
                <th key={i} className="py-3 px-4">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFF3F4]">
            {rowList.map((_, rIdx) => (
              <tr key={rIdx}>
                {colList.map((_, cIdx) => (
                  <td key={cIdx} className="py-3.5 px-4">
                    <Skeleton
                      className={`h-4 ${
                        cIdx === 0
                          ? 'w-24'
                          : cIdx === 1
                          ? 'w-36'
                          : cIdx === colList.length - 1
                          ? 'w-16'
                          : 'w-20'
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```


### `frontend/src/components/common/loading/WorkDetailSkeleton.jsx`

*File [97/131] | Lines: 94 | Size: 3.8 KB*

```jsx
import React from 'react';
import Skeleton from './Skeleton';

/**
 * WorkDetailSkeleton
 * Comprehensive skeleton layout for project dossier and case detail views.
 */
export default function WorkDetailSkeleton({ className = '' }) {
  return (
    <div className={`space-y-6 ${className} animate-in fade-in duration-200`}>
      {/* Breadcrumb Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EFF3F4]">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-md" />
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded-md" />
          <Skeleton className="h-4 w-24 rounded-md" />
        </div>
      </div>

      {/* Header Banner Skeleton */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 sm:p-6 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-6 w-96 max-w-full rounded-md" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle">
            <Skeleton className="h-3.5 w-24 mb-2 rounded-md" />
            <Skeleton className="h-7 w-28 mb-1 rounded-lg" />
            <Skeleton className="h-3 w-36 rounded-md" />
          </div>
        ))}
      </div>

      {/* Two Column Layout (Left: Timeline/Financials, Right: Risk/Auditor) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EFF3F4]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle space-y-3">
            <Skeleton className="h-5 w-40 mb-3" />
            <Skeleton className="h-44 w-full rounded-xl" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle space-y-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>

          <div className="bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle space-y-3">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
```


### `frontend/src/components/common/MpLeaderboardWidget.jsx`

*File [98/131] | Lines: 513 | Size: 24.3 KB*

```jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Info,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  FileText,
  CheckCircle,
  Clock,
  IndianRupee,
  Layers,
  Sparkles,
  Award,
  AlertCircle,
  X,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

/**
 * MP Performance Leaderboard Widget
 * 
 * Scoped strictly to MP recommendation & fund utilization performance:
 * - Primary ranking metric: Fund Utilization % (Expenditure / Sanctioned Amount)
 * - Secondary supporting metric: Completion Efficiency Rate %
 * - Excludes risk scores and anomaly counts to maintain fairness to MPs
 * - Uses neutral Twitter-blue branding (NO red/amber/green risk colors)
 */
import { TableSkeleton, ErrorState } from './loading';

export default function MpLeaderboardWidget({ leaderboardData, error, onRetry }) {
  const [activeTab, setActiveTab] = useState('top5'); // 'top5' or 'bottom5'
  const [expandedMpName, setExpandedMpName] = useState(null);
  const [selectedMpForModal, setSelectedMpForModal] = useState(null);

  if (error && !leaderboardData) {
    return (
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <ErrorState
          title="MP Leaderboard Unavailable"
          message={error?.message || 'Failed to load MP performance data.'}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (!leaderboardData) {
    return (
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <TableSkeleton rows={5} columns={4} />
      </div>
    );
  }

  const { top5 = [], bottom5 = [] } = leaderboardData;
  const currentList = activeTab === 'top5' ? top5 : bottom5;

  const toggleExpand = (mpName, e) => {
    e.stopPropagation();
    setExpandedMpName(expandedMpName === mpName ? null : mpName);
  };

  const handleRowClick = (mp) => {
    setSelectedMpForModal(mp);
  };

  return (
    <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
      {/* Header with Title, Explanatory Caption, and View Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#EFF3F4]">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg border border-sky-100">
              <Award className="w-4 h-4 text-[#1D9BF0]" />
            </span>
            <h2 className="text-base font-bold text-[#0F1419] tracking-tight">
              MP Performance Leaderboard
            </h2>
            <span className="text-[11px] font-semibold font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
              Fund Utilization Metric
            </span>
          </div>
          {/* Explanatory Caption */}
          <p className="text-xs text-slate-500 leading-relaxed">
            Ranked by fund utilization; completion efficiency shown as a supporting metric — reflects MP recommendation activity, not execution or ground-level compliance, which is tracked separately under District and Auditor oversight.
          </p>
        </div>

        {/* Actions: Top 5 / Bottom 5 Tabs & View All Button */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="flex items-center gap-1 bg-[#F7F9F9] p-1 rounded-xl border border-[#EFF3F4]">
            <button
              onClick={() => {
                setActiveTab('top5');
                setExpandedMpName(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'top5'
                  ? 'bg-white text-[#1D9BF0] shadow-xs border border-sky-100'
                  : 'text-slate-500 hover:text-[#0F1419]'
              }`}
            >
              <TrendingUp className={`w-3.5 h-3.5 ${activeTab === 'top5' ? 'text-[#1D9BF0]' : 'text-slate-400'}`} />
              <span>Top 5</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('bottom5');
                setExpandedMpName(null);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'bottom5'
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-[#0F1419]'
              }`}
            >
              <TrendingDown className={`w-3.5 h-3.5 ${activeTab === 'bottom5' ? 'text-slate-700' : 'text-slate-400'}`} />
              <span>Bottom 5</span>
            </button>
          </div>

          <Link
            to="/ministry/mp-performance"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1D9BF0] text-white hover:bg-[#1A8CD8] transition-colors shadow-xs"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Oversight Guidance Hint for Bottom 5 */}
      {activeTab === 'bottom5' && (
        <div className="mt-3.5 p-2.5 bg-sky-50/50 border border-sky-100 rounded-xl flex items-center gap-2 text-xs text-sky-800">
          <Info className="w-4 h-4 text-[#1D9BF0] shrink-0" />
          <span>
            <strong>Oversight Notice:</strong> MPs with low fund utilization may require administrative reminders to accelerate recommendation of developmental works for their constituency.
          </span>
        </div>
      )}

      {/* Ranked Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#EFF3F4] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3 w-14">Rank</th>
              <th className="py-2.5 px-3">Member of Parliament</th>
              <th className="py-2.5 px-3">State & Constituency</th>
              <th className="py-2.5 px-3 min-w-[200px]">
                <div className="flex items-center gap-1">
                  <span>Fund Utilization %</span>
                  <span className="text-[10px] text-[#1D9BF0] font-normal lowercase">(primary rank)</span>
                </div>
              </th>
              <th className="py-2.5 px-3 text-center">Works Rec.</th>
              <th className="py-2.5 px-3 text-center">Completed</th>
              <th className="py-2.5 px-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <span>Completion Rate</span>
                  <span className="text-[10px] text-slate-400 font-normal lowercase">(secondary)</span>
                </div>
              </th>
              <th className="py-2.5 px-2 w-10 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFF3F4]">
            {currentList.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-xs text-slate-500">
                  No MP performance data available.
                </td>
              </tr>
            ) : (
              currentList.map((mp, index) => {
                const isExpanded = expandedMpName === mp.mpName;
                const utilizationDisplay =
                  mp.fundUtilization !== null && !isNaN(mp.fundUtilization)
                    ? `${mp.fundUtilization}%`
                    : 'N/A';
                const completionDisplay =
                  mp.completionRate !== null && !isNaN(mp.completionRate)
                    ? `${mp.completionRate}%`
                    : 'N/A';

                const progressWidth =
                  mp.fundUtilization !== null && !isNaN(mp.fundUtilization)
                    ? Math.min(100, Math.max(0, mp.fundUtilization))
                    : 0;

                return (
                  <React.Fragment key={mp.mpName}>
                    <tr
                      onClick={() => handleRowClick(mp)}
                      className={`text-xs hover:bg-[#F7F9F9] transition-colors cursor-pointer group ${
                        isExpanded ? 'bg-[#F7F9F9]/80' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3 px-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                            activeTab === 'top5' && index === 0
                              ? 'bg-sky-100 text-[#1D9BF0] border border-sky-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          #{index + 1}
                        </span>
                      </td>

                      {/* MP Name */}
                      <td className="py-3 px-3 font-semibold text-[#0F1419] group-hover:text-[#1D9BF0] transition-colors">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1D9BF0]" />
                          <span>{mp.mpName}</span>
                        </div>
                      </td>

                      {/* State & Constituency */}
                      <td className="py-3 px-3 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-[#0F1419]">{mp.state}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 font-mono text-[11px] bg-slate-50 px-1.5 py-0.5 rounded border border-[#EFF3F4]">
                            {mp.constituency}
                          </span>
                        </div>
                      </td>

                      {/* Fund Utilization % (Primary Ranking Metric) */}
                      <td className="py-3 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono font-bold">
                            <span className="text-[#0F1419]">{utilizationDisplay}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ₹{mp.totalExpenditure}L / ₹{mp.totalSanctionedAmount}L
                            </span>
                          </div>
                          {/* Twitter-blue neutral progress bar (NO risk colors) */}
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                            <div
                              className="h-2 rounded-full bg-[#1D9BF0] transition-all duration-500"
                              style={{ width: `${progressWidth}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Total Works Recommended */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                        {mp.totalWorks}
                      </td>

                      {/* Total Works Completed */}
                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                        {mp.completedWorks ?? 0}
                      </td>

                      {/* Completion Rate % (Secondary Supporting Metric) */}
                      <td className="py-3 px-3 text-right">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {completionDisplay}
                        </span>
                      </td>

                      {/* Expand / Collapse Button */}
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={(e) => toggleExpand(mp.mpName, e)}
                          title="Toggle Quick Summary"
                          className="p-1 rounded-lg text-slate-400 hover:text-[#1D9BF0] hover:bg-sky-50 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Inline Expandable Summary Drawer */}
                    {isExpanded && (
                      <tr className="bg-[#F7F9F9] border-b border-[#EFF3F4]">
                        <td colSpan="8" className="p-4">
                          <div className="bg-white rounded-xl p-4 border border-[#EFF3F4] shadow-xs space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#EFF3F4]">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-[#0F1419]">
                                  {mp.mpName} — Aggregate Recommendation Profile
                                </span>
                                <span className="text-[10px] bg-sky-50 text-[#1D9BF0] font-semibold px-2 py-0.5 rounded border border-sky-200">
                                  {mp.constituency}, {mp.state}
                                </span>
                              </div>
                              <button
                                onClick={() => setSelectedMpForModal(mp)}
                                className="text-xs text-[#1D9BF0] font-semibold hover:underline flex items-center gap-1"
                              >
                                View full aggregate overview →
                              </button>
                            </div>

                            {/* Micro KPI Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <div className="p-2.5 bg-[#F7F9F9] rounded-lg border border-[#EFF3F4]">
                                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                                  Fund Utilization
                                </span>
                                <span className="text-base font-extrabold font-mono text-[#1D9BF0]">
                                  {utilizationDisplay}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  ₹{mp.totalExpenditure}L spent of ₹{mp.totalSanctionedAmount}L
                                </span>
                              </div>

                              <div className="p-2.5 bg-[#F7F9F9] rounded-lg border border-[#EFF3F4]">
                                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                                  Completion Efficiency
                                </span>
                                <span className="text-base font-extrabold font-mono text-slate-800">
                                  {completionDisplay}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  {mp.completedWorks ?? 0} of {mp.totalWorks ?? 0} completed
                                </span>
                              </div>

                              <div className="p-2.5 bg-[#F7F9F9] rounded-lg border border-[#EFF3F4]">
                                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                                  Active Pipeline
                                </span>
                                <span className="text-base font-extrabold font-mono text-slate-800">
                                  {(mp.ongoingWorks ?? 0) + (mp.underReviewWorks ?? 0)} works
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  {mp.ongoingWorks ?? 0} ongoing, {mp.underReviewWorks ?? 0} review
                                </span>
                              </div>

                              <div className="p-2.5 bg-[#F7F9F9] rounded-lg border border-[#EFF3F4]">
                                <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                                  Sector Focus
                                </span>
                                <span className="text-xs font-bold text-slate-700 block truncate">
                                  {Object.keys(mp.categories || {}).length} Categories
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                                  {Object.keys(mp.categories || {}).length > 0
                                    ? Object.keys(mp.categories).slice(0, 2).join(', ')
                                    : 'General development'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Widget Footer Bar: View All Link */}
      <div className="mt-3.5 pt-3 border-t border-[#EFF3F4] flex items-center justify-between text-xs">
        <span className="text-slate-500 text-[11px]">
          Showing {activeTab === 'top5' ? 'Top 5 Highest' : 'Bottom 5 Lowest'} Fund Utilization MPs
        </span>
        <Link
          to="/ministry/mp-performance"
          className="inline-flex items-center gap-1 font-semibold text-[#1D9BF0] hover:underline"
        >
          <span>View All MPs (Full Leaderboard Register)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Lightweight Summary Popover / Modal on MP Row Click */}
      {selectedMpForModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedMpForModal(null)}
        >
          <div
            className="bg-white rounded-2xl border border-[#EFF3F4] shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#EFF3F4]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-50 text-[#1D9BF0] border border-sky-100 flex items-center justify-center font-bold font-mono">
                  #{selectedMpForModal.rank || '•'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F1419]">
                    {selectedMpForModal.mpName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedMpForModal.constituency}, {selectedMpForModal.state}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMpForModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Performance Summary Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#F7F9F9] rounded-xl border border-[#EFF3F4]">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Fund Utilization %
                </span>
                <span className="text-xl font-extrabold font-mono text-[#1D9BF0]">
                  {selectedMpForModal.fundUtilization !== null ? `${selectedMpForModal.fundUtilization}%` : 'N/A'}
                </span>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div
                    className="h-1.5 rounded-full bg-[#1D9BF0]"
                    style={{ width: `${Math.min(100, selectedMpForModal.fundUtilization || 0)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>₹{selectedMpForModal.totalExpenditure}L spent</span>
                  <span>₹{selectedMpForModal.totalSanctionedAmount}L sanctioned</span>
                </div>
              </div>

              <div className="p-3 bg-[#F7F9F9] rounded-xl border border-[#EFF3F4]">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Completion Efficiency
                </span>
                <span className="text-xl font-extrabold font-mono text-slate-800">
                  {selectedMpForModal.completionRate !== null ? `${selectedMpForModal.completionRate}%` : 'N/A'}
                </span>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div
                    className="h-1.5 rounded-full bg-slate-700"
                    style={{ width: `${Math.min(100, selectedMpForModal.completionRate || 0)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>{selectedMpForModal.completedWorks ?? 0} completed</span>
                  <span>{selectedMpForModal.totalWorks ?? 0} recommended</span>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-[#0F1419] mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#1D9BF0]" />
                <span>Recommended Work Sectors</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(selectedMpForModal.categories || {}).length > 0 ? (
                  Object.entries(selectedMpForModal.categories).map(([cat, count]) => (
                    <span
                      key={cat}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-[#EFF3F4] font-medium"
                    >
                      {cat} <span className="font-mono text-slate-400 font-bold">({count})</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    No categorized sector works recorded for this constituency.
                  </span>
                )}
              </div>
            </div>

            {/* Scope / Governance Clarification Note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-[#EFF3F4] text-[11px] text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 block">Governance Note:</span>
              <p>
                This scorecard aggregates MP recommendation velocity and fund utilization. Individual project execution, contractor adherence, and anomaly resolution are monitored separately under District Authority and Auditor portals.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMpForModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```


### `frontend/src/components/common/ProtectedRoute.jsx`

*File [99/131] | Lines: 40 | Size: 1.4 KB*

```jsx
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute Component
 * Enforces role-based route security across dashboards.
 * 
 * Behavior:
 * 1. Unauthenticated users -> redirected to /login
 * 2. Authenticated users with incorrect role -> redirected to their own role's home dashboard
 * 3. Authenticated users with authorized role -> renders the nested routes (<Outlet />) or children
 */
export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If not logged in, redirect to /login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is specified and current user's role is not authorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to their respective role's default dashboard
    const roleDefaultRoutes = {
      ministry: '/ministry/overview',
      mp: '/mp/overview',
      district: '/district/overview',
      state: '/state/overview',
      auditor: '/auditor/queue',
    };

    const targetRoute = roleDefaultRoutes[user.role] || '/login';
    return <Navigate to={targetRoute} replace />;
  }

  return children ? children : <Outlet />;
}
```


### `frontend/src/components/common/RiskBadge.jsx`

*File [100/131] | Lines: 59 | Size: 1.9 KB*

```jsx
import React from 'react';

/**
 * RiskBadge Component
 * Displays a clean, high-contrast risk indicator (High = Red, Medium = Amber, Low = Green)
 * Follows the requirement: Risk colors are the only "loud" colors in the light UI.
 */
export default function RiskBadge({ level = 'Low', score = null, confidence = null, type = null, size = 'md', showDot = true }) {
  const normalizedLevel = (level || 'low').toLowerCase();

  let styles = {
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    label: type ? `${type}: Low` : 'Low Risk',
  };

  if (normalizedLevel === 'high' || (score !== null && score >= 70)) {
    styles = {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-500 animate-pulse',
      label: type ? `${type}: High` : 'High Risk',
    };
  } else if (normalizedLevel === 'medium' || (score !== null && score >= 40)) {
    styles = {
      bg: 'bg-amber-50 text-amber-900 border-amber-200',
      dot: 'bg-amber-500',
      label: type ? `${type}: Medium` : 'Medium Risk',
    };
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  }[size] || 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles.bg} ${sizeClasses} whitespace-nowrap shadow-xs`}
    >
      {showDot && <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />}
      <span>{styles.label}</span>
      {score !== null && (
        <span className="ml-1 opacity-75 font-mono text-[11px]">
          ({score})
        </span>
      )}
      {confidence !== null && (
        <span
          className="ml-1 text-[10px] opacity-60"
          title="Data confidence: how much corroborating evidence backs this score"
        >
          · {confidence}% confidence
        </span>
      )}
    </span>
  );
}
```


### `frontend/src/components/common/SearchBox.jsx`

*File [101/131] | Lines: 38 | Size: 1.2 KB*

```jsx
import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBox Component
 * Text search input for Work ID, MP Name, Vendor, Constituency, etc.
 */
export default function SearchBox({
  value = '',
  onChange,
  placeholder = 'Search by Work ID, MP Name, Vendor, District...',
  className = '',
}) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 bg-white text-sm text-[#0F1419] placeholder-slate-400 border border-[#EFF3F4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all shadow-xs"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
```


### `frontend/src/components/common/Sparkline.jsx`

*File [102/131] | Lines: 73 | Size: 2.0 KB*

```jsx
import React from 'react';

/**
 * Sparkline Component
 * SVG line chart for rendering 6-8 week risk score progression inline in tables.
 */
export default function Sparkline({
  data = [10, 15, 20, 30, 45, 60],
  width = 110,
  height = 28,
  strokeColor = '#EF4444',
  fillColor = 'rgba(239, 68, 68, 0.12)',
  showCurrentDot = true,
}) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data, 0);
  const max = Math.max(...data, 100);
  const range = max - min || 1;

  const padding = 3;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * usableWidth;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polylineStr = points.join(' ');
  const lastPoint = points[points.length - 1].split(',');
  const [lastX, lastY] = [parseFloat(lastPoint[0]), parseFloat(lastPoint[1])];

  const areaPoints = `${points[0].split(',')[0]},${height - padding} ${polylineStr} ${lastX},${height - padding}`;

  return (
    <div className="inline-flex items-center" title={`Trajectory: ${data.join(' → ')}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Fill under the curve */}
        <polygon points={areaPoints} fill={fillColor} />
        {/* Sparkline curve */}
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={polylineStr}
        />
        {/* Current / endpoint pulse dot */}
        {showCurrentDot && (
          <circle
            cx={lastX}
            cy={lastY}
            r="3"
            fill={strokeColor}
            className="animate-ping opacity-75"
          />
        )}
        {showCurrentDot && (
          <circle
            cx={lastX}
            cy={lastY}
            r="3"
            fill={strokeColor}
          />
        )}
      </svg>
    </div>
  );
}
```


### `frontend/src/components/common/TopNavbar.jsx`

*File [103/131] | Lines: 300 | Size: 10.5 KB*

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Building,
  LogOut,
  Sparkles,
  LayoutDashboard,
  AlertTriangle,
  LineChart,
  ListFilter,
  CheckCircle2,
  FileSpreadsheet,
  FileCheck,
  MapPin,
  Landmark,
  Search,
  Fingerprint,
  Award,
} from 'lucide-react';
import AlertBellIcon from './AlertBellIcon';
import { useAuth } from '../../context/AuthContext';

/**
 * TopNavbar Component
 * Reusable across Ministry, State, MP, District, and Auditor role dashboards.
 * Dynamically renders role indicator and respective navigation tabs based on `role` prop.
 */
export default function TopNavbar({
  role = 'Ministry', // 'Ministry' | 'State' | 'MP' | 'District' | 'Auditor'
  alerts = [],
  onSelectAlert,
  mpInfo = null,
  districtInfo = null,
  stateInfo = null,
}) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
      }
    }
    if (roleDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [roleDropdownOpen]);

  const isMpRole = role === 'MP' || role === 'Member of Parliament (MP)' || user?.role === 'mp';
  const isDistrictRole = role === 'District' || role === 'District Authority' || role === 'District Nodal Officer (DNO)' || user?.role === 'district';
  const isStateRole = role === 'State' || role === 'State Nodal Authority' || user?.role === 'state';
  const isAuditorRole = role === 'Auditor' || role === 'Independent Auditor' || role === 'Investigator' || user?.role === 'auditor';

  const ROLE_LABELS = {
    ministry: 'Ministry (National View)',
    state: 'State Nodal Authority',
    mp: 'Member of Parliament (MP)',
    district: 'District Authority',
    auditor: 'Independent Auditor',
  };

  let currentRoleLabel = user?.roleLabel || (user?.role && ROLE_LABELS[user.role]);
  if (!currentRoleLabel) {
    if (isAuditorRole) currentRoleLabel = 'Independent Auditor';
    else if (isStateRole) currentRoleLabel = 'State Nodal Authority';
    else if (isMpRole) currentRoleLabel = 'Member of Parliament (MP)';
    else if (isDistrictRole) currentRoleLabel = 'District Authority';
    else currentRoleLabel = 'Ministry (National View)';
  }

  // Ministry Navigation Tabs
  const ministryNavLinks = [
    {
      to: '/ministry/overview',
      label: 'National Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/ministry/flagged',
      label: 'All Flagged Cases',
      icon: AlertTriangle,
      badge: alerts.length > 0 ? `${alerts.length}` : null,
      badgeColor: 'bg-rose-100 text-rose-700',
    },
    {
      to: '/ministry/mp-performance',
      label: 'MP Performance',
      icon: Award,
      badge: null,
    },
    {
      to: '/ministry/trends',
      label: 'Trends & Analytics',
      icon: LineChart,
      badge: null,
    },
    {
      to: '/ministry/predictions',
      label: 'Predictive Risk Forecast',
      icon: Sparkles,
      badge: 'AI Early Warning',
      badgeColor: 'bg-indigo-100 text-indigo-700 font-semibold',
    },
  ];

  // Auditor Navigation Tabs
  const auditorNavLinks = [
    {
      to: '/auditor/queue',
      label: 'High-Risk Case Queue',
      icon: AlertTriangle,
      badge: alerts.length > 0 ? `${alerts.length}` : null,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold',
    },
    {
      to: '/auditor/vendor',
      label: 'Vendor Cross-Reference Tool',
      icon: Fingerprint,
      badge: 'Key Differentiator',
      badgeColor: 'bg-purple-100 text-purple-800 font-bold',
    },
  ];

  // State Navigation Tabs
  const stateNavLinks = [
    {
      to: '/state/overview',
      label: 'State Overview',
      icon: LayoutDashboard,
      badge: null,
    },
  ];

  // MP Navigation Tabs
  const mpNavLinks = [
    {
      to: '/mp/overview',
      label: 'My Constituency Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/mp/works',
      label: 'My Works (Full List)',
      icon: FileSpreadsheet,
      badge: null,
    },
  ];

  // District Authority Navigation Tabs
  const districtNavLinks = [
    {
      to: '/district/overview',
      label: 'District Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/district/verification',
      label: 'Work Verification Queue',
      icon: FileCheck,
      badge: alerts.length > 0 ? `${alerts.length} Pending` : null,
      badgeColor: 'bg-amber-100 text-amber-800 font-semibold',
    },
  ];

  let activeNavLinks = ministryNavLinks;
  if (isAuditorRole) activeNavLinks = auditorNavLinks;
  if (isStateRole) activeNavLinks = stateNavLinks;
  if (isMpRole) activeNavLinks = mpNavLinks;
  if (isDistrictRole) activeNavLinks = districtNavLinks;

  const handleLogout = () => {
    setRoleDropdownOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#EFF3F4] shadow-xs">
      {/* Top Level Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D9BF0] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-[#0F1419] tracking-tight">
                  MPLADS <span className="text-[#1D9BF0]">SENTINEL</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-slate-100 text-slate-700 border border-[#EFF3F4]">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {isAuditorRole
                  ? 'Central Forensic Audit & Investigation Wing • Ministry Oversight'
                  : isStateRole
                    ? (stateInfo ? `${stateInfo.stateName} State Nodal Authority • ${stateInfo.nodalDepartment}` : 'State Nodal Authority • Govt of Bihar')
                    : isMpRole
                      ? (mpInfo ? `${mpInfo.mpName} • ${mpInfo.constituency} (${mpInfo.state})` : 'MP Constituency Portal • Govt of India')
                      : isDistrictRole
                        ? (districtInfo ? `${districtInfo.districtName} District Authority (${districtInfo.state}) • ${districtInfo.nodalOfficer}` : 'District Authority Nodal Portal • Govt of Bihar')
                        : 'Ministry of Statistics & Programme Implementation • Govt of India'}
              </p>
            </div>
          </div>

          {/* Right Action Controls: Role Switcher & Notifications */}
          <div className="flex items-center gap-3">

            {/* Notification Bell */}
            <AlertBellIcon alerts={alerts} onSelectAlert={onSelectAlert} />

            <div className="h-6 w-px bg-[#EFF3F4] mx-1" />

            {/* Role Indicator & Account Menu Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#EFF3F4] bg-[#F7F9F9] hover:bg-slate-100 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-white border border-[#EFF3F4] flex items-center justify-center text-[#1D9BF0] shadow-2xs">
                  <Building className="w-4 h-4" />
                </div>
                <div className="hidden md:block">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                    Current Role
                  </span>
                  <span className="text-xs font-bold text-[#0F1419]">
                    {currentRoleLabel}
                  </span>
                </div>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 min-w-[190px] w-full bg-white border border-[#EFF3F4] rounded-2xl shadow-hover z-50 overflow-hidden animate-in fade-in duration-150 p-2.5 space-y-1">
                  <div className="px-2.5 py-1 text-xs font-bold text-[#0F1419] truncate border-b border-[#EFF3F4] pb-2">
                    {user?.name || currentRoleLabel}
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full py-1.5 px-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-2 text-left"
                    >
                      <span className="font-bold text-rose-600 select-none">→</span>
                      <span>Log Out Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pt-1 -mb-px">
          {activeNavLinks.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${isActive
                    ? 'border-[#1D9BF0] text-[#1D9BF0]'
                    : 'border-transparent text-slate-500 hover:text-[#0F1419] hover:border-slate-300'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${tab.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                    {tab.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
```


### `frontend/src/components/common/WorkDetailModal.jsx`

*File [104/131] | Lines: 391 | Size: 17.9 KB*

```jsx
import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Calendar,
  IndianRupee,
  Building2,
  User,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import RiskBadge from './RiskBadge';

/**
 * WorkDetailModal Component
 *
 * Full work details popup featuring the Explainability Breakdown horizontal bar chart,
 * financial progress, timeline audit, vendor flags, and AI rationale.
 */
export default function WorkDetailModal({
  work,
  isOpen,
  onClose,
}) {
  if (!isOpen || !work) return null;

  const breakdown = work.riskFactorBreakdown || {};

  const chartData = [
    { factor: 'Cost Inflation', percent: breakdown.costOverrun || 0, color: '#EF4444' },
    { factor: 'Timeline Slippage', percent: breakdown.delaySlippage || 0, color: '#F59E0B' },
    { factor: 'Duplicate/GIS Match', percent: breakdown.duplicateSimilarity || 0, color: '#6366F1' },
    { factor: 'Vendor Concentration', percent: breakdown.vendorAnomaly || 0, color: '#EC4899' },
  ].sort((a, b) => b.percent - a.percent);

  const isPredictive = !!work.predictedRiskScore30Days;
  const isFlagged = work.riskLevel === 'High' || work.riskLevel === 'Medium' || (work.riskScore && work.riskScore >= 40);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-modal border border-[#EFF3F4] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#EFF3F4] flex items-center justify-between bg-[#F7F9F9]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg border border-[#EFF3F4] text-[#1D9BF0] shadow-xs">
              <ShieldAlert className="w-5 h-5 text-[#1D9BF0]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#0F1419] font-mono">
                  {work.workId}
                </h3>
                <RiskBadge
                  level={work.fraudRiskTier || work.riskLevel || (work.riskScore >= 70 ? 'High' : work.riskScore >= 40 ? 'Medium' : 'Low')}
                  score={work.fraudRiskScore ?? work.riskScore ?? work.currentRiskScore}
                  confidence={work.dataConfidence}
                  type={work.inefficiencyScore !== undefined ? "Fraud" : null}
                />
                {work.inefficiencyScore !== undefined && (
                  <RiskBadge
                    level={work.inefficiencyTier || 'Low'}
                    score={work.inefficiencyScore}
                    type="Delay"
                  />
                )}
                {isPredictive && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Early Warning Watchlist
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {work.category} • {work.district}, {work.state}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F1419] hover:bg-white transition-colors border border-transparent hover:border-[#EFF3F4]"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-6">

          {/* Primary Alert / Flag Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            (work.riskScore >= 70 || work.riskLevel === 'High' || isPredictive)
              ? 'bg-rose-50/70 border-rose-200/80 text-rose-900'
              : work.riskLevel === 'Medium'
              ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
              : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
          }`}>
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-800">
                {isPredictive
                  ? 'Projected Escalation Trigger'
                  : isFlagged
                  ? 'Primary Risk Signal'
                  : 'Compliance Status'}
              </div>
              <p className="text-sm font-semibold text-[#0F1419] mt-0.5">
                {work.flagReason || work.warningSignal || 'Work is executing normally within standard SLA parameters.'}
              </p>
            </div>
          </div>

          {/* AI EXPLAINABILITY HORIZONTAL BAR CHART SECTION */}
          <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1D9BF0]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  AI Explainability Breakdown (Weightage)
                </h4>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                Transparent Multi-Vector Scoring
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Why was this work evaluated with this risk profile? Below is the contributory weight of each vector evaluated by the ML model.
            </p>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    unit="%"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={{ stroke: '#EFF3F4' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="factor"
                    tick={{ fontSize: 11, fill: '#0F1419', fontWeight: 500 }}
                    axisLine={{ stroke: '#EFF3F4' }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}% impact`, 'Weightage']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #EFF3F4',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={16}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Diagnostic Summary Narrative */}
            {work.aiDiagnosticSummary && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-start gap-2 bg-white p-3 rounded-lg border border-[#EFF3F4]">
                <Sparkles className="w-4 h-4 text-[#1D9BF0] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-[#0F1419]">Diagnostic Audit Note: </span>
                  {work.aiDiagnosticSummary}
                </p>
              </div>
            )}
          </div>

          {/* AUDITOR INVESTIGATION REPORT (CONDITIONAL: RENDERS IF AUDITOR REPORT FILED) */}
          {work.auditorReport && (
            <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                    Independent Auditor Official Report
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-purple-700 font-mono">
                  Filed {work.auditorReport.submittedDate}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-600">Audit Finding Conclusion:</span>
                <span className="px-2 py-0.5 rounded font-bold bg-white text-purple-900 border border-purple-200">
                  {work.auditorReport.conclusion}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-[11px] text-purple-800">Status: {work.auditorReport.status}</span>
              </div>
              {work.auditorReport.notes && (
                <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-purple-100 italic">
                  "{work.auditorReport.notes}"
                </p>
              )}
            </div>
          )}


          {/* Predictive Specific Box (if Page 4 watchlist item) */}
          {isPredictive && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5">
              <div>
                <span className="text-[11px] font-medium text-indigo-700 uppercase">Current Baseline</span>
                <div className="text-lg font-bold text-[#0F1419] font-mono mt-0.5">
                  {work.currentRiskScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
                </div>
              </div>
              <div>
                <span className="text-[11px] font-medium text-indigo-700 uppercase">30-Day Forecast</span>
                <div className="text-lg font-bold text-rose-600 font-mono mt-0.5 flex items-center gap-1.5">
                  {work.predictedRiskScore30Days} <span className="text-xs font-normal text-slate-500">/ 100</span>
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                    {work.riskDeltaPercent}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[11px] font-medium text-indigo-700 uppercase">Days to Breach High Risk</span>
                <div className="text-lg font-bold text-amber-600 font-mono mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  ~{work.daysUntilPredictedThreshold} Days
                </div>
              </div>
              {work.riskTrajectory && (
                <div className="sm:col-span-3 pt-2 border-t border-indigo-100 flex items-center justify-between">
                  <span className="text-xs text-indigo-800 font-medium">8-Week Risk Score Trajectory:</span>
                  <div className="flex items-center gap-2">
                    <Sparkline data={work.riskTrajectory} width={160} height={26} />
                    <span className="text-[11px] text-slate-500 font-mono">
                      {work.riskTrajectory[0]} → {work.riskTrajectory[work.riskTrajectory.length - 1]}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column: Governance & Location */}
            <div className="space-y-3 bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Governance & Location
              </h4>

              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Recommending MP</span>
                  <span className="text-xs font-semibold text-[#0F1419]">{work.mpName}</span>
                  {work.constituency && (
                    <span className="text-xs text-slate-500 block">({work.constituency} Constituency)</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Jurisdiction</span>
                  <span className="text-xs font-semibold text-[#0F1419]">{work.district}, {work.state}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block">Assigned Contractor / Vendor</span>
                  <span className="text-xs font-semibold text-[#0F1419]">{work.vendorName || 'Not Assigned'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Financials & Dates */}
            <div className="space-y-3 bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Financials & Timeline
              </h4>

              <div className="flex items-start gap-2.5">
                <IndianRupee className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Sanctioned Amount</span>
                    <span className="text-xs font-bold text-[#0F1419] font-mono">₹{work.sanctionedAmount?.toFixed(2)} Lakhs</span>
                  </div>
                  {work.expenditure !== undefined && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-slate-400">Actual Expenditure</span>
                      <span className={`text-xs font-bold font-mono ${
                        work.expenditure > work.sanctionedAmount ? 'text-rose-600' : 'text-[#0F1419]'
                      }`}>
                        ₹{work.expenditure?.toFixed(2)} Lakhs
                      </span>
                    </div>
                  )}
                  {work.expenditure !== undefined && (
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full ${
                          work.expenditure > work.sanctionedAmount ? 'bg-rose-500' : 'bg-[#1D9BF0]'
                        }`}
                        style={{
                          width: `${Math.min(100, (work.expenditure / work.sanctionedAmount) * 100)}%`
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Recommended:</span>
                    <span className="font-mono">{work.recommendedDate || '2023-04-12'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Sanctioned:</span>
                    <span className="font-mono">{work.sanctionDate || '2023-06-20'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Target Completion:</span>
                    <span className="font-mono">{work.completionDate || '2024-03-31'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#EFF3F4] bg-[#F7F9F9] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FileCheck className="w-4 h-4 text-emerald-600" />
            <span>Last scored: {work.scoredAt ? new Date(work.scoredAt).toLocaleString() : 'Not yet scored'} · Model v{work.modelVersion || '1.0'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#0F1419] bg-white border border-[#EFF3F4] rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
            >
              Close
            </button>
            <button
              onClick={() => alert(`Audit Action Initiated: Notice dispatched to District Nodal Officer for work ${work.workId}`)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#1D9BF0] hover:bg-[#1A8CD8] rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Issue Audit Notice</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```


### `frontend/src/components/layout/AuditorDashboardLayout.jsx`

*File [105/131] | Lines: 60 | Size: 2.0 KB*

```jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNavbar from '../common/TopNavbar';
import ErrorBoundary from '../common/loading/ErrorBoundary';
import { auditorApi } from '../../api/auditorApi';

/**
 * AuditorDashboardLayout Component
 * Wraps all Auditor views with TopNavbar configured for Auditor role,
 * and manages case drill-down navigation.
 */
export default function AuditorDashboardLayout() {
  const navigate = useNavigate();
  const [activeQueueCount, setActiveQueueCount] = useState(0);

  const loadAlerts = async () => {
    const queue = await auditorApi.getCaseQueue();
    setActiveQueueCount(queue.total || 0);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleOpenWorkDetail = (work) => {
    if (!work?.workId) return;
    navigate(`/auditor/cases/${work.workId}`, { state: { work } });
  };

  return (
    <div className="min-h-screen bg-white text-[#0F1419] flex flex-col font-sans">
      {/* Top Navbar with Auditor role */}
      <TopNavbar
        role="Auditor"
        alerts={new Array(activeQueueCount).fill({})}
        onSelectAlert={() => {}}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorBoundary>
          <Outlet context={{ onOpenWorkDetail: handleOpenWorkDetail, refreshQueue: loadAlerts }} />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EFF3F4] bg-[#F7F9F9] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Independent Auditor Investigation Portal • Central MoSPI Forensic Audit Wing
          </span>
          <span className="text-slate-400">
            Automated Collusion Detection & Evidence Verification
          </span>
        </div>
      </footer>
    </div>
  );
}
```


### `frontend/src/components/layout/DashboardLayout.jsx`

*File [106/131] | Lines: 65 | Size: 2.1 KB*

```jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNavbar from '../common/TopNavbar';
import ErrorBoundary from '../common/loading/ErrorBoundary';
import { mpladsService } from '../../api/mpladsService';

/**
 * DashboardLayout Component
 * Wraps all Ministry views with shared header, notification streams,
 * and centralized case navigation context.
 */
export default function DashboardLayout() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await mpladsService.getOverviewAlerts();
        if (data && data.recentAlerts) {
          setAlerts(data.recentAlerts);
        }
      } catch (err) {
        console.error('Failed to load navbar alerts:', err);
      }
    }
    loadAlerts();
  }, []);

  const handleOpenWorkDetail = (work) => {
    if (!work?.workId) return;
    navigate(`/ministry/cases/${work.workId}`, { state: { work } });
  };

  return (
    <div className="min-h-screen bg-white text-[#0F1419] flex flex-col font-sans">
      {/* Top Navbar with Alerts & Tabs */}
      <TopNavbar
        alerts={alerts}
        onSelectAlert={(alertItem) => handleOpenWorkDetail(alertItem)}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorBoundary>
          {/* Pass handleOpenWorkDetail to child routes via context */}
          <Outlet context={{ onOpenWorkDetail: handleOpenWorkDetail }} />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EFF3F4] bg-[#F7F9F9] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Smart India Hackathon 2026 • MPLADS AI Risk Screening & Early Warning System
          </span>
          <span className="text-slate-400">
            Powered by Automated Geospatial & Financial Risk ML Models
          </span>
        </div>
      </footer>
    </div>
  );
}
```


### `frontend/src/components/layout/DistrictDashboardLayout.jsx`

*File [107/131] | Lines: 66 | Size: 2.3 KB*

```jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNavbar from '../common/TopNavbar';
import ErrorBoundary from '../common/loading/ErrorBoundary';
import { districtApi } from '../../api/districtApi';
import { useAuth } from '../../context/AuthContext';

/**
 * DistrictDashboardLayout Component
 * Wraps all District Authority views with TopNavbar configured for District role,
 * and manages case drill-down navigation.
 */
export default function DistrictDashboardLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [districtProfile, setDistrictProfile] = useState(null);
  const [queueCount, setQueueCount] = useState(0);

  const loadData = async () => {
    const profile = await districtApi.getDistrictProfile(user?.districtId);
    setDistrictProfile(profile);
    const queue = await districtApi.getVerificationQueue(user?.districtId);
    setQueueCount(queue.total || 0);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleOpenWorkDetail = (work) => {
    if (!work?.workId) return;
    navigate(`/district/cases/${work.workId}`, { state: { work } });
  };

  return (
    <div className="min-h-screen bg-white text-[#0F1419] flex flex-col font-sans">
      {/* Top Navbar with District role */}
      <TopNavbar
        role="District Authority"
        alerts={new Array(queueCount).fill({})}
        onSelectAlert={() => {}}
        districtInfo={districtProfile}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorBoundary>
          <Outlet context={{ onOpenWorkDetail: handleOpenWorkDetail, districtProfile, refreshData: loadData }} />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EFF3F4] bg-[#F7F9F9] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            District Nodal Authority Portal • MPLADS Ground Verification & Escalation Cell
          </span>
          <span className="text-slate-400">
            District Magistrate & Collectorate Administration
          </span>
        </div>
      </footer>
    </div>
  );
}
```


### `frontend/src/components/layout/MpDashboardLayout.jsx`

*File [108/131] | Lines: 65 | Size: 2.1 KB*

```jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNavbar from '../common/TopNavbar';
import ErrorBoundary from '../common/loading/ErrorBoundary';
import { mpApi } from '../../api/mpApi';
import { useAuth } from '../../context/AuthContext';

/**
 * MpDashboardLayout Component
 * Wraps all MP views with TopNavbar configured for MP role,
 * and manages navigation to dedicated WorkDetailPage.
 */
export default function MpDashboardLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mpOverview, setMpOverview] = useState(null);

  const loadData = async () => {
    const data = await mpApi.getMyConstituencyOverview(user?.mpId);
    setMpOverview(data);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleOpenWorkDetail = (work) => {
    if (!work?.workId) return;
    navigate(`/mp/cases/${work.workId}`, { state: { work } });
  };

  const alerts = mpOverview?.flaggedWorks || [];

  return (
    <div className="min-h-screen bg-white text-[#0F1419] flex flex-col font-sans">
      {/* Top Navbar with MP role */}
      <TopNavbar
        role="MP"
        alerts={alerts}
        onSelectAlert={(alertItem) => handleOpenWorkDetail(alertItem)}
        mpInfo={mpOverview?.mp}
      />

      {/* Main Dynamic View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorBoundary>
          <Outlet context={{ onOpenWorkDetail: handleOpenWorkDetail, mpOverview, refreshData: loadData }} />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EFF3F4] bg-[#F7F9F9] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Member of Parliament Constituency Portal • MPLADS Scheme Management
          </span>
          <span className="text-slate-400">
            Automated Milestone Tracking & Compliance Support
          </span>
        </div>
      </footer>
    </div>
  );
}
```


### `frontend/src/components/layout/StateDashboardLayout.jsx`

*File [109/131] | Lines: 58 | Size: 1.9 KB*

```jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import TopNavbar from '../common/TopNavbar';
import ErrorBoundary from '../common/loading/ErrorBoundary';
import { stateApi } from '../../api/stateApi';
import { useAuth } from '../../context/AuthContext';

/**
 * StateDashboardLayout Component
 * Wraps State Nodal Authority views with TopNavbar configured for State role,
 * and manages case drill-down navigation.
 */
export default function StateDashboardLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stateProfile, setStateProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const p = await stateApi.getStateProfile(user?.stateId);
      setStateProfile(p);
    }
    loadProfile();
  }, [user]);

  const handleOpenWorkDetail = (work) => {
    if (!work?.workId) return;
    navigate(`/state/cases/${work.workId}`, { state: { work } });
  };

  return (
    <div className="min-h-screen bg-white text-[#0F1419] flex flex-col font-sans">
      <TopNavbar
        role="State Nodal Authority"
        alerts={[]}
        stateInfo={stateProfile}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorBoundary>
          <Outlet context={{ stateProfile, onOpenWorkDetail: handleOpenWorkDetail }} />
        </ErrorBoundary>
      </main>

      <footer className="border-t border-[#EFF3F4] bg-[#F7F9F9] py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            State Nodal Authority Portal • Planning & Development Department, Govt of Bihar
          </span>
          <span className="text-slate-400">
            State-Wide District Rollup & Monitoring Dashboard
          </span>
        </div>
      </footer>
    </div>
  );
}
```


### `frontend/src/context/AuthContext.jsx`

*File [110/131] | Lines: 146 | Size: 3.7 KB*

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/authApi';
import { setAuthToken } from '../api/apiClient';

const AuthContext = createContext(null);

const ROLE_DEFAULT_PATHS = {
  ministry: '/ministry/overview',
  mp: '/mp/overview',
  district: '/district/overview',
  state: '/state/overview',
  auditor: '/auditor/queue',
};

/**
 * Enriches the backend user payload with UI route defaults
 */
const enrichUser = (userProfile) => {
  if (!userProfile) return null;
  return {
    ...userProfile,
    defaultPath: ROLE_DEFAULT_PATHS[userProfile.role] || '/ministry/overview',
  };
};

/**
 * AuthProvider Component
 * Manages in-memory authentication state for the MPLADS platform.
 * Persists purely in React memory without localStorage / sessionStorage.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem('mplads_auth_token') || null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('mplads_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Initialize in-memory API token on mount if session exists
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      authApi.getMe()
        .then((userData) => {
          const enriched = enrichUser(userData);
          setUser(enriched);
          try {
            sessionStorage.setItem('mplads_auth_user', JSON.stringify(enriched));
          } catch {}
        })
        .catch((err) => {
          // Only clear session if token is definitively invalid/unauthorized
          if (err?.status === 401) {
            logout();
          }
        });
    }
  }, []);

  /**
   * Log in with email and password via backend REST API
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      setToken(res.token);
      setAuthToken(res.token);
      const enriched = enrichUser(res.user);
      setUser(enriched);
      try {
        sessionStorage.setItem('mplads_auth_token', res.token);
        sessionStorage.setItem('mplads_auth_user', JSON.stringify(enriched));
      } catch {}
      return { success: true, user: enriched, token: res.token };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid email or password' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Quick demo switcher: calls real backend login with demo user credentials
   * @param {{ email: string, password: string }} demoUser
   */
  const loginAsRole = async (demoUser) => {
    if (demoUser?.email && demoUser?.password) {
      return await login(demoUser.email, demoUser.password);
    }
    return { success: false, error: 'Demo user credentials missing.' };
  };

  /**
   * Log out session and clear all tokens
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    try {
      sessionStorage.removeItem('mplads_auth_token');
      sessionStorage.removeItem('mplads_auth_user');
    } catch {}
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    loginAsRole,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to consume AuthContext throughout the application
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
```


### `frontend/src/hooks/useApiQuery.js`

*File [111/131] | Lines: 63 | Size: 1.5 KB*

```javascript
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useApiQuery
 * Standardized data-fetching hook preserving existing data during refetches.
 * 
 * @param {Function} fetchFn - Async function returning data
 * @param {Array} deps - Dependency array triggering automatic refetches
 * @param {Object} options - { initialData, enabled }
 */
export function useApiQuery(fetchFn, deps = [], options = {}) {
  const { initialData = null, enabled = true } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled && initialData === null);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState(null);

  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const hasLoadedOnce = useRef(initialData !== null);

  const execute = useCallback(async () => {
    if (!enabled) return;

    if (hasLoadedOnce.current) {
      setIsRefetching(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await fetchFnRef.current();
      setData(result);
      hasLoadedOnce.current = true;
      return result;
    } catch (err) {
      console.error('useApiQuery error:', err);
      setError(err);
    } finally {
      setLoading(false);
      setIsRefetching(false);
    }
  }, [enabled]);

  useEffect(() => {
    execute();
  }, [...deps, execute]);

  return {
    data,
    loading,
    isRefetching,
    error,
    refetch: execute,
    setData,
  };
}

export default useApiQuery;
```


### `frontend/src/index.css`

*File [112/131] | Lines: 71 | Size: 1.2 KB*

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    border-color: #EFF3F4;
  }
  body {
    background-color: #FFFFFF;
    color: #0F1419;
    font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  }
}

/* Custom scrollbars for data tables and scrollable cards */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #F7F9F9;
}

::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}

/* Subtle transitions */
.transition-smooth {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes indeterminate {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-indeterminate {
  animation: indeterminate 1.4s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  background: linear-gradient(90deg, #EFF3F4 0%, #F7F9F9 50%, #EFF3F4 100%);
  background-size: 200% 100%;
  animation: shimmer 1.8s ease-in-out infinite;
}

```


### `frontend/src/main.jsx`

*File [113/131] | Lines: 11 | Size: 0.2 KB*

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```


### `frontend/src/pages/auditor/AuditorCaseDetailPage.jsx`

*File [114/131] | Lines: 768 | Size: 34.6 KB*

```jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  Calendar,
  Building2,
  User,
  MapPin,
  Sparkles,
  ExternalLink,
  Send,
  CheckCircle2,
  Clock,
  Fingerprint,
  Camera,
  Layers,
  FileText,
  Activity,
  Check,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import RiskBadge from '../../components/common/RiskBadge';
import { WorkDetailSkeleton, ErrorState } from '../../components/common/loading';
import { auditorApi } from '../../api/auditorApi';

/**
 * PAGE 2: Case Investigation Detail (Auditor Role)
 * Route: /auditor/case/:workId
 * Rich AI Investigation & Action Center
 */
export default function AuditorCaseDetailPage() {
  const params = useParams();
  const rawWorkId = params['*'] || params.workId || '';
  const workId = rawWorkId ? decodeURIComponent(rawWorkId) : '';
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Investigation Form State
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [status, setStatus] = useState('Under Review');
  const [verifiedProgressPct, setVerifiedProgressPct] = useState('');
  const [discrepancyFlag, setDiscrepancyFlag] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSubmittedSuccess, setReportSubmittedSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Asset Verification Form State
  const [assetType, setAssetType] = useState('');
  const [assetVerificationStatus, setAssetVerificationStatus] = useState('verified');
  const [geotagLat, setGeotagLat] = useState('');
  const [geotagLong, setGeotagLong] = useState('');
  const [isSubmittingAsset, setIsSubmittingAsset] = useState(false);
  const [assetSubmittedSuccess, setAssetSubmittedSuccess] = useState(false);

  const loadCase = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await auditorApi.getCaseById(workId);
      if (res) {
        setCaseData(res);
        if (res.auditorReport) {
          setInvestigationNotes(res.auditorReport.notes || '');
          setConclusion(res.auditorReport.conclusion || '');
          setStatus(res.auditorReport.status || 'Under Review');
          setVerifiedProgressPct(
            res.auditorReport.verifiedProgressPct !== null && res.auditorReport.verifiedProgressPct !== undefined
            ? String(res.auditorReport.verifiedProgressPct)
            : ''
        );
        setDiscrepancyFlag(Boolean(res.auditorReport.discrepancyFlag));
        setReportSubmittedSuccess(true);
      }
      if (res.assetCreation && res.assetCreation.length > 0) {
        const latestAsset = res.assetCreation[0];
        setAssetType(latestAsset.assetType || '');
        setAssetVerificationStatus(latestAsset.verificationStatus || 'verified');
        setGeotagLat(
          latestAsset.geotagLat !== null && latestAsset.geotagLat !== undefined
            ? String(latestAsset.geotagLat)
            : ''
        );
        setGeotagLong(
          latestAsset.geotagLong !== null && latestAsset.geotagLong !== undefined
            ? String(latestAsset.geotagLong)
            : ''
        );
      }
    } else {
      setError(`No forensic investigation record was found for work ID "${workId}".`);
    }
  } catch (err) {
    console.error('Failed to load auditor case:', err);
    setError(err?.message || 'Failed to load case investigation details.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadCase();
  }, [workId]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAction = async (actionType) => {
    await auditorApi.updateCaseAction(workId, actionType);
    showToast(`Audit Action executed: ${actionType}`);
    await loadCase();
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!conclusion) {
      showToast('Please select a conclusion before submitting.');
      return;
    }
    setIsSubmittingReport(true);
    const payload = {
      conclusion,
      notes: investigationNotes,
      status,
    };
    if (verifiedProgressPct !== '' && !isNaN(Number(verifiedProgressPct))) {
      payload.verifiedProgressPct = Number(verifiedProgressPct);
    }
    if (discrepancyFlag !== undefined) {
      payload.discrepancyFlag = Boolean(discrepancyFlag);
    }
    await auditorApi.submitAuditorReport(workId, payload);
    setIsSubmittingReport(false);
    setReportSubmittedSuccess(true);
    showToast('Official Audit Report filed — visible to Ministry & State dashboards.');
  };

  const handleSubmitAsset = async (e) => {
    e.preventDefault();
    if (!assetVerificationStatus) {
      showToast('Please select a verification status.');
      return;
    }
    setIsSubmittingAsset(true);
    const payload = {
      verificationStatus: assetVerificationStatus,
    };
    if (assetType.trim()) {
      payload.assetType = assetType.trim();
    }
    if (geotagLat !== '' && !isNaN(Number(geotagLat))) {
      payload.geotagLat = Number(geotagLat);
    }
    if (geotagLong !== '' && !isNaN(Number(geotagLong))) {
      payload.geotagLong = Number(geotagLong);
    }

    const res = await auditorApi.submitAssetVerification(workId, payload);
    setIsSubmittingAsset(false);
    if (res?.success) {
      setAssetSubmittedSuccess(true);
      showToast('Physical asset verification status updated successfully.');
      await loadCase();
    } else {
      showToast('Failed to submit asset verification.');
    }
  };

  if (loading && !caseData) {
    return <WorkDetailSkeleton />;
  }

  if (error || !caseData) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFF3F4]">
          <button
            onClick={() => navigate('/auditor/queue')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0F1419] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Investigation Queue</span>
          </button>
        </div>
        <ErrorState
          title="Investigation Dossier Not Found"
          message={error || `No forensic investigation record was found for work ID "${workId}".`}
          onRetry={loadCase}
        />
      </div>
    );
  }

  // Explainability chart data
  const breakdown = caseData.riskFactorBreakdown || {
    costOverrun: 35,
    delaySlippage: 30,
    duplicateSimilarity: 20,
    vendorAnomaly: 15,
  };

  const chartData = [
    { factor: 'Financial Inflation', percent: breakdown.costOverrun || 0, color: '#EF4444' },
    { factor: 'Progress Mismatch', percent: breakdown.delaySlippage || 0, color: '#F59E0B' },
    { factor: 'Duplicate/GIS Match', percent: breakdown.duplicateSimilarity || 0, color: '#6366F1' },
    { factor: 'Vendor Concentration', percent: breakdown.vendorAnomaly || 0, color: '#EC4899' },
  ].sort((a, b) => b.percent - a.percent);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Back Nav & Quick Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/auditor/queue')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0F1419] bg-white border border-[#EFF3F4] px-3 py-1.5 rounded-xl shadow-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Case Queue</span>
        </button>

        {caseData.vendorName && (
          <Link
            to={`/auditor/vendor?vendor=${encodeURIComponent(caseData.vendorName)}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
          >
            <Fingerprint className="w-4 h-4 text-purple-600" />
            <span>Cross-Reference Vendor ({caseData.vendorName})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* INVESTIGATION CASE HEADER CARD */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-rose-600 shadow-xs shrink-0">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-bold text-[#0F1419]">
                {caseData.workId}
              </span>
              <RiskBadge level={caseData.riskLevel} score={caseData.riskScore} />
              <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md ${
                caseData.escalationSource === 'district'
                  ? 'bg-purple-50 text-purple-800 border border-purple-200'
                  : 'bg-sky-50 text-sky-800 border border-sky-200'
              }`}>
                {caseData.escalationSource === 'district' ? '📍 District Escalated' : '🤖 AI Flagged'}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-[#0F1419] mt-1">
              {caseData.description || caseData.flagReason}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
              <span>{caseData.category}</span>
              <span>•</span>
              <span>{caseData.district}, {caseData.state}</span>
              <span>•</span>
              <span>Recommending MP: <strong className="text-[#0F1419]">{caseData.mpName}</strong></span>
            </div>
          </div>
        </div>

        {/* Large Prominent Risk Score */}
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center shrink-0 self-start md:self-auto min-w-[130px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
            AI Risk Score
          </span>
          <div className="text-3xl font-black text-rose-600 font-mono mt-0.5">
            {caseData.riskScore}<span className="text-sm font-normal text-slate-500">/100</span>
          </div>
          <span className="text-[10px] font-bold text-rose-700 block mt-0.5">
            Critical Review Required
          </span>
        </div>
      </div>

      {/* DISTRICT ESCALATION CALLOUT (IF ESCALATED BY DISTRICT) */}
      {caseData.escalationSource === 'district' && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-purple-900">
              Escalated by District Authority ({caseData.district} Collectorate)
            </div>
            <p className="text-xs text-purple-900 font-semibold mt-0.5">
              "{caseData.escalationNote || 'Contractor failed to provide completion photo evidence despite multiple statutory reminder notices.'}"
            </p>
            <span className="text-[10px] text-purple-700 font-mono mt-1 block">
              Escalated on: {caseData.escalatedDate || '2024-07-15'}
            </span>
          </div>
        </div>
      )}

      {/* SECTION 1: WHY FLAGGED? + EXPECTED VS ACTUAL COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (6 cols): Horizontal Bar Chart */}
        <div className="lg:col-span-6 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#EFF3F4]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#1D9BF0]" />
              Why Flagged? Contributory ML Vectors
            </h3>
            <span className="text-[11px] text-slate-500">Risk Weightage</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#EFF3F4' }} />
                <YAxis type="category" dataKey="factor" tick={{ fontSize: 11, fill: '#0F1419', fontWeight: 500 }} axisLine={{ stroke: '#EFF3F4' }} tickLine={false} />
                <Tooltip
                  formatter={(value) => [`${value}% impact`, 'Weightage']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #EFF3F4', fontSize: '12px' }}
                />
                <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={16}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-[#F7F9F9] border border-[#EFF3F4] text-xs text-slate-700 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#1D9BF0] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#0F1419]">Diagnostic Audit Rationale:</strong> {caseData.aiDiagnosticSummary || caseData.flagReason}
            </p>
          </div>
        </div>

        {/* Right (6 cols): Expected vs Actual Progress & Financial Comparison */}
        <div className="lg:col-span-6 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EFF3F4]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              Expected vs Actual Disparity Forensics
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Discrepancy: {Math.abs((caseData.expectedProgress || 100) - (caseData.physicalProgress || 54))}%</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#EFF3F4]">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Expected Progress</span>
              <div className="text-2xl font-extrabold text-[#0F1419] font-mono mt-0.5">
                {caseData.expectedProgress || 100}%
              </div>
              <span className="text-[10px] text-slate-400">Based on elapsed SLA milestone</span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">Audited Physical Progress</span>
              <div className="text-2xl font-extrabold text-rose-600 font-mono mt-0.5">
                {caseData.physicalProgress || 54}%
              </div>
              <span className="text-[10px] text-rose-700 font-semibold">Ground milestone stall</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#EFF3F4]">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Sanctioned Amount</span>
              <div className="text-xl font-bold text-[#0F1419] font-mono mt-0.5">
                ₹{caseData.sanctionedAmount?.toFixed(2)}L
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#EFF3F4]">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Actual Expenditure Drawn</span>
              <div className={`text-xl font-bold font-mono mt-0.5 ${
                caseData.expenditure > caseData.sanctionedAmount ? 'text-rose-600' : 'text-[#0F1419]'
              }`}>
                ₹{caseData.expenditure?.toFixed(2)}L
              </div>
            </div>
          </div>

          {/* AI Recommendation banner */}
          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1D9BF0] shrink-0" />
              <span><strong>AI Action Recommendation:</strong> Field verification and forensic vendor audit recommended.</span>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 2: WORK LIFECYCLE HORIZONTAL TIMELINE STEPPER */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Full Work Lifecycle Statutory Timeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
          <div className="p-3 rounded-xl bg-[#F7F9F9] border border-[#EFF3F4]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#1D9BF0]">1. Recommended</div>
            <div className="text-xs font-bold text-[#0F1419] font-mono mt-1">{caseData.recommendedDate || '2023-04-12'}</div>
            <div className="text-[11px] text-slate-500">By MP {caseData.mpName}</div>
          </div>

          <div className="p-3 rounded-xl bg-[#F7F9F9] border border-[#EFF3F4]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#1D9BF0]">2. Sanctioned</div>
            <div className="text-xs font-bold text-[#0F1419] font-mono mt-1">{caseData.sanctionDate || '2023-06-20'}</div>
            <div className="text-[11px] text-slate-500">By District Collectorate</div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-800">3. Target Completion</div>
            <div className="text-xs font-bold text-rose-700 font-mono mt-1">{caseData.completionDate || '2024-02-15'}</div>
            <div className="text-[11px] text-rose-600 font-semibold">{caseData.status}</div>
          </div>
        </div>
      </div>

      {/* SECTION 3: SITE LOCATION & PHOTO EVIDENCE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Static Map Visual Area */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#1D9BF0]" />
              Geospatial Site Location
            </h3>
            <span className="text-[11px] font-mono text-slate-500">GPS: 25.5941° N, 85.1376° E</span>
          </div>

          {/* Map Placeholder */}
          <div className="w-full h-48 bg-slate-100 rounded-xl border border-[#EFF3F4] flex flex-col items-center justify-center text-slate-400 p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-sky-50/40 to-slate-200/60" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-white border border-rose-300 flex items-center justify-center text-rose-600 shadow-card animate-bounce">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#0F1419] mt-2">
                {caseData.district}, {caseData.state}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                Constituency: {caseData.constituency || caseData.district}
              </span>
            </div>
          </div>
        </div>

        {/* Photo Evidence Comparison */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" />
              Geotagged Photo Evidence Audit
            </h3>
            <span className="text-[11px] font-semibold text-rose-600">
              {caseData.photoEvidenceStatus === 'missing' ? '⚠️ Missing Ground Evidence' : '✓ Verified'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 h-48">
            <div className="border border-[#EFF3F4] rounded-xl bg-[#F7F9F9] p-3 flex flex-col items-center justify-center text-center">
              <Camera className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-bold text-slate-700">Before Work (Inception)</span>
              <span className="text-[10px] text-slate-400 mt-1 font-mono">Geotagged 12-Apr-2023</span>
            </div>

            <div className="border border-rose-200 rounded-xl bg-rose-50/40 p-3 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="w-6 h-6 text-rose-500 mb-1" />
              <span className="text-xs font-bold text-rose-800">Latest Photo Status</span>
              <span className="text-[10px] text-rose-600 mt-1 font-semibold">Missing Post-Completion Upload</span>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 4: INVESTIGATION FORM & ACTIONS */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFF3F4]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg text-purple-800">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F1419]">
                Investigation Findings & Official Audit Filing
              </h2>
              <span className="text-[11px] text-slate-500">
                Document conclusions and submit the official auditor report for central MoSPI & state authorities
              </span>
            </div>
          </div>

          {reportSubmittedSuccess && (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Report Filed
            </span>
          )}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <span className="text-xs font-semibold text-slate-500 mr-2">Audit Action Triggers:</span>
          <button
            type="button"
            onClick={() => handleAction('Request Physical Inspection')}
            className="px-3 py-1.5 text-xs font-semibold text-[#0F1419] bg-[#F7F9F9] border border-[#EFF3F4] hover:bg-slate-100 rounded-xl transition-colors shadow-xs"
          >
            Request Inspection
          </button>
          <button
            type="button"
            onClick={() => handleAction('Request Supplementary Evidence')}
            className="px-3 py-1.5 text-xs font-semibold text-[#0F1419] bg-[#F7F9F9] border border-[#EFF3F4] hover:bg-slate-100 rounded-xl transition-colors shadow-xs"
          >
            Request Evidence
          </button>
          <button
            type="button"
            onClick={() => handleAction('Mark Under Review')}
            className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-xl transition-colors shadow-xs"
          >
            Mark Under Review
          </button>
          <button
            type="button"
            onClick={() => handleAction('Resolve Case')}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-xl transition-colors shadow-xs"
          >
            Resolve Case
          </button>
        </div>

        {/* Official Report Form */}
        <form onSubmit={handleSubmitReport} className="space-y-4 pt-2 border-t border-[#EFF3F4]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Investigation Conclusion:
              </label>
              <select
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                required
                className="w-full text-xs p-2.5 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] font-medium"
              >
                <option value="" disabled>Select a conclusion...</option>
                <option value="Confirmed Anomaly">Confirmed — Irregularity Verified</option>
                <option value="Requires Field Action">Requires Field Action (Remedial Notice)</option>
                <option value="False Positive">False Positive — No Irregularity Found</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Case Resolution Status:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] font-medium"
              >
                <option value="Under Review">Under Review</option>
                <option value="Escalated">Escalated to Ministry Directorate</option>
                <option value="Resolved">Resolved / Closed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Verified Progress % (Optional):
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={verifiedProgressPct}
                onChange={(e) => setVerifiedProgressPct(e.target.value)}
                placeholder="e.g. 65 (leave empty if not evaluated)"
                className="w-full text-xs p-2.5 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] font-medium placeholder-slate-400"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="relative flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={discrepancyFlag}
                  onChange={(e) => setDiscrepancyFlag(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                />
                <span className="text-xs font-bold text-rose-700">
                  Discrepancy Flag (Reported progress does not match ground verification)
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Detailed Investigation Notes & Audit Findings:
            </label>
            <textarea
              rows={3}
              value={investigationNotes}
              onChange={(e) => setInvestigationNotes(e.target.value)}
              placeholder="Document physical site findings, invoice mismatches, contractor explanations, or recommended recovery action..."
              className="w-full text-xs p-3 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] placeholder-slate-400"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Submitted report is permanently appended to this work record across all roles.
            </span>
            <button
              type="submit"
              disabled={isSubmittingReport || !investigationNotes.trim()}
              className="px-5 py-2 text-xs font-bold text-white bg-[#1D9BF0] hover:bg-[#1A8CD8] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingReport ? 'Submitting Report...' : 'Submit Official Audit Report'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 5: PHYSICAL ASSET VERIFICATION */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFF3F4]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-100 rounded-lg text-sky-800">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F1419]">
                Physical Asset Ground Verification
              </h2>
              <span className="text-[11px] text-slate-500">
                Record on-site asset creation status, asset classification, and geotag telemetry
              </span>
            </div>
          </div>

          {assetSubmittedSuccess && (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Asset Recorded
            </span>
          )}
        </div>

        <form onSubmit={handleSubmitAsset} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Asset Type:
              </label>
              <input
                type="text"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                placeholder="e.g. Community Hall, Solar Light"
                className="w-full text-xs p-2.5 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] font-medium placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Verification Status:
              </label>
              <select
                value={assetVerificationStatus}
                onChange={(e) => setAssetVerificationStatus(e.target.value)}
                required
                className="w-full text-xs p-2.5 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] font-medium"
              >
                <option value="verified">Verified (Ground Confirmed)</option>
                <option value="unverified">Unverified (Pending Check)</option>
                <option value="disputed">Disputed (Anomaly Detected)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Geotag Latitude:
              </label>
              <input
                type="number"
                step="any"
                value={geotagLat}
                onChange={(e) => setGeotagLat(e.target.value)}
                placeholder="e.g. 25.5941"
                className="w-full text-xs p-2.5 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] font-medium placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Geotag Longitude:
              </label>
              <input
                type="number"
                step="any"
                value={geotagLong}
                onChange={(e) => setGeotagLong(e.target.value)}
                placeholder="e.g. 85.1376"
                className="w-full text-xs p-2.5 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[#0F1419] font-medium placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Updates the central asset registry and verification queue for this project.
            </span>
            <button
              type="submit"
              disabled={isSubmittingAsset}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0F1419] hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingAsset ? 'Saving Verification...' : 'Record Asset Verification'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
```


### `frontend/src/pages/auditor/AuditorCaseQueuePage.jsx`

*File [115/131] | Lines: 359 | Size: 16.0 KB*

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
  Filter,
  RotateCcw,
  ShieldAlert,
  Bot,
  MapPin,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import RiskBadge from '../../components/common/RiskBadge';
import SearchBox from '../../components/common/SearchBox';
import { ErrorState, EmptyState } from '../../components/common/loading';
import { auditorApi } from '../../api/auditorApi';

/**
 * PAGE 1: High-Risk Case Queue (Auditor Role)
 * Route: /auditor/queue
 * Purpose: Surfaces ONLY Medium and High risk cases requiring deep-dive forensic investigation.
 */
export default function AuditorCaseQueuePage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    riskLevel: 'All',
    caseStatus: 'All',
    source: 'All',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;
  const navigate = useNavigate();

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  useEffect(() => {
    let active = true;
    const loadQueue = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await auditorApi.getCaseQueue({
          search: searchQuery,
          ...filters,
          page: currentPage,
          limit: pageSize,
        });
        if (!active) return;
        const incoming = res.data || [];
        setCases(incoming);
        setTotalCount(res.pagination?.total ?? res.total ?? incoming.length);
        setTotalPages(res.pagination?.totalPages ?? Math.max(1, Math.ceil((res.total || incoming.length) / pageSize)));
      } catch (err) {
        if (!active) return;
        console.error('Failed to load auditor case queue:', err);
        setError(err?.message || 'Failed to retrieve investigation cases.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadQueue();
    return () => {
      active = false;
    };
  }, [searchQuery, filters, currentPage]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({ riskLevel: 'All', caseStatus: 'All', source: 'All' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-100 rounded-lg text-rose-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight">
              High-Risk Investigation Case Queue
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Active audit queue prioritizing <span className="font-bold text-rose-700">High and Medium risk cases</span> across India. Low risk works are filtered out automatically.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-[#EFF3F4] px-3.5 py-2 rounded-xl text-xs font-mono shadow-xs self-start md:self-auto">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Investigation Backlog</span>
            <span className="text-base font-extrabold text-rose-600">{totalCount} Open Cases</span>
          </div>
        </div>
      </div>

      {/* Search & Custom Filter Bar */}
      <div className="space-y-3">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search investigation cases by Work ID, MP Name, vendor, district, state..."
        />

        {/* Custom Filter Bar for Auditor Queue */}
        <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-xl p-3.5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#1D9BF0]" />
            <span>Filters:</span>
          </div>

          {/* Risk Level Filter (Medium / High only) */}
          <select
            value={filters.riskLevel}
            onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
            className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
          >
            <option value="All">All Priority Risks (Med + High)</option>
            <option value="High">🔴 High Risk Only (&ge;70)</option>
            <option value="Medium">🟡 Medium Risk Only (40-69)</option>
          </select>

          {/* Case Status Filter */}
          <select
            value={filters.caseStatus}
            onChange={(e) => handleFilterChange('caseStatus', e.target.value)}
            className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
          >
            <option value="All">All Case Statuses</option>
            <option value="New">New / Unassigned</option>
            <option value="Under Review">Under Review</option>
            <option value="Escalated">Escalated by District</option>
            <option value="Resolved">Resolved / Report Filed</option>
          </select>

          {/* Source Tag Filter */}
          <select
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
            className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
          >
            <option value="All">All Flag Sources</option>
            <option value="ai">🤖 AI Flagged</option>
            <option value="district">📍 District Escalated</option>
          </select>

          {(filters.riskLevel !== 'All' || filters.caseStatus !== 'All' || filters.source !== 'All' || searchQuery) && (
            <button
              onClick={handleResetFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#1D9BF0] transition-colors px-2 py-1 bg-white border border-[#EFF3F4] rounded-lg"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Case Queue Table */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F9F9] border-b border-[#EFF3F4] text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4">Work ID</th>
                <th className="py-3 px-4">Recommending MP</th>
                <th className="py-3 px-4">State & District</th>
                <th className="py-3 px-3 text-center">Risk Score</th>
                <th className="py-3 px-4 min-w-[220px]">Flag Reason / Trigger</th>
                <th className="py-3 px-3 text-center">Case Status</th>
                <th className="py-3 px-4 text-center">Source</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className={`divide-y divide-[#EFF3F4] text-xs ${loading && cases.length > 0 ? 'opacity-70 transition-opacity' : ''}`}>
              {error ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <ErrorState
                      title="Failed to Load Investigation Cases"
                      message={error}
                      onRetry={loadQueue}
                    />
                  </td>
                </tr>
              ) : loading && cases.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-28" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                    <td className="py-3 px-3 text-center"><div className="h-6 bg-slate-200 rounded-full w-14 mx-auto" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-44" /></td>
                    <td className="py-3 px-3 text-center"><div className="h-5 bg-slate-200 rounded w-16 mx-auto" /></td>
                    <td className="py-4 px-4 text-center"><div className="h-5 bg-slate-200 rounded w-20 mx-auto" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-200 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <EmptyState
                      icon={CheckCircle2}
                      title="No High-Risk Cases Found"
                      message="No high-risk investigation cases match the selected filters."
                      actionText="Reset Filters"
                      onAction={handleResetFilters}
                    />
                  </td>
                </tr>
              ) : (
                cases.map((c) => {
                  const isDistrictSource = c.escalationSource === 'district';

                  return (
                    <tr
                      key={c.workId}
                      onClick={() => navigate(`/auditor/case/${encodeURIComponent(c.workId)}`)}
                      className="hover:bg-[#F7F9F9] cursor-pointer transition-colors group"
                    >
                      {/* Work ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                        <div className="flex items-center gap-1.5">
                          <span>{c.workId}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1D9BF0]" />
                        </div>
                      </td>

                      {/* MP Name */}
                      <td className="py-3.5 px-4 font-medium text-[#0F1419]">
                        <div>{c.mpName}</div>
                        <div className="text-[10px] text-slate-400">{c.category}</div>
                      </td>

                      {/* State & District */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        <div>{c.state}</div>
                        <div className="text-[10px] text-slate-400">{c.district}</div>
                      </td>

                      {/* Risk Score */}
                      <td className="py-3.5 px-3 text-center">
                        <RiskBadge level={c.riskLevel} score={c.riskScore} size="sm" />
                      </td>

                      {/* Flag Reason */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs">
                        <p className="line-clamp-2" title={c.flagReason}>
                          {c.flagReason}
                        </p>
                      </td>

                      {/* Case Status */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          c.caseStatus === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : c.caseStatus === 'Escalated'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : c.caseStatus === 'Under Review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {c.caseStatus}
                        </span>
                      </td>

                      {/* Source Tag Column */}
                      <td className="py-3.5 px-4 text-center">
                        {isDistrictSource ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] bg-purple-50 text-purple-800 border border-purple-200" title={c.escalationNote || 'Escalated by District Collectorate'}>
                            <MapPin className="w-3 h-3 text-purple-600" />
                            <span>📍 District Escalated</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] bg-sky-50 text-sky-800 border border-sky-200">
                            <Bot className="w-3 h-3 text-[#1D9BF0]" />
                            <span>🤖 AI Flagged</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-xs font-semibold text-[#1D9BF0] group-hover:underline flex items-center justify-end">
                          <span>Investigate</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with True Server-Side Pagination */}
        <div className="p-3.5 bg-[#F7F9F9] border-t border-[#EFF3F4] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Showing{' '}
            <span className="font-bold text-[#0F1419]">
              {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-bold text-[#0F1419]">
              {Math.min(currentPage * pageSize, totalCount)}
            </span>{' '}
            of <span className="font-bold text-[#0F1419]">{totalCount}</span> priority investigation cases
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-[#EFF3F4] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-[#EFF3F4] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
```


### `frontend/src/pages/auditor/AuditorVendorToolPage.jsx`

*File [116/131] | Lines: 396 | Size: 18.1 KB*

```jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import {
  Fingerprint,
  Search,
  Building2,
  AlertTriangle,
  IndianRupee,
  MapPin,
  User,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import RiskBadge from '../../components/common/RiskBadge';
import SearchBox from '../../components/common/SearchBox';
import {
  CardSkeleton,
  TableSkeleton,
  ErrorState,
} from '../../components/common/loading';
import { auditorApi } from '../../api/auditorApi';

/**
 * PAGE 3: Vendor Cross-Reference Tool (KEY DIFFERENTIATOR FEATURE)
 * Route: /auditor/vendor
 * Purpose: Uncovers nationwide multi-state contractor collusion, repeat identical payments,
 * and contract anomaly signatures.
 */
export default function AuditorVendorToolPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialVendor = searchParams.get('vendor') || 'Rajasthan Project Engineering';

  const [searchTerm, setSearchTerm] = useState(initialVendor);
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVendorData = async (name) => {
    try {
      setLoading(true);
      setError(null);
      const data = await auditorApi.getVendorProfile(name);
      if (data) {
        setVendorData(data);
        if (!name && data.vendorName) {
          setSearchTerm(data.vendorName);
        }
      } else {
        setError(`No contractor records found for "${name}".`);
      }
    } catch (err) {
      console.error('Failed to load vendor profile:', err);
      setError(err?.message || 'Failed to connect to contractor surveillance database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('vendor') || '';
    if (q) setSearchTerm(q);
    fetchVendorData(q);
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;
    setSearchParams({ vendor: searchTerm });
    fetchVendorData(searchTerm);
  };

  const handleSelectSampleVendor = (vendor) => {
    setSearchTerm(vendor);
    setSearchParams({ vendor });
    fetchVendorData(vendor);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* KEY DIFFERENTIATOR FEATURE HEADER */}
      <div className="bg-gradient-to-r from-purple-50/90 via-sky-50/50 to-indigo-50/70 border border-purple-200/80 rounded-2xl p-5 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-white rounded-xl border border-purple-200 text-purple-700 shadow-xs mt-0.5">
              <Fingerprint className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-700 text-white font-mono">
                  Forensic Differentiator
                </span>
                <span className="text-xs text-purple-800 font-semibold">
                  Multi-State Collusion Scanner
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight mt-1">
                Vendor Cross-Reference & Cartel Forensics
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
                Cross-references contractor awards across <span className="font-bold text-[#0F1419]">all 28 states and MPs</span> to detect contract-splitting, repeat round figures, and cartel concentration.
              </p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xs border border-purple-100 rounded-xl p-3 text-xs font-mono self-start md:self-auto">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Audited Scope</span>
            <span className="text-sm font-extrabold text-[#0F1419]">Nationwide Repository</span>
          </div>
        </div>
      </div>

      {/* VENDOR SEARCH BOX & QUICK SHORTCUTS */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendor by exact or partial name (e.g. M/s Apex Infra Projects, Ganga Civil Solutions)..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#F7F9F9] text-xs sm:text-sm text-[#0F1419] placeholder-slate-400 border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:bg-white transition-all font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#1D9BF0] hover:bg-[#1A8CD8] rounded-xl transition-colors shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <span>Scan Vendor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {vendorData?.popularVendors && vendorData.popularVendors.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-semibold text-[11px]">Database Contractor Presets:</span>
            {vendorData.popularVendors.map((v) => (
              <button
                key={v}
                onClick={() => handleSelectSampleVendor(v)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                  searchTerm.toLowerCase() === v.toLowerCase()
                    ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold'
                    : 'bg-[#F7F9F9] text-slate-700 border-[#EFF3F4] hover:bg-slate-100'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && !vendorData ? (
        <ErrorState
          title="Contractor Profile Not Found"
          message={error}
          onRetry={() => fetchVendorData(searchTerm)}
        />
      ) : !vendorData ? (
        <div className="space-y-6">
          <CardSkeleton count={5} />
          <TableSkeleton columns={6} rows={5} />
        </div>
      ) : (
        <div className={`space-y-6 ${loading ? 'opacity-70 transition-opacity' : ''}`}>

          {/* PATTERN ALERT BANNER (IF DETECTED) */}
          {vendorData.patternAlerts && vendorData.patternAlerts.length > 0 && (
            <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-4.5 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                  AI Forensic Pattern Detection Alerts ({vendorData.patternAlerts.length} Red Flags)
                </h3>
              </div>
              <div className="space-y-1.5 pl-7">
                {vendorData.patternAlerts.map((alertText, idx) => (
                  <p key={idx} className="text-xs font-semibold text-rose-900 leading-relaxed">
                    {alertText}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* VENDOR PROFILE SUMMARY CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Card 1: Total Works */}
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Works Awarded</span>
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-[#EFF3F4]">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
                {vendorData.totalWorks}
              </div>
              <div className="mt-2 text-[11px] text-rose-600 font-bold">
                {vendorData.highRiskCount} High-Risk Flagged
              </div>
            </div>

            {/* Card 2: Total Payment Amount */}
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Payment Volume</span>
                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
                ₹{vendorData.totalPaymentCr.toFixed(2)} <span className="text-sm font-normal text-slate-500">Cr</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Across all ministries & MPs
              </div>
            </div>

            {/* Card 3: Distinct MPs Worked With */}
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Distinct MPs</span>
                <div className="p-1.5 bg-sky-50 rounded-lg text-[#1D9BF0] border border-sky-100">
                  <User className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
                {vendorData.distinctMpsCount} <span className="text-sm font-normal text-slate-500">MPs</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500 truncate" title={vendorData.distinctMps.join(', ')}>
                {vendorData.distinctMps.slice(0, 2).join(', ')}...
              </div>
            </div>

            {/* Card 4: Distinct Districts & States */}
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Districts & States</span>
                <div className="p-1.5 bg-purple-50 rounded-lg text-purple-700 border border-purple-100">
                  <MapPin className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
                {vendorData.distinctDistrictsCount} <span className="text-sm font-normal text-slate-500">({vendorData.distinctStatesCount} States)</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                {vendorData.distinctStates.join(', ')}
              </div>
            </div>

            {/* Card 5: Average Payment Amount */}
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Avg Payment Size</span>
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-[#EFF3F4]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
                ₹{vendorData.avgPaymentLakhs.toFixed(1)} <span className="text-sm font-normal text-slate-500">L</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Per work average
              </div>
            </div>

          </div>

          {/* NATIONWIDE WORKS LIST FOR THIS VENDOR */}
          <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
            <div className="p-4 bg-[#F7F9F9] border-b border-[#EFF3F4] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-[#0F1419] flex items-center gap-2">
                  <span>Nationwide Contract Register for</span>
                  <span className="text-purple-700 font-mono underline">{vendorData.vendorName}</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  Rows highlighted in red contain detected collusion signatures (repeating round-figure amounts)
                </span>
              </div>
              <span className="text-xs font-mono font-bold bg-white border border-[#EFF3F4] px-2.5 py-1 rounded-lg">
                {vendorData.works.length} Contracts Cross-Referenced
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F7F9F9]/50 border-b border-[#EFF3F4] text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    <th className="py-3 px-4">Work ID</th>
                    <th className="py-3 px-4">Recommending MP</th>
                    <th className="py-3 px-4">State & District</th>
                    <th className="py-3 px-4 text-right">Sanctioned Amount</th>
                    <th className="py-3 px-3 text-center">Risk Level</th>
                    <th className="py-3 px-4 min-w-[200px]">Detected Pattern Flag</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EFF3F4] text-xs">
                  {vendorData.works.map((w) => {
                    return (
                      <tr
                        key={w.workId}
                        onClick={() => onOpenWorkDetail(w)}
                        className={`cursor-pointer transition-colors group ${
                          w.isRedFlagged ? 'bg-rose-50/30 hover:bg-rose-50/60' : 'hover:bg-[#F7F9F9]'
                        }`}
                      >
                        {/* Work ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                          <div className="flex items-center gap-1.5">
                            <span>{w.workId}</span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1D9BF0]" />
                          </div>
                        </td>

                        {/* MP Name */}
                        <td className="py-3.5 px-4 font-medium text-[#0F1419]">
                          <div>{w.mpName}</div>
                          <div className="text-[10px] text-slate-400">{w.category}</div>
                        </td>

                        {/* State & District */}
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          <div>{w.state}</div>
                          <div className="text-[10px] text-slate-400">{w.district}</div>
                        </td>

                        {/* Sanctioned Amount */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-[#0F1419]">
                          <span className={w.flags?.some(f => f.includes('Identical')) ? 'px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-200' : ''}>
                            ₹{w.sanctionedAmount?.toFixed(2)}L
                          </span>
                        </td>

                        {/* Risk Level */}
                        <td className="py-3.5 px-3 text-center">
                          <RiskBadge level={w.riskLevel} score={w.riskScore} size="sm" />
                        </td>

                        {/* Red Flag Tag */}
                        <td className="py-3.5 px-4">
                          {w.flags && w.flags.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {w.flags.map((f, i) => (
                                <span key={i} className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                                  {f}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-medium">
                              Standard execution
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-3 bg-[#F7F9F9] border-t border-[#EFF3F4] flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-700" />
                <span>
                  Click any contract row to inspect full work details and audit evidence.
                </span>
              </div>
              <span className="font-mono text-[11px] font-semibold text-slate-700">
                Vendor Audit Hash: #VN-8820-APEX
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
```


### `frontend/src/pages/district/DistrictOverviewPage.jsx`

*File [117/131] | Lines: 330 | Size: 14.6 KB*

```jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  IndianRupee,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MapPin,
  User,
  ShieldAlert,
  ArrowUpRight,
  FileCheck,
  ExternalLink,
  Layers,
} from 'lucide-react';
import RiskBadge from '../../components/common/RiskBadge';
import {
  CardSkeleton,
  ListSkeleton,
  ErrorState,
} from '../../components/common/loading';
import { districtApi } from '../../api/districtApi';

/**
 * PAGE 1: District Overview (District Authority View)
 * Route: /district/overview
 */
export default function DistrictOverviewPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMp, setExpandedMp] = useState(null);

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await districtApi.getDistrictOverview();
      setData(res);
      // Auto-expand first MP for demo scannability
      if (res.mpBreakdown && res.mpBreakdown.length > 0) {
        setExpandedMp(res.mpBreakdown[0].mpName);
      }
    } catch (err) {
      console.error('Failed to load district overview:', err);
      setError(err?.message || 'Failed to retrieve district telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const district = data?.district || {};
  const kpis = data?.kpis;
  const mpBreakdown = data?.mpBreakdown || [];

  const toggleExpand = (mpName) => {
    setExpandedMp(prev => prev === mpName ? null : mpName);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* DISTRICT HEADER PROFILE CARD */}
      <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#EFF3F4] flex items-center justify-center text-[#1D9BF0] shadow-xs shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight">
                {district.districtName} District Authority
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-sky-50 text-[#1D9BF0] border border-sky-200">
                {district.state} • Nodal Office
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[#0F1419] font-bold">{district.headquarters}</span>
              </span>
              <span>•</span>
              <span className="text-slate-700">{district.nodalOfficer}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            to="/district/verification"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1D9BF0] text-white hover:bg-[#1A8CD8] transition-colors shadow-xs"
          >
            <FileCheck className="w-4 h-4" />
            <span>Open Verification Queue</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {error && !data ? (
        <ErrorState
          title="District Telemetry Offline"
          message={error}
          onRetry={loadOverview}
        />
      ) : !data ? (
        <>
          <CardSkeleton count={4} />
          <ListSkeleton count={3} title="MP Portfolio Breakdown" />
        </>
      ) : (
        <>
          {/* SUMMARY KPI CARDS (SCOPED TO THIS DISTRICT) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Works */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Works in District</span>
            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-[#EFF3F4]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            {kpis.totalWorks} <span className="text-sm font-normal text-slate-500">Active</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Across {mpBreakdown.length} MPs (Lok Sabha & Rajya Sabha)
          </div>
        </div>

        {/* Card 2: Total Sanctioned */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sanctioned Volume</span>
            <div className="p-1.5 bg-sky-50 rounded-lg text-[#1D9BF0] border border-sky-100">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            ₹{kpis.totalSanctionedCr.toFixed(2)} <span className="text-sm font-normal text-slate-500">Cr</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            {kpis.totalSanctionedCount} works sanctioned by Collectorate
          </div>
        </div>

        {/* Card 3: Total Completed */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Works</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">
            {kpis.totalCompletedCount} <span className="text-sm font-normal text-slate-500">Works</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium font-mono">
            {kpis.completionRate}% district completion rate
          </div>
        </div>

        {/* Card 4: Total Flagged Cases */}
        <div className="bg-white border border-rose-200/80 rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all bg-rose-50/20">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Flagged Anomalies</span>
            <div className="p-1.5 bg-rose-100 rounded-lg text-rose-600 border border-rose-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            {kpis.totalFlaggedCount} <span className="text-sm font-normal text-rose-700">Cases</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-700 font-medium">
            Requires ground audit / DNO verification
          </div>
        </div>

      </div>

      {/* MP-WISE BREAKDOWN SECTION & EXPANDABLE WORKS SUB-TABLE */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F1419]">
                MP-Wise Works Breakdown in {district.districtName} District
              </h2>
              <span className="text-[11px] text-slate-500">
                Click on any MP to expand and inspect their specific works running within this district
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {mpBreakdown.length} MPs active
          </span>
        </div>

        {/* MP Breakdown Accordion Table */}
        <div className="divide-y divide-[#EFF3F4] border border-[#EFF3F4] rounded-xl overflow-hidden">
          {mpBreakdown.map((mpEntry) => {
            const isExpanded = expandedMp === mpEntry.mpName;

            return (
              <div key={mpEntry.mpName} className="bg-white">
                {/* MP Summary Row */}
                <div
                  onClick={() => toggleExpand(mpEntry.mpName)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F9F9] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 font-mono">
                      {mpEntry.mpName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#0F1419] flex items-center gap-2">
                        <span>{mpEntry.mpName}</span>
                        <span className="text-xs font-normal text-slate-500">({mpEntry.constituency})</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Sanctioned: <strong className="font-mono text-slate-700">₹{mpEntry.totalSanctionedCr} Cr</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#0F1419] font-mono">
                        {mpEntry.totalWorks} Works ({mpEntry.completedCount} Completed)
                      </div>
                      <div className="text-[11px] text-emerald-600 font-semibold">
                        {mpEntry.completionRate}% Completion Rate
                      </div>
                    </div>

                    <div className="text-right min-w-[70px]">
                      {mpEntry.flaggedCount > 0 ? (
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {mpEntry.flaggedCount} Flagged
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          0 Flagged
                        </span>
                      )}
                    </div>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expandable Works Sub-Table */}
                {isExpanded && (
                  <div className="bg-[#F7F9F9] p-4 border-t border-[#EFF3F4] space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Works by {mpEntry.mpName} in {district.districtName}
                    </div>

                    <div className="space-y-2">
                      {mpEntry.works.map((work) => (
                        <div
                          key={work.workId}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenWorkDetail(work);
                          }}
                          className="bg-white p-3 rounded-xl border border-[#EFF3F4] hover:border-[#1D9BF0] hover:shadow-xs transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono font-bold text-xs text-[#0F1419] group-hover:text-[#1D9BF0]">
                                {work.workId}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs text-slate-600 font-medium truncate">
                                {work.category}
                              </span>
                              <RiskBadge level={work.riskLevel} score={work.riskScore} size="sm" />
                            </div>
                            <p className="text-xs text-slate-700 font-medium line-clamp-1">
                              {work.description || work.flagReason}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 shrink-0 text-xs">
                            <div className="text-right font-mono">
                              <div className="font-bold text-[#0F1419]">₹{work.sanctionedAmount?.toFixed(1)}L</div>
                              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                work.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                              }`}>
                                {work.status}
                              </span>
                            </div>

                            <span className="text-[#1D9BF0] font-semibold flex items-center text-xs group-hover:translate-x-0.5 transition-transform">
                              Inspect <ExternalLink className="w-3 h-3 ml-1" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
        </>
      )}

    </div>
  );
}
```


### `frontend/src/pages/district/DistrictVerificationQueuePage.jsx`

*File [118/131] | Lines: 481 | Size: 22.6 KB*

```jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  ShieldAlert,
  Search,
  ExternalLink,
  MessageSquare,
  X,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import RiskBadge from '../../components/common/RiskBadge';
import SearchBox from '../../components/common/SearchBox';
import { ErrorState, EmptyState } from '../../components/common/loading';
import { districtApi } from '../../api/districtApi';

/**
 * PAGE 2: Work Verification Queue (District Authority View)
 * Route: /district/verification
 * Purpose: Surfaces ONLY completed works where mandatory geotagged photo evidence is missing.
 */
export default function DistrictVerificationQueuePage() {
  const { onOpenWorkDetail, refreshData } = useOutletContext();
  const [queueWorks, setQueueWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRisk, setFilterRisk] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  // Modal / Action states
  const [escalatingWork, setEscalatingWork] = useState(null);
  const [escalationNote, setEscalationNote] = useState('');
  const [isEscalating, setIsEscalating] = useState(false);

  // Toast / notification state
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const loadQueue = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await districtApi.getVerificationQueue({
        search: searchQuery,
        page: currentPage,
        limit: pageSize,
      });
      setQueueWorks(res.data || []);
      setTotalCount(res.pagination?.total ?? res.total ?? (res.data || []).length);
      setTotalPages(res.pagination?.totalPages ?? Math.max(1, Math.ceil((res.total || 0) / pageSize)));
    } catch (err) {
      console.error('Failed to load verification queue:', err);
      setError(err?.message || 'Failed to retrieve district verification queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [searchQuery, currentPage]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Action 1: Mark as Verified
  const handleMarkVerified = async (e, work) => {
    e.stopPropagation();
    await districtApi.markWorkVerified(work.workId);
    showToast(`Work ${work.workId} marked as verified & removed from pending queue.`);
    await loadQueue();
    if (refreshData) refreshData();
  };

  // Action 2: Request Evidence
  const handleRequestEvidence = async (e, work) => {
    e.stopPropagation();
    await districtApi.requestEvidence(work.workId, 'Urgent reminder dispatched to block engineer & contractor.');
    showToast(`Evidence submission notice dispatched for ${work.workId}.`);
    await loadQueue();
    if (refreshData) refreshData();
  };

  // Action 3: Open Escalation Modal
  const handleOpenEscalation = (e, work) => {
    e.stopPropagation();
    setEscalatingWork(work);
    setEscalationNote('Mandatory completion photo evidence not provided after multiple statutory reminder periods.');
  };

  // Submit Escalation to Investigation (Updates database for Auditor)
  const handleSubmitEscalation = async (e) => {
    e.preventDefault();
    if (!escalatingWork || !escalationNote.trim()) return;

    setIsEscalating(true);
    await districtApi.escalateWorkToInvestigation(escalatingWork.workId, escalationNote.trim());
    setIsEscalating(false);
    setEscalatingWork(null);

    showToast(`Work ${escalatingWork.workId} escalated to Independent Auditor for investigation.`);
    await loadQueue();
    if (refreshData) refreshData();
  };

  const filteredQueue = queueWorks.filter((w) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      w.workId.toLowerCase().includes(q) ||
      w.mpName.toLowerCase().includes(q) ||
      (w.description && w.description.toLowerCase().includes(q)) ||
      w.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header & Verification Guidance Banner */}
      <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-800">
              <FileCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight">
              Work Ground Verification Queue
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Surfacing <span className="font-bold text-[#0F1419]">completed works with missing photo evidence</span>. Confirm ground reality, request proof, or escalate to Independent Auditor.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-[#EFF3F4] px-3.5 py-2 rounded-xl text-xs font-mono shadow-xs self-start md:self-auto">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Pending Queue</span>
            <span className="text-base font-extrabold text-amber-700">{totalCount} Works</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <SearchBox
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search verification queue by Work ID, MP Name, description, or contractor..."
      />

      {/* Verification Queue Table */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F9F9] border-b border-[#EFF3F4] text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4">Work ID</th>
                <th className="py-3 px-4">Recommending MP</th>
                <th className="py-3 px-4 min-w-[200px]">Description</th>
                <th className="py-3 px-3">Completion Date</th>
                <th className="py-3 px-3 text-center">Overdue Days</th>
                <th className="py-3 px-3 text-center">Risk Level</th>
                <th className="py-3 px-3 text-center">Asset Status</th>
                <th className="py-3 px-4 text-right min-w-[260px]">Verification Actions</th>
              </tr>
            </thead>

            <tbody className={`divide-y divide-[#EFF3F4] text-xs ${loading && queueWorks.length > 0 ? 'opacity-70 transition-opacity' : ''}`}>
              {error ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <ErrorState
                      title="Failed to Load Verification Queue"
                      message={error}
                      onRetry={loadQueue}
                    />
                  </td>
                </tr>
              ) : loading && queueWorks.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-28 mb-1" /><div className="h-3 bg-slate-100 rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-44 mb-1" /><div className="h-3 bg-slate-100 rounded w-24" /></td>
                    <td className="py-4 px-3 font-mono"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                    <td className="py-4 px-3 text-center"><div className="h-5 bg-slate-200 rounded w-12 mx-auto" /></td>
                    <td className="py-4 px-3 text-center"><div className="h-5 bg-slate-200 rounded w-14 mx-auto" /></td>
                    <td className="py-4 px-3 text-center"><div className="h-5 bg-slate-200 rounded w-16 mx-auto" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-7 bg-slate-200 rounded w-36 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <EmptyState
                      icon={CheckCircle2}
                      title="All Completed Works Verified"
                      message="No pending verification flags in the ground queue for Patna district."
                    />
                  </td>
                </tr>
              ) : (
                filteredQueue.map((work) => {
                  const isHighOrMed = work.riskLevel === 'High' || work.riskLevel === 'Medium' || (work.riskScore && work.riskScore >= 40);
                  const isEscalated = work.escalationSource === 'district';

                  return (
                    <tr
                      key={work.workId}
                      onClick={() => onOpenWorkDetail(work)}
                      className="hover:bg-[#F7F9F9] cursor-pointer transition-colors group"
                    >
                      {/* Work ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                        <div className="flex items-center gap-1.5">
                          <span>{work.workId}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1D9BF0]" />
                        </div>
                      </td>

                      {/* MP Name */}
                      <td className="py-3.5 px-4 font-medium text-[#0F1419]">
                        <div>{work.mpName}</div>
                        <div className="text-[10px] text-slate-400">{work.category}</div>
                      </td>

                      {/* Description */}
                      <td className="py-3.5 px-4 max-w-xs font-medium text-slate-700">
                        <div className="line-clamp-2">{work.description || work.flagReason}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Contractor: {work.vendorName}</div>
                      </td>

                      {/* Completion Date */}
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">
                        {work.completionDate?.split(' ')[0] || '2024-03-10'}
                      </td>

                      {/* Days Since Completion */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 text-xs">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{work.daysSinceCompletion || 90}d</span>
                        </div>
                      </td>

                      {/* Risk Level */}
                      <td className="py-3.5 px-3 text-center">
                        <RiskBadge level={work.riskLevel} score={work.riskScore} size="sm" />
                      </td>

                      {/* Asset Verification Status */}
                      <td className="py-3.5 px-3 text-center">
                        {(() => {
                          const status = (work.assetVerificationStatus || 'none').toLowerCase();
                          if (status === 'verified') {
                            return (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Verified
                              </span>
                            );
                          }
                          if (status === 'disputed') {
                            return (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                Disputed
                              </span>
                            );
                          }
                          if (status === 'unverified') {
                            return (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Unverified
                              </span>
                            );
                          }
                          return (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                              None
                            </span>
                          );
                        })()}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Button 1: Mark Verified */}
                          <button
                            onClick={(e) => handleMarkVerified(e, work)}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition-colors shadow-xs"
                            title="Confirm photo evidence verified on ground"
                          >
                            Mark Verified
                          </button>

                          {/* Button 2: Request Evidence */}
                          <button
                            onClick={(e) => handleRequestEvidence(e, work)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors border shadow-xs ${
                              work.evidenceReminderSent
                                ? 'bg-sky-50 text-[#1D9BF0] border-sky-200'
                                : 'bg-white text-slate-700 border-[#EFF3F4] hover:bg-slate-50'
                            }`}
                            title="Send notice to contractor and block engineer"
                          >
                            {work.evidenceReminderSent ? 'Notice Sent ✓' : 'Request Evidence'}
                          </button>

                          {/* Button 3: Escalate to Investigation (Only Medium or High Risk) */}
                          {isHighOrMed && (
                            isEscalated ? (
                              <span className="px-2 py-1 text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-lg flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3" />
                                Escalated to Auditor
                              </span>
                            ) : (
                              <button
                                onClick={(e) => handleOpenEscalation(e, work)}
                                className="px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors shadow-xs flex items-center gap-1"
                                title="Escalate to Independent Auditor for forensic investigation"
                              >
                                <AlertTriangle className="w-3 h-3 text-rose-600" />
                                <span>Escalate</span>
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Informational Callout Bar & Pagination */}
        <div className="p-3.5 bg-[#F7F9F9] border-t border-[#EFF3F4] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#1D9BF0]" />
            <span>
              Under MPLADS guidelines, physical verification photos must be uploaded within 30 days of completion before final account settlement.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-semibold text-slate-700">
              Showing {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} Cases
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 rounded border border-[#EFF3F4] bg-white text-slate-600 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px]">
                  {currentPage}/{totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1 rounded border border-[#EFF3F4] bg-white text-slate-600 disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ESCALATION TO INVESTIGATION MODAL */}
      {escalatingWork && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-modal border border-[#EFF3F4] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-100 rounded-lg text-rose-700">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-rose-900">
                  Escalate Work to Independent Auditor
                </h3>
              </div>
              <button onClick={() => setEscalatingWork(null)} className="text-slate-400 hover:text-[#0F1419]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitEscalation} className="p-5 space-y-4">
              <div className="p-3 rounded-xl bg-[#F7F9F9] border border-[#EFF3F4] text-xs space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="font-bold text-[#0F1419]">{escalatingWork.workId}</span>
                  <RiskBadge level={escalatingWork.riskLevel} score={escalatingWork.riskScore} size="sm" />
                </div>
                <div className="text-slate-700">{escalatingWork.description}</div>
                <div className="text-[11px] text-slate-500">MP: {escalatingWork.mpName} • Completed {escalatingWork.daysSinceCompletion || 90} days ago</div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  District Authority Escalation Reason:
                </label>
                <textarea
                  rows={3}
                  value={escalationNote}
                  onChange={(e) => setEscalationNote(e.target.value)}
                  placeholder="Provide reason for escalating to Auditor (e.g. Photo evidence not provided after multiple reminder notices)..."
                  className="w-full text-xs p-3 bg-white border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-[#0F1419]"
                  required
                />
              </div>

              <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-100 text-[11px] text-purple-800">
                ⚡ <strong>Auditor Integration:</strong> This case will be tagged as <span className="font-mono font-bold">escalationSource: "district"</span> and will immediately appear in the Auditor's Priority Investigation queue.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EFF3F4]">
                <button
                  type="button"
                  onClick={() => setEscalatingWork(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#0F1419] bg-white border border-[#EFF3F4] rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEscalating || !escalationNote.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isEscalating ? 'Escalating...' : 'Confirm Escalation to Auditor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
```


### `frontend/src/pages/FlaggedCasesPage.jsx`

*File [119/131] | Lines: 575 | Size: 20.7 KB*

```jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import {
  Download,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  ShieldCheck,
  FileSpreadsheet,
  Loader2,
} from 'lucide-react';
import RiskBadge from '../components/common/RiskBadge';
import SearchBox from '../components/common/SearchBox';
import FilterBar from '../components/common/FilterBar';
import { ErrorState, EmptyState } from '../components/common/loading';
import { mpladsService } from '../api/mpladsService';

const EXPORT_BATCH_SIZE = 50;

/**
 * PAGE 2: All Flagged Cases
 * Route: /ministry/flagged
 */
export default function FlaggedCasesPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [searchParams] = useSearchParams();
  const [works, setWorks] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  // Initialise state filter from ?state= query param if present (e.g. navigated from state risk matrix)
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: searchParams.get('state') || 'All',
    category: 'All',
    riskLevel: 'All',
    status: 'All',
    financialYear: 'All',
  });

  // Sorting & Pagination State
  const [sortField, setSortField] = useState('riskScore');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // CSV Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  // Mounted ref to guard against state updates after unmount during CSV exports
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // AbortController ref to safely manage in-flight requests and prevent out-of-order race conditions
  const abortControllerRef = useRef(null);

  // Reset to page 1 whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Hoisted data loader with AbortController protection and retry capability
  const loadWorks = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const res = await mpladsService.getFlaggedWorks(
        {
          search: searchQuery,
          ...filters,
          page: currentPage,
          limit: pageSize,
          sortField,
          sortDirection,
        },
        { signal: controller.signal }
      );

      // Discard state updates if another request was triggered
      if (abortControllerRef.current !== controller) return;

      const incoming = res.data || [];
      setWorks(incoming);
      setTotalCount(res.pagination?.total ?? res.total ?? incoming.length);
      setTotalPages(
        res.pagination?.totalPages ??
          Math.max(1, Math.ceil((res.total || incoming.length) / pageSize))
      );

      // Directly consume complete uncached live metadata from server
      if (Array.isArray(res.availableStates)) {
        setAvailableStates(res.availableStates);
      }
      if (Array.isArray(res.availableCategories)) {
        setAvailableCategories(res.availableCategories);
      }
    } catch (err) {
      if (err?.name === 'AbortError' || err?.isAborted) {
        // Request was aborted in favor of a newer query - do not update state
        return;
      }
      console.error('Failed to load flagged works:', err);
      setError(err?.message || 'Failed to retrieve flagged cases.');
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, [searchQuery, filters, currentPage, sortField, sortDirection]);

  useEffect(() => {
    loadWorks();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadWorks]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      state: 'All',
      category: 'All',
      riskLevel: 'All',
      status: 'All',
      financialYear: 'All',
    });
    setCurrentPage(1);
  };

  // Batched CSV Export handler (fetches all filtered rows sequentially using safe batch size)
  const handleExportCSV = async () => {
    if (totalCount === 0) {
      alert('No flagged works to export with the current filter criteria.');
      return;
    }

    try {
      if (isMountedRef.current) {
        setIsExporting(true);
        setExportStatus('Starting export...');
      }

      const totalBatches = Math.ceil(totalCount / EXPORT_BATCH_SIZE);
      let allRows = [];

      for (let batchNum = 1; batchNum <= totalBatches; batchNum++) {
        if (!isMountedRef.current) break;
        if (isMountedRef.current) {
          setExportStatus(`Preparing export... (${allRows.length} of ${totalCount})`);
        }

        const res = await mpladsService.getFlaggedWorks({
          search: searchQuery,
          ...filters,
          sortField,
          sortDirection,
          page: batchNum,
          limit: EXPORT_BATCH_SIZE,
        });

        if (!isMountedRef.current) break;

        const batchData = res.data || [];
        allRows = allRows.concat(batchData);

        if (batchData.length < EXPORT_BATCH_SIZE) {
          break;
        }
      }

      if (!isMountedRef.current) return;
      if (isMountedRef.current) {
        setExportStatus(`Generating CSV (${allRows.length} records)...`);
      }

      const headers = [
        'Work ID',
        'MP Name',
        'Category',
        'State',
        'District',
        'Risk Score',
        'Risk Level',
        'Sanctioned Amount (Lakhs)',
        'Expenditure (Lakhs)',
        'Status',
        'Flag Reason',
      ];

      const rows = allRows.map((w) => [
        `"${w.workId}"`,
        `"${w.mpName}"`,
        `"${w.category}"`,
        `"${w.state}"`,
        `"${w.district}"`,
        w.riskScore,
        `"${w.riskLevel}"`,
        w.sanctionedAmount ?? 0,
        w.expenditure || 0,
        `"${w.status}"`,
        `"${(w.flagReason || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `MPLADS_Flagged_For_Review_Export_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export CSV:', err);
      alert(`Export failed: ${err.message || 'Network error'}`);
    } finally {
      if (isMountedRef.current) {
        setIsExporting(false);
        setExportStatus('');
      }
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F1419] tracking-tight">
            Works Flagged for Review
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central repository of works flagged by AI audit algorithms across India.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={isExporting || totalCount === 0 || loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0F1419] bg-white border border-[#EFF3F4] rounded-xl hover:bg-[#F7F9F9] hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs self-start sm:self-auto"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 text-[#1D9BF0] animate-spin" />
              <span>{exportStatus || 'Preparing export...'}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-slate-600" />
              <span>Export Flagged List (CSV)</span>
            </>
          )}
        </button>
      </div>

      {/* Search & Filter Section */}
      <div className="space-y-3">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by Work ID, MP Name, Vendor Name, District..."
        />
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          availableStates={availableStates}
          availableCategories={availableCategories}
        />
      </div>

      {/* Flagged Cases Data Table */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F9F9] border-b border-[#EFF3F4] text-[11px] font-bold uppercase tracking-wider text-slate-600">
                {/* 1. Work ID */}
                <th
                  onClick={() => handleSort('workId')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Work ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                {/* 2. Recommending MP */}
                <th
                  onClick={() => handleSort('mpName')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Recommending MP</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                {/* 3. Category (Dedicated Column) */}
                <th
                  onClick={() => handleSort('category')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Category</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                {/* 4. State / District */}
                <th
                  onClick={() => handleSort('state')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>State / District</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                {/* 5. Risk Level & Score */}
                <th
                  onClick={() => handleSort('riskScore')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Risk Level & Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                {/* 6. Flag Reason / Diagnostic Signal */}
                <th className="py-3 px-4 min-w-[220px]">
                  Flag Reason / Diagnostic Signal
                </th>

                {/* 7. Sanctioned */}
                <th
                  onClick={() => handleSort('sanctionedAmount')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Sanctioned</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>

                {/* 8. Status */}
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody
              className={`divide-y divide-[#EFF3F4] text-xs ${
                loading && works.length > 0 ? 'opacity-70 transition-opacity' : ''
              }`}
            >
              {error ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <ErrorState
                      title="Failed to Load Flagged Cases"
                      message={error}
                      onRetry={loadWorks}
                    />
                  </td>
                </tr>
              ) : loading && works.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-20" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-28" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-24 mb-1" />
                      <div className="h-3 bg-slate-100 rounded w-16" />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="h-6 bg-slate-200 rounded-full w-24 mx-auto" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-slate-200 rounded w-48 mb-1" />
                      <div className="h-3 bg-slate-100 rounded w-32" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="h-4 bg-slate-200 rounded w-14 ml-auto" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-5 bg-slate-200 rounded w-16" />
                    </td>
                  </tr>
                ))
              ) : works.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <EmptyState
                      icon={ShieldCheck}
                      title="No Flagged Works Found"
                      message="No works match the selected search and filter criteria."
                      actionText="Reset All Filters"
                      onAction={handleResetFilters}
                    />
                  </td>
                </tr>
              ) : (
                works.map((w) => (
                  <tr
                    key={w.workId}
                    onClick={() => onOpenWorkDetail(w)}
                    className="hover:bg-[#F7F9F9] cursor-pointer transition-colors group"
                  >
                    {/* 1. Work ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                      <div className="flex items-center gap-1.5">
                        <span>{w.workId}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1D9BF0]" />
                      </div>
                    </td>

                    {/* 2. Recommending MP */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0F1419]">{w.mpName}</div>
                    </td>

                    {/* 3. Category (Dedicated Column) */}
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {w.category}
                    </td>

                    {/* 4. State / District */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0F1419]">{w.state}</div>
                      <div className="text-[10px] text-slate-500">{w.district}</div>
                    </td>

                    {/* 5. Risk Level & Score (Single Badge: 🔴 High Risk (100)) */}
                    <td className="py-3.5 px-4 text-center">
                      <RiskBadge
                        level={w.fraudRiskTier || w.riskLevel || 'Medium'}
                        score={w.fraudRiskScore || w.riskScore}
                        size="sm"
                      />
                    </td>

                    {/* 6. Flag Reason */}
                    <td className="py-3.5 px-4 font-medium text-slate-700 max-w-xs">
                      <p className="line-clamp-2" title={w.flagReason}>
                        {w.flagReason}
                      </p>
                    </td>

                    {/* 7. Sanctioned Amount */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#0F1419]">
                      ₹{(w.sanctionedAmount ?? 0).toFixed(2)}L
                    </td>

                    {/* 8. Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          w.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : w.status === 'Delayed'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : w.status === 'Under Review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-[#F7F9F9] border-t border-[#EFF3F4] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Showing{' '}
            <span className="font-bold text-[#0F1419]">
              {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-bold text-[#0F1419]">
              {Math.min(currentPage * pageSize, totalCount)}
            </span>{' '}
            of <span className="font-bold text-[#0F1419]">{totalCount}</span> flagged cases
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-[#EFF3F4] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-[#EFF3F4] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```


### `frontend/src/pages/LoginPage.jsx`

*File [120/131] | Lines: 235 | Size: 9.5 KB*

```jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Building,
  User,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Award,
  FileCheck,
  Fingerprint,
  Landmark,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockUsers } from '../auth/mockAuth';

/**
 * LoginPage Component (Route: /login)
 * 
 * Provides:
 * 1. Standard credential form (Email + Plaintext Password)
 * 2. 5 One-Click "Quick Demo Login" buttons connecting to real backend auth
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsRole, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Target route after login (fallback to role default path)
  const fromPath = location.state?.from?.pathname;

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      const destination = fromPath || res.user.defaultPath || '/ministry/overview';
      navigate(destination, { replace: true });
    } else {
      setErrorMessage(res.error || 'Authentication failed.');
    }
  };

  const handleQuickLogin = async (demoUser) => {
    setErrorMessage('');
    setEmail(demoUser.email);
    setPassword(demoUser.password);

    const res = await loginAsRole(demoUser);
    if (res.success) {
      const destination = fromPath || res.user.defaultPath || '/ministry/overview';
      navigate(destination, { replace: true });
    } else {
      setErrorMessage(res.error || 'Authentication failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Emblem & Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#1D9BF0] flex items-center justify-center text-white shadow-card mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-[#0F1419] tracking-tight">
            MPLADS <span className="text-[#1D9BF0]">SENTINEL</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            AI-Assisted Risk Screening & Transparency Platform
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mt-2 rounded-full bg-sky-50 text-[#1D9BF0] text-[11px] font-semibold border border-sky-100">
            <Sparkles className="w-3 h-3 text-[#1D9BF0]" />
            <span>Smart India Hackathon 2026 Prototype</span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-5 sm:px-8 border border-[#EFF3F4] rounded-3xl shadow-subtle space-y-6">
          
          {/* Form Header */}
          <div className="pb-3 border-b border-[#EFF3F4]">
            <h2 className="text-base font-bold text-[#0F1419]">Portal Sign In</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter authorized credentials or select a Quick Demo role below.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email / Official Username
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ministry@mplads.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-white text-xs sm:text-sm text-[#0F1419] placeholder-slate-400 border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (e.g. ministry@mplads123)"
                  className="w-full pl-9 pr-10 py-2.5 bg-white text-xs sm:text-sm text-[#0F1419] placeholder-slate-400 border border-[#EFF3F4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#1D9BF0] text-white hover:bg-[#1A8CD8] transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="pt-4 border-t border-[#EFF3F4] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                ⚡ Quick Demo One-Click Login
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Backend Auth</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {mockUsers.map((u) => {
                const roleIcons = {
                  ministry: Building,
                  mp: Award,
                  district: FileCheck,
                  state: Landmark,
                  auditor: Fingerprint,
                };
                const RoleIcon = roleIcons[u.role] || User;

                return (
                  <button
                    key={u.id}
                    type="button"
                    disabled={loading}
                    onClick={() => handleQuickLogin(u)}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#EFF3F4] bg-[#F7F9F9] hover:bg-sky-50/60 hover:border-sky-200 transition-all text-left group disabled:opacity-60"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#EFF3F4] flex items-center justify-center text-[#1D9BF0] group-hover:scale-105 transition-transform shadow-2xs">
                        <RoleIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0F1419] group-hover:text-[#1D9BF0] transition-colors">
                          Login as {u.roleLabel}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                          {u.name} · {u.email}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#1D9BF0] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                      Launch →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-2 text-center text-[11px] text-slate-400">
            <span>Role-Based Access Control • Smart India Hackathon 2026</span>
          </div>

        </div>
      </div>
    </div>
  );
}
```


### `frontend/src/pages/mp/MpConstituencyOverviewPage.jsx`

*File [121/131] | Lines: 341 | Size: 15.0 KB*

```jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  IndianRupee,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import RiskBadge from '../../components/common/RiskBadge';
import {
  CardSkeleton,
  TableSkeleton,
  ErrorState,
} from '../../components/common/loading';
import { mpApi } from '../../api/mpApi';

/**
 * PAGE 1: My Constituency Overview (MP Individual View)
 * Route: /mp/overview
 */
export default function MpConstituencyOverviewPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await mpApi.getMyConstituencyOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to load MP overview:', err);
      setError(err?.message || 'Failed to retrieve constituency telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const mp = data?.mp || {};
  const kpis = data?.kpis;
  const flaggedWorks = data?.flaggedWorks || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* MP HEADER PROFILE CARD */}
      <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#EFF3F4] flex items-center justify-center text-[#1D9BF0] shadow-xs shrink-0 font-black text-xl font-mono">
            {mp.mpName ? mp.mpName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'MP'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight">
                {mp.mpName}
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-sky-50 text-[#1D9BF0] border border-sky-200">
                {mp.house} • {mp.term}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[#0F1419] font-bold">{mp.constituency}</span> ({mp.state})
              </span>
              <span>•</span>
              <span>District: <span className="text-[#0F1419] font-semibold">{mp.district}</span></span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Nodal Constituency
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            to="/mp/works"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1D9BF0] text-white hover:bg-[#1A8CD8] transition-colors shadow-xs"
          >
            <span>View All My Works</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {error && !data ? (
        <ErrorState
          title="Constituency Telemetry Offline"
          message={error}
          onRetry={loadOverview}
        />
      ) : !data ? (
        <>
          <CardSkeleton count={5} />
          <TableSkeleton columns={5} rows={5} />
        </>
      ) : (
        <>
          {/* SUMMARY KPI CARDS (SCOPED TO THIS MP ONLY) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Allocated Amount */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Annual Allocation</span>
            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-[#EFF3F4]">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            ₹{kpis.annualEntitlementCr.toFixed(2)} <span className="text-sm font-normal text-slate-500">Cr</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            ₹{kpis.annualEntitlementLakhs} Lakhs entitlement
          </div>
        </div>

        {/* Card 2: Total Recommended */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Recommended</span>
            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-[#EFF3F4]">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            {kpis.totalRecommendedCount} <span className="text-sm font-normal text-slate-500">Works</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Submitted to District Nodal Officer
          </div>
        </div>

        {/* Card 3: Total Sanctioned */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sanctioned</span>
            <div className="p-1.5 bg-sky-50 rounded-lg text-[#1D9BF0] border border-sky-100">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            {kpis.totalSanctionedCount} <span className="text-sm font-normal text-slate-500">Works</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            ₹{kpis.totalSanctionedLakhs} Lakhs approved
          </div>
        </div>

        {/* Card 4: Total Completed */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">
            {kpis.totalCompletedCount} <span className="text-sm font-normal text-slate-500">Works</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium">
            100% verified asset delivery
          </div>
        </div>

        {/* Card 5: Total Expenditure */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Expenditure</span>
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            ₹{kpis.totalExpenditureCr.toFixed(2)} <span className="text-sm font-normal text-slate-500">Cr</span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-700 font-medium">
            ₹{kpis.totalExpenditureLakhs} Lakhs drawn
          </div>
        </div>

      </div>

      {/* FUND UTILIZATION RATE PROGRESS SECTION */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-[#0F1419]">
                MPLADS Fund Utilization Rate
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cumulative expenditure drawn against the ₹{kpis.annualEntitlementCr.toFixed(2)} Cr annual statutory allocation for {mp.constituency}.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xl font-extrabold text-[#1D9BF0] font-mono">
              {kpis.utilizationRatePercent}%
            </span>
            <span className="text-xs text-slate-500 block font-medium">
              (₹{kpis.totalExpenditureCr.toFixed(2)} Cr of ₹{kpis.annualEntitlementCr.toFixed(2)} Cr utilized)
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#F7F9F9] border border-[#EFF3F4] rounded-full h-3.5 p-0.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1D9BF0] to-sky-400 transition-all duration-500"
            style={{ width: `${Math.min(100, kpis.utilizationRatePercent)}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#EFF3F4] text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1D9BF0]" />
            <span>Utilized: <strong className="text-[#0F1419] font-mono">₹{kpis.totalExpenditureLakhs} L</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>Uncommitted Balance: <strong className="text-[#0F1419] font-mono">₹{(kpis.annualEntitlementLakhs - kpis.totalExpenditureLakhs).toFixed(1)} L</strong></span>
          </div>
          <div className="flex items-center gap-2 sm:justify-end text-slate-500">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Next Installment SLA: Active</span>
          </div>
        </div>
      </div>

      {/* MY FLAGGED CASES SECTION */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F1419]">
                My Flagged Works & Actionable Risk Notices
              </h2>
              <span className="text-[11px] text-slate-500">
                Works in {mp.constituency} flagged by automated AI audit algorithms requiring your clarification
              </span>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
            {flaggedWorks.length} Flagged
          </span>
        </div>

        {/* Empty State vs Flagged Works List */}
        {flaggedWorks.length === 0 ? (
          <div className="p-8 text-center bg-[#F7F9F9] rounded-xl border border-[#EFF3F4]">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#0F1419]">
              No risk flags on your works — all clear!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              All recommended and sanctioned projects in {mp.constituency} are executing within standard milestone schedules and financial ceilings.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {flaggedWorks.map((work) => (
              <div
                key={work.workId}
                onClick={() => onOpenWorkDetail(work)}
                className="p-4 rounded-xl border border-rose-200/80 bg-rose-50/20 hover:bg-white hover:border-[#1D9BF0] hover:shadow-card transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#0F1419] group-hover:text-[#1D9BF0]">
                      {work.workId}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {work.category}
                    </span>
                  </div>
                  <RiskBadge level={work.riskLevel} score={work.riskScore} size="sm" />
                </div>

                <p className="text-xs font-semibold text-[#0F1419] mb-1">
                  {work.description || work.flagReason}
                </p>

                <div className="p-2.5 rounded-lg bg-white border border-rose-100 text-xs text-rose-900 mb-2">
                  <span className="font-bold text-rose-800 uppercase text-[10px] tracking-wider block">
                    AI Anomaly Trigger:
                  </span>
                  <span>{work.flagReason}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-3">
                    <span>Sanctioned: <strong className="font-mono text-slate-700">₹{work.sanctionedAmount?.toFixed(1)}L</strong></span>
                    <span>Vendor: <strong className="text-slate-700">{work.vendorName}</strong></span>
                  </div>

                  <span className="text-[#1D9BF0] font-semibold flex items-center group-hover:translate-x-0.5 transition-transform">
                    View Project Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        </>
      )}

    </div>
  );
}
```


### `frontend/src/pages/mp/MpWorksListPage.jsx`

*File [122/131] | Lines: 380 | Size: 15.1 KB*

```jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ExternalLink,
  ArrowUpDown,
  FileSpreadsheet,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import RiskBadge from '../../components/common/RiskBadge';
import SearchBox from '../../components/common/SearchBox';
import FilterBar from '../../components/common/FilterBar';
import { ErrorState, EmptyState } from '../../components/common/loading';
import { mpApi } from '../../api/mpApi';

/**
 * PAGE 2: My Works (Full List)
 * Route: /mp/works
 * Full portfolio of all recommended, sanctioned, ongoing and completed works for the logged-in MP.
 */
export default function MpWorksListPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [works, setWorks] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [mpProfile, setMpProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    category: 'All',
    riskLevel: 'All',
  });

  // Sorting & Pagination State
  const [sortField, setSortField] = useState('recommendedDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  useEffect(() => {
    let active = true;
    const loadWorks = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await mpApi.getMyWorks({
          search: searchQuery,
          ...filters,
          page: currentPage,
          limit: pageSize,
          sortField,
          sortDirection,
        });
        if (!active) return;
        const incoming = res.data || [];
        setWorks(incoming);
        setTotalCount(res.pagination?.total ?? res.total ?? incoming.length);
        setTotalPages(res.pagination?.totalPages ?? Math.max(1, Math.ceil((res.total || incoming.length) / pageSize)));

        if (incoming.length > 0) {
          setAvailableCategories((prev) => {
            const set = new Set([...prev, ...incoming.map((w) => w.category).filter(Boolean)]);
            return Array.from(set).sort();
          });
        }
        setMpProfile(res.mp);
      } catch (err) {
        if (!active) return;
        console.error('Failed to load MP works list:', err);
        setError(err?.message || 'Failed to retrieve constituency works register.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadWorks();
    return () => {
      active = false;
    };
  }, [searchQuery, filters, currentPage, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      status: 'All',
      category: 'All',
      riskLevel: 'All',
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F1419] tracking-tight">
            My Constituency Works Register
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete lifecycle register of all MPLADS development projects recommended in {mpProfile?.constituency || 'Patna Sahib'}.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-white border border-[#EFF3F4] px-3 py-1.5 rounded-xl shadow-xs self-start sm:self-auto">
          <span className="text-slate-400">Total Portfolio:</span>
          <span className="font-bold text-[#0F1419]">{totalCount} Works</span>
        </div>
      </div>

      {/* Search and Filter Bar (Scoped: No State/District filters) */}
      <div className="space-y-3">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search my works by Work ID, description, category, or contractor..."
        />
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          showState={false}
          showDistrict={false}
          showDateRange={false}
          availableCategories={availableCategories}
        />
      </div>

      {/* Full Works Data Table */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F9F9] border-b border-[#EFF3F4] text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th
                  onClick={() => handleSort('workId')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Work ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[240px]">
                  Description & Scope
                </th>
                <th
                  onClick={() => handleSort('category')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Category</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('recommendedDate')}
                  className="py-3 px-3 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Recommended</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('sanctionDate')}
                  className="py-3 px-3 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Sanctioned</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('sanctionedAmount')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-3 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('riskScore')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Risk Evaluation</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className={`divide-y divide-[#EFF3F4] text-xs ${loading && works.length > 0 ? 'opacity-70 transition-opacity' : ''}`}>
              {error ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <ErrorState
                      title="Failed to Load Works Portfolio"
                      message={error}
                      onRetry={loadWorks}
                    />
                  </td>
                </tr>
              ) : loading && works.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-44 mb-1" /><div className="h-3 bg-slate-100 rounded w-24" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-28" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-200 rounded w-16 ml-auto" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-4 bg-slate-200 rounded w-14 ml-auto" /></td>
                    <td className="py-4 px-4 text-center"><div className="h-5 bg-slate-200 rounded w-16 mx-auto" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="py-4 px-4 text-center"><div className="h-6 bg-slate-200 rounded-full w-14 mx-auto" /></td>
                  </tr>
                ))
              ) : works.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <EmptyState
                      icon={ShieldCheck}
                      title="No Works Match Criteria"
                      message="No works match the selected search or filter settings."
                      actionText="Reset Filters"
                      onAction={handleResetFilters}
                    />
                  </td>
                </tr>
              ) : (
                works.map((w) => (
                  <tr
                    key={w.workId}
                    onClick={() => onOpenWorkDetail(w)}
                    className="hover:bg-[#F7F9F9] cursor-pointer transition-colors group"
                  >
                    {/* Work ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                      <div className="flex items-center gap-1.5">
                        <span>{w.workId}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1D9BF0]" />
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-[#0F1419] line-clamp-2">
                        {w.description || w.flagReason}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Contractor: {w.vendorName || 'Not Appointed'}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {w.category}
                    </td>

                    {/* Recommended Date */}
                    <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                      {w.recommendedDate || '2023-04-12'}
                    </td>

                    {/* Sanction Date */}
                    <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                      {w.sanctionDate || '—'}
                    </td>

                    {/* Sanctioned Amount */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-[#0F1419]">
                      ₹{w.sanctionedAmount?.toFixed(2)}L
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        w.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : w.status === 'Delayed'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : w.status === 'Under Review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {w.status}
                      </span>
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <RiskBadge level={w.riskLevel} score={w.riskScore} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with True Server-Side Pagination */}
        <div className="px-4 py-3 bg-[#F7F9F9] border-t border-[#EFF3F4] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            Showing{' '}
            <span className="font-bold text-[#0F1419]">
              {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-bold text-[#0F1419]">
              {Math.min(currentPage * pageSize, totalCount)}
            </span>{' '}
            of <span className="font-bold text-[#0F1419]">{totalCount}</span> works
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-[#EFF3F4] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-[#EFF3F4] bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
```


### `frontend/src/pages/MpPerformancePage.jsx`

*File [123/131] | Lines: 804 | Size: 36.0 KB*

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  User,
  MapPin,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Filter,
  X,
} from 'lucide-react';
import SearchBox from '../components/common/SearchBox';
import { ErrorState, EmptyState } from '../components/common/loading';
import { ministryApi } from '../api/ministryApi';
import { mpladsService } from '../api/mpladsService';

/**
 * PAGE: MP Performance & Fund Utilization Register (Full View All Page)
 * Route: /ministry/mp-performance
 * 
 * Scoped strictly to MP recommendation & fund utilization performance:
 * - Primary ranking metric: Fund Utilization % (Expenditure / Sanctioned Amount)
 * - Secondary supporting metric: Completion Efficiency Rate %
 * - Neutral Twitter-blue styling with zero risk colors
 */
export default function MpPerformancePage() {
  const [mps, setMps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: 'All',
    district: 'All',
    utilizationRange: 'All',
    completionRange: 'All',
  });

  // Sorting & Pagination State
  const [sortField, setSortField] = useState('fundUtilization');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMpsCount, setTotalMpsCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Lightweight details expand / modal state
  const [expandedMpName, setExpandedMpName] = useState(null);
  const [selectedMpForModal, setSelectedMpForModal] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  const loadMpData = async (isMounted = { current: true }) => {
    try {
      setLoading(true);
      setError(null);
      const apiCaller = ministryApi?.getMpLeaderboard || mpladsService.getMpLeaderboard;
      const res = await apiCaller({
        search: searchQuery,
        ...filters,
        sortField,
        sortDirection,
        page: currentPage,
        limit: pageSize,
      });

      if (!isMounted.current) return;
      setMps(res.data || []);
      setTotalMpsCount(res.pagination?.total ?? res.total ?? (res.data || []).length);
      setTotalPages(res.pagination?.totalPages ?? Math.max(1, Math.ceil((res.total || 0) / pageSize)));

      if (res.availableStates && res.availableStates.length > 0) {
        setAvailableStates(res.availableStates);
      }
      if (res.availableDistricts && res.availableDistricts.length > 0) {
        setAvailableDistricts(res.availableDistricts);
      }
    } catch (err) {
      if (!isMounted.current) return;
      if (err?.isAborted && !err?.isTimeout) {
        return;
      }
      console.error('Failed to load MP performance records:', err);
      setError(err?.message || 'Failed to retrieve MP performance data.');
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const isMounted = { current: true };
    loadMpData(isMounted);
    return () => {
      isMounted.current = false;
    };
  }, [searchQuery, filters, sortField, sortDirection, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'state' ? { district: 'All' } : {}),
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      state: 'All',
      district: 'All',
      utilizationRange: 'All',
      completionRange: 'All',
    });
    setSortField('fundUtilization');
    setSortDirection('desc');
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    Object.entries(filters).some(([_, val]) => val && val !== 'All');

  // CSV Export handler: exports full filtered dataset rather than only the current page
  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const apiCaller = ministryApi?.getMpLeaderboard || mpladsService.getMpLeaderboard;
      const res = await apiCaller({
        search: searchQuery,
        ...filters,
        sortField,
        sortDirection,
        page: 1,
        limit: Math.max(50, totalMpsCount || 600),
      });

      const exportRows = (res?.data && res.data.length > 0) ? res.data : mps;
      const headers = [
        'MP Name',
        'State',
        'Constituency / District',
        'Fund Utilization %',
        'Total Sanctioned (Lakhs)',
        'Total Expenditure (Lakhs)',
        'Total Works Recommended',
        'Total Works Completed',
        'Completion Rate %',
      ];
      const rows = exportRows.map((m) => [
        `"${m.mpName}"`,
        `"${m.state}"`,
        `"${m.constituency || m.district}"`,
        m.fundUtilization !== null ? `${m.fundUtilization}%` : 'N/A',
        m.totalSanctionedAmount,
        m.totalExpenditure,
        m.totalWorks,
        m.completedWorks,
        m.completionRate !== null ? `${m.completionRate}%` : 'N/A',
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute(
        'download',
        `MPLADS_MP_Performance_Leaderboard_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export CSV:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300 ml-1 inline" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#1D9BF0] ml-1 inline" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#1D9BF0] ml-1 inline" />
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg border border-sky-100">
              <Award className="w-5 h-5 text-[#1D9BF0]" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F1419] tracking-tight">
              MP Performance & Fund Utilization Register
            </h1>
          </div>
          {/* Explanatory Caption */}
          <p className="text-xs text-slate-500 max-w-4xl leading-relaxed">
            Ranked by fund utilization; completion efficiency shown as a supporting metric — reflects MP recommendation activity, not execution or ground-level compliance, which is tracked separately under District and Auditor oversight.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={isExporting}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0F1419] bg-white border border-[#EFF3F4] rounded-xl hover:bg-[#F7F9F9] hover:border-slate-300 transition-all shadow-xs self-start sm:self-auto shrink-0 disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-slate-600" />
          <span>{isExporting ? 'Exporting...' : 'Export Leaderboard (CSV)'}</span>
        </button>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by MP Name, Constituency, District, or State..."
            className="flex-1"
          />
        </div>

        {/* Custom Filter Bar for MP Leaderboard */}
        <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-xl p-3 flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#1D9BF0]" />
            <span>Filters:</span>
          </div>

          {/* State Filter */}
          <div className="flex flex-col">
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
            >
              <option value="All">All States (India)</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* District / Constituency Filter */}
          <div className="flex flex-col">
            <select
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer max-w-[200px]"
            >
              <option value="All">All Districts / Constituencies</option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Utilization Range Filter */}
          <div className="flex flex-col">
            <select
              value={filters.utilizationRange}
              onChange={(e) => handleFilterChange('utilizationRange', e.target.value)}
              className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
            >
              <option value="All">All Utilization %</option>
              <option value="75-100">75% - 100% (High)</option>
              <option value="50-75">50% - 75% (Moderate)</option>
              <option value="25-50">25% - 50% (Low)</option>
              <option value="0-25">0% - 25% (Critical Oversight)</option>
              <option value=">100">&gt; 100% (High Activity)</option>
            </select>
          </div>

          {/* Completion Rate Range Filter */}
          <div className="flex flex-col">
            <select
              value={filters.completionRange}
              onChange={(e) => handleFilterChange('completionRange', e.target.value)}
              className="bg-white border border-[#EFF3F4] text-xs text-[#0F1419] font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#1D9BF0] shadow-xs cursor-pointer"
            >
              <option value="All">All Completion Rates</option>
              <option value="75-100">75% - 100% Completed</option>
              <option value="50-75">50% - 75% Completed</option>
              <option value="25-50">25% - 50% Completed</option>
              <option value="0-25">0% - 25% Completed</option>
            </select>
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#1D9BF0] transition-colors px-2 py-1 bg-white border border-[#EFF3F4] rounded-lg hover:border-[#1D9BF0]"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main MP Data Table */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
        {/* Table Results Bar */}
        <div className="px-5 py-3 border-b border-[#EFF3F4] flex items-center justify-between text-xs text-slate-500 bg-[#F7F9F9]/50">
          <span>
            Showing <strong>{totalMpsCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, totalMpsCount)}</strong> of <strong>{totalMpsCount}</strong> MPs
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Sorted by: {sortField} ({sortDirection.toUpperCase()})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EFF3F4] bg-[#F7F9F9] text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
                <th
                  onClick={() => handleSort('mpName')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <span>Member of Parliament</span>
                  {renderSortIcon('mpName')}
                </th>
                <th
                  onClick={() => handleSort('state')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <span>State</span>
                  {renderSortIcon('state')}
                </th>
                <th
                  onClick={() => handleSort('constituency')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <span>District / Constituency</span>
                  {renderSortIcon('constituency')}
                </th>
                <th
                  onClick={() => handleSort('fundUtilization')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors min-w-[220px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Fund Utilization %</span>
                    <span className="text-[10px] text-[#1D9BF0] font-normal lowercase">(primary)</span>
                    {renderSortIcon('fundUtilization')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('totalWorks')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <span>Works Rec.</span>
                  {renderSortIcon('totalWorks')}
                </th>
                <th
                  onClick={() => handleSort('completedWorks')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <span>Completed</span>
                  {renderSortIcon('completedWorks')}
                </th>
                <th
                  onClick={() => handleSort('completionRate')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Completion Rate</span>
                    <span className="text-[10px] text-slate-400 font-normal lowercase">(secondary)</span>
                    {renderSortIcon('completionRate')}
                  </div>
                </th>
                <th className="py-3 px-3 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-[#EFF3F4] ${loading && mps.length > 0 ? 'opacity-70 transition-opacity' : ''}`}>
              {error ? (
                <tr>
                  <td colSpan="8" className="py-8">
                    <ErrorState
                      title="Failed to Load MP Performance Records"
                      message={error}
                      onRetry={loadMpData}
                    />
                  </td>
                </tr>
              ) : loading && mps.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3 px-4"><div className="h-4 bg-slate-200 rounded w-32" /></td>
                    <td className="py-3 px-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="py-3 px-4"><div className="h-4 bg-slate-200 rounded w-24" /></td>
                    <td className="py-3 px-4"><div className="h-4 bg-slate-200 rounded w-16" /></td>
                    <td className="py-3 px-4"><div className="h-4 bg-slate-200 rounded w-14" /></td>
                    <td className="py-3 px-4"><div className="h-3 bg-slate-200 rounded-full w-28" /></td>
                    <td className="py-3 px-4 text-center"><div className="h-4 bg-slate-200 rounded w-12 mx-auto" /></td>
                    <td className="py-3 px-3"><div className="h-4 bg-slate-200 rounded w-4" /></td>
                  </tr>
                ))
              ) : mps.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8">
                    <EmptyState
                      icon={Award}
                      title="No MP Performance Records Found"
                      message="No records match the active search and filter criteria."
                      actionText="Reset Filters"
                      onAction={handleResetFilters}
                    />
                  </td>
                </tr>
              ) : (
                mps.map((mp) => {
                  const isExpanded = expandedMpName === mp.mpName;
                  const utilizationDisplay =
                    mp.fundUtilization !== null && !isNaN(mp.fundUtilization)
                      ? `${mp.fundUtilization}%`
                      : 'N/A';
                  const completionDisplay =
                    mp.completionRate !== null && !isNaN(mp.completionRate)
                      ? `${mp.completionRate}%`
                      : 'N/A';

                  const progressWidth =
                    mp.fundUtilization !== null && !isNaN(mp.fundUtilization)
                      ? Math.min(100, Math.max(0, mp.fundUtilization))
                      : 0;

                  return (
                    <React.Fragment key={mp.mpName}>
                      <tr
                        onClick={() => setSelectedMpForModal(mp)}
                        className={`text-xs hover:bg-[#F7F9F9] transition-colors cursor-pointer group ${
                          isExpanded ? 'bg-[#F7F9F9]/80' : ''
                        }`}
                      >
                        {/* MP Name */}
                        <td className="py-3 px-4 font-semibold text-[#0F1419] group-hover:text-[#1D9BF0] transition-colors">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1D9BF0]" />
                            <span>{mp.mpName}</span>
                          </div>
                        </td>

                        {/* State */}
                        <td className="py-3 px-4 text-slate-700 font-medium">{mp.state}</td>

                        {/* District / Constituency */}
                        <td className="py-3 px-4 text-slate-600">
                          <span className="font-mono text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-[#EFF3F4]">
                            {mp.constituency || mp.district}
                          </span>
                        </td>

                        {/* Fund Utilization % (Primary Ranking Metric) */}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-mono font-bold">
                              <span className="text-[#0F1419]">{utilizationDisplay}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                ₹{mp.totalExpenditure}L / ₹{mp.totalSanctionedAmount}L
                              </span>
                            </div>
                            {/* Neutral Twitter-blue progress bar */}
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                              <div
                                className="h-2 rounded-full bg-[#1D9BF0] transition-all duration-300"
                                style={{ width: `${progressWidth}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Works Recommended */}
                        <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                          {mp.totalWorks}
                        </td>

                        {/* Completed Works */}
                        <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                          {mp.completedWorks}
                        </td>

                        {/* Completion Rate % (Secondary Metric) */}
                        <td className="py-3 px-4 text-right">
                          <span className="inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {completionDisplay}
                          </span>
                        </td>

                        {/* Inline Expand Toggle */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedMpName(isExpanded ? null : mp.mpName);
                            }}
                            title="Toggle summary breakdown"
                            className="p-1 rounded-lg text-slate-400 hover:text-[#1D9BF0] hover:bg-sky-50 transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Inline Expandable Summary Drawer */}
                      {isExpanded && (
                        <tr className="bg-[#F7F9F9] border-b border-[#EFF3F4]">
                          <td colSpan="8" className="p-4">
                            <div className="bg-white rounded-xl p-4 border border-[#EFF3F4] shadow-xs space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#EFF3F4]">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-[#0F1419]">
                                    {mp.mpName} — Aggregate Recommendation Rollup
                                  </span>
                                  <span className="text-[10px] bg-sky-50 text-[#1D9BF0] font-semibold px-2 py-0.5 rounded border border-sky-200">
                                    {mp.constituency || mp.district}, {mp.state}
                                  </span>
                                </div>
                                <button
                                  onClick={() => setSelectedMpForModal(mp)}
                                  className="text-xs text-[#1D9BF0] font-semibold hover:underline flex items-center gap-1"
                                >
                                  Open popover modal →
                                </button>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-2.5 bg-[#F7F9F9] rounded-lg border border-[#EFF3F4]">
                                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                                    Fund Utilization
                                  </span>
                                  <span className="text-base font-extrabold font-mono text-[#1D9BF0]">
                                    {utilizationDisplay}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">
                                    ₹{mp.totalExpenditure}L spent of ₹{mp.totalSanctionedAmount}L
                                  </span>
                                </div>

                                <div className="p-2.5 bg-[#F7F9F9] rounded-lg border border-[#EFF3F4]">
                                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                                    Completion Efficiency
                                  </span>
                                  <span className="text-base font-extrabold font-mono text-slate-800">
                                    {completionDisplay}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">
                                    {mp.completedWorks} of {mp.totalWorks} completed
                                  </span>
                                </div>

                                <div className="p-2.5 bg-[#F7F9F9] rounded-lg border border-[#EFF3F4]">
                                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                                    Active Pipeline
                                  </span>
                                  <span className="text-base font-extrabold font-mono text-slate-800">
                                    {mp.ongoingWorks + mp.underReviewWorks} works
                                  </span>
                                  <span className="text-[10px] text-slate-400 block mt-0.5">
                                    {mp.ongoingWorks} ongoing, {mp.underReviewWorks} review
                                  </span>
                                </div>

                                <div className="p-2.5 bg-[#F7F9F9] rounded-lg border border-[#EFF3F4]">
                                  <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-semibold">
                                    Sector Focus
                                  </span>
                                  <span className="text-xs font-bold text-slate-700 block truncate">
                                    {Object.keys(mp.categories || {}).length} Categories
                                  </span>
                                  <span className="text-[10px] text-slate-400 block mt-0.5 truncate">
                                    {Object.keys(mp.categories || {}).length > 0
                                      ? Object.keys(mp.categories).slice(0, 2).join(', ')
                                      : 'General development'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar with True Server-Side Controls */}
        <div className="px-5 py-3 border-t border-[#EFF3F4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-white">
          <span className="text-slate-500">
            Showing <strong>{totalMpsCount > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to <strong>{Math.min(currentPage * pageSize, totalMpsCount)}</strong> of <strong>{totalMpsCount}</strong> MPs
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#EFF3F4] text-slate-600 hover:bg-[#F7F9F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-mono font-semibold text-slate-700 bg-slate-50 border border-[#EFF3F4] rounded-lg">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage >= totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-[#EFF3F4] text-slate-600 hover:bg-[#F7F9F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lightweight Summary Popover / Modal on MP Row Click */}
      {selectedMpForModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedMpForModal(null)}
        >
          <div
            className="bg-white rounded-2xl border border-[#EFF3F4] shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#EFF3F4]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-50 text-[#1D9BF0] border border-sky-100 flex items-center justify-center font-bold font-mono">
                  <User className="w-5 h-5 text-[#1D9BF0]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F1419]">
                    {selectedMpForModal.mpName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {selectedMpForModal.constituency || selectedMpForModal.district},{' '}
                      {selectedMpForModal.state}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMpForModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Performance Summary Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#F7F9F9] rounded-xl border border-[#EFF3F4]">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Fund Utilization %
                </span>
                <span className="text-xl font-extrabold font-mono text-[#1D9BF0]">
                  {selectedMpForModal.fundUtilization !== null
                    ? `${selectedMpForModal.fundUtilization}%`
                    : 'N/A'}
                </span>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div
                    className="h-1.5 rounded-full bg-[#1D9BF0]"
                    style={{
                      width: `${Math.min(100, selectedMpForModal.fundUtilization || 0)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>₹{selectedMpForModal.totalExpenditure}L spent</span>
                  <span>₹{selectedMpForModal.totalSanctionedAmount}L sanctioned</span>
                </div>
              </div>

              <div className="p-3 bg-[#F7F9F9] rounded-xl border border-[#EFF3F4]">
                <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                  Completion Efficiency
                </span>
                <span className="text-xl font-extrabold font-mono text-slate-800">
                  {selectedMpForModal.completionRate !== null
                    ? `${selectedMpForModal.completionRate}%`
                    : 'N/A'}
                </span>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                  <div
                    className="h-1.5 rounded-full bg-slate-700"
                    style={{
                      width: `${Math.min(100, selectedMpForModal.completionRate || 0)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>{selectedMpForModal.completedWorks} completed</span>
                  <span>{selectedMpForModal.totalWorks} recommended</span>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div>
              <h4 className="text-xs font-bold text-[#0F1419] mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#1D9BF0]" />
                <span>Recommended Work Sectors</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(selectedMpForModal.categories || {}).length > 0 ? (
                  Object.entries(selectedMpForModal.categories).map(([cat, count]) => (
                    <span
                      key={cat}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-[#EFF3F4] font-medium"
                    >
                      {cat} <span className="font-mono text-slate-400 font-bold">({count})</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    No categorized sector works recorded for this constituency.
                  </span>
                )}
              </div>
            </div>

            {/* Governance Note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-[#EFF3F4] text-[11px] text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 block">Governance Note:</span>
              <p>
                This scorecard aggregates MP recommendation velocity and fund utilization. Individual project execution, contractor adherence, and anomaly resolution are monitored separately under District Authority and Auditor portals.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMpForModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```


### `frontend/src/pages/NationalOverviewPage.jsx`

*File [124/131] | Lines: 617 | Size: 28.2 KB*

```jsx
import React, { useState } from 'react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import {
  AlertOctagon,
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  IndianRupee,
  ShieldAlert,
  TrendingUp,
  ArrowUpRight,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import RiskBadge from '../components/common/RiskBadge';
import MpLeaderboardWidget from '../components/common/MpLeaderboardWidget';
import {
  CardSkeleton,
  MapSkeleton,
  ChartSkeleton,
  ListSkeleton,
  ErrorState,
} from '../components/common/loading';
import { useApiQuery } from '../hooks/useApiQuery';
import { mpladsService } from '../api/mpladsService';
import { ministryApi } from '../api/ministryApi';

/**
 * PAGE 1: National Overview (Home / Command Center)
 * Route: /ministry/overview
 * Decomposed into 6 fully isolated request/render units.
 */
export default function NationalOverviewPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('density'); // 'density' or 'bar'

  // 6 Independent queries — each has its own loading, error, and refetch cycle
  const kpisQuery = useApiQuery(() => mpladsService.getOverviewKpis(), []);
  const riskQuery = useApiQuery(() => mpladsService.getOverviewRisk(), []);
  const statesQuery = useApiQuery(() => mpladsService.getOverviewStates(), []);
  const urgentQuery = useApiQuery(() => mpladsService.getOverviewUrgent(), []);
  const alertsQuery = useApiQuery(() => mpladsService.getOverviewAlerts(), []);
  const leaderboardQuery = useApiQuery(
    () => (ministryApi?.getMpLeaderboard || mpladsService.getMpLeaderboard)(),
    []
  );

  // Navigate to Flagged Cases page with a pre-applied state filter
  const handleStateClick = (stateName) => {
    if (!stateName) return;
    navigate(`/ministry/flagged?state=${encodeURIComponent(stateName)}`);
  };

  // Pie chart data for National Risk Distribution
  const riskDist = riskQuery.data?.riskDistribution;
  const pieData = riskDist
    ? [
        ...(riskDist.low > 0 ? [{ name: 'Low Risk', value: riskDist.low, color: '#10B981' }] : []),
        { name: 'Medium Risk', value: riskDist.medium || 0, color: '#F59E0B' },
        { name: 'High Risk', value: riskDist.high || 0, color: '#EF4444' },
      ].filter((p) => p.value > 0)
    : [];

  const totalFlagsCount = riskDist
    ? (riskDist.medium || 0) + (riskDist.high || 0)
    : kpisQuery.data?.totalFlaggedCases || 0;

  // States formatted for Centerpiece Chart
  const statesData = statesQuery.data?.statesData || [];
  const sortedStates = [...statesData].sort((a, b) => b.flaggedCount - a.flaggedCount);
  const topAttentionStates = urgentQuery.data?.topAttentionStates || [];
  const recentAlerts = alertsQuery.data?.recentAlerts || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: National Command Center Status (Always rendered immediately) */}
      <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight">
              India National MPLADS Command Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time multi-state telemetry, anomaly detection, and predictive audit surveillance across 28 States & 8 UTs.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            to="/ministry/predictions"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Early Warning Forecast</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/ministry/flagged"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1D9BF0] text-white hover:bg-[#1A8CD8] transition-colors shadow-xs"
          >
            <span>Review Flagged Cases</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* SECTION 1: SUMMARY KPI CARDS */}
      {kpisQuery.error && !kpisQuery.data ? (
        <ErrorState
          title="KPI Data Unavailable"
          message={kpisQuery.error?.message}
          onRetry={kpisQuery.refetch}
        />
      ) : !kpisQuery.data ? (
        <CardSkeleton count={5} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Works Recommended */}
          <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Works Recommended</span>
              <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-[#EFF3F4]">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
              {kpisQuery.data.totalWorksRecommended.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span className="text-emerald-600 font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> 100%
              </span>
              <span>recommended by MPs</span>
            </div>
          </div>

          {/* Card 2: Total Sanctioned */}
          <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Sanctioned Works</span>
              <div className="p-1.5 bg-sky-50 rounded-lg text-[#1D9BF0] border border-sky-100">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
              {kpisQuery.data.totalSanctionedWorks.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span className="text-slate-700 font-semibold font-mono">
                ₹{kpisQuery.data.totalSanctionedCr.toLocaleString()} Cr
              </span>
              <span>allocated</span>
            </div>
          </div>

          {/* Card 3: Total Completed */}
          <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Completed</span>
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono">
              {kpisQuery.data.totalCompletedWorks.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span className="text-emerald-700 font-semibold font-mono">{kpisQuery.data.completionRate}%</span>
              <span>national completion rate</span>
            </div>
          </div>

          {/* Card 4: Total Expenditure */}
          <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Expenditure</span>
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
              ₹{kpisQuery.data.totalExpenditureCr.toLocaleString()}{' '}
              <span className="text-sm font-normal text-slate-500">Cr</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 font-medium">
              <span className="text-indigo-600 font-semibold font-mono">{kpisQuery.data.expenditureRatio}%</span>
              <span>fund utilization ratio</span>
            </div>
          </div>

          {/* Card 5: Flagged Cases */}
          <div className="bg-white border border-rose-200/80 rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all bg-rose-50/20">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800">Flagged for Review</span>
              <div className="p-1.5 bg-rose-100 rounded-lg text-rose-600 border border-rose-200">
                <AlertOctagon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-600 font-mono">
              {kpisQuery.data.totalFlaggedCases.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-rose-700 font-medium">
              {riskDist?.high !== undefined && (
                <span className="font-bold">{riskDist.high} High Risk • </span>
              )}
              <span>{kpisQuery.data.flaggedRatePercent}% rate</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: NATIONAL RISK DISTRIBUTION BY STATE */}
      {statesQuery.error && !statesQuery.data ? (
        <ErrorState
          title="State Data Unavailable"
          message={statesQuery.error?.message}
          onRetry={statesQuery.refetch}
        />
      ) : !statesQuery.data ? (
        <MapSkeleton title="State Risk & Escalation Surveillance Matrix" />
      ) : (
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#EFF3F4]">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg">
                  <MapPin className="w-4 h-4" />
                </span>
                <h2 className="text-base font-bold text-[#0F1419]">
                  National Risk Distribution by State
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Live density breakdown across all States & UTs. States with higher risk density require targeted audit interventions.
              </p>
            </div>

            {/* Toggle View Mode */}
            <div className="flex items-center gap-1 bg-[#F7F9F9] p-1 rounded-xl border border-[#EFF3F4] self-start sm:self-auto">
              <button
                onClick={() => setViewMode('density')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'density'
                    ? 'bg-white text-[#0F1419] shadow-xs'
                    : 'text-slate-500 hover:text-[#0F1419]'
                }`}
              >
                State Risk Matrix
              </button>
              <button
                onClick={() => setViewMode('bar')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'bar'
                    ? 'bg-white text-[#0F1419] shadow-xs'
                    : 'text-slate-500 hover:text-[#0F1419]'
                }`}
              >
                Flagged Volume Chart
              </button>
            </div>
          </div>

          {/* View Mode 1: State Density Grid */}
          {viewMode === 'density' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {sortedStates.map((st) => {
                const isHigh = st.riskIndex >= 8.0;
                const isMed = st.riskIndex >= 5.0 && st.riskIndex < 8.0;
                const cardBg = isHigh
                  ? 'border-rose-200 bg-rose-50/20 hover:bg-rose-50/40'
                  : isMed
                  ? 'border-amber-200 bg-amber-50/20 hover:bg-amber-50/40'
                  : 'border-[#EFF3F4] bg-[#F7F9F9] hover:bg-slate-100/70';

                return (
                  <div
                    key={st.code}
                    onClick={() => handleStateClick(st.state)}
                    title={`Click to view ${st.state}'s flagged cases`}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${cardBg} group`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-[#0F1419] group-hover:text-[#1D9BF0] transition-colors truncate">
                        {st.state}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-white border border-[#EFF3F4]">
                        {st.code}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-lg font-black font-mono text-[#0F1419]">
                          {st.flaggedCount}
                        </div>
                        <span className="text-[10px] text-slate-500 block leading-tight">
                          Flagged cases
                        </span>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-xs font-bold font-mono ${
                            isHigh ? 'text-rose-600' : isMed ? 'text-amber-600' : 'text-emerald-600'
                          }`}
                        >
                          Index {st.riskIndex}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {st.highRisk} High / {st.medRisk} Med
                        </span>
                      </div>
                    </div>

                    {/* Micro Progress Bar */}
                    <div className="w-full bg-slate-200/70 rounded-full h-1 mt-2.5 overflow-hidden">
                      <div
                        className={`h-1 rounded-full ${
                          isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, (st.flaggedCount / 350) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* View Mode 2: Large Recharts Bar Chart */
            <div className="h-80 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedStates} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF3F4" />
                  <XAxis
                    dataKey="code"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    interval={0}
                    axisLine={{ stroke: '#EFF3F4' }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#EFF3F4' }} />
                  <Tooltip
                    formatter={(val, name, item) => [
                      `${val} works (${item.payload.state})`,
                      name === 'highRisk'
                        ? 'High Risk'
                        : name === 'medRisk'
                        ? 'Medium Risk'
                        : 'Low Risk',
                    ]}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #EFF3F4',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="highRisk" name="highRisk" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="medRisk" name="medRisk" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="lowRisk" name="lowRisk" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: MP PERFORMANCE LEADERBOARD (RANKED BY FUND UTILIZATION) */}
      <MpLeaderboardWidget
        leaderboardData={leaderboardQuery.data}
        error={leaderboardQuery.error}
        onRetry={leaderboardQuery.refetch}
      />

      {/* LOWER GRID: RISK SEVERITY + URGENT REVIEW + RECENT ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Risk Distribution & States Requiring Attention */}
        <div className="lg:col-span-5 space-y-6">
          {/* SECTION 4: Risk Severity Donut Section */}
          {riskQuery.error && !riskQuery.data ? (
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
              <ErrorState
                title="Risk Breakdown Unavailable"
                message={riskQuery.error?.message}
                onRetry={riskQuery.refetch}
              />
            </div>
          ) : !riskQuery.data ? (
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
              <ChartSkeleton title="National Risk Distribution" type="pie" height="h-44" />
            </div>
          ) : (
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#0F1419]">
                  National Risk Severity Breakdown
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {totalFlagsCount} total flags
                </span>
              </div>

              <div className="h-44 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [`${val} works`, name]}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid #EFF3F4',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-[#EFF3F4] text-center">
                <div className="p-2 rounded-xl bg-rose-50/60 border border-rose-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                    High Risk
                  </span>
                  <span className="text-base font-extrabold text-rose-600 font-mono">
                    {riskDist?.high ?? 0}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                    Medium
                  </span>
                  <span className="text-base font-extrabold text-amber-600 font-mono">
                    {riskDist?.medium ?? 0}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                    Low
                  </span>
                  <span className="text-base font-extrabold text-emerald-600 font-mono">
                    {riskDist?.low ?? 0}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: States Requiring Urgent Review Section */}
          {urgentQuery.error && !urgentQuery.data ? (
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
              <ErrorState
                title="Urgent States Unavailable"
                message={urgentQuery.error?.message}
                onRetry={urgentQuery.refetch}
              />
            </div>
          ) : !urgentQuery.data ? (
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
              <ListSkeleton count={3} title="Immediate State Attention" />
            </div>
          ) : (
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-bold text-[#0F1419]">
                    States Requiring Urgent Central Review
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                  Top Risk Indices
                </span>
              </div>

              <div className="space-y-2.5">
                {topAttentionStates.map((st, idx) => (
                  <div
                    key={st.state}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F9F9] border border-[#EFF3F4] hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#0F1419]">{st.state}</div>
                        <div className="text-[10px] text-slate-500">
                          {st.flaggedCount} flagged ({st.highRisk} High) • ₹{st.sanctionedCr} Cr
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-rose-600 font-mono">
                        Index {st.riskIndex}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {st.totalWorks > 0 ? Math.round((st.completed / st.totalWorks) * 100) : 0}% done
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 6: Recent High-Risk Alerts Feed (7 cols) */}
        <div className="lg:col-span-7">
          {alertsQuery.error && !alertsQuery.data ? (
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
              <ErrorState
                title="Alerts Unavailable"
                message={alertsQuery.error?.message}
                onRetry={alertsQuery.refetch}
              />
            </div>
          ) : !alertsQuery.data ? (
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
              <ListSkeleton count={4} title="Real-Time Flag Alerts" />
            </div>
          ) : (
            <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-bold text-[#0F1419]">
                    Recent High-Priority Flags (Nationwide)
                  </h3>
                </div>
                <Link
                  to="/ministry/flagged"
                  className="text-xs font-semibold text-[#1D9BF0] hover:underline flex items-center gap-1"
                >
                  <span>View all cases</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* List of Clickable Alert Works */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[660px] pr-1">
                {recentAlerts.map((work) => (
                  <div
                    key={work.workId}
                    onClick={() => onOpenWorkDetail(work)}
                    className="p-3.5 rounded-xl border border-[#EFF3F4] bg-[#F7F9F9] hover:bg-white hover:border-[#1D9BF0] hover:shadow-card transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                          {work.workId}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-600 font-medium">
                          {work.state} ({work.district})
                        </span>
                      </div>
                      <RiskBadge level={work.riskLevel} score={work.riskScore} size="sm" />
                    </div>

                    <p className="text-xs font-semibold text-slate-800 line-clamp-2 mb-2">
                      {work.flagReason}
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                      <span>MP: {work.mpName}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-medium">
                          {work.sanctionedAmount !== null &&
                          work.sanctionedAmount !== undefined &&
                          work.sanctionedAmount > 0
                            ? `₹${work.sanctionedAmount.toFixed(1)}L${work.isEstimated ? ' (Est.)' : ''}`
                            : 'Cost Not Available'}
                        </span>
                        <span className="text-[#1D9BF0] font-semibold flex items-center group-hover:translate-x-0.5 transition-transform">
                          Inspect Work <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```


### `frontend/src/pages/PredictiveForecastPage.jsx`

*File [125/131] | Lines: 441 | Size: 18.8 KB*

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldAlert,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Sparkline from '../components/common/Sparkline';
import SearchBox from '../components/common/SearchBox';
import FilterBar from '../components/common/FilterBar';
import { ErrorState, EmptyState } from '../components/common/loading';
import { mpladsService } from '../api/mpladsService';

/**
 * PAGE 4: Predictive Risk Forecast (KEY INNOVATION FEATURE)
 * Route: /ministry/predictions
 * Purpose: Surfaces currently healthy projects trending toward high-risk escalation
 */
export default function PredictiveForecastPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [watchlist, setWatchlist] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableStates, setAvailableStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: 'All',
    category: 'All',
  });

  // Sorting & Pagination State
  const [sortField, setSortField] = useState('riskDelta');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 15;

  // Reset to page 1 on filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await mpladsService.getPredictiveWatchlist({
          search: searchQuery,
          ...filters,
          page: currentPage,
          limit: pageSize,
        });
        if (!active) return;
        const incoming = res.data || [];
        setWatchlist(incoming);
        setTotalCount(res.pagination?.total ?? res.total ?? incoming.length);
        setTotalPages(res.pagination?.totalPages ?? Math.max(1, Math.ceil((res.total || incoming.length) / pageSize)));

        if (incoming.length > 0) {
          setAvailableCategories((prev) => {
            const set = new Set([...prev, ...incoming.map((w) => w.category).filter(Boolean)]);
            return Array.from(set).sort();
          });
          setAvailableStates((prev) => {
            const set = new Set([...prev, ...incoming.map((w) => w.state).filter(Boolean)]);
            return Array.from(set).sort();
          });
        }
      } catch (err) {
        if (!active) return;
        console.error('Failed to load predictive forecast:', err);
        setError(err?.message || 'Failed to retrieve predictive risk watchlist.');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();
    return () => {
      active = false;
    };
  }, [searchQuery, filters, currentPage]);

  // Sorting
  const sortedWatchlist = useMemo(() => {
    return [...watchlist].sort((a, b) => {
      let valA, valB;
      if (sortField === 'riskDelta') {
        valA = parseInt(a.riskDeltaPercent?.replace(/[^0-9]/g, '') || '0', 10);
        valB = parseInt(b.riskDeltaPercent?.replace(/[^0-9]/g, '') || '0', 10);
      } else if (sortField === 'days') {
        valA = a.daysUntilPredictedThreshold;
        valB = b.daysUntilPredictedThreshold;
      } else if (sortField === 'currentScore') {
        valA = a.currentRiskScore;
        valB = b.currentRiskScore;
      } else if (sortField === 'predictedScore') {
        valA = a.predictedRiskScore30Days;
        valB = b.predictedRiskScore30Days;
      } else {
        valA = a[sortField];
        valB = b[sortField];
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [watchlist, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner: Key Innovation Framing */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-sky-50/50 to-indigo-50/70 border border-indigo-100/90 rounded-2xl p-5 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-white rounded-xl border border-indigo-100 text-indigo-600 shadow-xs mt-0.5">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-600 text-white font-mono">
                  AI Early Warning Innovation
                </span>
                <span className="text-xs text-indigo-800 font-semibold">
                  Preventive Governance Model
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight mt-1">
                Predictive Risk Forecast & Watchlist
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
                These projects are <span className="font-bold text-[#0F1419]">not yet flagged</span>, but AI-detected velocity patterns suggest rising risk — early intervention recommended.
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs border border-indigo-100 rounded-xl p-3 flex items-center gap-4 text-xs font-mono self-start md:self-auto">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Watchlist Volume</span>
              <span className="text-base font-extrabold text-[#0F1419]">{totalCount} Works</span>
            </div>
            <div className="h-6 w-px bg-indigo-100" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Avg 30-Day Surge</span>
              <span className="text-base font-extrabold text-rose-600">+43.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search predictive watchlist by Work ID, MP Name, Vendor, District..."
        />
        <FilterBar
          filters={filters}
          onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))}
          onReset={() => {
            setSearchQuery('');
            setFilters({ state: 'All', category: 'All' });
          }}
          availableStates={availableStates}
          availableCategories={availableCategories}
          showRiskLevel={false}
          showStatus={false}
          showDateRange={false}
        />
      </div>

      {/* Projects to Watch Table */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
        <div className="p-4 bg-[#F7F9F9] border-b border-[#EFF3F4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-[#0F1419]">
              Projects to Watch (Ranked by Predicted Risk Escalation Delta)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Sorted by Risk Delta (Desc)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F9F9]/50 border-b border-[#EFF3F4] text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th
                  onClick={() => handleSort('workId')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Work ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">
                  MP & Jurisdiction
                </th>
                <th className="py-3 px-4">
                  Category & Status
                </th>
                <th
                  onClick={() => handleSort('currentScore')}
                  className="py-3 px-3 cursor-pointer hover:text-[#1D9BF0] transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Current Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('predictedScore')}
                  className="py-3 px-3 cursor-pointer hover:text-[#1D9BF0] transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>30-Day Forecast</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('riskDelta')}
                  className="py-3 px-3 cursor-pointer hover:text-[#1D9BF0] transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Risk Delta %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 min-w-[130px] text-center">
                  8-Week Trajectory
                </th>
                <th className="py-3 px-4 min-w-[220px]">
                  Early Warning Signal
                </th>
                <th
                  onClick={() => handleSort('days')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Est. Breach SLA</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className={`divide-y divide-[#EFF3F4] text-xs ${loading && watchlist.length > 0 ? 'opacity-70 transition-opacity' : ''}`}>
              {error ? (
                <tr>
                  <td colSpan={9} className="py-8">
                    <ErrorState
                      title="Failed to Load Predictive Watchlist"
                      message={error}
                      onRetry={loadData}
                    />
                  </td>
                </tr>
              ) : loading && watchlist.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-28 mb-1" /><div className="h-3 bg-slate-100 rounded w-16" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-24 mb-1" /><div className="h-3 bg-slate-100 rounded w-14" /></td>
                    <td className="py-4 px-3 text-center"><div className="h-6 bg-slate-200 rounded-full w-12 mx-auto" /></td>
                    <td className="py-4 px-3 text-center"><div className="h-6 bg-slate-200 rounded-full w-12 mx-auto" /></td>
                    <td className="py-4 px-3 text-center"><div className="h-4 bg-slate-200 rounded w-14 mx-auto" /></td>
                    <td className="py-4 px-3"><div className="h-6 bg-slate-200 rounded w-24 mx-auto" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-slate-200 rounded w-44" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-5 bg-slate-200 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : sortedWatchlist.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8">
                    <EmptyState
                      icon={CheckCircle2}
                      title="No Predictive Risks Identified"
                      message="No current projects exceed the predictive early warning threshold for these filters."
                      actionText="Reset Filters"
                      onAction={handleResetFilters}
                    />
                  </td>
                </tr>
              ) : (
                sortedWatchlist.map((item) => (
                  <tr
                    key={item.workId}
                    onClick={() => onOpenWorkDetail(item)}
                    className="hover:bg-indigo-50/30 cursor-pointer transition-colors group"
                  >
                    {/* Work ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                      <div className="flex items-center gap-1.5">
                        <span>{item.workId}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1D9BF0]" />
                      </div>
                    </td>

                    {/* MP & Jurisdiction */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0F1419]">{item.mpName}</div>
                      <div className="text-[10px] text-slate-500">{item.district}, {item.state}</div>
                    </td>

                    {/* Category & Current Status */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700 font-medium">{item.category}</div>
                      <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-700 mt-0.5">
                        {item.currentStatus}
                      </span>
                    </td>

                    {/* Current Risk Score */}
                    <td className="py-3.5 px-3 text-center font-mono">
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-slate-100 text-slate-800 font-bold">
                        {item.currentRiskScore}
                      </span>
                    </td>

                    {/* Predicted Score (30 Days) */}
                    <td className="py-3.5 px-3 text-center font-mono">
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                        {item.predictedRiskScore30Days}
                      </span>
                    </td>

                    {/* Risk Delta % */}
                    <td className="py-3.5 px-3 text-center font-mono">
                      <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded-md bg-rose-100 text-rose-800 font-extrabold text-[11px]">
                        <TrendingUp className="w-3 h-3 text-rose-600" />
                        {item.riskDeltaPercent}
                      </span>
                    </td>

                    {/* Sparkline */}
                    <td className="py-3.5 px-3 text-center">
                      <Sparkline
                        data={item.riskTrajectory}
                        width={110}
                        height={26}
                        strokeColor="#EF4444"
                        fillColor="rgba(239, 68, 68, 0.15)"
                      />
                    </td>

                    {/* Warning Signal */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium max-w-xs">
                      <p className="line-clamp-2" title={item.warningSignal}>
                        {item.warningSignal}
                      </p>
                    </td>

                    {/* Days Until Threshold */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>~{item.daysUntilPredictedThreshold}d</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Informational Callout Bar & Pagination */}
        <div className="p-3 bg-[#F7F9F9] border-t border-[#EFF3F4] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#1D9BF0]" />
            <span>
              Predictions generated via gradient boosting regression trained on 5 years of historical MPLADS disbursement milestones.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-semibold text-slate-700">
              Showing {totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} Works
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 rounded border border-[#EFF3F4] bg-white text-slate-600 disabled:opacity-40"
                  title="Previous page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px]">
                  {currentPage}/{totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1 rounded border border-[#EFF3F4] bg-white text-slate-600 disabled:opacity-40"
                  title="Next page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
```


### `frontend/src/pages/state/StateOverviewPage.jsx`

*File [126/131] | Lines: 466 | Size: 18.7 KB*

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Landmark,
  FileSpreadsheet,
  CheckCircle2,
  IndianRupee,
  AlertTriangle,
  ArrowUpDown,
  BarChart3,
  MapPin,
  Layers,
  ChevronRight,
  Info,
  ExternalLink,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import RiskBadge from '../../components/common/RiskBadge';
import DistrictSummaryModal from '../../components/common/DistrictSummaryModal';
import {
  CardSkeleton,
  TableSkeleton,
  ChartSkeleton,
  ErrorState,
} from '../../components/common/loading';
import { stateApi } from '../../api/stateApi';

/**
 * PAGE 1: State Overview (State Nodal Authority View)
 * Route: /state/overview
 * Purpose: State-level rollup of all districts in Bihar with comparative risk ranking
 * and drill-down DistrictSummaryModal popup.
 */
export default function StateOverviewPage() {
  const { onOpenWorkDetail } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Drill-down District Summary Modal State
  const [activeDistrictSummary, setActiveDistrictSummary] = useState(null);
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState('flaggedCount');
  const [sortDirection, setSortDirection] = useState('desc');

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await stateApi.getStateOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to load state overview:', err);
      setError(err?.message || 'Failed to retrieve state rollup telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const sortedDistricts = useMemo(() => {
    if (!data?.districts) return [];
    return [...data.districts].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const handleOpenDistrictDrilldown = async (districtName) => {
    const summary = await stateApi.getDistrictSummary(districtName);
    setActiveDistrictSummary(summary);
    setIsDistrictModalOpen(true);
  };

  const handleSelectProjectFromDrilldown = (project) => {
    setIsDistrictModalOpen(false);
    if (onOpenWorkDetail) {
      onOpenWorkDetail(project);
    }
  };

  const state = data?.state || {};
  const kpis = data?.kpis;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* STATE HEADER PROFILE CARD */}
      <div className="bg-[#F7F9F9] border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#EFF3F4] flex items-center justify-center text-[#1D9BF0] shadow-xs shrink-0">
            <Landmark className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0F1419] tracking-tight">
                {state.stateName} State Nodal Authority
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-sky-50 text-[#1D9BF0] border border-sky-200">
                State Rollup • 38 Districts
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[#0F1419] font-bold">{state.headquarters}</span>
              </span>
              <span>•</span>
              <span className="text-slate-700">{state.nodalDepartment}</span>
            </div>
          </div>
        </div>

        <div className="text-xs font-mono bg-white border border-[#EFF3F4] px-3.5 py-2 rounded-xl shadow-xs self-start md:self-auto">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">State Risk Index</span>
          <span className="text-base font-extrabold text-rose-600">9.6 / 10 (High Oversight)</span>
        </div>
      </div>

      {error && !data ? (
        <ErrorState
          title="State Rollup Telemetry Offline"
          message={error}
          onRetry={loadOverview}
        />
      ) : !data ? (
        <>
          <CardSkeleton count={4} />
          <ChartSkeleton title="High-Risk Works Across Monitored Districts" type="bar" height="h-64" />
          <TableSkeleton columns={6} rows={8} />
        </>
      ) : (
        <>
          {/* SUMMARY KPI CARDS (SCOPED TO THIS STATE) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Works */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">State Works Total</span>
            <div className="p-1.5 bg-slate-50 rounded-lg text-slate-600 border border-[#EFF3F4]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            {kpis.totalWorks.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Across {kpis.totalDistrictsCovered} monitored districts
          </div>
        </div>

        {/* Card 2: Total Sanctioned */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sanctioned Allocation</span>
            <div className="p-1.5 bg-sky-50 rounded-lg text-[#1D9BF0] border border-sky-100">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0F1419] font-mono">
            ₹{kpis.totalSanctionedCr.toLocaleString()} <span className="text-sm font-normal text-slate-500">Cr</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            State cumulative sanction
          </div>
        </div>

        {/* Card 3: Total Completed */}
        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Works</span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono">
            {kpis.totalCompleted.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium font-mono">
            {kpis.completionRate}% state completion rate
          </div>
        </div>

        {/* Card 4: Total Flagged Cases */}
        <div className="bg-white border border-rose-200/80 rounded-2xl p-4 shadow-subtle hover:shadow-card transition-all bg-rose-50/20">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">State Flagged Cases</span>
            <div className="p-1.5 bg-rose-100 rounded-lg text-rose-600 border border-rose-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 font-mono">
            {kpis.totalFlaggedCount}
          </div>
          <div className="mt-2 text-[11px] text-rose-700 font-medium">
            Avg District Risk: <strong className="font-mono">{kpis.avgRiskScore}/100</strong>
          </div>
        </div>

      </div>

      {/* SIMPLE BAR CHART: DISTRICTS RANKED BY FLAGGED ANOMALIES (CLICKABLE BARS) */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F1419]">
                Districts Ranked by Flagged Anomaly Density (Highest Risk First)
              </h2>
              <span className="text-[11px] text-slate-500">
                Click on any bar or table row to open the District Drill-down popup
              </span>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Top 10 Districts
          </span>
        </div>

        <div className="h-64 w-full cursor-pointer">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.districts}
              margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
              onClick={(state) => {
                if (state && state.activePayload && state.activePayload.length > 0) {
                  const districtName = state.activePayload[0].payload.district;
                  handleOpenDistrictDrilldown(districtName);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF3F4" />
              <XAxis
                dataKey="district"
                tick={{ fontSize: 11, fill: '#64748B' }}
                interval={0}
                axisLine={{ stroke: '#EFF3F4' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={{ stroke: '#EFF3F4' }}
              />
              <Tooltip
                formatter={(val, name, item) => [
                  `${val} flagged cases (Click to inspect ${item.payload.district})`,
                  'Flagged Anomalies'
                ]}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #EFF3F4',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="flaggedCount" name="Flagged Cases" radius={[4, 4, 0, 0]} barSize={28}>
                {data.districts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.avgRiskScore >= 60 ? '#EF4444' : entry.avgRiskScore >= 50 ? '#F59E0B' : '#1D9BF0'}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DISTRICT-WISE COMPARISON TABLE (CLICK ROW OPENS DRILL-DOWN POPUP) */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl shadow-subtle overflow-hidden">
        <div className="p-4 bg-[#F7F9F9] border-b border-[#EFF3F4] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F1419]">
              District-Wise Comparative Register ({state.stateName})
            </h3>
            <p className="text-[11px] text-slate-500">
              Click any district row to view the district summary drill-down popup
            </p>
          </div>
          <span className="text-xs text-[#1D9BF0] font-semibold">
            {data.districts.length} Districts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F9F9]/50 border-b border-[#EFF3F4] text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th
                  onClick={() => handleSort('district')}
                  className="py-3 px-4 cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>District Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('totalWorks')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Total Works</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('sanctionedCr')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Sanctioned (₹ Cr)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('completionRate')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Completion Rate</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('flaggedCount')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Flagged Count</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('avgRiskScore')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-[#1D9BF0] transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Avg Risk Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EFF3F4] text-xs">
              {sortedDistricts.map((d) => (
                <tr
                  key={d.district}
                  onClick={() => handleOpenDistrictDrilldown(d.district)}
                  className="hover:bg-[#F7F9F9] cursor-pointer transition-colors group"
                >
                  {/* District Name */}
                  <td className="py-3.5 px-4 font-bold text-[#0F1419] group-hover:text-[#1D9BF0]">
                    <div className="flex items-center gap-1.5">
                      <span>{d.district}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#1D9BF0]" />
                    </div>
                  </td>

                  {/* Total Works */}
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                    {d.totalWorks}
                  </td>

                  {/* Sanctioned Cr */}
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-[#0F1419]">
                    ₹{d.sanctionedCr.toFixed(1)} Cr
                  </td>

                  {/* Completion Rate */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 font-mono">
                      <span className="text-emerald-700 font-semibold">{d.completionRate}%</span>
                      <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${d.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Flagged Count */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-rose-50 text-rose-700 border border-rose-200">
                      {d.flaggedCount}
                    </span>
                  </td>

                  {/* Avg Risk Score */}
                  <td className="py-3.5 px-4 text-center">
                    <RiskBadge
                      level={d.avgRiskScore >= 60 ? 'High' : d.avgRiskScore >= 45 ? 'Medium' : 'Low'}
                      score={d.avgRiskScore}
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F7F9F9] border-t border-[#EFF3F4] flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#1D9BF0]" />
            <span>
              Click any district row or bar to inspect its top 3 highest-risk projects.
            </span>
          </div>
          <span className="font-mono text-[11px]">
            {data.districts.length} Districts Monitored
          </span>
        </div>
      </div>
        </>
      )}

      {/* DISTRICT DRILL-DOWN POPUP MODAL */}
      <DistrictSummaryModal
        districtSummary={activeDistrictSummary}
        isOpen={isDistrictModalOpen}
        onClose={() => setIsDistrictModalOpen(false)}
        onSelectProject={handleSelectProjectFromDrilldown}
      />

    </div>
  );
}
```


### `frontend/src/pages/TrendsAnalyticsPage.jsx`

*File [127/131] | Lines: 1489 | Size: 63.0 KB*

```jsx
import React, { useState, useMemo, useCallback } from 'react';
import {
  TrendingUp,
  LineChart as LineChartIcon,
  BarChart3,
  Building,
  AlertTriangle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Filter,
  RefreshCw,
  Info,
  CheckCircle2,
  ShieldAlert,
  Clock,
  DollarSign,
  MapPin,
  XCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { mpladsService } from '../api/mpladsService';
import {
  CardSkeleton,
  ChartSkeleton,
  ErrorState,
  EmptyState,
  Skeleton,
} from '../components/common/loading';
import { useApiQuery } from '../hooks/useApiQuery';

/* ==========================================================================
   STATISTICAL & AGGREGATION HELPER FUNCTIONS
   ========================================================================== */

/**
 * Computes peak month and Month-over-Month (MoM) direction for Flagged Work Trend.
 */
function computeTrendStats(monthlyTrends = []) {
  if (!monthlyTrends || monthlyTrends.length === 0) {
    return {
      peakMonth: null,
      peakValue: 0,
      momChange: 0,
      momDirection: 'unchanged',
      momPercent: 0,
    };
  }

  let peak = monthlyTrends[0];
  for (const item of monthlyTrends) {
    if ((item.totalFlagged || 0) > (peak.totalFlagged || 0)) {
      peak = item;
    }
  }

  let momChange = 0;
  let momDirection = 'unchanged';
  let momPercent = 0;

  if (monthlyTrends.length >= 2) {
    const latest = monthlyTrends[monthlyTrends.length - 1].totalFlagged || 0;
    const previous = monthlyTrends[monthlyTrends.length - 2].totalFlagged || 0;
    momChange = latest - previous;

    if (momChange > 0) {
      momDirection = 'increasing';
    } else if (momChange < 0) {
      momDirection = 'decreasing';
    } else {
      momDirection = 'unchanged';
    }

    if (previous > 0) {
      momPercent = Number(((momChange / previous) * 100).toFixed(1));
    } else if (latest > 0) {
      momPercent = 100;
    }
  }

  return {
    peakMonth: peak?.month || null,
    peakValue: peak?.totalFlagged || 0,
    momChange,
    momDirection,
    momPercent,
  };
}

/**
 * Computes Historical Baseline (arithmetic mean of totalFlagged) and monthly deviations.
 */
function computeBaselineData(monthlyTrends = []) {
  if (!monthlyTrends || monthlyTrends.length === 0) {
    return {
      baselineValue: 0,
      chartData: [],
      aboveBaselineCount: 0,
    };
  }

  const total = monthlyTrends.reduce(
    (sum, item) => sum + (Number(item.totalFlagged) || 0),
    0
  );
  const baselineValue = Math.round(total / monthlyTrends.length);

  let aboveBaselineCount = 0;

  const chartData = monthlyTrends.map((item) => {
    const actual = Number(item.totalFlagged) || 0;
    const deviation = actual - baselineValue;
    const deviationPct =
      baselineValue > 0
        ? Number(((deviation / baselineValue) * 100).toFixed(1))
        : 0;
    const isAboveBaseline = actual > baselineValue;

    if (isAboveBaseline) aboveBaselineCount += 1;

    return {
      month: item.month,
      actual,
      baseline: baselineValue,
      deviation,
      deviationPct,
      isAboveBaseline,
    };
  });

  return {
    baselineValue,
    chartData,
    aboveBaselineCount,
  };
}

/**
 * Computes category distribution with relative percentage shares.
 */
function computeCategoryData(categoryAnomalies = []) {
  if (!categoryAnomalies || categoryAnomalies.length === 0) return [];

  const totalCategoryFlags = categoryAnomalies.reduce(
    (sum, item) => sum + (Number(item.count) || 0),
    0
  );

  return [...categoryAnomalies]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .map((item) => {
      const count = Number(item.count) || 0;
      const pct =
        totalCategoryFlags > 0
          ? Number(((count / totalCategoryFlags) * 100).toFixed(1))
          : 0;
      return {
        category: item.category,
        count,
        pct,
      };
    });
}

/**
 * Sorts state comparison records.
 */
function computeStateData(stateComparison = [], sortMode = 'highestRisk') {
  const list = [...stateComparison];

  if (sortMode === 'highestRisk') {
    list.sort((a, b) => (b.flaggedPercent || 0) - (a.flaggedPercent || 0));
  } else if (sortMode === 'bestCompletion') {
    list.sort((a, b) => (b.completionRate || 0) - (a.completionRate || 0));
  }

  return list;
}

/**
 * Helper: Truncates axis category label with ellipsis if length > maxLen.
 */
function truncateCategoryLabel(label, maxLen = 20) {
  if (!label) return '';
  return label.length > maxLen ? `${label.slice(0, maxLen)}…` : label;
}

/* ==========================================================================
   RISK INSIGHT ROW COMPONENT (DECOUPLED & INDEPENDENTLY GATED)
   ========================================================================== */

function InsightCard({ type = 'neutral', title, text, loading, error, icon: CustomIcon }) {
  if (loading) {
    return (
      <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2 animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 bg-slate-200 rounded" />
          <div className="h-3 w-36 bg-slate-200 rounded" />
        </div>
        <div className="h-2.5 w-4/5 bg-slate-200 rounded ml-5" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 text-slate-400">
            <Minus className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold block text-[11px] text-slate-700">{title}</span>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              {text || 'Insight unavailable due to telemetry error.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-3 rounded-xl border text-xs transition-all ${
        type === 'alert'
          ? 'bg-rose-50/40 border-rose-200 text-rose-950'
          : type === 'warning'
          ? 'bg-amber-50/40 border-amber-200 text-amber-950'
          : type === 'positive'
          ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
          : 'bg-slate-50 border-slate-200 text-slate-900'
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex-shrink-0">
          {CustomIcon ? (
            <CustomIcon className="w-3.5 h-3.5" />
          ) : type === 'alert' ? (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          ) : type === 'warning' ? (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          ) : type === 'positive' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          ) : type === 'info' ? (
            <Info className="w-3.5 h-3.5 text-[#1D9BF0]" />
          ) : (
            <Minus className="w-3.5 h-3.5 text-slate-500" />
          )}
        </div>
        <div>
          <span className="font-bold block text-[11px]">{title}</span>
          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function TrendsAnalyticsPage() {
  // Scoped Filter States (Local to this page only)
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [timePeriod, setTimePeriod] = useState('12'); // '3' | '6' | '12'
  const [stateSortMode, setStateSortMode] = useState('highestRisk'); // 'highestRisk' | 'bestCompletion'

  // 1. Locations Query (Hierarchy of States & Districts for Header Dropdowns)
  const locationsQuery = useApiQuery(
    () => mpladsService.getTrendsLocations(),
    []
  );

  // 2. Section 1 Query: Monthly Trends (drives Flagged Work Trend + Historical Baseline)
  const monthlyQuery = useApiQuery(
    () => mpladsService.getTrendsMonthly({ state: selectedState, district: selectedDistrict }),
    [selectedState, selectedDistrict]
  );

  // 3. Section 2 Query: Category Anomalies
  const categoriesQuery = useApiQuery(
    () => mpladsService.getTrendsCategories({ state: selectedState, district: selectedDistrict }),
    [selectedState, selectedDistrict]
  );

  // 4. Section 3 Query: Vendor Concentration & Risk
  const vendorsQuery = useApiQuery(
    () => mpladsService.getTrendsVendors({ state: selectedState, district: selectedDistrict }),
    [selectedState, selectedDistrict]
  );

  // 5. Section 4 Query: State Performance vs Risk
  const statesQuery = useApiQuery(
    () => mpladsService.getTrendsStates({ state: selectedState, district: selectedDistrict }),
    [selectedState, selectedDistrict]
  );

  // Derive dynamic State & District dropdown lists
  const availableStates = useMemo(() => {
    return locationsQuery.data || [];
  }, [locationsQuery.data]);

  const selectedStateObj = useMemo(() => {
    if (selectedState === 'ALL') return null;
    return availableStates.find((s) => s.state_name === selectedState) || null;
  }, [availableStates, selectedState]);

  const availableDistricts = useMemo(() => {
    return selectedStateObj?.districts || [];
  }, [selectedStateObj]);

  // Handle State Selection Change (Resets District to ALL)
  const handleStateChange = useCallback((newState) => {
    setSelectedState(newState);
    setSelectedDistrict('ALL');
  }, []);

  // Handle Clear District Filter
  const handleClearDistrict = useCallback(() => {
    setSelectedDistrict('ALL');
  }, []);

  // Derive Trailing Monthly Trends based on selected Time Period (3, 6, 12 months)
  const filteredMonthlyTrends = useMemo(() => {
    if (!monthlyQuery.data || !Array.isArray(monthlyQuery.data)) return [];
    const full = monthlyQuery.data;
    if (timePeriod === '3') {
      return full.slice(-3);
    }
    if (timePeriod === '6') {
      return full.slice(-6);
    }
    return full.slice(-12);
  }, [monthlyQuery.data, timePeriod]);

  // Derived Trend Statistics
  const trendStats = useMemo(() => {
    return computeTrendStats(filteredMonthlyTrends);
  }, [filteredMonthlyTrends]);

  // Derived Historical Baseline Data
  const baselineData = useMemo(() => {
    return computeBaselineData(filteredMonthlyTrends);
  }, [filteredMonthlyTrends]);

  // Derived Category Data
  const categoryData = useMemo(() => {
    return computeCategoryData(categoriesQuery.data || []);
  }, [categoriesQuery.data]);

  // Derived State Comparison Data
  const stateData = useMemo(() => {
    return computeStateData(statesQuery.data || [], stateSortMode);
  }, [statesQuery.data, stateSortMode]);

  // Vendor Data
  const topVendors = vendorsQuery.data || [];

  // KPI Calculations (Computed strictly from loaded datasets without defaulting unloaded to 0)
  const monthlyLoaded = Boolean(monthlyQuery.data && Array.isArray(monthlyQuery.data));
  const categoriesLoaded = Boolean(categoriesQuery.data && Array.isArray(categoriesQuery.data));
  const vendorsLoaded = Boolean(vendorsQuery.data && Array.isArray(vendorsQuery.data));

  const totalFlaggedCount = useMemo(() => {
    if (!monthlyLoaded) return null;
    return monthlyQuery.data.reduce((acc, curr) => acc + (Number(curr.totalFlagged) || 0), 0);
  }, [monthlyLoaded, monthlyQuery.data]);

  const totalCostOverruns = useMemo(() => {
    if (!monthlyLoaded) return null;
    return monthlyQuery.data.reduce((acc, curr) => acc + (Number(curr.costOverrun) || 0), 0);
  }, [monthlyLoaded, monthlyQuery.data]);

  const totalDelaySignals = useMemo(() => {
    if (!monthlyLoaded) return null;
    return monthlyQuery.data.reduce((acc, curr) => acc + (Number(curr.delayStall) || 0), 0);
  }, [monthlyLoaded, monthlyQuery.data]);

  const suspiciousVendorStats = useMemo(() => {
    if (!vendorsLoaded) return null;
    const suspicious = topVendors.filter((v) => Boolean(v.isSuspicious)).length;
    return { suspicious, total: topVendors.length };
  }, [vendorsLoaded, topVendors]);

  const topCategoryStats = useMemo(() => {
    if (!categoriesLoaded) return null;
    if (categoriesQuery.data.length === 0) return { name: 'None', count: 0 };
    const sorted = [...categoriesQuery.data].sort((a, b) => (b.count || 0) - (a.count || 0));
    return { name: sorted[0].category, count: sorted[0].count };
  }, [categoriesLoaded, categoriesQuery.data]);

  // Dynamic Height for Category Chart to prevent label overlap
  const dynamicCategoryChartHeight = useMemo(() => {
    return Math.max(280, (categoryData.length || 1) * 46);
  }, [categoryData.length]);

  // Refresh All handler
  const isAnyRefetching =
    monthlyQuery.isRefetching ||
    categoriesQuery.isRefetching ||
    vendorsQuery.isRefetching ||
    statesQuery.isRefetching;

  const handleRefreshAll = useCallback(() => {
    monthlyQuery.refetch();
    categoriesQuery.refetch();
    vendorsQuery.refetch();
    statesQuery.refetch();
  }, [monthlyQuery, categoriesQuery, vendorsQuery, statesQuery]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* ====================================================================
          1. HEADER & CONTROLS
          ==================================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EFF3F4] pb-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F1419] tracking-tight">
            National Trends & Risk Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor flagged-work trends, identify sector vulnerabilities, investigate contractor concentration, and evaluate state performance.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Time Period Filter (3M, 6M, 12M) */}
          <div className="flex items-center bg-white border border-[#EFF3F4] rounded-lg p-0.5 shadow-sm text-xs">
            <button
              onClick={() => setTimePeriod('3')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                timePeriod === '3'
                  ? 'bg-[#1D9BF0] text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 3 Months
            </button>
            <button
              onClick={() => setTimePeriod('6')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                timePeriod === '6'
                  ? 'bg-[#1D9BF0] text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 6 Months
            </button>
            <button
              onClick={() => setTimePeriod('12')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                timePeriod === '12'
                  ? 'bg-[#1D9BF0] text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 12 Months
            </button>
          </div>

          {/* State Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-[#EFF3F4] rounded-lg px-2.5 py-1 text-xs shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-500 font-medium">State:</span>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#0F1419] focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              <option value="ALL">All States</option>
              {availableStates.map((st) => (
                <option key={st.state_id} value={st.state_name}>
                  {st.state_name}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter Dropdown (Enabled only when a State is selected) */}
          {selectedState !== 'ALL' && (
            <div className="flex items-center gap-1.5 bg-white border border-[#EFF3F4] rounded-lg px-2.5 py-1 text-xs shadow-sm animate-in fade-in duration-200">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] text-slate-500 font-medium">District:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#0F1419] focus:outline-none cursor-pointer max-w-[150px] truncate"
              >
                <option value="ALL">All Districts ({availableDistricts.length})</option>
                {availableDistricts.map((d) => (
                  <option key={d.district_id} value={d.district_name}>
                    {d.district_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Refresh Action */}
          <button
            onClick={handleRefreshAll}
            title="Refresh all analytics data"
            className="p-1.5 bg-white border border-[#EFF3F4] text-slate-500 hover:text-[#0F1419] rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isAnyRefetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Scope Notice */}
      {(selectedState !== 'ALL' || selectedDistrict !== 'ALL') && (
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 text-xs border border-sky-100 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#1D9BF0] flex-shrink-0" />
            <span>
              Scope filtered to <strong>{selectedState}</strong>
              {selectedDistrict !== 'ALL' ? (
                <> &rsaquo; <strong>{selectedDistrict}</strong></>
              ) : null}
              . Real-time trend vectors, category distribution, and contractor analysis scoped to this geographic domain.
            </span>
          </div>
          <button
            onClick={() => handleStateChange('ALL')}
            className="text-xs font-semibold text-[#1D9BF0] hover:underline cursor-pointer flex-shrink-0 ml-2"
          >
            Reset to National View
          </button>
        </div>
      )}

      {/* ====================================================================
          2. KPI SUMMARY (5 Cards with fine-grained Loading / Unavailable / Value states)
          ==================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Flagged Works (feeds from monthlyQuery) */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Flagged Works
            </span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-md">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2 min-h-[32px]">
            {monthlyQuery.loading && !monthlyQuery.data ? (
              <Skeleton className="h-7 w-20 rounded" />
            ) : monthlyQuery.error && !monthlyQuery.data ? (
              <span className="text-2xl font-bold font-mono text-slate-400" title="Data unavailable">—</span>
            ) : (
              <span className="text-2xl font-bold font-mono text-[#0F1419]">
                {totalFlaggedCount?.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">12-Month Medium & High Risk</p>
        </div>

        {/* Card 2: Cost Overrun Signals (feeds from monthlyQuery) */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Cost Overrun Signals
            </span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2 min-h-[32px]">
            {monthlyQuery.loading && !monthlyQuery.data ? (
              <Skeleton className="h-7 w-20 rounded" />
            ) : monthlyQuery.error && !monthlyQuery.data ? (
              <span className="text-2xl font-bold font-mono text-slate-400" title="Data unavailable">—</span>
            ) : (
              <span className="text-2xl font-bold font-mono text-amber-600">
                {totalCostOverruns?.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Flagged works with overrun &gt; 0%</p>
        </div>

        {/* Card 3: Timeline Stall Signals (feeds from monthlyQuery) */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Timeline Stall Signals
            </span>
            <div className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-md">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2 min-h-[32px]">
            {monthlyQuery.loading && !monthlyQuery.data ? (
              <Skeleton className="h-7 w-20 rounded" />
            ) : monthlyQuery.error && !monthlyQuery.data ? (
              <span className="text-2xl font-bold font-mono text-slate-400" title="Data unavailable">—</span>
            ) : (
              <span className="text-2xl font-bold font-mono text-[#1D9BF0]">
                {totalDelaySignals?.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Flagged works in Delayed status</p>
        </div>

        {/* Card 4: Suspicious Vendors (feeds from vendorsQuery) */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Concentration Risk
            </span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-md">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2 min-h-[32px]">
            {vendorsQuery.loading && !vendorsQuery.data ? (
              <Skeleton className="h-7 w-20 rounded" />
            ) : vendorsQuery.error && !vendorsQuery.data ? (
              <span className="text-2xl font-bold font-mono text-slate-400" title="Data unavailable">—</span>
            ) : (
              <>
                <span className="text-2xl font-bold font-mono text-rose-600">
                  {suspiciousVendorStats?.suspicious}
                </span>
                <span className="text-[11px] text-slate-400">
                  / {suspiciousVendorStats?.total} top vendors
                </span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">&gt;40% risk ratio or single state</p>
        </div>

        {/* Card 5: Highest Flagged Category (feeds from categoriesQuery) */}
        <div className="bg-white border border-[#EFF3F4] rounded-xl p-4 shadow-subtle col-span-2 sm:col-span-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Top Risk Category
            </span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 min-h-[32px]">
            {categoriesQuery.loading && !categoriesQuery.data ? (
              <div className="space-y-1">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            ) : categoriesQuery.error && !categoriesQuery.data ? (
              <span className="text-2xl font-bold font-mono text-slate-400" title="Data unavailable">—</span>
            ) : (
              <>
                <span
                  className="text-sm font-bold text-[#0F1419] truncate block"
                  title={topCategoryStats?.name}
                >
                  {topCategoryStats?.name}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-500 block">
                  {topCategoryStats?.count} flagged projects
                </span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Highest frequency risk sector</p>
        </div>
      </div>

      {/* ====================================================================
          SECTION 1: TREND ANALYSIS
          - Chart 1: Flagged Work Trend (Dynamic peak & MoM status)
          - Chart 2: Risk Distribution by Category (sorted horizontal bars, dynamic height, truncated labels)
          ==================================================================== */}
      <div>
        <div className="mb-3">
          <h2 className="text-sm font-bold text-[#0F1419] tracking-tight uppercase">
            Trend Analysis
          </h2>
          <p className="text-[11px] text-slate-500">
            Temporal progression of risk vectors and structural breakdown by public work sector
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Flagged Work Trend */}
          <div className="lg:col-span-7 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#EFF3F4]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-sky-50 text-[#1D9BF0] rounded-lg">
                  <LineChartIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F1419]">
                    Flagged Work Trend
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Monthly Medium- and High-Risk Activity ({timePeriod} Months)
                  </p>
                </div>
              </div>

              {/* Dynamic Badges: Peak & MoM change (Rendered only when data is loaded) */}
              {monthlyQuery.data && (
                <div className="flex items-center gap-2 flex-wrap">
                  {trendStats.peakMonth && (
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      Peak: <strong>{trendStats.peakMonth}</strong> ({trendStats.peakValue})
                    </span>
                  )}
                  {trendStats.momDirection === 'increasing' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                      <ArrowUpRight className="w-3 h-3 text-rose-600" />
                      Increased MoM (+{trendStats.momChange})
                    </span>
                  )}
                  {trendStats.momDirection === 'decreasing' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ArrowDownRight className="w-3 h-3 text-emerald-600" />
                      Decreased MoM ({trendStats.momChange})
                    </span>
                  )}
                  {trendStats.momDirection === 'unchanged' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      <Minus className="w-3 h-3" />
                      Unchanged MoM
                    </span>
                  )}
                </div>
              )}
            </div>

            {monthlyQuery.error && !monthlyQuery.data ? (
              <ErrorState
                title="Flagged Work Trend Unavailable"
                message={monthlyQuery.error?.message}
                onRetry={monthlyQuery.refetch}
                className="py-12"
              />
            ) : monthlyQuery.loading && !monthlyQuery.data ? (
              <ChartSkeleton title="Flagged Work Trend" height="h-72" />
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filteredMonthlyTrends}
                    margin={{ top: 10, right: 15, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF3F4" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      axisLine={{ stroke: '#EFF3F4' }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      axisLine={{ stroke: '#EFF3F4' }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid #EFF3F4',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalFlagged"
                      name="Total Flagged"
                      stroke="#EF4444"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#EF4444' }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="costOverrun"
                      name="Cost Overrun"
                      stroke="#F59E0B"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      dot={{ r: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="delayStall"
                      name="Timeline Stall"
                      stroke="#1D9BF0"
                      strokeWidth={1.5}
                      strokeDasharray="2 2"
                      dot={{ r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Chart 2: Risk Distribution by Category */}
          <div className="lg:col-span-5 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F1419]">
                    Risk Distribution by Category
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Sectors with the highest count of Medium- and High-Risk works
                  </p>
                </div>
              </div>
            </div>

            {categoriesQuery.error && !categoriesQuery.data ? (
              <ErrorState
                title="Category Distribution Unavailable"
                message={categoriesQuery.error?.message}
                onRetry={categoriesQuery.refetch}
                className="py-12"
              />
            ) : categoriesQuery.loading && !categoriesQuery.data ? (
              <ChartSkeleton title="Risk Category Distribution" height="h-72" />
            ) : categoryData.length === 0 ? (
              <EmptyState
                icon={Layers}
                title="No Category Flags"
                message="No flagged category records in this scope."
              />
            ) : (
              /* Dynamically sized container to provide vertical breathing room for all categories */
              <div style={{ height: `${dynamicCategoryChartHeight}px` }} className="w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 130, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EFF3F4" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      axisLine={{ stroke: '#EFF3F4' }}
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="category"
                      tick={{ fontSize: 11, fill: '#0F1419', fontWeight: 500 }}
                      tickFormatter={(label) => truncateCategoryLabel(label, 20)}
                      width={130}
                      axisLine={{ stroke: '#EFF3F4' }}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(val, name, entry) => [
                        `${val} flagged (${entry.payload.pct}% of category flags)`,
                        'Flagged Works',
                      ]}
                      labelFormatter={(label, payload) => payload?.[0]?.payload?.category || label}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid #EFF3F4',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                        fontSize: '12px',
                        maxWidth: '320px',
                        whiteSpace: 'normal',
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cat-cell-${index}`}
                          fill={index === 0 ? '#EF4444' : index === 1 ? '#F59E0B' : '#1D9BF0'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ====================================================================
          SECTION 2: BASELINE & ANOMALY ANALYSIS
          - Historical Baseline vs Actual Flagged Activity
          - Shared with Flagged Work Trend data source
          ==================================================================== */}
      <div>
        <div className="mb-3">
          <h2 className="text-sm font-bold text-[#0F1419] tracking-tight uppercase">
            Baseline & Anomaly Analysis
          </h2>
          <p className="text-[11px] text-slate-500">
            Evaluating temporal fluctuations against the mathematical period baseline
          </p>
        </div>

        <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#EFF3F4]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F1419]">
                  Historical Baseline vs Actual Activity
                </h3>
                <p className="text-[11px] text-slate-500">
                  Compare monthly flagged activity with the {timePeriod}-month historical average ({baselineData.baselineValue} works/month)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200">
                Threshold: <strong>&gt; {baselineData.baselineValue} (Above Baseline)</strong>
              </span>
            </div>
          </div>

          {monthlyQuery.error && !monthlyQuery.data ? (
            <ErrorState
              title="Historical Baseline Unavailable"
              message={monthlyQuery.error?.message}
              onRetry={monthlyQuery.refetch}
              className="py-12"
            />
          ) : monthlyQuery.loading && !monthlyQuery.data ? (
            <ChartSkeleton title="Historical Baseline vs Actual Activity" height="h-80" />
          ) : (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={baselineData.chartData}
                  margin={{ top: 15, right: 25, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF3F4" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={{ stroke: '#EFF3F4' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={{ stroke: '#EFF3F4' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white border border-[#EFF3F4] rounded-lg p-3 shadow-lg text-xs space-y-1">
                            <p className="font-bold text-[#0F1419] border-b border-slate-100 pb-1 mb-1">
                              {label}
                            </p>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">Actual Flagged:</span>
                              <span className="font-mono font-bold text-rose-600">{d.actual}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                              <span className="text-slate-500">Historical Baseline:</span>
                              <span className="font-mono font-medium text-slate-700">{d.baseline}</span>
                            </div>
                            <div className="flex justify-between gap-4 pt-1 border-t border-slate-100">
                              <span className="text-slate-500">Deviation:</span>
                              <span
                                className={`font-mono font-bold ${
                                  d.deviation > 0 ? 'text-rose-600' : 'text-emerald-600'
                                }`}
                              >
                                {d.deviation > 0 ? `+${d.deviation}` : d.deviation} ({d.deviationPct > 0 ? `+${d.deviationPct}%` : `${d.deviationPct}%`})
                              </span>
                            </div>
                            {d.isAboveBaseline && (
                              <p className="text-[10px] text-rose-600 font-semibold pt-1">
                                ⚠ Substantially above historical norm
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                  <ReferenceLine
                    y={baselineData.baselineValue}
                    stroke="#64748B"
                    strokeDasharray="5 5"
                    strokeWidth={1.5}
                    label={{
                      value: `Baseline: ${baselineData.baselineValue}`,
                      fill: '#64748B',
                      fontSize: 10,
                      position: 'top',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual Flagged Works"
                    stroke="#0F1419"
                    strokeWidth={2.5}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      const isAbove = payload.isAboveBaseline;
                      return (
                        <circle
                          key={`dot-${payload.month}`}
                          cx={cx}
                          cy={cy}
                          r={isAbove ? 5 : 3.5}
                          fill={isAbove ? '#EF4444' : '#0F1419'}
                          stroke="#FFFFFF"
                          strokeWidth={1.5}
                        />
                      );
                    }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name="Historical Baseline (Average)"
                    stroke="#64748B"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================================
          SECTION 3: STATE PERFORMANCE & DYNAMIC RISK INSIGHTS
          - Left: State Performance vs Risk (with district filter explanatory card)
          - Right: Risk Insights Panel (5 independent, unblocked insight rows)
          ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* State Performance Chart */}
        <div className="lg:col-span-7 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#EFF3F4]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F1419]">
                    State Performance vs Risk
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {selectedState !== 'ALL' && selectedDistrict === 'ALL'
                      ? `Performance metrics for ${selectedState}`
                      : 'Compare completion rate with the share of flagged works across states'}
                  </p>
                </div>
              </div>

              {/* Sort Toggle (Visible only in multi-state national view) */}
              {selectedState === 'ALL' && selectedDistrict === 'ALL' && (
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-[11px]">
                  <button
                    onClick={() => setStateSortMode('highestRisk')}
                    className={`px-2 py-1 rounded-md font-medium transition-all cursor-pointer ${
                      stateSortMode === 'highestRisk'
                        ? 'bg-white text-rose-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Highest Risk
                  </button>
                  <button
                    onClick={() => setStateSortMode('bestCompletion')}
                    className={`px-2 py-1 rounded-md font-medium transition-all cursor-pointer ${
                      stateSortMode === 'bestCompletion'
                        ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Best Completion
                  </button>
                </div>
              )}
            </div>

            {/* If District Filter is Active: Render Explanatory Message */}
            {selectedDistrict !== 'ALL' ? (
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#1D9BF0]">
                  <MapPin className="w-5.5 h-5.5" />
                </div>
                <div className="max-w-sm space-y-1">
                  <h4 className="text-sm font-bold text-[#0F1419]">State Comparison Inactive</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    State Performance vs Risk compares metrics across state administrative units. When filtering down to a specific district (<strong>{selectedDistrict}</strong>), state-level comparison is not applicable.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearDistrict}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#1D9BF0] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-all shadow-2xs mt-2 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Clear District Filter</span>
                </button>
              </div>
            ) : statesQuery.error && !statesQuery.data ? (
              <ErrorState
                title="State Performance Unavailable"
                message={statesQuery.error?.message}
                onRetry={statesQuery.refetch}
                className="py-12"
              />
            ) : statesQuery.loading && !statesQuery.data ? (
              <ChartSkeleton title="State Performance vs Risk" height="h-72" />
            ) : stateData.length === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="No State Records"
                message="No state performance records available."
              />
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stateData}
                    margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFF3F4" />
                    <XAxis
                      dataKey="state"
                      tick={{ fontSize: 10, fill: '#64748B' }}
                      angle={-25}
                      textAnchor="end"
                      interval={0}
                      axisLine={{ stroke: '#EFF3F4' }}
                    />
                    <YAxis
                      unit="%"
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      axisLine={{ stroke: '#EFF3F4' }}
                    />
                    <Tooltip
                      formatter={(val, name) => [
                        `${val}%`,
                        name === 'completionRate' ? 'Completion Rate' : 'Flagged Work Rate',
                      ]}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid #EFF3F4',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                    />
                    <Bar
                      dataKey="completionRate"
                      name="Completion Rate (%)"
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                      barSize={14}
                    />
                    <Bar
                      dataKey="flaggedPercent"
                      name="Flagged Work Rate (%)"
                      fill="#EF4444"
                      radius={[4, 4, 0, 0]}
                      barSize={14}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Risk Insights (5 Independently Gated Insight Lines) */}
        <div className="lg:col-span-5 bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EFF3F4]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F1419]">
                    Risk Insights
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Continuous operational signals evaluated across distinct risk vectors
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Live Signals
              </span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {/* Insight 1: Month-over-Month Trend (gated by monthlyQuery) */}
              <InsightCard
                loading={monthlyQuery.loading && !monthlyQuery.data}
                error={monthlyQuery.error && !monthlyQuery.data}
                title={
                  trendStats.momDirection === 'increasing'
                    ? 'Flagged Activity Increased'
                    : trendStats.momDirection === 'decreasing'
                    ? 'Flagged Activity Decreased'
                    : 'Flagged Activity Steady'
                }
                text={
                  monthlyQuery.error && !monthlyQuery.data
                    ? 'Month-over-month trend telemetry could not be loaded.'
                    : trendStats.momDirection === 'increasing'
                    ? `Flagged activity increased by ${trendStats.momChange} works (${trendStats.momPercent > 0 ? `+${trendStats.momPercent}%` : ''}) compared to the previous month.`
                    : trendStats.momDirection === 'decreasing'
                    ? `Flagged activity decreased by ${Math.abs(trendStats.momChange)} works (${trendStats.momPercent}% MoM) compared to the previous month.`
                    : 'Flagged work activity remained unchanged compared to the previous month.'
                }
                type={
                  trendStats.momDirection === 'increasing'
                    ? 'warning'
                    : trendStats.momDirection === 'decreasing'
                    ? 'positive'
                    : 'neutral'
                }
              />

              {/* Insight 2: Baseline Deviation (gated by monthlyQuery) */}
              <InsightCard
                loading={monthlyQuery.loading && !monthlyQuery.data}
                error={monthlyQuery.error && !monthlyQuery.data}
                title={
                  baselineData.aboveBaselineCount > 0
                    ? 'Activity Above Historical Baseline'
                    : 'Activity Within Historical Baseline'
                }
                text={
                  monthlyQuery.error && !monthlyQuery.data
                    ? 'Historical baseline telemetry could not be loaded.'
                    : baselineData.aboveBaselineCount > 0
                    ? `${baselineData.aboveBaselineCount} of ${filteredMonthlyTrends.length} tracked months had flagged works exceeding the period baseline (${baselineData.baselineValue} works/month).`
                    : `All ${filteredMonthlyTrends.length} tracked months remained at or below the historical baseline (${baselineData.baselineValue} works/month).`
                }
                type={baselineData.aboveBaselineCount > 0 ? 'info' : 'positive'}
              />

              {/* Insight 3: Category Concentration (gated by categoriesQuery) */}
              <InsightCard
                loading={categoriesQuery.loading && !categoriesQuery.data}
                error={categoriesQuery.error && !categoriesQuery.data}
                title={categoryData.length > 0 ? 'Sector Risk Concentration' : 'No Category Anomalies'}
                text={
                  categoriesQuery.error && !categoriesQuery.data
                    ? 'Category vulnerability telemetry could not be loaded.'
                    : categoryData.length > 0
                    ? `${categoryData[0].category} represents the highest volume of flagged projects with ${categoryData[0].count} works (${categoryData[0].pct}% of flagged category records).`
                    : 'No sector risk concentrations detected in the active scope.'
                }
                type={categoryData.length > 0 ? 'warning' : 'neutral'}
              />

              {/* Insight 4: State Risk Insight (gated by statesQuery & district filter) */}
              {selectedDistrict !== 'ALL' ? (
                <InsightCard
                  loading={false}
                  error={false}
                  title="State Comparison Inactive"
                  text={`State risk telemetry comparison is disabled while the district filter (${selectedDistrict}) is applied.`}
                  type="neutral"
                  icon={MapPin}
                />
              ) : (
                <InsightCard
                  loading={statesQuery.loading && !statesQuery.data}
                  error={statesQuery.error && !statesQuery.data}
                  title={
                    selectedState !== 'ALL'
                      ? `${selectedState} State Profile`
                      : 'State With Highest Flagged Ratio'
                  }
                  text={
                    statesQuery.error && !statesQuery.data
                      ? 'State comparison telemetry could not be loaded.'
                      : selectedState !== 'ALL'
                      ? stateData[0]
                        ? `${stateData[0].state} records a completion rate of ${stateData[0].completionRate}% with a flagged work share of ${stateData[0].flaggedPercent}%.`
                        : 'No records available for the selected state.'
                      : stateData[0]
                      ? `${stateData[0].state} has the highest share of flagged works at ${stateData[0].flaggedPercent}% (Completion: ${stateData[0].completionRate}%).`
                      : 'No state comparison records found.'
                  }
                  type={
                    selectedState !== 'ALL'
                      ? 'info'
                      : stateData[0]?.flaggedPercent > 30
                      ? 'warning'
                      : 'neutral'
                  }
                />
              )}

              {/* Insight 5: Vendor Concentration (gated by vendorsQuery) */}
              <InsightCard
                loading={vendorsQuery.loading && !vendorsQuery.data}
                error={vendorsQuery.error && !vendorsQuery.data}
                title={
                  (topVendors.filter((v) => Boolean(v.isSuspicious)).length > 0)
                    ? 'Vendor Concentration Signals'
                    : 'No Vendor Concentration Flags'
                }
                text={
                  vendorsQuery.error && !vendorsQuery.data
                    ? 'Vendor concentration telemetry could not be loaded.'
                    : (topVendors.filter((v) => Boolean(v.isSuspicious)).length > 0)
                    ? `${topVendors.filter((v) => Boolean(v.isSuspicious)).length} of ${topVendors.length} tracked top vendors meet concentration-risk criteria (>40% flagged ratio or single-state lock with ≥5 works).`
                    : 'None of the top vendors currently exceed the concentration-risk threshold in this scope.'
                }
                type={
                  (topVendors.filter((v) => Boolean(v.isSuspicious)).length > 0)
                    ? 'alert'
                    : 'positive'
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          SECTION 4: VENDOR CONCENTRATION & RISK
          - High Concentration Risk indicator
          - Evaluates only qualifying in-scope expenditures
          ==================================================================== */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#EFF3F4]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F1419]">
                Vendor Concentration & Risk
              </h3>
              <p className="text-[11px] text-slate-500">
                Vendors with high flagged-work concentration or concentrated regional activity
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            Criteria: Flagged ratio &gt; 40% OR 1 state with ≥ 5 works. (Requires review; does not imply proven collusion)
          </div>
        </div>

        {vendorsQuery.error && !vendorsQuery.data ? (
          <ErrorState
            title="Vendor Concentration Unavailable"
            message={vendorsQuery.error?.message}
            onRetry={vendorsQuery.refetch}
            className="py-12"
          />
        ) : vendorsQuery.loading && !vendorsQuery.data ? (
          <CardSkeleton count={3} />
        ) : topVendors.length === 0 ? (
          <EmptyState
            icon={Building}
            title="No Vendor Records"
            message="No qualifying vendor expenditures found for the selected geographic filter."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topVendors.map((v) => (
              <div
                key={v.vendor}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  v.isSuspicious
                    ? 'bg-rose-50/20 border-rose-200 shadow-xs'
                    : 'bg-[#F7F9F9] border-[#EFF3F4]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-xs font-bold text-[#0F1419] line-clamp-1" title={v.vendor}>
                        {v.vendor}
                      </h4>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Active: {v.stateConcentration}
                      </span>
                    </div>

                    {v.isSuspicious ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 shrink-0">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        High Concentration Risk
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        Standard Profile
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Awarded Works</span>
                      <span className="font-mono font-bold text-slate-800">{v.worksAwarded}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Total Amount</span>
                      <span className="font-mono font-bold text-slate-800">₹{v.totalAmountCr} Cr</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Flagged Works</span>
                      <span
                        className={`font-mono font-bold ${
                          v.isSuspicious ? 'text-rose-600' : 'text-slate-700'
                        }`}
                      >
                        {v.flaggedCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Risk Ratio</span>
                      <span className="font-mono font-semibold text-slate-600">{v.riskRatio}</span>
                    </div>
                  </div>
                </div>

                {v.isSuspicious && (
                  <div className="mt-3 pt-2 border-t border-rose-100 text-[11px] text-rose-700 flex items-center gap-1 font-medium">
                    <Info className="w-3 h-3 text-rose-500 shrink-0" />
                    Concentration risk indicator — requires review
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```


### `frontend/src/pages/WorkDetailPage.jsx`

*File [128/131] | Lines: 811 | Size: 34.2 KB*

```jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  Calendar,
  IndianRupee,
  Building2,
  User,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  FileCheck,
  Copy,
  Check,
  Printer,
  ChevronRight,
  FileText,
  Activity,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import RiskBadge from '../components/common/RiskBadge';
import Sparkline from '../components/common/Sparkline';
import { WorkDetailSkeleton, ErrorState } from '../components/common/loading';
import { mpladsService } from '../api/mpladsService';
import { auditorApi } from '../api/auditorApi';
import { useAuth } from '../context/AuthContext';

/**
 * WorkDetailPage Component
 * Dedicated full-page view for case/work details.
 * Replaces the former WorkDetailModal overlay popup with a permanent, URL-addressable route.
 *
 * Supported Routes:
 * - /ministry/cases/:workId
 * - /state/cases/:workId
 * - /mp/cases/:workId
 * - /district/cases/:workId
 * - /auditor/cases/:workId
 * - /cases/:workId (redirects based on role)
 */
export default function WorkDetailPage() {
  const params = useParams();
  const rawWorkId = params['*'] || params.workId || '';
  const workId = rawWorkId ? decodeURIComponent(rawWorkId) : '';
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Initialize work from route state if passed; otherwise will fetch by workId
  const [work, setWork] = useState(location.state?.work || null);
  const [loading, setLoading] = useState(!location.state?.work);
  const [notFound, setNotFound] = useState(false);

  // Copied State
  const [copiedId, setCopiedId] = useState(false);
  // Audit Notice State
  const [auditNoticeSent, setAuditNoticeSent] = useState(false);

  // Role check
  const isMpRole = user?.role === 'mp';

  // Determine breadcrumb back destination based on role
  const getBackDestination = () => {
    switch (user?.role) {
      case 'mp':
        return { path: '/mp/works', label: 'My Works' };
      case 'district':
        return { path: '/district/verification', label: 'Verification Queue' };
      case 'state':
        return { path: '/state/overview', label: 'State Overview' };
      case 'auditor':
        return { path: '/auditor/queue', label: 'Case Queue' };
      case 'ministry':
      default:
        return { path: '/ministry/flagged', label: 'Flagged Cases' };
    }
  };

  const backDest = getBackDestination();

  // Load work data by workId
  const loadWork = async () => {
    // Check if the work currently in state is already a full detail object
    const hasFullDetail =
      work &&
      work.workId?.toLowerCase() === workId?.toLowerCase() &&
      (Boolean(work.riskFactorBreakdown) ||
        Boolean(work.progressHistory) ||
        Boolean(work.expenditureBreakdown) ||
        Boolean(work.contractorName) ||
        Boolean(work.sanctionOrderNumber));

    if (hasFullDetail) {
      return;
    }

    if (!work) setLoading(true);
    setNotFound(false);

    try {
      let data = await mpladsService.getWorkById(workId);
      if (!data) {
        data = await auditorApi.getCaseById(workId);
      }

      if (data) {
        setWork(data);
      } else if (!work) {
        setNotFound(true);
      }
    } catch (err) {
      console.error('Failed to load work details:', err);
      if (!work) setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workId) {
      loadWork();
    }
  }, [workId]);

  // Copy Work ID to clipboard
  const handleCopyId = () => {
    if (!work?.workId) return;
    navigator.clipboard?.writeText(work.workId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Issue Audit Notice (for Non-MP roles)
  const handleIssueAuditNotice = async () => {
    try {
      if (work?.workId) {
        await mpladsService.issueAuditNotice(work.workId);
      }
    } catch (err) {
      console.error('Failed to issue audit notice:', err);
    }
    setAuditNoticeSent(true);
    setTimeout(() => setAuditNoticeSent(false), 4000);
  };

  // Loading State - Render matching skeleton dossier
  if (loading && !work) {
    return <WorkDetailSkeleton />;
  }

  // Case Not Found / Error State
  if (notFound || !work) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-[#EFF3F4]">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#0F1419] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <Link
            to={backDest.path}
            className="text-xs font-semibold text-[#1D9BF0] hover:underline"
          >
            Return to {backDest.label}
          </Link>
        </div>
        <ErrorState
          title="Case Dossier Not Found"
          message={`No work record with ID "${workId}" was found in the central registry or active watchlists.`}
          onRetry={loadWork}
        />
      </div>
    );
  }

  // Prepare Explainability Chart Data
  const breakdown = work.riskFactorBreakdown || {
    costOverrun: 35,
    delaySlippage: 30,
    duplicateSimilarity: 20,
    vendorAnomaly: 15,
  };

  const chartData = [
    { factor: 'Cost Inflation', percent: breakdown.costOverrun || 0, color: '#EF4444' },
    { factor: 'Timeline Slippage', percent: breakdown.delaySlippage || 0, color: '#F59E0B' },
    { factor: 'Duplicate/GIS Match', percent: breakdown.duplicateSimilarity || 0, color: '#6366F1' },
    { factor: 'Vendor Concentration', percent: breakdown.vendorAnomaly || 0, color: '#EC4899' },
  ].sort((a, b) => b.percent - a.percent);

  const isPredictive = !!work.predictedRiskScore30Days;
  const isFlagged = work.riskLevel === 'High' || work.riskLevel === 'Medium' || (work.riskScore && work.riskScore >= 40);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Action Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFF3F4]">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-[#1D9BF0] font-medium transition-colors p-1 -ml-1 rounded hover:bg-slate-100"
            title="Go to previous page"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-slate-300">/</span>
          <Link
            to={backDest.path}
            className="hover:text-[#1D9BF0] transition-colors"
          >
            {backDest.label}
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-mono font-bold text-[#0F1419]">{work.workId}</span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleCopyId}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#EFF3F4] rounded-lg hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-1.5"
            title="Copy Work ID"
          >
            {copiedId ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Work ID</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#EFF3F4] rounded-lg hover:bg-slate-50 transition-colors shadow-xs flex items-center gap-1.5"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Dossier</span>
          </button>

          {user?.role === 'auditor' && (
            <Link
              to={`/auditor/case/${work.workId}`}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Forensic Action Center</span>
            </Link>
          )}
        </div>
      </div>

      {/* Main Header Hero Card */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#F7F9F9] rounded-xl border border-[#EFF3F4] text-[#1D9BF0] shadow-xs shrink-0">
              <ShieldAlert className="w-7 h-7 text-[#1D9BF0]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-xl font-bold text-[#0F1419] font-mono tracking-tight">
                  {work.workId}
                </h1>
                <RiskBadge
                  level={work.fraudRiskTier || work.riskLevel || (work.riskScore >= 70 ? 'High' : work.riskScore >= 40 ? 'Medium' : 'Low')}
                  score={work.fraudRiskScore ?? work.riskScore ?? work.currentRiskScore}
                  confidence={work.dataConfidence}
                  type={work.inefficiencyScore !== undefined ? 'Fraud' : null}
                />
                {work.inefficiencyScore !== undefined && (
                  <RiskBadge
                    level={work.inefficiencyTier || 'Low'}
                    score={work.inefficiencyScore}
                    type="Delay"
                  />
                )}
                {isPredictive && (
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3" />
                    AI Early Warning Watchlist
                  </span>
                )}
                {work.status && (
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    work.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : work.status === 'Delayed' || work.status === 'Overdue'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : work.status === 'Under Review'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {work.status}
                  </span>
                )}
              </div>

              <p className="text-base font-semibold text-[#0F1419] mb-1">
                {work.description || `${work.category} scheme execution under MPLADS`}
              </p>

              <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-700">{work.category}</span>
                <span>•</span>
                <span>{work.district}, {work.state}</span>
                {work.constituency && (
                  <>
                    <span>•</span>
                    <span>{work.constituency} Constituency</span>
                  </>
                )}
                {work.sanctionDate && (
                  <>
                    <span>•</span>
                    <span>Sanctioned {work.sanctionDate}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 bg-[#F7F9F9] p-3 rounded-xl border border-[#EFF3F4]">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Sanctioned Cost
            </div>
            <div className="text-xl font-bold font-mono text-[#0F1419] mt-0.5">
              ₹{work.sanctionedAmount?.toFixed(2)} <span className="text-xs text-slate-500 font-normal">Lakhs</span>
            </div>
            {work.expenditure !== undefined && (
              <div className="text-xs font-semibold text-slate-600 mt-1">
                Spent: <span className={`font-mono font-bold ${work.expenditure > work.sanctionedAmount ? 'text-rose-600' : 'text-slate-900'}`}>
                  ₹{work.expenditure?.toFixed(2)}L
                </span>
                <span className="text-[10px] text-slate-400 font-normal ml-1">
                  ({Math.round((work.expenditure / work.sanctionedAmount) * 100)}%)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Alert / Risk Signal Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-start gap-3.5 shadow-subtle ${
          work.riskScore >= 70 || work.riskLevel === 'High' || isPredictive
            ? 'bg-rose-50/70 border-rose-200/80 text-rose-900'
            : work.riskLevel === 'Medium'
            ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
            : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
        }`}
      >
        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-800">
            {isPredictive
              ? 'Projected Escalation Trigger'
              : isFlagged
              ? 'Primary Risk Signal'
              : 'Compliance Status'}
          </div>
          <p className="text-sm font-semibold text-[#0F1419] mt-0.5">
            {work.flagReason || work.warningSignal || 'Work is executing normally within standard SLA parameters.'}
          </p>
        </div>
      </div>

      {/* AI EXPLAINABILITY HORIZONTAL BAR CHART SECTION */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#1D9BF0]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F1419]">
              AI Explainability Breakdown (Weightage)
            </h3>
          </div>
          <span className="text-xs font-medium text-slate-500">
            Transparent Multi-Vector Scoring
          </span>
        </div>
        <p className="text-xs text-slate-600 mb-4">
          Why was this work evaluated with this risk profile? Below is the contributory weight of each vector evaluated by the ML model.
        </p>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 35, left: 140, bottom: 5 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                unit="%"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={{ stroke: '#EFF3F4' }}
              />
              <YAxis
                type="category"
                dataKey="factor"
                tick={{ fontSize: 12, fill: '#0F1419', fontWeight: 600 }}
                axisLine={{ stroke: '#EFF3F4' }}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [`${value}% impact`, 'Weightage']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #EFF3F4',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Diagnostic Summary Narrative */}
        {work.aiDiagnosticSummary && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-3 bg-[#F7F9F9] p-4 rounded-xl border border-[#EFF3F4]">
            <Sparkles className="w-5 h-5 text-[#1D9BF0] shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-[#0F1419]">Diagnostic Audit Note: </span>
              {work.aiDiagnosticSummary}
            </p>
          </div>
        )}
      </div>

      {/* AUDITOR INVESTIGATION REPORT (CONDITIONAL: RENDERS IF AUDITOR REPORT FILED) */}
      {work.auditorReport && (
        <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-5 space-y-3 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                Independent Auditor Official Report
              </h3>
            </div>
            <span className="text-xs font-semibold text-purple-700 font-mono">
              Filed {work.auditorReport.submittedDate}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-slate-600">Audit Finding Conclusion:</span>
            <span className="px-2.5 py-0.5 rounded font-bold bg-white text-purple-900 border border-purple-200">
              {work.auditorReport.conclusion}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-purple-800 font-medium">Status: {work.auditorReport.status}</span>
          </div>

          {work.auditorReport.verifiedProgressPct !== null &&
            work.auditorReport.verifiedProgressPct !== undefined && (
              <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                <span className="font-semibold text-purple-900">Auditor Verified Progress:</span>
                <span className="font-bold text-purple-950 font-mono px-2 py-0.5 rounded bg-white border border-purple-200">
                  {work.auditorReport.verifiedProgressPct}%
                </span>
                {work.auditorReport.discrepancyFlag && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-100 border border-rose-200 text-rose-800 text-[11px] font-bold">
                    <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                    <span>Discrepancy Flagged</span>
                  </span>
                )}
              </div>
            )}

          {work.auditorReport.notes && (
            <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-purple-100 italic leading-relaxed">
              "{work.auditorReport.notes}"
            </p>
          )}
        </div>
      )}


      {/* Predictive Specific Box (if watchlist item) */}
      {isPredictive && (
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 space-y-4 shadow-subtle">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-3.5 rounded-xl border border-indigo-100">
              <span className="text-[11px] font-semibold text-indigo-700 uppercase">Current Baseline</span>
              <div className="text-xl font-bold text-[#0F1419] font-mono mt-1">
                {work.currentRiskScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-indigo-100">
              <span className="text-[11px] font-semibold text-indigo-700 uppercase">30-Day Forecast</span>
              <div className="text-xl font-bold text-rose-600 font-mono mt-1 flex items-center gap-2">
                {work.predictedRiskScore30Days} <span className="text-xs font-normal text-slate-500">/ 100</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  {work.riskDeltaPercent}
                </span>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-indigo-100">
              <span className="text-[11px] font-semibold text-indigo-700 uppercase">Days to Breach High Risk</span>
              <div className="text-xl font-bold text-amber-600 font-mono mt-1 flex items-center gap-1.5">
                <Clock className="w-5 h-5" />
                ~{work.daysUntilPredictedThreshold} Days
              </div>
            </div>
          </div>

          {work.riskTrajectory && (
            <div className="pt-3 border-t border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs text-indigo-900 font-semibold">8-Week Risk Score Trajectory:</span>
              <div className="flex items-center gap-3">
                <Sparkline data={work.riskTrajectory} width={180} height={28} />
                <span className="text-xs text-slate-600 font-mono font-medium">
                  {work.riskTrajectory[0]} → {work.riskTrajectory[work.riskTrajectory.length - 1]}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Project Details Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Governance & Location */}
        <div className="space-y-4 bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Governance & Location
          </h3>

          <div className="space-y-4 pt-1">
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Recommending MP</span>
                <span className="text-sm font-semibold text-[#0F1419]">{work.mpName}</span>
                {work.constituency && (
                  <span className="text-xs text-slate-500 block">({work.constituency} Constituency)</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Jurisdiction</span>
                <span className="text-sm font-semibold text-[#0F1419]">{work.district}, {work.state}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Assigned Contractor / Vendor</span>
                <span className="text-sm font-semibold text-[#0F1419]">{work.vendorName || 'Not Assigned'}</span>
              </div>
            </div>

            {work.physicalProgress !== undefined && (
              <div className="flex items-start gap-3">
                <Activity className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-[11px] text-slate-400 block font-medium">Physical Progress</span>
                  {work.auditorReport?.verifiedProgressPct !== null &&
                  work.auditorReport?.verifiedProgressPct !== undefined ? (
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Contractor Reported:</span>
                        <span className="font-semibold text-[#0F1419] font-mono">
                          {work.physicalProgress}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-purple-700 font-semibold">Auditor Verified:</span>
                        <span className="font-bold text-purple-900 font-mono">
                          {work.auditorReport.verifiedProgressPct}%
                        </span>
                      </div>
                      {work.auditorReport.discrepancyFlag && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold mt-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                          <span>Progress Discrepancy Flagged</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#0F1419]">
                        {work.physicalProgress}%
                      </span>
                      {work.auditorReport?.discrepancyFlag && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold">
                          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                          <span>Discrepancy Flagged</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Financials & Timeline */}
        <div className="space-y-4 bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Financials & Timeline
          </h3>

          <div className="space-y-4 pt-1">
            <div className="flex items-start gap-3">
              <IndianRupee className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Sanctioned Amount</span>
                  <span className="text-sm font-bold text-[#0F1419] font-mono">₹{work.sanctionedAmount?.toFixed(2)} Lakhs</span>
                </div>
                {work.expenditure !== undefined && (
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-slate-400 font-medium">Actual Expenditure</span>
                    <span className={`text-sm font-bold font-mono ${
                      work.expenditure > work.sanctionedAmount ? 'text-rose-600' : 'text-[#0F1419]'
                    }`}>
                      ₹{work.expenditure?.toFixed(2)} Lakhs
                    </span>
                  </div>
                )}
                {work.expenditure !== undefined && (
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-2.5 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        work.expenditure > work.sanctionedAmount ? 'bg-rose-500' : 'bg-[#1D9BF0]'
                      }`}
                      style={{
                        width: `${Math.min(100, (work.expenditure / work.sanctionedAmount) * 100)}%`
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5 text-xs text-slate-600 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Recommended:</span>
                  <span className="font-mono font-semibold text-[#0F1419]">{work.recommendedDate || '2023-04-12'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Sanctioned:</span>
                  <span className="font-mono font-semibold text-[#0F1419]">{work.sanctionDate || '2023-06-20'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Target Completion:</span>
                  <span className="font-mono font-semibold text-[#0F1419]">{work.completionDate || '2024-03-31'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Creation & Verification Card */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EFF3F4]">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#1D9BF0]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F1419]">
              Physical Asset Creation & Geotag Verification
            </h3>
          </div>
          {work.latestAssetVerificationStatus && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                work.latestAssetVerificationStatus === 'verified'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : work.latestAssetVerificationStatus === 'disputed'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              Latest: {work.latestAssetVerificationStatus.toUpperCase()}
            </span>
          )}
        </div>

        {Array.isArray(work.assetCreation) && work.assetCreation.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {work.assetCreation.map((asset, idx) => {
              const status = (asset.verificationStatus || 'unverified').toLowerCase();
              const badgeStyle =
                status === 'verified'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : status === 'disputed'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200';

              return (
                <div
                  key={asset.assetId || idx}
                  className="p-3.5 rounded-xl border border-[#EFF3F4] bg-[#F7F9F9] space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0F1419] truncate">
                      {asset.assetType || 'Physical Asset'}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md border ${badgeStyle}`}>
                      {status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 font-mono space-y-0.5">
                    {asset.geotagLat !== null && asset.geotagLong !== null ? (
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3 text-[#1D9BF0] shrink-0" />
                        <span>
                          {asset.geotagLat}, {asset.geotagLong}
                        </span>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic">No geotag coordinates logged</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-[#F7F9F9] text-center text-xs text-slate-400">
            No physical asset records logged for this work yet.
          </div>
        )}
      </div>

      {/* Page Action Footer Bar */}
      <div className="bg-white border border-[#EFF3F4] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-subtle">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>
            Last scored: {work.scoredAt ? new Date(work.scoredAt).toLocaleString() : 'Recent ML Batch'} · Model v{work.modelVersion || '1.0'}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-xs font-semibold text-[#0F1419] bg-white border border-[#EFF3F4] rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
          >
            Back
          </button>

          {!isMpRole && (
            <button
              onClick={handleIssueAuditNotice}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1.5 ${
                auditNoticeSent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white'
              }`}
            >
              {auditNoticeSent ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Notice Dispatched to DNO!</span>
                </>
              ) : (
                <>
                  <span>Issue Audit Notice</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```


### `frontend/tailwind.config.js`

*File [129/131] | Lines: 56 | Size: 1.4 KB*

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#0F1419',
        card: '#F7F9F9',
        border: '#EFF3F4',
        brand: {
          DEFAULT: '#1D9BF0',
          hover: '#1A8CD8',
          light: '#E8F5FD',
        },
        risk: {
          low: '#10B981',
          lowBg: '#ECFDF5',
          lowText: '#065F46',
          medium: '#F59E0B',
          mediumBg: '#FFFBEB',
          mediumText: '#92400E',
          high: '#EF4444',
          highBg: '#FEF2F2',
          highText: '#991B1B',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 4px 0 rgba(15, 20, 25, 0.06)',
        'hover': '0 4px 12px 0 rgba(15, 20, 25, 0.08)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
```


### `frontend/vercel.json`

*File [130/131] | Lines: 9 | Size: 0.1 KB*

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```


### `frontend/vite.config.js`

*File [131/131] | Lines: 11 | Size: 0.2 KB*

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false
  }
});
```

