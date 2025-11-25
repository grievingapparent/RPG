import React, { useState, useEffect } from 'react'

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

function App() {
  const [currentDate, setCurrentDate] = useState(() => {
    const saved = localStorage.getItem('frs-current-date')
    return saved ? new Date(saved) : new Date()
  })
  
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem('frs-checked-' + currentDate.toDateString())
    return saved ? JSON.parse(saved) : {}
  })
  
  const [pomodoroCount, setPomodoroCount] = useState(() => {
    const saved = localStorage.getItem('frs-pomodoros-' + currentDate.toDateString())
    return saved ? parseInt(saved) : 0
  })
  
  const [currentWeight, setCurrentWeight] = useState(() => {
    const saved = localStorage.getItem('frs-weight-' + currentDate.toDateString())
    return saved ? parseFloat(saved) : START_WEIGHT
  })
  
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('frs-history')
    return saved ? JSON.parse(saved) : []
  })

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('frs-checked-' + currentDate.toDateString(), JSON.stringify(checkedItems))
  }, [checkedItems, currentDate])
  
  useEffect(() => {
    localStorage.setItem('frs-pomodoros-' + currentDate.toDateString(), pomodoroCount.toString())
  }, [pomodoroCount, currentDate])
  
  useEffect(() => {
    localStorage.setItem('frs-weight-' + currentDate.toDateString(), currentWeight.toString())
  }, [currentWeight, currentDate])
  
  useEffect(() => {
    localStorage.setItem('frs-history', JSON.stringify(history))
  }, [history])

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
          // MCAT gives bonus for multiple pomodoros (up to 8)
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

  // Save day to history
  const saveDay = () => {
    const dayData = {
      date: currentDate.toDateString(),
      frs: dailyFRS,
      weight: currentWeight,
      pomodoros: pomodoroCount,
      completed: Object.keys(checkedItems).filter(k => checkedItems[k]).length
    }
    
    // Update or add to history
    const existingIndex = history.findIndex(h => h.date === dayData.date)
    if (existingIndex >= 0) {
      const newHistory = [...history]
      newHistory[existingIndex] = dayData
      setHistory(newHistory)
    } else {
      setHistory([...history, dayData])
    }
  }

  // FRS comparison
  const frsAdvantage = avgFRS - OPPONENT_FRS
  const winProbability = Math.min(Math.max((frsAdvantage + 2.5) / 5 * 100, 5), 95)

  return (
    <div style={styles.container}>
      <div style={styles.noise} />
      
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
        <button style={styles.saveBtn} onClick={saveDay}>
          LOCK IN DAY {dayNumber}
        </button>
        
        {history.length > 0 && (
          <div style={styles.historySection}>
            <div style={styles.historyLabel}>CAMP HISTORY</div>
            <div style={styles.historyGrid}>
              {history.slice(-14).map((day, i) => (
                <div 
                  key={i} 
                  style={{
                    ...styles.historyDay,
                    background: day.frs >= OPPONENT_FRS ? '#00ff8833' : '#ff444433'
                  }}
                >
                  <div style={styles.historyDayNum}>D{history.indexOf(day) + 1}</div>
                  <div style={styles.historyFRS}>{day.frs.toFixed(1)}</div>
                </div>
              ))}
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
    fontFamily: '"Barlow", sans-serif',
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
    fontFamily: '"Archivo Black", sans-serif',
    fontSize: '11px',
    color: '#ff4444',
    letterSpacing: '3px',
    marginBottom: '5px',
  },
  title: {
    fontFamily: '"Archivo Black", sans-serif',
    fontSize: '42px',
    margin: 0,
    letterSpacing: '-1px',
    background: 'linear-gradient(180deg, #fff 0%, #888 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  record: {
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: '12px',
    color: '#666',
    letterSpacing: '2px',
    marginTop: '5px',
  },
  headerRight: {
    textAlign: 'right',
  },
  dayCounter: {
    fontFamily: '"Archivo Black", sans-serif',
    fontSize: '32px',
    color: '#00ff88',
  },
  dateDisplay: {
    fontFamily: '"IBM Plex Mono", monospace',
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
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: '11px',
    color: '#666',
    letterSpacing: '2px',
  },
  countdownNumber: {
    fontFamily: '"Archivo Black", sans-serif',
    fontSize: '80px',
    color: '#fff',
    lineHeight: 1,
    marginBottom: '10px',
  },
  fightInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  opponentName: {
    fontFamily: '"Barlow", sans-serif',
    fontWeight: '600',
    fontSize: '14px',
    color: '#ff4444',
    textTransform: 'uppercase',
  },
  fightDate: {
    fontFamily: '"IBM Plex Mono", monospace',
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
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: '10px',
    color: '#666',
    letterSpacing: '1px',
    marginBottom: '5px',
  },
  statValue: {
    fontFamily: '"Archivo Black", sans-serif',
    fontSize: '28px',
    color: '#fff',
  },
  statSub: {
    fontFamily: '"IBM Plex Mono", monospace',
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
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: '11px',
    color: '#666',
    letterSpacing: '2px',
  },
  weightTarget: {
    fontFamily: '"IBM Plex Mono", monospace',
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
    fontFamily: '"IBM Plex Mono", monospace',
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
    fontFamily: '"IBM Plex Mono", monospace',
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
    fontFamily: '"Barlow", sans-serif',
    fontWeight: '600',
    fontSize: '14px',
    color: '#fff',
  },
  pomodoroCount: {
    fontFamily: '"IBM Plex Mono", monospace',
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
    fontFamily: '"Archivo Black", sans-serif',
    fontSize: '11px',
    letterSpacing: '2px',
    padding: '6px 12px',
    borderRadius: '4px',
    marginBottom: '10px',
    display: 'inline-block',
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
  },
  activityIcon: {
    fontSize: '18px',
  },
  activityName: {
    fontFamily: '"Barlow", sans-serif',
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
    fontFamily: '"Archivo Black", sans-serif',
    fontSize: '16px',
    letterSpacing: '2px',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'transform 0.1s ease',
  },
  historySection: {
    marginTop: '20px',
  },
  historyLabel: {
    fontFamily: '"IBM Plex Mono", monospace',
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
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: '10px',
    color: '#666',
  },
  historyFRS: {
    fontFamily: '"Archivo Black", sans-serif',
    fontSize: '16px',
    color: '#fff',
  },
  footer: {
    marginTop: '40px',
    paddingTop: '20px',
    borderTop: '1px solid #222',
    position: 'relative',
    zIndex: 1,
  },
  coachQuote: {
    fontFamily: '"Barlow", sans-serif',
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
