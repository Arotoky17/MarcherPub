require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()

app.use(cors({
  origin: '*' // Temporaire pour test
}))
app.use(express.json())

// Connexion Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Test de connexion avec vos vraies tables
app.get('/test-db', async (req, res) => {
  try {
    // Test sur chaque table
    const usersTest = await supabase.from('users').select('count', { count: 'exact' })
    const offresTest = await supabase.from('offres').select('count', { count: 'exact' })
    const candidaturesTest = await supabase.from('candidatures').select('count', { count: 'exact' })
    
    res.json({ 
      success: true, 
      message: 'Toutes les tables sont connectées!',
      tables: {
        users: usersTest.count || 0,
        offres: offresTest.count || 0,
        candidatures: candidaturesTest.count || 0
      }
    })
  } catch (error) {
    res.json({ 
      success: false, 
      error: error.message 
    })
  }
})

// Routes API pour vos tables
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*')
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/offres', async (req, res) => {
  try {
    const { data, error } = await supabase.from('offres').select('*')
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/candidatures', async (req, res) => {
  try {
    const { data, error } = await supabase.from('candidatures').select('*')
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(process.env.PORT || 5000, () => {
  console.log('🚀 Server ready!')
})