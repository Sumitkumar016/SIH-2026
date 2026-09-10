-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('ministry', 'mp', 'district', 'state', 'auditor');

-- CreateEnum
CREATE TYPE "work_status" AS ENUM ('Recommended', 'Sanctioned', 'Ongoing', 'Completed');

-- CreateEnum
CREATE TYPE "evidence_status" AS ENUM ('present', 'missing');

-- CreateEnum
CREATE TYPE "verification_status" AS ENUM ('verified', 'unverified', 'disputed');

-- CreateEnum
CREATE TYPE "risk_level" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "escalation_source_type" AS ENUM ('ai', 'ministry', 'state', 'district');

-- CreateEnum
CREATE TYPE "auditor_conclusion" AS ENUM ('Confirmed Anomaly', 'False Positive', 'Requires Field Action');

-- CreateEnum
CREATE TYPE "auditor_report_status" AS ENUM ('Under Review', 'Resolved', 'Escalated');

-- CreateTable
CREATE TABLE "asset_creation" (
    "asset_id" SERIAL NOT NULL,
    "work_id" VARCHAR(100) NOT NULL,
    "asset_type" VARCHAR(100),
    "geotag_lat" DECIMAL(10,8),
    "geotag_long" DECIMAL(11,8),
    "verification_status" "verification_status" NOT NULL DEFAULT 'unverified',

    CONSTRAINT "asset_creation_pkey" PRIMARY KEY ("asset_id")
);

-- CreateTable
CREATE TABLE "auditor_reports" (
    "report_id" SERIAL NOT NULL,
    "work_id" VARCHAR(100) NOT NULL,
    "conclusion" "auditor_conclusion" NOT NULL,
    "notes" TEXT,
    "status" "auditor_report_status" NOT NULL,
    "verified_progress_pct" DECIMAL(5,2),
    "discrepancy_flag" BOOLEAN NOT NULL DEFAULT false,
    "submitted_by" VARCHAR(150) DEFAULT 'Auditor',
    "submitted_date" DATE,

    CONSTRAINT "auditor_reports_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "districts" (
    "district_id" SERIAL NOT NULL,
    "district_name" VARCHAR(100) NOT NULL,
    "state_id" INTEGER NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("district_id")
);

-- CreateTable
CREATE TABLE "escalations" (
    "escalation_id" SERIAL NOT NULL,
    "work_id" VARCHAR(100) NOT NULL,
    "escalation_source" "escalation_source_type" NOT NULL,
    "escalation_note" TEXT,
    "escalated_by" VARCHAR(150),
    "escalated_by_user_id" INTEGER,
    "escalated_date" DATE,

    CONSTRAINT "escalations_pkey" PRIMARY KEY ("escalation_id")
);

-- CreateTable
CREATE TABLE "expenditures" (
    "expenditure_id" SERIAL NOT NULL,
    "work_id" VARCHAR(100) NOT NULL,
    "vendor_id" INTEGER,
    "amount" DECIMAL(15,2) NOT NULL,
    "payment_date" DATE NOT NULL,
    "payment_status" VARCHAR(50),

    CONSTRAINT "expenditures_pkey" PRIMARY KEY ("expenditure_id")
);

-- CreateTable
CREATE TABLE "mps" (
    "mp_id" SERIAL NOT NULL,
    "mp_name" VARCHAR(150) NOT NULL,
    "constituency" VARCHAR(150),
    "state_id" INTEGER NOT NULL,
    "allocated_amount" DECIMAL(15,2),

    CONSTRAINT "mps_pkey" PRIMARY KEY ("mp_id")
);

-- CreateTable
CREATE TABLE "predictions" (
    "prediction_id" SERIAL NOT NULL,
    "work_id" VARCHAR(100) NOT NULL,
    "current_risk_score" DECIMAL(5,2),
    "predicted_risk_score_30d" DECIMAL(5,2),
    "risk_delta_pct" DECIMAL(5,2),
    "warning_signal" VARCHAR(255),
    "days_until_threshold" INTEGER,
    "predicted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("prediction_id")
);

-- CreateTable
CREATE TABLE "risk_scores" (
    "risk_id" SERIAL NOT NULL,
    "work_id" VARCHAR(100) NOT NULL,
    "is_current" BOOLEAN NOT NULL DEFAULT true,
    "risk_score" DECIMAL(5,2),
    "risk_level" "risk_level",
    "cost_overrun_pct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "delay_slippage_pct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "duplicate_similarity_pct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "vendor_anomaly_pct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "progress_mismatch_pct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "flag_reason" VARCHAR(255),
    "ai_diagnostic_summary" TEXT,
    "calculated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "risk_scores_pkey" PRIMARY KEY ("risk_id")
);

-- CreateTable
CREATE TABLE "states" (
    "state_id" SERIAL NOT NULL,
    "state_name" VARCHAR(100) NOT NULL,
    "type" VARCHAR(20),

    CONSTRAINT "states_pkey" PRIMARY KEY ("state_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "user_role" NOT NULL,
    "mp_id" INTEGER,
    "district_id" INTEGER,
    "state_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "vendor_id" SERIAL NOT NULL,
    "vendor_name" VARCHAR(200) NOT NULL,
    "registration_number" VARCHAR(100),
    "contact_info" VARCHAR(255),

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("vendor_id")
);

-- CreateTable
CREATE TABLE "works" (
    "work_id" VARCHAR(100) NOT NULL,
    "mp_id" INTEGER NOT NULL,
    "district_id" INTEGER NOT NULL,
    "state_id" INTEGER NOT NULL,
    "category" VARCHAR(100),
    "description" TEXT,
    "recommended_amount" DECIMAL(15,2),
    "sanctioned_amount" DECIMAL(15,2),
    "recommended_date" DATE,
    "sanction_date" DATE,
    "completion_date" DATE,
    "status" "work_status" NOT NULL,
    "current_risk_score_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "works_pkey" PRIMARY KEY ("work_id")
);

-- CreateTable
CREATE TABLE "work_progress" (
    "progress_id" SERIAL NOT NULL,
    "work_id" VARCHAR(100) NOT NULL,
    "report_date" DATE NOT NULL,
    "physical_progress_pct" DECIMAL(5,2),
    "expected_progress_pct" DECIMAL(5,2),
    "evidence_status" "evidence_status" NOT NULL DEFAULT 'missing',
    "photo_url" VARCHAR(500),
    "geotag_lat" DECIMAL(10,8),
    "geotag_long" DECIMAL(11,8),
    "reported_by" VARCHAR(150),

    CONSTRAINT "work_progress_pkey" PRIMARY KEY ("progress_id")
);

-- CreateIndex
CREATE INDEX "asset_creation_work_id_idx" ON "asset_creation"("work_id");

-- CreateIndex
CREATE INDEX "auditor_reports_work_id_idx" ON "auditor_reports"("work_id");

-- CreateIndex
CREATE INDEX "auditor_reports_status_idx" ON "auditor_reports"("status");

-- CreateIndex
CREATE INDEX "auditor_reports_conclusion_idx" ON "auditor_reports"("conclusion");

-- CreateIndex
CREATE INDEX "districts_state_id_idx" ON "districts"("state_id");

-- CreateIndex
CREATE INDEX "escalations_work_id_idx" ON "escalations"("work_id");

-- CreateIndex
CREATE INDEX "escalations_escalation_source_idx" ON "escalations"("escalation_source");

-- CreateIndex
CREATE INDEX "escalations_escalated_by_user_id_idx" ON "escalations"("escalated_by_user_id");

-- CreateIndex
CREATE INDEX "expenditures_work_id_idx" ON "expenditures"("work_id");

-- CreateIndex
CREATE INDEX "expenditures_vendor_id_idx" ON "expenditures"("vendor_id");

-- CreateIndex
CREATE INDEX "mps_state_id_idx" ON "mps"("state_id");

-- CreateIndex
CREATE UNIQUE INDEX "predictions_work_id_key" ON "predictions"("work_id");

-- CreateIndex
CREATE INDEX "predictions_work_id_idx" ON "predictions"("work_id");

-- CreateIndex
CREATE INDEX "risk_scores_work_id_idx" ON "risk_scores"("work_id");

-- CreateIndex
CREATE INDEX "risk_scores_risk_level_idx" ON "risk_scores"("risk_level");

-- CreateIndex
CREATE INDEX "risk_scores_work_id_calculated_at_idx" ON "risk_scores"("work_id", "calculated_at");

-- CreateIndex
CREATE UNIQUE INDEX "states_state_name_key" ON "states"("state_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_mp_id_idx" ON "users"("mp_id");

-- CreateIndex
CREATE INDEX "users_district_id_idx" ON "users"("district_id");

-- CreateIndex
CREATE INDEX "users_state_id_idx" ON "users"("state_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_registration_number_key" ON "vendors"("registration_number");

-- CreateIndex
CREATE INDEX "vendors_vendor_name_idx" ON "vendors"("vendor_name");

-- CreateIndex
CREATE UNIQUE INDEX "works_current_risk_score_id_key" ON "works"("current_risk_score_id");

-- CreateIndex
CREATE INDEX "works_mp_id_idx" ON "works"("mp_id");

-- CreateIndex
CREATE INDEX "works_district_id_idx" ON "works"("district_id");

-- CreateIndex
CREATE INDEX "works_state_id_idx" ON "works"("state_id");

-- CreateIndex
CREATE INDEX "works_status_idx" ON "works"("status");

-- CreateIndex
CREATE INDEX "work_progress_work_id_idx" ON "work_progress"("work_id");

-- AddForeignKey
ALTER TABLE "asset_creation" ADD CONSTRAINT "asset_creation_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("work_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditor_reports" ADD CONSTRAINT "auditor_reports_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("work_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("state_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalations" ADD CONSTRAINT "escalations_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("work_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalations" ADD CONSTRAINT "escalations_escalated_by_user_id_fkey" FOREIGN KEY ("escalated_by_user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenditures" ADD CONSTRAINT "expenditures_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("work_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenditures" ADD CONSTRAINT "expenditures_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("vendor_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mps" ADD CONSTRAINT "mps_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("state_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("work_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_scores" ADD CONSTRAINT "risk_scores_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("work_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_mp_id_fkey" FOREIGN KEY ("mp_id") REFERENCES "mps"("mp_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("district_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("state_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "works" ADD CONSTRAINT "works_mp_id_fkey" FOREIGN KEY ("mp_id") REFERENCES "mps"("mp_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "works" ADD CONSTRAINT "works_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("district_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "works" ADD CONSTRAINT "works_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("state_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "works" ADD CONSTRAINT "works_current_risk_score_id_fkey" FOREIGN KEY ("current_risk_score_id") REFERENCES "risk_scores"("risk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_progress" ADD CONSTRAINT "work_progress_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("work_id") ON DELETE CASCADE ON UPDATE CASCADE;
