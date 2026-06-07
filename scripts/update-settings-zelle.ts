import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL!)
async function main() {
  await sql`UPDATE "Setting" SET "zelleEmail" = 'kissigloxxi@hotmail.com' WHERE id = 'default'`
  console.log('✅ zelleEmail set in DB')
}
main().catch(e => { console.error(e); process.exit(1) })
