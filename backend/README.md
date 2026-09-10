# ⚙️ MPLADS SENTINEL — Backend API & Data Engine
### Smart India Hackathon 2026 • Backend Architecture, Database Schema & Complete API Specification

> **MPLADS SENTINEL Backend** is an enterprise-grade REST API server built for the **Ministry of Statistics and Programme Implementation (MoSPI), Government of India**. Powered by **Node.js**, **Express 5**, **Prisma ORM 6**, and **PostgreSQL**, it serves as the high-integrity data backbone for automated early-warning anomaly detection, forensic audit reporting, multi-state contractor collusion tracking, and photographic ground verification across 38,000+ MPLADS projects nationwide.

---

## 📑 Table of Contents
1. [System Overview & Architecture](#1-system-overview--architecture)
2. [Technology Stack](#2-technology-stack)
3. [Repository Directory Structure](#3-repository-directory-structure)
4. [Relational Database Architecture (PostgreSQL + Prisma)](#4-relational-database-architecture-postgresql--prisma)
   - [Prisma Schema Folder Architecture](#prisma-schema-folder-architecture)
   - [Entity-Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
   - [Detailed Data Models & Table Definitions](#detailed-data-models--table-definitions)
   - [PostgreSQL Custom ENUM Types](#postgresql-custom-enum-types)
5. [Authentication & Role-Based Access Control (RBAC)](#5-authentication--role-based-access-control-rbac)
   - [Authentication Flow](#authentication-flow)
   - [Pre-Seeded Demo Credentials](#pre-seeded-demo-credentials)
   - [JWT Token Structure](#jwt-token-structure)
6. [Complete REST API Specification & Endpoint Contracts](#6-complete-rest-api-specification--endpoint-contracts)
   - [System & Health Diagnostics](#system--health-diagnostics)
   - [Authentication & Identity](#authentication--identity)
   - [Ministry Domain Endpoints (National Oversight)](#ministry-domain-endpoints-national-oversight)
   - [Shared Work Detail & Justification Endpoints](#shared-work-detail--justification-endpoints)
   - [Member of Parliament (MP) Endpoints](#member-of-parliament-mp-endpoints)
   - [District Authority Endpoints (Collectorate)](#district-authority-endpoints-collectorate)
   - [State Nodal Authority Endpoints](#state-nodal-authority-endpoints)
   - [Independent Forensic Auditor Endpoints](#independent-forensic-auditor-endpoints)
7. [Middleware Architecture & Pipeline](#7-middleware-architecture--pipeline)
   - [Authentication Guard (`protect`)](#authentication-guard-protect)
   - [Role Guard (`restrictTo`)](#role-guard-restrictto)
   - [Zod Request Validation Middleware](#zod-request-validation-middleware)
   - [Centralized Error Handler](#centralized-error-handler)
8. [Database Connection & Pool Management](#8-database-connection--pool-management)
9. [Environment Variables & Configuration](#9-environment-variables--configuration)
10. [Local Development & Setup Guide](#10-local-development--setup-guide)

---

## 1. System Overview & Architecture

The backend engine provides:
- **Zero-Trust Role-Based Access Control**: Strict segregation between National Ministry leadership, State Nodal Authorities, Members of Parliament, District Collectorates, and Independent Forensic Auditors.
- **Relational Integrity for Public Finance**: ACID-compliant tracking of developmental works, milestone payments, vendor disbursements, photographic evidence, and formal auditor findings.
- **AI Telemetry & Explainability Integration**: Dedicated storage and endpoints for multi-factor risk scores ($W_1-W_4$), 30-day escalation predictions, and formal escalations.
- **Fail-Fast Configuration**: Strict environment bootstrapping ensuring missing variables prevent startup rather than causing runtime crashes.

```mermaid
graph TD
    Client[React Frontend / API Client] -->|HTTP / JSON| ExpressApp[Express 5 Server]
    ExpressApp --> Helmet[Helmet Security Headers]
    ExpressApp --> Cors[CORS Middleware]
    ExpressApp --> JsonParser[JSON Body Parser]
    
    ExpressApp --> AuthRouter["/api/auth Router"]
    ExpressApp --> MinistryRouter["/api/ministry Router"]
    ExpressApp --> WorkRouter["/api/works Router"]
    ExpressApp --> MpRouter["/api/mp Router"]
    ExpressApp --> DistrictRouter["/api/district Router"]
    ExpressApp --> StateRouter["/api/state Router"]
    ExpressApp --> AuditorRouter["/api/auditor Router"]

    MinistryRouter --> ProtectMW["protect (JWT Verification)"]
    MinistryRouter --> RestrictMW["restrictTo (Role Enforcement)"]
    
    MinistryRouter --> MinistryCtrl[Ministry Controller]
    MinistryCtrl --> MinistrySvc[Domain Services]
    MinistrySvc --> PrismaClient[Prisma ORM Singleton]
    PrismaClient --> Postgres[(PostgreSQL / Supabase Database)]
    
    ExpressApp --> ErrMW[Centralized Error Middleware]
```

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime Environment** | Node.js (ES Modules) | `>=18.0.0` | Native ECMAScript modules (`"type": "module"`) |
| **Web Framework** | Express.js | `^5.2.1` | Next-gen HTTP server with native async error handling |
| **ORM & Query Builder**| Prisma ORM | `^6.19.3` | Type-safe database client with multi-file schema folder |
| **Database Engine** | PostgreSQL | `>=14` | Relational storage (Supabase Cloud or local instance) |
| **Security Headers** | Helmet | `^8.3.0` | HTTP security headers (XSS, Clickjacking, MIME sniffing) |
| **CORS Handling** | CORS | `^2.8.6` | Cross-Origin Resource Sharing control |
| **Data Validation** | Zod | `^4.4.3` | Schema declaration and strict runtime request validation |
| **Authentication** | JSON Web Token (`jsonwebtoken`) | `^9.0.3` | Signed stateless 8-hour access tokens |
| **Environment Config** | `dotenv` | `^17.4.2` | Environment variable parsing and isolation |
| **Development Tooling**| `nodemon` | `^3.1.14` | Automated hot-reloading development server |

---

## 3. Repository Directory Structure

```
backend/
├── package.json              # NPM dependencies, metadata, and scripts
├── .env                      # Local environment configuration (PORT, DATABASE_URL, JWT)
├── .env.example              # Template environment configuration
├── .gitignore                # Git exclusion rules (node_modules, .env)
│
├── prisma/                   # Prisma ORM & Database Layer
│   ├── schema.prisma         # Master Prisma configuration (generator, datasource)
│   ├── migrations/           # Versioned migration history
│   │   ├── 001_init/         # Initial baseline migration
│   │   ├── 001_init.sql      # Raw reference SQL DDL with comments and indexes
│   │   └── migration_lock.toml
│   └── models/               # Multi-file Schema Folder (Prisma 6 Preview Feature)
│       ├── Enums.prisma      # Custom PostgreSQL ENUM definitions
│       ├── State.prisma      # Administrative States & UTs
│       ├── District.prisma   # Districts mapped to parent States
│       ├── Mp.prisma         # Members of Parliament records
│       ├── User.prisma       # Authentication identities & RBAC scopes
│       ├── Work.prisma       # Core MPLADS project entity
│       ├── WorkProgress.prisma # Physical execution milestone logs
│       ├── Expenditure.prisma  # Financial milestone disbursement logs
│       ├── RiskScore.prisma    # Multi-factor AI anomaly telemetry
│       ├── Prediction.prisma   # 30-day early warning risk forecasting
│       ├── Escalation.prisma   # Formal administrative escalation records
│       ├── AuditorReport.prisma# Independent forensic investigation reports
│       ├── Vendor.prisma       # Contracting entities & syndicates
│       └── AssetCreation.prisma# Geotagged physical asset verification logs
│
└── src/                      # Application Source Code
    ├── server.js             # Process bootstrapping, DB connection verification & port binding
    ├── app.js                # Express app configuration, route mounting, middleware pipeline
    │
    ├── config/               # Configuration modules
    │   ├── db.js             # PrismaClient singleton instance & graceful shutdown hooks
    │   └── env.js            # Environment validation & fail-fast bootstrapping
    │
    ├── middleware/           # Reusable Express middleware
    │   ├── auth.middleware.js# protect (JWT verification) & restrictTo (role checking)
    │   ├── validate.middleware.js # Zod schema request body validator
    │   └── error.middleware.js    # Global centralized error handler & masking
    │
    ├── validators/           # Zod schema definitions
    │   └── auth.validator.js # Login schema validation rules
    │
    ├── utils/                # Utility helpers
    │   ├── asyncHandler.js   # Wrapper catching unhandled rejections in async routes
    │   ├── jwt.js            # JWT signing and verification utilities
    │   ├── password.js       # Password verification helper
    │   ├── stateCodeMap.js   # Two-letter state code mapping helper
    │   ├── workStatus.js     # MPLADS status normalization & fiscal year calculators
    │   └── resolveVendorName.js # Normalized vendor string resolution
    │
    ├── services/             # Core Business Logic & Database Queries
    │   ├── auth.service.js
    │   ├── ministryOverview.service.js
    │   ├── mpPerformance.service.js
    │   ├── trendsAnalytics.service.js
    │   ├── prediction.service.js
    │   ├── workDetail.service.js
    │   ├── mpOverview.service.js
    │   ├── mpWorks.service.js
    │   ├── districtOverview.service.js
    │   ├── verificationQueue.service.js
    │   ├── stateOverview.service.js
    │   ├── auditorQueue.service.js
    │   ├── auditorCase.service.js
    │   ├── vendorForensics.service.js
    │   └── shared/
    │       └── latestFor.service.js
    │
    ├── controllers/          # HTTP Request/Response Handlers
    │   ├── auth.controller.js
    │   ├── ministry.controller.js
    │   ├── work.controller.js
    │   ├── mp.controller.js
    │   ├── district.controller.js
    │   ├── state.controller.js
    │   └── auditor.controller.js
    │
    └── routes/               # Express Route Definitions
        ├── auth.routes.js
        ├── ministry.routes.js
        ├── work.routes.js
        ├── mp.routes.js
        ├── district.routes.js
        ├── state.routes.js
        └── auditor.routes.js
```

---

## 4. Relational Database Architecture (PostgreSQL + Prisma)

### Prisma Schema Folder Architecture

The database utilizes Prisma 6's `prismaSchemaFolder` preview feature, allowing schemas to be modularized across 14 focused files in `prisma/models/`:

```prisma
// prisma/schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["prismaSchemaFolder"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    STATE ||--o{ DISTRICT : "contains"
    STATE ||--o{ MP : "elects"
    STATE ||--o{ USER : "scopes"
    STATE ||--o{ WORK : "locates"

    DISTRICT ||--o{ MP : "associates"
    DISTRICT ||--o{ USER : "scopes"
    DISTRICT ||--o{ WORK : "administers"

    MP ||--o{ USER : "linked to"
    MP ||--o{ WORK : "recommends"

    USER ||--o{ AUDITOR_REPORT : "authors"
    USER ||--o{ WORK_PROGRESS : "records"

    VENDOR ||--o{ WORK : "executes"

    WORK ||--o{ WORK_PROGRESS : "milestones"
    WORK ||--o{ EXPENDITURE : "disbursements"
    WORK ||--o| RISK_SCORE : "evaluates"
    WORK ||--o| PREDICTION : "forecasts"
    WORK ||--o{ ESCALATION : "triggers"
    WORK ||--o{ AUDITOR_REPORT : "investigated by"
    WORK ||--o{ ASSET_CREATION : "physical proofs"
```

### Detailed Data Models & Table Definitions

| Model | Table Name | Purpose | Primary Keys / Key Foreign Keys |
| :--- | :--- | :--- | :--- |
| `State` | `states` | Administrative states and union territories | `state_id` (PK), `state_name` |
| `District` | `districts` | Administrative districts within states | `district_id` (PK), `state_id` (FK) |
| `Mp` | `mps` | Lok Sabha / Rajya Sabha Members of Parliament | `mp_id` (PK), `state_id` (FK), `district_id` (FK) |
| `User` | `users` | Role-based system users (Ministry, MP, District, State, Auditor) | `user_id` (PK), `email` (Unique), `mp_id`, `district_id`, `state_id` |
| `Work` | `works` | Core MPLADS recommended, sanctioned, or ongoing works | `work_id` (PK), `mp_id`, `district_id`, `state_id`, `vendor_id` |
| `WorkProgress` | `work_progress` | Physical execution milestone logs & completion % | `progress_id` (PK), `work_id` (FK), `recorded_by` (FK) |
| `Expenditure` | `expenditures` | Financial disbursement amounts and installments | `expenditure_id` (PK), `work_id` (FK), `amount` |
| `RiskScore` | `risk_scores` | Multi-factor AI anomaly telemetry ($W_1-W_4$ weights) | `risk_id` (PK), `work_id` (FK, Unique), `overall_score`, `risk_level` |
| `Prediction` | `predictions` | 30-day early warning risk forecasting | `prediction_id` (PK), `work_id` (FK, Unique), `predicted_delay_days` |
| `Escalation` | `escalations` | Formal administrative flags transferred to auditors | `escalation_id` (PK), `work_id` (FK), `escalated_by`, `status` |
| `AuditorReport` | `auditor_reports` | Independent forensic findings & conclusions | `report_id` (PK), `work_id` (FK), `auditor_id` (FK), `conclusion` |
| `Vendor` | `vendors` | Contractors and executing agencies | `vendor_id` (PK), `vendor_name`, `pan_number` |
| `AssetCreation` | `asset_creations` | Geotagged photographic asset validation logs | `asset_id` (PK), `work_id` (FK), `latitude`, `longitude`, `photo_url` |

### PostgreSQL Custom ENUM Types

| ENUM Name in DB | Prisma Name | Allowed Values |
| :--- | :--- | :--- |
| `user_role` | `Role` | `'ministry'`, `'mp'`, `'district'`, `'state'`, `'auditor'` |
| `work_status` | `WorkStatus` | `'Recommended'`, `'Sanctioned'`, `'Ongoing'`, `'Completed'` |
| `evidence_status` | `EvidenceStatus` | `'present'`, `'missing'` |
| `verification_status` | `VerificationStatus`| `'verified'`, `'unverified'`, `'disputed'` |
| `risk_level` | `RiskLevel` | `'Low'`, `'Medium'`, `'High'` |
| `escalation_source_type` | `EscalationSource` | `'ai'`, `'ministry'`, `'state'`, `'district'` |
| `auditor_conclusion` | `AuditorConclusion` | `'Confirmed Anomaly'`, `'False Positive'`, `'Requires Field Action'` |
| `auditor_report_status`| `AuditorReportStatus`| `'Under Review'`, `'Resolved'`, `'Escalated'` |

---

## 5. Authentication & Role-Based Access Control (RBAC)

### Authentication Flow
1. Client submits email and password to `POST /api/auth/login`.
2. Zod validates request payload formatting.
3. Controller retrieves user record by lowercase email from `prisma.user`.
4. Secure credential verification executes.
5. On match, a signed JWT containing user ID and Role is generated (valid for 8 hours).
6. Safe user profile (with password excluded) and the token are returned to the client.

---

### Pre-Seeded Demo Credentials

| Email | Password | Role | Entity Name / Context | Scope IDs |
| :--- | :--- | :--- | :--- | :--- |
| `ministry@mplads.gov.in` | `ministry@mplads123` | `ministry` | MoSPI Ministry Admin | National Scope |
| `bihar@mplads.gov.in` | `bihar@mplads123` | `state` | Bihar State Nodal Authority | `state_id: 5` |
| `abhaykumarsinha@mplads.gov.in` | `abhaykumarsinha@mplads123` | `mp` | Abhay Kumar Sinha (MP, Aurangabad) | `mp_id: 3`, `state_id: 5` |
| `aurangabad@mplads.gov.in` | `aurangabad@mplads123` | `district` | Aurangabad District Authority | `district_id: 84`, `state_id: 5` |
| `auditor@mplads.gov.in` | `auditor@mplads123` | `auditor` | Central Forensic Auditor | Central Forensic Wing |

---

### JWT Token Structure

Tokens generated by `src/utils/jwt.js` contain:
```json
{
  "user_id": 758,
  "name": "ABHAY KUMAR SINHA",
  "role": "mp",
  "mp_id": 3,
  "district_id": null,
  "state_id": 5,
  "iat": 1725880000,
  "exp": 1725908800
}
```

---

## 6. Complete REST API Specification & Endpoint Contracts

### System & Health Diagnostics

#### `GET /api/health`
- **Access**: Public
- **Description**: Uptime monitor and server health verification.
- **Response**: `200 OK`
```json
{
  "success": true,
  "message": "SIH backend is running",
  "environment": "development",
  "timestamp": "2026-09-10T14:00:00.000Z"
}
```

---

### Authentication & Identity

#### `POST /api/auth/login`
- **Access**: Public
- **Body**:
```json
{
  "email": "ministry@mplads.gov.in",
  "password": "ministry@mplads123"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "name": "Ministry Admin",
    "role": "ministry",
    "mp_id": null,
    "district_id": null,
    "state_id": null
  }
}
```

#### `GET /api/auth/me`
- **Access**: Protected (`Authorization: Bearer <token>`)
- **Response**: `200 OK`
```json
{
  "success": true,
  "user": {
    "user_id": 1,
    "name": "Ministry Admin",
    "role": "ministry",
    "mp_id": null,
    "district_id": null,
    "state_id": null
  }
}
```

---

### Ministry Domain Endpoints (National Oversight)
> **Access Requirement**: `protect`, `restrictTo('ministry')`

#### `GET /api/ministry/overview`
- **Description**: National KPI rollups, funds sanctioned/released, risk score distributions, state risk rankings, and 10 most critical alerts.
- **Response**: `200 OK`
```json
{
  "kpis": {
    "totalRecommended": 38450,
    "totalSanctioned": 34120,
    "totalCompleted": 28940,
    "totalSanctionedFunds": 14250.75,
    "totalDisbursedFunds": 11840.20,
    "flaggedAnomaliesCount": 412
  },
  "riskDistribution": {
    "high": 182,
    "medium": 230,
    "low": 38038
  },
  "stateSummaries": [
    {
      "stateId": 5,
      "stateName": "Bihar",
      "stateCode": "BR",
      "totalWorks": 3200,
      "highRiskCount": 42,
      "mediumRiskCount": 38,
      "completionRate": 74.2
    }
  ],
  "recentAlerts": [...]
}
```

#### `GET /api/ministry/flagged`
- **Description**: Paginated, filterable register of high/medium risk works nationwide.
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 20)
  - `search` (text search by title, ID, or MP name)
  - `state` (filter by state ID or name)
  - `category` (filter by infrastructure sector)
  - `riskLevel` (`High`, `Medium`)
  - `status` (`Recommended`, `Sanctioned`, `Ongoing`, `Completed`)
  - `sortBy`, `sortOrder`
- **Response**: `200 OK`
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 12,
    "totalCount": 230,
    "limit": 20
  }
}
```

#### `GET /api/ministry/mp-performance`
- **Description**: Evaluates and ranks all MPs by fund utilization % and completion rate. Handles edge cases where allocations or sanctioned funds are zero.
- **Query Parameters**: `search`, `state`, `district`, `utilizationRange`, `completionRange`, `sortField`, `sortDirection`
- **Response**: `200 OK`
```json
{
  "data": [
    {
      "mpId": 3,
      "mpName": "ABHAY KUMAR SINHA",
      "state": "Bihar",
      "district": "Aurangabad",
      "totalRecommended": 142,
      "totalSanctionedAmount": 1980.5,
      "totalExpenditure": 1640.2,
      "fundUtilization": 82.8,
      "completionRate": 78.4,
      "flaggedCount": 3
    }
  ],
  "top5": [...],
  "bottom5": [...]
}
```

#### `GET /api/ministry/trends`
- **Description**: Macro trends across the scheme: 12-month expenditure timeline, category vulnerability matrices, vendor contract concentration, and state performance benchmarks.
- **Response**: `200 OK` (Monthly trend objects, category anomaly distributions, top 10 vendor aggregates).

#### `GET /api/ministry/predictions`
- **Description**: 30-day early-warning predictive watchlists for works projected to slip schedule or exceed allocated funds.
- **Query Parameters**: `search`, `state`, `riskLevel`, `sortField`, `sortDirection`
- **Response**: `200 OK` (List of predicted high-risk slippages with confidence intervals).

---

### Shared Work Detail & Justification Endpoints

#### `GET /api/works/:workId`
- **Access**: Protected (Any valid authenticated role)
- **Description**: Complete dossier of a project: financial figures, contractor details, risk scores ($W_1-W_4$), photographic proofs, milestone timestamps, and audit history.
- **Response**: `200 OK`
```json
{
  "workId": "WRK-BR-2024-0089",
  "title": "Construction of Community Health Sub-Centre",
  "category": "Healthcare",
  "state": "Bihar",
  "district": "Aurangabad",
  "mpName": "ABHAY KUMAR SINHA",
  "sanctionedAmount": 45.0,
  "expenditureAmount": 42.5,
  "status": "Ongoing",
  "riskScore": {
    "overall": 82,
    "level": "High",
    "costInflation": 88,
    "delayRisk": 75,
    "vendorRisk": 85,
    "proximityRisk": 30
  },
  "vendor": {
    "name": "Magadh Infrastructure Pvt Ltd",
    "pan": "AAACM1234F"
  },
  "evidenceStatus": "missing",
  "auditHistory": [...]
}
```

#### `POST /api/works/:workId/justification`
- **Access**: Protected (`restrictTo('mp')`)
- **Description**: Allows an MP to submit an official justification for an anomaly flag on their project.
- **Body**:
```json
{
  "justification": "Delay occurred due to unseasonal monsoon flooding; revised execution timeline approved by district engineer."
}
```
- **Response**: `200 OK` (Updated work object with recorded justification).

#### `POST /api/works/:workId/audit-notice`
- **Access**: Protected (`restrictTo('ministry', 'district', 'state', 'auditor')`)
- **Description**: Issues an official notice placing a work under audit review.
- **Response**: `200 OK`

---

### Member of Parliament (MP) Endpoints
> **Access Requirement**: `protect`, `restrictTo('mp')` (Scoped to authenticated `req.user.mp_id`)

#### `GET /api/mp/overview`
- **Description**: MP constituency financial summary: annual entitlement (₹5 Cr), cumulative sanctions, expenditure, fund utilization %, and list of active flagged works in constituency.
- **Response**: `200 OK`

#### `GET /api/mp/works`
- **Description**: Complete portfolio of projects recommended by the MP with category and status filters.
- **Query Parameters**: `status`, `search`, `category`
- **Response**: `200 OK`

---

### District Authority Endpoints (Collectorate)
> **Access Requirement**: `protect`, `restrictTo('district')` (Scoped to authenticated `req.user.district_id`)

#### `GET /api/district/overview`
- **Description**: District summary KPIs: total sanctioned projects, funds disbursed, pending physical verifications, and per-MP work distributions.
- **Response**: `200 OK`

#### `GET /api/district/verification`
- **Description**: Ground verification queue displaying works reported as 100% completed that lack mandatory geotagged photographs.
- **Response**: `200 OK`

#### `POST /api/district/verification/:workId/verify`
- **Description**: Confirms ground photographic validation, clears the missing evidence flag, and logs a `WorkProgress` verification milestone.
- **Response**: `200 OK`

#### `POST /api/district/verification/:workId/request-evidence`
- **Description**: Issues a formal electronic reminder notice to the contractor and implementing agency.
- **Body**: `{ "note": "Submit high-resolution geotagged photos within 7 days" }`
- **Response**: `200 OK`

#### `POST /api/district/verification/:workId/escalate`
- **Description**: Escalates a suspected ghost project to the Central Forensic Auditor investigation queue.
- **Body**: `{ "note": "On-site physical inspection revealed foundation not commenced" }`
- **Response**: `200 OK`

---

### State Nodal Authority Endpoints
> **Access Requirement**: `protect`, `restrictTo('state')` (Scoped to authenticated `req.user.state_id`)

#### `GET /api/state/overview`
- **Description**: State-wide rollup metrics across all constituent districts, district comparative risk ranking, and state expenditure pace.
- **Response**: `200 OK`

#### `GET /api/state/districts/:districtName/summary`
- **Description**: Detailed drill-down for a selected district: total sanctioned amount, expenditure, and top 3 highest-risk projects.
- **Response**: `200 OK`

---

### Independent Forensic Auditor Endpoints
> **Access Requirement**: `protect`, `restrictTo('auditor')`

#### `GET /api/auditor/queue`
- **Description**: High-risk triage queue containing all works nationwide exhibiting severe cost inflation, delays, or administrative escalations.
- **Query Parameters**: `search`, `riskLevel`, `caseStatus`, `source`
- **Response**: `200 OK`

#### `GET /api/auditor/case/:workId`
- **Description**: Forensic investigation dossier: financial vouchers, risk factor radar scores, prior audit notes, and contractor historical performance.
- **Response**: `200 OK`

#### `POST /api/auditor/case/:workId/action`
- **Description**: Triggers audit lifecycle state transitions.
- **Body**:
```json
{
  "actionType": "Mark Under Review"
}
```
*Allowed actions: `"Request Physical Inspection"`, `"Request Supplementary Evidence"`, `"Mark Under Review"`, `"Resolve Case"`.*
- **Response**: `200 OK`

#### `POST /api/auditor/case/:workId/report`
- **Description**: Submits the final forensic audit finding.
- **Body**:
```json
{
  "conclusion": "Confirmed Anomaly",
  "notes": "Verified tender collusion: identical bidding documents submitted by 3 shell companies sharing the same registered address.",
  "status": "Escalated"
}
```
- **Response**: `200 OK`

#### `GET /api/auditor/vendor`
- **Description**: Algorithmic contractor collusion detection tool: identifies same-day contract splitting below ₹10 Lakh statutory competitive threshold, repeat identical billing amounts, and multi-state syndicates.
- **Response**: `200 OK` (Detailed vendor network graph with flagged cartel clusters).

---

## 7. Middleware Architecture & Pipeline

### 1. Authentication Guard (`protect`)
Located in `src/middleware/auth.middleware.js`:
- Inspects `req.headers.authorization`.
- Validates the `Bearer <token>` scheme.
- Calls `jwt.verify(token, config.jwtSecret)`.
- Mounts decoded payload onto `req.user`.
- Rejects missing or malformed tokens with `401 Unauthorized`.

### 2. Role Guard (`restrictTo`)
Located in `src/middleware/auth.middleware.js`:
- Factory function accepting allowed roles: `restrictTo('ministry', 'state')`.
- Compares `req.user.role` against arguments.
- Rejects unauthorized roles with `403 Forbidden`.

### 3. Zod Request Validation Middleware
Located in `src/middleware/validate.middleware.js`:
- Intercepts incoming requests before reaching the controller.
- Executes `schema.safeParse(req.body)`.
- On error, transforms raw Zod issues into clean `{ field, message }` arrays.
- On success, replaces `req.body` with sanitized parsed data and invokes `next()`.

### 4. Centralized Error Handler
Located in `src/middleware/error.middleware.js`:
- Universal 4-argument Express error boundary (`err, req, res, next`).
- Normalizes HTTP status codes (`statusCode` or default `500`).
- **Production Security Masking**: Masks internal stack traces and server error messages when `NODE_ENV === 'production'`, preventing database or schema leakage.

---

## 8. Database Connection & Pool Management

Located in `src/config/db.js`:
- **Singleton PrismaClient**: Instantiates a single `PrismaClient` instance to prevent connection starvation in serverless or multi-threaded environments.
- **Configurable Query Logging**: Automatically enables SQL query logging in `development` mode while restricting to errors in `production`.
- **Startup Connection Verification**: Executes `prisma.$connect()` before `app.listen()` to ensure the server never starts in a disconnected state.
- **Graceful Shutdown**: Listens for `SIGINT` (Ctrl+C) and `SIGTERM` signals to cleanly execute `prisma.$disconnect()` before terminating the Node process.

---

## 9. Environment Variables & Configuration

The configuration module `src/config/env.js` implements a **fail-fast check**: if any mandatory environment variable is empty, the application throws an immediate error and refuses to start.

| Variable | Required | Default | Purpose |
| :--- | :--- | :--- | :--- |
| `PORT` | Optional | `5000` | HTTP port for Express server |
| `NODE_ENV` | Optional | `development` | Environment mode (`development` / `production`) |
| `DATABASE_URL` | **Required** | None | PostgreSQL connection URI (Prisma format) |
| `JWT_SECRET` | **Required** | None | Secret key used for HMAC SHA-256 JWT signing |
| `JWT_EXPIRES_IN`| Optional | `7d` | Default validity duration of issued JWTs |
| `CORS_ORIGIN` | Optional | `*` | Allowed CORS origins for frontend client |

### Example `.env` File
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/mplads_db?schema=public"
JWT_SECRET="sih2026_super_secure_jwt_secret_key_987654321"
JWT_EXPIRES_IN=7d
CORS_ORIGIN="http://localhost:5173"
```

---

## 10. Local Development & Setup Guide

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **NPM**: `v9.0.0` or higher
- **PostgreSQL**: `v14+` running locally or a hosted Supabase / Neon PostgreSQL instance

### Installation & Execution

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Open .env and add your valid DATABASE_URL and JWT_SECRET
   ```

4. Generate Prisma Client from models:
   ```bash
   npx prisma generate
   ```

5. Apply database migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Start the development server with hot reload:
   ```bash
   npm run dev
   ```
   The backend API will start at `http://localhost:5000/`.

7. Verify API health:
   ```bash
   curl http://localhost:5000/api/health
   ```

---

*Developed for the **Smart India Hackathon 2026** • Ministry of Statistics and Programme Implementation (MoSPI) Problem Statement.*
