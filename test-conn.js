require('dotenv').config({ path: __dirname + '/.env' })
const ws = require('./node_modules/ws')
const { neonConfig, Pool } = require('./node_modules/@neondatabase/serverless')
neonConfig.webSocketConstructor = ws
console.log('ws type:', typeof ws.WebSocket)
console.log('URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.slice(0,50) : 'MISSING')
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
pool.query('SELECT 1 as ok').then(r => {
  console.log('Pool query OK:', r.rows)
  return pool.end()
}).catch(e => {
  console.log('Pool ERR:', e.message)
  pool.end()
})
