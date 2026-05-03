import { useEffect, useState } from 'react'
import Calculator from './Calculater.jsx'

function App() {
   // Persist theme preference in localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('calc-theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('calc-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }


  return (
    <Calculator theme={theme} onThemeToggle={toggleTheme} />

  )
}

export default App
