-- DropIndex
DROP INDEX "certificate_templates_event_id_idx";

-- DropIndex
DROP INDEX "event_settlements_event_id_idx";

-- DropIndex
DROP INDEX "transactions_event_id_idx";

-- DropIndex
DROP INDEX "transactions_user_id_idx";

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "ticket_id" SET DEFAULT '';
