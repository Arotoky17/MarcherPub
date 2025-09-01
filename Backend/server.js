const express = require('express')
const { createClient } = require('@supabase/supabase-js')

const app = express()
app.use(express.json())

// METTEZ VOS VRAIES VALEURS ICI DIRECTEMENT
const SUPABASE_URL = 'https://elulxxtneaxxezpgyibs.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdWx4eHRuZWF4eGV6cGd5aWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0OTQxMDAsImV4cCI6MjA3MjA3MDEwMH0.S0I82pLie84AW7euw5ejXkDN3fMnoi-NiNCRx0pj_4s'

// Test de connexion directe
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

app.get('/', (req, res) => {
  res.json({ message: 'Test avec valeurs en dur' })
})

app.get('/test', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('count')
    if (error) throw error
    res.json({ success: true, message: 'DB connectée avec valeurs en dur!' })
  } catch (error) {
    res.json({ success: false, error: error.message })
  }
})

app.listen(process.env.PORT || 5000)