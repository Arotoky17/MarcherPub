require('dotenv').config()
const express = require('express')

const app = express()

// DEBUG - AJOUTEZ CECI EN PREMIER
console.log('=== DEBUG VARIABLES ===')
console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY)
console.log('Toutes les variables:', Object.keys(process.env))
console.log('========================')

// NE PAS créer le client Supabase pour l'instant
// const supabase = createClient(...) // COMMENTEZ CETTE LIGNE

app.get('/debug', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL || 'MANQUANTE',
    hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
    nodeEnv: process.env.NODE_ENV,
    allSupabaseVars: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
  })
})

app.listen(process.env.PORT || 5000, () => {
  console.log('Server started')
})