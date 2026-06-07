/**
 * Apply schema migration for payment method fields via Neon WebSocket.
 * Run: npx tsx scripts/migrate-payment-method.ts
 */
import 'dotenv/config'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

async function main() {
  console.log('Applying payment method migration...')

  // 1. Create PaymentMethod enum
  await sql`DO $$ BEGIN
    CREATE TYPE "PaymentMethod" AS ENUM ('PAGO_MOVIL', 'ZELLE');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$`
  console.log('✓ PaymentMethod enum created (or already exists)')

  // 2. Add paymentMethod column to Payment table
  await sql`ALTER TABLE "Payment"
    ADD COLUMN IF NOT EXISTS "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'PAGO_MOVIL'`
  console.log('✓ paymentMethod column added')

  // 3. Add senderName column
  await sql`ALTER TABLE "Payment"
    ADD COLUMN IF NOT EXISTS "senderName" TEXT`
  console.log('✓ senderName column added')

  // 4. Add senderEmail column
  await sql`ALTER TABLE "Payment"
    ADD COLUMN IF NOT EXISTS "senderEmail" TEXT`
  console.log('✓ senderEmail column added')

  // 5. Add zelleEmail to Setting
  await sql`ALTER TABLE "Setting"
    ADD COLUMN IF NOT EXISTS "zelleEmail" TEXT NOT NULL DEFAULT 'kissigloxxi@hotmail.com'`
  console.log('✓ zelleEmail column added to Setting')

  // 6. Verify
  const result = await sql`
    SELECT column_name, data_type, column_default
    FROM information_schema.columns
    WHERE table_name = 'Payment'
    AND column_name IN ('paymentMethod', 'senderName', 'senderEmail')
    ORDER BY column_name`
  console.log('\nPayment columns:')
  for (const row of result) {
    console.log(`  ${row.column_name}: ${row.data_type} (default: ${row.column_default})`)
  }

  console.log('\n✅ Migration complete!')
}

main().catch(e => { console.error(e); process.exit(1) })
