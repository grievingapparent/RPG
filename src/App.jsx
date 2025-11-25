import React, { useState, useEffect } from 'react'

// PIN Protection - Uses environment variable
const APP_PIN = import.meta.env.VITE_APP_PIN

// Airtable Configuration - Uses environment variables for security
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Daily Logs'
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY

const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`

// PIN Entry Screen Component
function PinScreen({ onSuccess }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(false)

  const handleSubmit = () => {
    if (pin === APP_PIN) {
      if (rememberDevice) {
        localStorage.setItem('frs-device-auth', 'true')
      }
      onSuccess()
    } else {
      setError(true)
      setPin('')
      setTimeout(() => setError(false), 1500)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div style={pinStyles.container}>
      <div style={pinStyles.card}>
        <div style={pinStyles.gymBadge}>IRON HORSE</div>
        <h1 style={pinStyles.title}>FRS TRACKER</h1>
        <p style={pinStyles.subtitle}>Enter PIN to continue</p>
        
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          onKeyPress={handleKeyPress}
          placeholder="••••"
          style={{
            ...pinStyles.input,
            borderColor: error ? '#ff4444' : '#333',
            animation: error ? 'shake 0.5s ease' : 'none'
          }}
          autoFocus
        />
        
        {error && <p style={pinStyles.error}>Wrong PIN</p>}
        
        <label style={pinStyles.rememberLabel}>
          <input
            type="checkbox"
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
            style={pinStyles.checkbox}
          />
          Remember this device
        </label>
        
        <button onClick={handleSubmit} style={pinStyles.button}>
          ENTER
        </button>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  )
}

const pinStyles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"Barlow", system-ui, sans-serif',
  },
  card: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    maxWidth: '320px',
    width: '90%',
  },
  gymBadge: {
    fontSize: '11px',
    color: '#ff4444',
    letterSpacing: '3px',
    marginBottom: '5px',
    fontWeight: '700',
  },
  title: {
    fontSize: '28px',
    margin: '0 0 8px 0',
    fontWeight: '900',
    color: '#fff',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 24px 0',
  },
  input: {
    width: '100%',
    padding: '16px',
    fontSize: '24px',
    textAlign: 'center',
    letterSpacing: '8px',
    background: '#0a0a0a',
    border: '2px solid #333',
    borderRadius: '8px',
    color: '#fff',
    fontFamily: 'monospace',
    boxSizing: 'border-box',
    outline: 'none',
  },
  error: {
    color: '#ff4444',
    fontSize: '14px',
    margin: '12px 0 0 0',
  },
  rememberLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#666',
    margin: '20px 0',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(180deg, #ff4444 0%, #cc0000 100%)',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '2px',
    cursor: 'pointer',
  },
}

// Activity data with weights and categories
const ACTIVITIES = {
  core: {
    label: "CORE PRIORITY",
    weight: 3.0,
    items: [
      { id: 'gym', name: 'Gym Session', icon: '🥊' },
      { id: 'mcat', name: 'MCAT Study (Pomodoros)', icon: '📚', hasCount: true },
      { id: 'protein', name: 'Make Protein Shake', icon: '🥤' },
    ]
  },
  secondary: {
    label: "SECONDARY PRIORITY", 
    weight: 2.0,
    items: [
      { id: 'yoga', name: 'Yoga', icon: '🧘' },
      { id: 'meditation', name: 'Meditation', icon: '🕯️' },
      { id: 'bed', name: 'Make Bed', icon: '🛏️' },
      { id: 'tea', name: 'Make Tea', icon: '🍵' },
      { id: 'candle', name: 'Light Candle', icon: '🔥' },
      { id: 'extinguish', name: 'Extinguish All Flames', icon: '💨' },
      { id: 'reading', name: 'Physical Reading', icon: '📖' },
      { id: 'writing', name: 'Writing (Daughters/Dr. Larry)', icon: '✍️' },
      { id: 'janeuary', name: 'Jane-uary Prep', icon: '📝' },
      { id: 'french', name: 'Pimsleur French in Bath', icon: '🇫🇷' },
    ]
  },
  tertiary: {
    label: "TERTIARY PRIORITY",
    weight: 1.0,
    items: [
      { id: 'podcast', name: 'Podcast Recording', icon: '🎙️' },
      { id: 'tiktok', name: 'RavynReads TikTok Promo', icon: '📱' },
      { id: 'teeth', name: 'Brush Teeth/Wash Face/Cologne', icon: '🪥' },
      { id: 'hair', name: 'Wash Hair', icon: '🚿' },
      { id: 'body', name: 'Wash Body', icon: '🧼' },
      { id: 'dressed', name: 'Get Dressed Intentionally', icon: '👔' },
      { id: 'bag', name: 'Check Bag', icon: '🎒' },
      { id: 'digital', name: 'Digital Cleaning', icon: '🧹' },
      { id: 'audible', name: 'Audible on Commute', icon: '🎧' },
      { id: 'work', name: 'Settle in to Work', icon: '💼' },
      { id: 'commute', name: 'Commute Home', icon: '🚶' },
    ]
  }
}

const FIGHT_DATE = new Date('2026-02-22T00:00:00')
const START_DATE = new Date('2025-11-25T00:00:00')
const OPPONENT_FRS = 3.8
const TARGET_WEIGHT = 135
const START_WEIGHT = 145

// Airtable API functions
async function fetchAllRecords() {
  try {
    const response = await fetch(AIRTABLE_URL, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      }
    })
    const data = await response.json()
    return data.records || []
  } catch (error) {
    console.error('Error fetching from Airtable:', error)
    return []
  }
}

async function createRecord(fields) {
  try {
    const response = await fetch(AIRTABLE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields })
    })
    return await response.json()
  } catch (error) {
    console.error('Error creating record:', error)
    return null
  }
}

async function updateRecord(recordId, fields) {
  try {
    const response = await fetch(`${AIRTABLE_URL}/${recordId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields })
    })
    return await response.json()
  } catch (error) {
    console.error('Error updating record:', error)
    return null
  }
}

function App() {
  // PIN Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if device is remembered or if no PIN is set
    if (!APP_PIN) return true
    return localStorage.getItem('frs-device-auth') === 'true'
  })

  // All hooks must be declared before any conditional returns
  const [currentDate] = useState(new Date())
  const [checkedItems, setCheckedItems] = useState({})
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [currentWeight, setCurrentWeight] = useState(START_WEIGHT)
  const [history, setHistory] = useState([])
  const [todayRecordId, setTodayRecordId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncStatus, setSyncStatus] = useState('loading')

  // Format date as YYYY-MM-DD for Airtable
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  // Load data from Airtable on mount
  useEffect(() => {
    if (!isAuthenticated) return // Don't load if not authenticated
    
    async function loadData() {
      setLoading(true)
      setSyncStatus('syncing')
      
      const records = await fetchAllRecords()
      const todayStr = formatDate(currentDate)
      
      // Find today's record
      const todayRecord = records.find(r => r.fields.Date === todayStr)
      
      if (todayRecord) {
        setTodayRecordId(todayRecord.id)
        setCurrentWeight(todayRecord.fields.Weight || START_WEIGHT)
        setPomodoroCount(todayRecord.fields.Pomodoros || 0)
        try {
          setCheckedItems(JSON.parse(todayRecord.fields.CompletedActivities || '{}'))
        } catch {
          setCheckedItems({})
        }
      }
      
      // Build history from all records
      const historyData = records
        .filter(r => r.fields.Date && r.fields.DailyFRS !== undefined)
        .map(r => ({
          date: r.fields.Date,
          frs: r.fields.DailyFRS || 0,
          weight: r.fields.Weight || 0,
          pomodoros: r.fields.Pomodoros || 0,
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
      
      setHistory(historyData)
      setLoading(false)
      setSyncStatus('synced')
    }
    
    loadData()
  }, [isAuthenticated])

  // Show PIN screen if not authenticated
  if (!isAuthenticated) {
    return <PinScreen onSuccess={() => setIsAuthenticated(true)} />
  }

  // Calculate days remaining
  const daysRemaining = Math.ceil((FIGHT_DATE - currentDate) / (1000 * 60 * 60 * 24))
  const totalDays = Math.ceil((FIGHT_DATE - START_DATE) / (1000 * 60 * 60 * 24))
  const dayNumber = totalDays - daysRemaining + 1

  // Calculate daily FRS
  const calculateDailyFRS = () => {
    let totalWeight = 0
    let earnedScore = 0
    
    Object.entries(ACTIVITIES).forEach(([tier, { weight, items }]) => {
      items.forEach(item => {
        totalWeight += weight
        if (item.id === 'mcat') {
          const mcatScore = Math.min(pomodoroCount / 8, 1) * weight
          earnedScore += mcatScore
        } else if (checkedItems[item.id]) {
          earnedScore += weight
        }
      })
    })
    
    return totalWeight > 0 ? (earnedScore / totalWeight) * 5 : 0
  }

  const dailyFRS = calculateDailyFRS()
  
  // Calculate average FRS from history
  const avgFRS = history.length > 0 
    ? history.reduce((sum, day) => sum + day.frs, 0) / history.length 
    : dailyFRS

  // Toggle activity
  const toggleItem = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Save day to Airtable
  const saveDay = async () => {
    setSaving(true)
    setSyncStatus('syncing')
    
    const fields = {
      Date: formatDate(currentDate),
      Weight: currentWeight,
      Pomodoros: pomodoroCount,
      CompletedActivities: JSON.stringify(checkedItems),
      DailyFRS: Math.round(dailyFRS * 100) / 100,
    }
    
    let result
    if (todayRecordId) {
      result = await updateRecord(todayRecordId, fields)
    } else {
      result = await createRecord(fields)
      if (result && result.id) {
        setTodayRecordId(result.id)
      }
    }
    
    if (result) {
      // Update local history
      const todayStr = formatDate(currentDate)
      const existingIndex = history.findIndex(h => h.date === todayStr)
      const newEntry = { date: todayStr, frs: dailyFRS, weight: currentWeight, pomodoros: pomodoroCount }
      
      if (existingIndex >= 0) {
        const newHistory = [...history]
        newHistory[existingIndex] = newEntry
        setHistory(newHistory)
      } else {
        setHistory([...history, newEntry])
      }
      setSyncStatus('synced')
    } else {
      setSyncStatus('error')
    }
    
    setSaving(false)
  }

  // FRS comparison
  const winProbability = Math.min(Math.max((avgFRS - OPPONENT_FRS + 2.5) / 5 * 100, 5), 95)

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingScreen}>
          <div style={styles.loadingText}>SYNCING WITH BASE...</div>
          <div style={styles.loadingSubtext}>Iron Horse Wrestling Club</div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.noise} />
      
      {/* Sync Status */}
      <div style={{
        ...styles.syncBadge,
        background: syncStatus === 'synced' ? '#00ff8833' : syncStatus === 'error' ? '#ff444433' : '#ffaa0033',
        borderColor: syncStatus === 'synced' ? '#00ff88' : syncStatus === 'error' ? '#ff4444' : '#ffaa00',
      }}>
        {syncStatus === 'synced' ? '✓ Synced' : syncStatus === 'error' ? '✗ Error' : '↻ Syncing...'}
      </div>
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.gymBadge}>IRON HORSE</div>
          <h1 style={styles.title}>RAVYN SUMMERS</h1>
          <div style={styles.record}>0-0 • BANTAMWEIGHT • NYC CAGE WARS</div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.dayCounter}>DAY {dayNumber}</div>
          <div style={styles.dateDisplay}>{currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
        </div>
      </header>

      {/* Fight Countdown */}
      <section style={styles.countdownSection}>
        <div style={styles.countdownCard}>
          <div style={styles.countdownLabel}>DAYS TO FIGHT</div>
          <div style={styles.countdownNumber}>{daysRemaining}</div>
          <div style={styles.fightInfo}>
            <span style={styles.opponentName}>vs. JAVON "THE BLITZ" BARNES</span>
            <span style={styles.fightDate}>FEB 22, 2026</span>
          </div>
          <div style={styles.progressBarContainer}>
            <div style={{...styles.progressBar, width: `${((totalDays - daysRemaining) / totalDays) * 100}%`}} />
          </div>
        </div>
        
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>YOUR FRS</div>
            <div style={{...styles.statValue, color: dailyFRS >= OPPONENT_FRS ? '#00ff88' : '#ff4444'}}>
              {dailyFRS.toFixed(2)}
            </div>
            <div style={styles.statSub}>TODAY</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>AVG FRS</div>
            <div style={{...styles.statValue, color: avgFRS >= OPPONENT_FRS ? '#00ff88' : '#ff4444'}}>
              {avgFRS.toFixed(2)}
            </div>
            <div style={styles.statSub}>CAMP</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>OPPONENT</div>
            <div style={styles.statValue}>{OPPONENT_FRS.toFixed(2)}</div>
            <div style={styles.statSub}>HIDDEN</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>WIN PROB</div>
            <div style={{...styles.statValue, color: winProbability > 50 ? '#00ff88' : '#ff4444'}}>
              {winProbability.toFixed(0)}%
            </div>
            <div style={styles.statSub}>EST.</div>
          </div>
        </div>
      </section>

      {/* Weight Tracker */}
      <section style={styles.weightSection}>
        <div style={styles.weightHeader}>
          <span style={styles.weightLabel}>WEIGHT CUT</span>
          <span style={styles.weightTarget}>{currentWeight} → {TARGET_WEIGHT} lbs</span>
        </div>
        <div style={styles.weightControls}>
          <input
            type="number"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
            style={styles.weightInput}
            step="0.1"
          />
          <div style={styles.weightProgress}>
            <div style={{
              ...styles.weightBar, 
              width: `${Math.max(0, Math.min(100, ((START_WEIGHT - currentWeight) / (START_WEIGHT - TARGET_WEIGHT)) * 100))}%`
            }} />
          </div>
          <span style={styles.weightRemaining}>
            {(currentWeight - TARGET_WEIGHT).toFixed(1)} lbs to go
          </span>
        </div>
      </section>

      {/* MCAT Pomodoros */}
      <section style={styles.pomodoroSection}>
        <div style={styles.pomodoroHeader}>
          <span style={styles.pomodoroLabel}>📚 MCAT POMODOROS</span>
          <span style={styles.pomodoroCount}>{pomodoroCount} / 8</span>
        </div>
        <div style={styles.pomodoroControls}>
          <button 
            style={styles.pomodoroBtn} 
            onClick={() => setPomodoroCount(Math.max(0, pomodoroCount - 1))}
          >−</button>
          <div style={styles.pomodoroDots}>
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                style={{
                  ...styles.pomodoroDot,
                  background: i < pomodoroCount ? '#00ff88' : '#333'
                }}
              />
            ))}
          </div>
          <button 
            style={styles.pomodoroBtn} 
            onClick={() => setPomodoroCount(Math.min(12, pomodoroCount + 1))}
          >+</button>
        </div>
      </section>

      {/* Activity Checklist */}
      <section style={styles.activitiesSection}>
        {Object.entries(ACTIVITIES).map(([tier, { label, items }]) => (
          <div key={tier} style={styles.tierBlock}>
            <div style={{
              ...styles.tierLabel,
              background: tier === 'core' ? '#ff4444' : tier === 'secondary' ? '#ffaa00' : '#666'
            }}>
              {label}
            </div>
            <div style={styles.activityGrid}>
              {items.map(item => (
                item.id !== 'mcat' && (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    style={{
                      ...styles.activityBtn,
                      background: checkedItems[item.id] ? '#00ff8822' : '#1a1a1a',
                      borderColor: checkedItems[item.id] ? '#00ff88' : '#333'
                    }}
                  >
                    <span style={styles.activityIcon}>{item.icon}</span>
                    <span style={styles.activityName}>{item.name}</span>
                    {checkedItems[item.id] && <span style={styles.checkMark}>✓</span>}
                  </button>
                )
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Save & History */}
      <section style={styles.bottomSection}>
        <button 
          style={{
            ...styles.saveBtn,
            opacity: saving ? 0.7 : 1,
            cursor: saving ? 'wait' : 'pointer'
          }} 
          onClick={saveDay}
          disabled={saving}
        >
          {saving ? 'SAVING...' : `LOCK IN DAY ${dayNumber}`}
        </button>
        
        {history.length > 0 && (
          <div style={styles.historySection}>
            <div style={styles.historyLabel}>CAMP HISTORY ({history.length} days logged)</div>
            <div style={styles.historyGrid}>
              {history.slice(-14).map((day, i) => {
                const dayNum = history.indexOf(day) + 1
                return (
                  <div 
                    key={i} 
                    style={{
                      ...styles.historyDay,
                      background: day.frs >= OPPONENT_FRS ? '#00ff8833' : '#ff444433'
                    }}
                  >
                    <div style={styles.historyDayNum}>D{dayNum}</div>
                    <div style={styles.historyFRS}>{day.frs.toFixed(1)}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* Coach Clay Quote */}
      <footer style={styles.footer}>
        <div style={styles.coachQuote}>
          "Hard 90-minute wrestling session today. Focus on takedown defense and chain-wrestling from the clinch."
          <span style={styles.coachName}>— Coach Clay Peterson</span>
        </div>
      </footer>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#e0e0e0',
    fontFamily: '"Barlow", system-ui, sans-serif',
    padding: '20px',
    position: 'relative',
    maxWidth: '900px',
    margin: '0 auto',
  },
  noise: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    opacity: 0.03,
    pointerEvents: 'none',
    zIndex: 0,
  },
  syncBadge: {
    position: 'fixed',
    top: '10px',
    right: '10px',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: 'monospace',
    border: '1px solid',
    zIndex: 100,
  },
  loadingScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  loadingText: {
    fontSize: '24px',
    fontWeight: '900',
    color: '#00ff88',
    letterSpacing: '3px',
  },
  loadingSubtext: {
    fontSize: '12px',
    color: '#666',
    marginTop: '10px',
    letterSpacing: '2px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #222',
    position: 'relative',
    zIndex: 1,
  },
  headerLeft: {},
  gymBadge: {
    fontSize: '11px',
    color: '#ff4444',
    letterSpacing: '3px',
    marginBottom: '5px',
    fontWeight: '700',
  },
  title: {
    fontSize: '42px',
    margin: 0,
    letterSpacing: '-1px',
    fontWeight: '900',
    background: 'linear-gradient(180deg, #fff 0%, #888 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  record: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#666',
    letterSpacing: '2px',
    marginTop: '5px',
  },
  headerRight: {
    textAlign: 'right',
  },
  dayCounter: {
    fontSize: '32px',
    color: '#00ff88',
    fontWeight: '900',
  },
  dateDisplay: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#666',
  },
  countdownSection: {
    marginBottom: '30px',
    position: 'relative',
    zIndex: 1,
  },
  countdownCard: {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '25px',
    marginBottom: '15px',
  },
  countdownLabel: {
    fontFamily: 'monospace',
    fontSize: '11px',
    color: '#666',
    letterSpacing: '2px',
  },
  countdownNumber: {
    fontSize: '80px',
    color: '#fff',
    lineHeight: 1,
    marginBottom: '10px',
    fontWeight: '900',
  },
  fightInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  opponentName: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#ff4444',
    textTransform: 'uppercase',
  },
  fightDate: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#666',
  },
  progressBarContainer: {
    height: '4px',
    background: '#222',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #ff4444 0%, #ffaa00 50%, #00ff88 100%)',
    transition: 'width 0.3s ease',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
  },
  statCard: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: '6px',
    padding: '15px',
    textAlign: 'center',
  },
  statLabel: {
    fontFamily: 'monospace',
    fontSize: '10px',
    color: '#666',
    letterSpacing: '1px',
    marginBottom: '5px',
  },
  statValue: {
    fontSize: '28px',
    color: '#fff',
    fontWeight: '900',
  },
  statSub: {
    fontFamily: 'monospace',
    fontSize: '9px',
    color: '#444',
    letterSpacing: '1px',
  },
  weightSection: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: '6px',
    padding: '15px 20px',
    marginBottom: '20px',
    position: 'relative',
    zIndex: 1,
  },
  weightHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  weightLabel: {
    fontFamily: 'monospace',
    fontSize: '11px',
    color: '#666',
    letterSpacing: '2px',
  },
  weightTarget: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#00ff88',
  },
  weightControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  weightInput: {
    width: '80px',
    padding: '8px 12px',
    background: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: '16px',
    textAlign: 'center',
  },
  weightProgress: {
    flex: 1,
    height: '8px',
    background: '#222',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  weightBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #00ff88, #00cc66)',
    transition: 'width 0.3s ease',
  },
  weightRemaining: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#666',
    whiteSpace: 'nowrap',
  },
  pomodoroSection: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: '6px',
    padding: '15px 20px',
    marginBottom: '20px',
    position: 'relative',
    zIndex: 1,
  },
  pomodoroHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  pomodoroLabel: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#fff',
  },
  pomodoroCount: {
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#00ff88',
  },
  pomodoroControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  pomodoroBtn: {
    width: '36px',
    height: '36px',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pomodoroDots: {
    display: 'flex',
    gap: '8px',
    flex: 1,
    justifyContent: 'center',
  },
  pomodoroDot: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    transition: 'background 0.2s ease',
  },
  activitiesSection: {
    marginBottom: '30px',
    position: 'relative',
    zIndex: 1,
  },
  tierBlock: {
    marginBottom: '20px',
  },
  tierLabel: {
    fontSize: '11px',
    letterSpacing: '2px',
    padding: '6px 12px',
    borderRadius: '4px',
    marginBottom: '10px',
    display: 'inline-block',
    fontWeight: '700',
  },
  activityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '8px',
  },
  activityBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 15px',
    border: '1px solid',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    position: 'relative',
    background: 'none',
  },
  activityIcon: {
    fontSize: '18px',
  },
  activityName: {
    fontSize: '13px',
    color: '#ccc',
    flex: 1,
  },
  checkMark: {
    color: '#00ff88',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  bottomSection: {
    position: 'relative',
    zIndex: 1,
  },
  saveBtn: {
    width: '100%',
    padding: '18px',
    background: 'linear-gradient(180deg, #ff4444 0%, #cc0000 100%)',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    letterSpacing: '2px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'transform 0.1s ease',
    fontWeight: '900',
  },
  historySection: {
    marginTop: '20px',
  },
  historyLabel: {
    fontFamily: 'monospace',
    fontSize: '11px',
    color: '#666',
    letterSpacing: '2px',
    marginBottom: '10px',
  },
  historyGrid: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  historyDay: {
    width: '50px',
    padding: '8px',
    borderRadius: '4px',
    textAlign: 'center',
  },
  historyDayNum: {
    fontFamily: 'monospace',
    fontSize: '10px',
    color: '#666',
  },
  historyFRS: {
    fontSize: '16px',
    color: '#fff',
    fontWeight: '900',
  },
  footer: {
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #222',
    position: 'relative',
    zIndex: 1,
  },
  coachQuote: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 1.6,
  },
  coachName: {
    display: 'block',
    marginTop: '8px',
    fontStyle: 'normal',
    color: '#444',
    fontSize: '12px',
  },
}

export default App
