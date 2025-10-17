import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { getTheme, type ThemeMode } from './theme'
import { PeraWalletConnect } from '@perawallet/connect'

const pera = new PeraWalletConnect()

function App() {
  const [mode, setMode] = useState<ThemeMode>(() => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  const theme = useMemo(() => getTheme(mode), [mode])
  const [accounts, setAccounts] = useState<string[]>([])

  useEffect(() => {
    document.documentElement.style.background = theme.background
    document.documentElement.style.color = theme.foreground
  }, [theme])

  const toggleMode = () => setMode((m) => (m === 'light' ? 'dark' : 'light'))

  async function connectPera() {
    try {
      const accs = await pera.connect()
      setAccounts(accs)
    } catch (e) {
      console.error(e)
    }
  }

  async function copyAddress(address: string) {
    try {
      await navigator.clipboard.writeText(address)
      // Lightweight visual feedback by briefly changing document title
      const prev = document.title
      document.title = 'Copied address!'
      setTimeout(() => (document.title = prev), 800)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr', gap: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: theme.card, borderBottom: `2px solid ${theme.primary}` }}>
        <h1 style={{ margin: 0 }}>HosConnect</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={toggleMode} style={{ background: theme.secondary, color: '#0f1222', padding: '8px 12px', borderRadius: 8, border: 'none' }}>
            {mode === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
          <button onClick={connectPera} style={{ background: theme.primary, color: '#0f1222', padding: '8px 12px', borderRadius: 8, border: 'none' }}>
            {accounts.length ? 'Connected' : 'Connect Pera'}
          </button>
        </div>
      </header>
      <main style={{ padding: 24 }}>
        <div style={{ background: theme.card, borderRadius: 12, padding: 24, border: `1px solid ${theme.secondary}` }}>
          <h2 style={{ marginTop: 0 }}>Welcome</h2>
          <p style={{ opacity: 0.9 }}>A medical dApp on Algorand with Pera Wallet.</p>
          {accounts.length > 0 && (
            <div>
              <h3>Accounts</h3>
              <ul>
                {accounts.map((a) => (
                  <li key={a} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#16a34a', wordBreak: 'break-all' }}>{a}</span>
                    <button
                      onClick={() => copyAddress(a)}
                      style={{
                        background: theme.secondary,
                        color: '#0f1222',
                        padding: '4px 8px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Copy
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
