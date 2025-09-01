const express = require('express')
const app = express()

// TEST SANS DOTENV NI SUPABASE
app.get('/', (req, res) => {
  res.json({
    message: 'Server basic OK',
    env_count: Object.keys(process.env).length,
    has_supabase_url: !!process.env.SUPABASE_URL,
    has_supabase_key: !!process.env.SUPABASE_ANON_KEY,
    supabase_url_value: process.env.SUPABASE_URL || 'UNDEFINED',
    all_supabase_vars: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
  })
})

app.listen(process.env.PORT || 5000)