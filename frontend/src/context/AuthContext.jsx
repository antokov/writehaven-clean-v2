import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import i18n from '../i18n'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Token aus localStorage laden
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (token && savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      // Token in axios defaults setzen
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Set i18n language from user preference
      if (userData.language) {
        i18n.changeLanguage(userData.language)
      }
    }

    setLoading(false)
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
    // Set i18n language
    if (userData.language) {
      i18n.changeLanguage(userData.language)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    // Update i18n language if language changed
    if (userData.language) {
      i18n.changeLanguage(userData.language)
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
