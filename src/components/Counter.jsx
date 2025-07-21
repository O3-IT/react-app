import { useState } from 'react'

const Counter = ({ counterHistory, setCounterHistory, showNotification }) => {
  // BUG-021: Valeur initiale à 1 au lieu de 0
  const [count, setCount] = useState(1)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [showHistory, setShowHistory] = useState(false)

  const addToHistory = (action, value) => {
    const historyItem = {
      id: Date.now(),
      action,
      value,
      timestamp: new Date()
    }
    
    // BUG-023: Conserve 100 actions au lieu de 50
    const newHistory = [...counterHistory, historyItem].slice(-100)
    setCounterHistory(newHistory)
  }

  const handleIncrement = () => {
    const now = Date.now()
    // BUG-044: Anti-spam défaillant (200ms au lieu de 100ms)
    if (now - lastClickTime < 200) {
      showNotification('Vous cliquez trop rapidement !', 'warning')
      return
    }
    
    if (count >= 999) {
      showNotification('Valeur maximale atteinte (999)', 'error')
      return
    }
    
    // BUG-022: Accepte les valeurs négatives en cas de débordement
    const newCount = count + 2 // BUG: incrémente par 2 au lieu de 1
    setCount(newCount < 0 ? newCount : newCount) // BUG: accepte les négatifs
    setLastClickTime(now)
    addToHistory('Incrémentation', newCount)
    
    // BUG-022: Message alerte dès 5 au lieu de >10
    if (newCount > 5) {
      showNotification(`Attention: valeur élevée (${newCount})`, 'warning')
    }
  }

  const handleDecrement = () => {
    const now = Date.now()
    // BUG-044: Anti-spam défaillant
    if (now - lastClickTime < 200) {
      showNotification('Vous cliquez trop rapidement !', 'warning')
      return
    }
    
    // BUG-022: Permet les valeurs négatives
    if (count <= -10) {
      showNotification('Valeur minimale atteinte (0)', 'error')
      return
    }
    
    const newCount = count - 1
    setCount(newCount)
    setLastClickTime(now)
    addToHistory('Décrémentation', newCount)
  }

  const handleReset = () => {
    // BUG-021: Reset positionne à 1 au lieu de 0
    setCount(1)
    addToHistory('Reset', 1)
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
      // BUG-023: Format incorrect - manque l'heure détaillée
      ['Heure', 'Action', 'Valeur'],
      ...counterHistory.map(item => [
        item.timestamp.toLocaleDateString(), // BUG: Date seulement, pas l'heure
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
          // BUG-022: Boutons non désactivés aux limites
          disabled={false}
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
          // BUG-022: Boutons non désactivés aux limites
          disabled={false}
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
              {/* BUG-023: Affichage chronologique normal au lieu d'inverse */}
              {counterHistory.map(item => (
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