-- DropForeignKey
ALTER TABLE "asset_creation" DROP CONSTRAINT "fk_asset_creation_work";

-- DropForeignKey
ALTER TABLE "auditor_reports" DROP CONSTRAINT "fk_auditor_reports_work";

-- DropForeignKey
ALTER TABLE "districts" DROP CONSTRAINT "fk_districts_state";

-- DropForeignKey
ALTER TABLE "escalations" DROP CONSTRAINT "fk_escalations_work";

-- DropForeignKey
ALTER TABLE "expenditures" DROP CONSTRAINT "fk_expenditures_vendor";

-- DropForeignKey
ALTER TABLE "expenditures" DROP CONSTRAINT "fk_expenditures_work";

-- DropForeignKey
ALTER TABLE "mps" DROP CONSTRAINT "fk_mps_state";

-- DropForeignKey
ALTER TABLE "predictions" DROP CONSTRAINT "fk_predictions_work";

-- DropForeignKey
ALTER TABLE "risk_scores" DROP CONSTRAINT "fk_risk_scores_work";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "fk_users_district";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "fk_users_mp";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "fk_users_state";

-- DropForeignKey
ALTER TABLE "work_progress" DROP CONSTRAINT "fk_work_progress_work";

-- DropForeignKey
ALTER TABLE "works" DROP CONSTRAINT "fk_works_district";

-- DropForeignKey
ALTER TABLE "works" DROP CONSTRAINT "fk_works_mp";

-- DropForeignKey
ALTER TABLE "works" DROP CONSTRAINT "fk_works_state";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "works" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "asset_creation" ADD CONSTRAINT "asset_creation_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("work_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditor_reports" ADD CONSTRAINT "auditor_reports_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("work_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("state_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalations" ADD CONSTRAINT "escalations_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("work_id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "work_progress" ADD CONSTRAINT "work_progress_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("work_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "idx_asset_creation_work_id" RENAME TO "asset_creation_work_id_idx";

-- RenameIndex
ALTER INDEX "idx_auditor_reports_conclusion" RENAME TO "auditor_reports_conclusion_idx";

-- RenameIndex
ALTER INDEX "idx_auditor_reports_status" RENAME TO "auditor_reports_status_idx";

-- RenameIndex
ALTER INDEX "idx_auditor_reports_work_id" RENAME TO "auditor_reports_work_id_idx";

-- RenameIndex
ALTER INDEX "idx_districts_state_id" RENAME TO "districts_state_id_idx";

-- RenameIndex
ALTER INDEX "idx_escalations_source" RENAME TO "escalations_escalation_source_idx";

-- RenameIndex
ALTER INDEX "idx_escalations_work_id" RENAME TO "escalations_work_id_idx";

-- RenameIndex
ALTER INDEX "idx_expenditures_vendor_id" RENAME TO "expenditures_vendor_id_idx";

-- RenameIndex
ALTER INDEX "idx_expenditures_work_id" RENAME TO "expenditures_work_id_idx";

-- RenameIndex
ALTER INDEX "idx_mps_state_id" RENAME TO "mps_state_id_idx";

-- RenameIndex
ALTER INDEX "idx_predictions_work_id" RENAME TO "predictions_work_id_idx";

-- RenameIndex
ALTER INDEX "idx_risk_scores_risk_level" RENAME TO "risk_scores_risk_level_idx";

-- RenameIndex
ALTER INDEX "idx_risk_scores_work_id" RENAME TO "risk_scores_work_id_idx";

-- RenameIndex
ALTER INDEX "idx_users_district_id" RENAME TO "users_district_id_idx";

-- RenameIndex
ALTER INDEX "idx_users_mp_id" RENAME TO "users_mp_id_idx";

-- RenameIndex
ALTER INDEX "idx_users_state_id" RENAME TO "users_state_id_idx";

-- RenameIndex
ALTER INDEX "idx_vendors_vendor_name" RENAME TO "vendors_vendor_name_idx";

-- RenameIndex
ALTER INDEX "idx_work_progress_work_id" RENAME TO "work_progress_work_id_idx";

-- RenameIndex
ALTER INDEX "idx_works_district_id" RENAME TO "works_district_id_idx";

-- RenameIndex
ALTER INDEX "idx_works_mp_id" RENAME TO "works_mp_id_idx";

-- RenameIndex
ALTER INDEX "idx_works_state_id" RENAME TO "works_state_id_idx";

-- RenameIndex
ALTER INDEX "idx_works_status" RENAME TO "works_status_idx";
