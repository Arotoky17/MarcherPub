require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

app.get('/api/test', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('count')
    if (error) throw error
    res.json({ success: true, message: 'DB connectée!' })
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

app.listen(process.env.PORT || 5000)