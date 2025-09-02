const API_URL = process.env.REACT_APP_BACKEND_URL || 'https://marcherpub.onrender.com'

export const api = {
  // Test de connexion
  async testConnection() {
    try {
      const response = await fetch(`${API_URL}/api/test-db`)
      return await response.json()
    } catch (error) {
      throw new Error(`Erreur de connexion: ${error.message}`)
    }
  },

  // Récupérer tous les users
  async getUsers() {
    try {
      const response = await fetch(`${API_URL}/api/users`)
      return await response.json()
    } catch (error) {
      throw new Error(`Erreur récupération users: ${error.message}`)
    }
  },

  // Créer un user
  async createUser(userData) {
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })
      return await response.json()
    } catch (error) {
      throw new Error(`Erreur création user: ${error.message}`)
    }
  }
}