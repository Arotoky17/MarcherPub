// src/config/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// src/services/api.js
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'

export const testConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/api/test-db`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erreur de connexion:', error)
    throw error
  }
}