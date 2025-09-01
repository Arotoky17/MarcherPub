require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const app = express()

// CORS pour votre frontend Vercel
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://votre-app.vercel.app' // Changez par votre vraie URL Vercel
  ],
  credentials: true
}))

app.use(express.json())

// Connexion Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'API Backend connectée!' })
})

// Test de connexion DB
app.get('/api/test', async (req, res) => {
  try {
    const usersCount = await supabase.from('users').select('count', { count: 'exact' })
    const offresCount = await supabase.from('offres').select('count', { count: 'exact' })
    const candidaturesCount = await supabase.from('candidatures').select('count', { count: 'exact' })
    
    res.json({ 
      success: true,
      message: 'Base de données connectée!',
      tables: {
        users: usersCount.count,
        offres: offresCount.count,
        candidatures: candidaturesCount.count
      }
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    })
  }
})

// Routes CRUD pour Users
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*')
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([req.body])
      .select()
    
    if (error) throw error
    res.status(201).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Routes CRUD pour Offres
app.get('/api/offres', async (req, res) => {
  try {
    const { data, error } = await supabase.from('offres').select('*')
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/offres', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('offres')
      .insert([req.body])
      .select()
    
    if (error) throw error
    res.status(201).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Routes CRUD pour Candidatures
app.get('/api/candidatures', async (req, res) => {
  try {
    const { data, error } = await supabase.from('candidatures').select('*')
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/candidatures', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('candidatures')
      .insert([req.body])
      .select()
    
    if (error) throw error
    res.status(201).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})