-- MPLADS AI-Powered Anomaly/Risk Detection and Early Warning Platform
-- Schema DDL for PostgreSQL
-- Migration: 001_init (corrected to match current schema.prisma)

-- Drop existing tables and types if recreating (clean setup)
-- DROP SCHEMA public CASCADE; CREATE SCHEMA public;

-- =============================================================================
-- ENUM TYPES
-- =============================================================================
-- NOTE: house_type enum REMOVED — was only used by mps.house, which has been
-- removed entirely from the schema.

CREATE TYPE user_role AS ENUM (
    'ministry',
    'mp',
    'district',
    'state',
    'auditor'
);

CREATE TYPE work_status AS ENUM (
    'Recommended',
    'Sanctioned',
    'Ongoing',
    'Completed'
);

CREATE TYPE evidence_status AS ENUM (
    'present',
    'missing'
);

CREATE TYPE verification_status AS ENUM (
    'verified',
    'unverified',
    'disputed'
);

CREATE TYPE risk_level AS ENUM (
    'Low',
    'Medium',
    'High'
);

CREATE TYPE escalation_source_type AS ENUM (
    'ai',
    'ministry',
    'state',
    'district'
);

CREATE TYPE auditor_conclusion AS ENUM (
    'Confirmed Anomaly',
    'False Positive',
    'Requires Field Action'
);

CREATE TYPE auditor_report_status AS ENUM (
    'Under Review',
    'Resolved',
    'Escalated'
);

-- =============================================================================
-- 1. states
-- FIX: region -> type (matches real CSV data: 'STATE' or 'UT')
-- =============================================================================
CREATE TABLE states (
    state_id SERIAL PRIMARY KEY,
    state_name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(20)
);

-- =============================================================================
-- 2. districts (unchanged)
-- =============================================================================
CREATE TABLE districts (
    district_id SERIAL PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL,
    state_id INTEGER NOT NULL,
    CONSTRAINT fk_districts_state FOREIGN KEY (state_id) 
        REFERENCES states(state_id) ON DELETE RESTRICT
);
CREATE INDEX idx_districts_state_id ON districts(state_id);

-- =============================================================================
-- 3. mps
-- FIX: house column REMOVED, district_id column + FK REMOVED,
--      annual_entitlement REMOVED, allocated_amount ADDED
-- =============================================================================
CREATE TABLE mps (
    mp_id SERIAL PRIMARY KEY,
    mp_name VARCHAR(150) NOT NULL,
    constituency VARCHAR(150),
    state_id INTEGER NOT NULL,
    allocated_amount NUMERIC(15, 2),
    CONSTRAINT fk_mps_state FOREIGN KEY (state_id) 
        REFERENCES states(state_id) ON DELETE RESTRICT
);
CREATE INDEX idx_mps_state_id ON mps(state_id);

-- =============================================================================
-- 4. vendors (unchanged)
-- =============================================================================
CREATE TABLE vendors (
    vendor_id SERIAL PRIMARY KEY,
    vendor_name VARCHAR(200) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    contact_info VARCHAR(255)
);
CREATE INDEX idx_vendors_vendor_name ON vendors(vendor_name);

-- =============================================================================
-- 5. users
-- FIX: password_hash -> password (plaintext, no hashing for this prototype)
-- =============================================================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    mp_id INTEGER,
    district_id INTEGER,
    state_id INTEGER,
    CONSTRAINT fk_users_mp FOREIGN KEY (mp_id) 
        REFERENCES mps(mp_id) ON DELETE SET NULL,
    CONSTRAINT fk_users_district FOREIGN KEY (district_id) 
        REFERENCES districts(district_id) ON DELETE SET NULL,
    CONSTRAINT fk_users_state FOREIGN KEY (state_id) 
        REFERENCES states(state_id) ON DELETE SET NULL
);
CREATE INDEX idx_users_mp_id ON users(mp_id);
CREATE INDEX idx_users_district_id ON users(district_id);
CREATE INDEX idx_users_state_id ON users(state_id);

-- =============================================================================
-- 6. works
-- FIX: vendor_id column + FK + index REMOVED (moved to expenditures)
-- =============================================================================
CREATE TABLE works (
    work_id VARCHAR(100) PRIMARY KEY, -- e.g. 'WS/MP620/2024-2025/133166'
    mp_id INTEGER NOT NULL,
    district_id INTEGER NOT NULL,
    state_id INTEGER NOT NULL,
    category VARCHAR(100),
    description TEXT,
    sanctioned_amount NUMERIC(15, 2) NOT NULL,
    recommended_date DATE,
    sanction_date DATE,
    fund_released_date DATE,
    completion_date DATE,
    expected_duration_days INTEGER DEFAULT 365,
    status work_status NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_works_mp FOREIGN KEY (mp_id) 
        REFERENCES mps(mp_id) ON DELETE RESTRICT,
    CONSTRAINT fk_works_district FOREIGN KEY (district_id) 
        REFERENCES districts(district_id) ON DELETE RESTRICT,
    CONSTRAINT fk_works_state FOREIGN KEY (state_id) 
        REFERENCES states(state_id) ON DELETE RESTRICT
);
CREATE INDEX idx_works_mp_id ON works(mp_id);
CREATE INDEX idx_works_district_id ON works(district_id);
CREATE INDEX idx_works_state_id ON works(state_id);
CREATE INDEX idx_works_status ON works(status);

-- =============================================================================
-- 7. expenditures (1-to-N with works)
-- FIX: vendor_id column + FK + index ADDED (moved here from works)
-- FIX: payment_mode -> payment_status (matches real source data meaning)
-- =============================================================================
CREATE TABLE expenditures (
    expenditure_id SERIAL PRIMARY KEY,
    work_id VARCHAR(100) NOT NULL,
    vendor_id INTEGER,
    amount NUMERIC(15, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_status VARCHAR(50),
    released_by VARCHAR(150),
    CONSTRAINT fk_expenditures_work FOREIGN KEY (work_id) 
        REFERENCES works(work_id) ON DELETE CASCADE,
    CONSTRAINT fk_expenditures_vendor FOREIGN KEY (vendor_id) 
        REFERENCES vendors(vendor_id) ON DELETE SET NULL
);
CREATE INDEX idx_expenditures_work_id ON expenditures(work_id);
CREATE INDEX idx_expenditures_vendor_id ON expenditures(vendor_id);

-- =============================================================================
-- 8. work_progress (unchanged)
-- =============================================================================
CREATE TABLE work_progress (
    progress_id SERIAL PRIMARY KEY,
    work_id VARCHAR(100) NOT NULL,
    report_date DATE NOT NULL,
    physical_progress_pct NUMERIC(5, 2),
    expected_progress_pct NUMERIC(5, 2),
    evidence_status evidence_status NOT NULL DEFAULT 'missing',
    photo_url VARCHAR(500),
    reported_by VARCHAR(150),
    CONSTRAINT fk_work_progress_work FOREIGN KEY (work_id) 
        REFERENCES works(work_id) ON DELETE CASCADE
);
CREATE INDEX idx_work_progress_work_id ON work_progress(work_id);

-- =============================================================================
-- 9. asset_creation (unchanged)
-- =============================================================================
CREATE TABLE asset_creation (
    asset_id SERIAL PRIMARY KEY,
    work_id VARCHAR(100) NOT NULL,
    asset_type VARCHAR(100),
    geotag_lat NUMERIC(10, 8),
    geotag_long NUMERIC(11, 8),
    verification_status verification_status NOT NULL DEFAULT 'unverified',
    CONSTRAINT fk_asset_creation_work FOREIGN KEY (work_id) 
        REFERENCES works(work_id) ON DELETE CASCADE
);
CREATE INDEX idx_asset_creation_work_id ON asset_creation(work_id);

-- =============================================================================
-- 10. risk_scores (unchanged)
-- =============================================================================
CREATE TABLE risk_scores (
    risk_id SERIAL PRIMARY KEY,
    work_id VARCHAR(100) UNIQUE NOT NULL,
    risk_score NUMERIC(5, 2),
    risk_level risk_level,
    cost_overrun_pct NUMERIC(5, 2) NOT NULL DEFAULT 0,
    delay_slippage_pct NUMERIC(5, 2) NOT NULL DEFAULT 0,
    duplicate_similarity_pct NUMERIC(5, 2) NOT NULL DEFAULT 0,
    vendor_anomaly_pct NUMERIC(5, 2) NOT NULL DEFAULT 0,
    progress_mismatch_pct NUMERIC(5, 2) NOT NULL DEFAULT 0,
    flag_reason VARCHAR(255),
    ai_diagnostic_summary TEXT,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_risk_scores_work FOREIGN KEY (work_id) 
        REFERENCES works(work_id) ON DELETE CASCADE
);
CREATE INDEX idx_risk_scores_work_id ON risk_scores(work_id);
CREATE INDEX idx_risk_scores_risk_level ON risk_scores(risk_level);

-- =============================================================================
-- 11. predictions (unchanged)
-- =============================================================================
CREATE TABLE predictions (
    prediction_id SERIAL PRIMARY KEY,
    work_id VARCHAR(100) UNIQUE NOT NULL,
    current_risk_score NUMERIC(5, 2),
    predicted_risk_score_30d NUMERIC(5, 2),
    risk_delta_pct NUMERIC(5, 2),
    warning_signal VARCHAR(255),
    days_until_threshold INTEGER,
    predicted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_predictions_work FOREIGN KEY (work_id) 
        REFERENCES works(work_id) ON DELETE CASCADE
);
CREATE INDEX idx_predictions_work_id ON predictions(work_id);

-- =============================================================================
-- 12. escalations (unchanged)
-- =============================================================================
CREATE TABLE escalations (
    escalation_id SERIAL PRIMARY KEY,
    work_id VARCHAR(100) NOT NULL,
    escalation_source escalation_source_type NOT NULL,
    escalation_note TEXT,
    escalated_by VARCHAR(150),
    escalated_date DATE,
    CONSTRAINT fk_escalations_work FOREIGN KEY (work_id) 
        REFERENCES works(work_id) ON DELETE CASCADE
);
CREATE INDEX idx_escalations_work_id ON escalations(work_id);
CREATE INDEX idx_escalations_source ON escalations(escalation_source);

-- =============================================================================
-- 13. auditor_reports (unchanged)
-- =============================================================================
CREATE TABLE auditor_reports (
    report_id SERIAL PRIMARY KEY,
    work_id VARCHAR(100) NOT NULL,
    conclusion auditor_conclusion NOT NULL,
    notes TEXT,
    status auditor_report_status NOT NULL,
    verified_progress_pct NUMERIC(5, 2),
    discrepancy_flag BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_by VARCHAR(150) DEFAULT 'Auditor',
    submitted_date DATE,
    CONSTRAINT fk_auditor_reports_work FOREIGN KEY (work_id) 
        REFERENCES works(work_id) ON DELETE CASCADE
);
CREATE INDEX idx_auditor_reports_work_id ON auditor_reports(work_id);
CREATE INDEX idx_auditor_reports_status ON auditor_reports(status);
CREATE INDEX idx_auditor_reports_conclusion ON auditor_reports(conclusion);