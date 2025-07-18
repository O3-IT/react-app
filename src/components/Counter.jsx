import { useState } from 'react'

const Counter = ({ counterHistory, setCounterHistory, showNotification }) => {
  const [count, setCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [showHistory, setShowHistory] = useState(false)

  const addToHistory = (action, value) => {
    const historyItem = {
      id: Date.now(),
      action,
      value,
      timestamp: new Date()
    }
    
    const newHistory = [...counterHistory, historyItem].slice(-50)
    setCounterHistory(newHistory)
  }

  const handleIncrement = () => {
    const now = Date.now()
    if (now - lastClickTime < 100) {
      showNotification('Vous cliquez trop rapidement !', 'warning')
      return
    }
    
    if (count >= 999) {
      showNotification('Valeur maximale atteinte (999)', 'error')
      return
    }
    
    const newCount = count + 1
    setCount(newCount)
    setLastClickTime(now)
    addToHistory('Incrémentation', newCount)
    
    if (newCount > 10) {
      showNotification(`Attention: valeur élevée (${newCount})`, 'warning')
    }
  }

  const handleDecrement = () => {
    const now = Date.now()
    if (now - lastClickTime < 100) {
      showNotification('Vous cliquez trop rapidement !', 'warning')
      return
    }
    
    if (count <= 0) {
      showNotification('Valeur minimale atteinte (0)', 'error')
      return
    }
    
    const newCount = count - 1
    setCount(newCount)
    setLastClickTime(now)
    addToHistory('Décrémentation', newCount)
  }

  const handleReset = () => {
    setCount(0)
    addToHistory('Reset', 0)
    showNotification('Compteur remis à zéro', 'info')
  }

  const resetHistory = () => {
    setCounterHistory([])
    showNotification('Historique effacé', 'info')
  }

  const exportHistory = () => {
    if (counterHistory.length === 0) {
      showNotification('Aucun historique à exporter', 'warning')
      return
    }
    
    const csvContent = [
      ['Heure', 'Action', 'Valeur'],
      ...counterHistory.map(item => [
        item.timestamp.toLocaleString(),
        item.action,
        item.value
      ])
    ].map(row => row.join(';')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `compteur_historique_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    showNotification('Historique exporté', 'success')
  }

  return (
    <div className="counter">
      <div className="counter-header">
        <h2>Compteur</h2>
        <div className="counter-actions">
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? 'Masquer' : 'Afficher'} l'historique
          </button>
          <button className="btn btn-secondary" onClick={exportHistory}>
            Exporter
          </button>
        </div>
      </div>

      <div className="counter-display">
        <div className="counter-value">
          {count}
        </div>
        <div className="counter-range">
          <small>Min: 0 | Max: 999</small>
        </div>
      </div>

      <div className="counter-controls">
        <button 
          className="btn btn-large btn-secondary" 
          onClick={handleDecrement}
          disabled={count <= 0}
          title="Décrémenter (-1)"
        >
          -
        </button>
        <button 
          className="btn btn-large btn-primary" 
          onClick={handleReset}
          title="Remettre à zéro"
        >
          Reset
        </button>
        <button 
          className="btn btn-large btn-secondary" 
          onClick={handleIncrement}
          disabled={count >= 999}
          title="Incrémenter (+1)"
        >
          +
        </button>
      </div>

      {showHistory && (
        <div className="counter-history">
          <div className="history-header">
            <h3>Historique des actions</h3>
            <button 
              className="btn btn-small btn-danger" 
              onClick={resetHistory}
              disabled={counterHistory.length === 0}
            >
              Effacer l'historique
            </button>
          </div>
          
          {counterHistory.length === 0 ? (
            <p>Aucune action dans l'historique</p>
          ) : (
            <div className="history-list">
              {counterHistory.slice().reverse().map(item => (
                <div key={item.id} className="history-item">
                  <span className="history-time">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="history-action">
                    {item.action}
                  </span>
                  <span className="history-value">
                    → {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="counter-help">
        <h4>Instructions</h4>
        <ul>
          <li>Utilisez les boutons + et - pour modifier la valeur</li>
          <li>La valeur doit être comprise entre 0 et 999</li>
          <li>Le bouton Reset remet le compteur à 0</li>
          <li>L'historique garde les 50 dernières actions</li>
          <li>Un délai de 100ms est requis entre les clics</li>
        </ul>
      </div>
    </div>
  )
}

export default Counter