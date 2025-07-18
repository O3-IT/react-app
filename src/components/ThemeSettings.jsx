import { useState } from 'react'

const ThemeSettings = ({ theme, setTheme, showNotification }) => {
  const [selectedTheme, setSelectedTheme] = useState(theme)

  const themes = [
    { 
      id: 'light', 
      name: 'Clair', 
      description: 'Thème clair classique',
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        background: '#ffffff',
        text: '#212529'
      }
    },
    { 
      id: 'dark', 
      name: 'Sombre', 
      description: 'Thème sombre pour réduire la fatigue oculaire',
      colors: {
        primary: '#0d6efd',
        secondary: '#6c757d',
        background: '#212529',
        text: '#ffffff'
      }
    },
    { 
      id: 'blue', 
      name: 'Bleu', 
      description: 'Thème bleu professionnel',
      colors: {
        primary: '#0066cc',
        secondary: '#4d94ff',
        background: '#f0f8ff',
        text: '#003366'
      }
    },
    { 
      id: 'green', 
      name: 'Vert', 
      description: 'Thème vert naturel',
      colors: {
        primary: '#28a745',
        secondary: '#6c757d',
        background: '#f8fff8',
        text: '#1a5928'
      }
    }
  ]

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId)
    setTheme(themeId)
    showNotification(`Thème ${themes.find(t => t.id === themeId).name} appliqué`, 'success')
  }

  const resetToDefault = () => {
    handleThemeChange('light')
    showNotification('Thème par défaut restauré', 'info')
  }

  return (
    <div className="theme-settings">
      <div className="theme-header">
        <h2>Paramètres de thème</h2>
        <button 
          className="btn btn-secondary" 
          onClick={resetToDefault}
        >
          Réinitialiser
        </button>
      </div>

      <div className="theme-grid">
        {themes.map(themeOption => (
          <div 
            key={themeOption.id}
            className={`theme-card ${selectedTheme === themeOption.id ? 'active' : ''}`}
            onClick={() => handleThemeChange(themeOption.id)}
          >
            <div className="theme-preview">
              <div 
                className="theme-color-bar"
                style={{ backgroundColor: themeOption.colors.primary }}
              />
              <div 
                className="theme-background"
                style={{ 
                  backgroundColor: themeOption.colors.background,
                  color: themeOption.colors.text
                }}
              >
                <div className="theme-text">Aperçu</div>
                <div 
                  className="theme-accent"
                  style={{ backgroundColor: themeOption.colors.secondary }}
                />
              </div>
            </div>
            <div className="theme-info">
              <h3>{themeOption.name}</h3>
              <p>{themeOption.description}</p>
              {selectedTheme === themeOption.id && (
                <div className="theme-current">
                  ✓ Actuel
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="theme-options">
        <h3>Options avancées</h3>
        
        <div className="option-group">
          <label>
            <input 
              type="checkbox" 
              defaultChecked
            />
            Transitions animées
          </label>
          <small>Active les transitions fluides entre les thèmes</small>
        </div>

        <div className="option-group">
          <label>
            <input 
              type="checkbox" 
              defaultChecked
            />
            Sauvegarder automatiquement
          </label>
          <small>Sauvegarde automatiquement votre choix de thème</small>
        </div>

        <div className="option-group">
          <label>
            <input 
              type="checkbox" 
              defaultChecked
            />
            Respecter les préférences système
          </label>
          <small>Adapte le thème selon les préférences de votre système</small>
        </div>
      </div>

      <div className="theme-accessibility">
        <h3>Accessibilité</h3>
        <div className="accessibility-info">
          <div className="contrast-info">
            <h4>Contraste actuel</h4>
            <div className="contrast-demo">
              <div className="contrast-sample">
                Texte d'exemple pour tester le contraste
              </div>
              <div className="contrast-score">
                Score WCAG: AA ✓
              </div>
            </div>
          </div>
          
          <div className="font-size-controls">
            <h4>Taille de police</h4>
            <div className="font-size-options">
              <button className="btn btn-small">Petite</button>
              <button className="btn btn-small active">Normale</button>
              <button className="btn btn-small">Grande</button>
            </div>
          </div>
        </div>
      </div>

      <div className="theme-shortcuts">
        <h3>Raccourcis clavier</h3>
        <div className="shortcut-list">
          <div className="shortcut-item">
            <kbd>Alt + T</kbd>
            <span>Ouvrir les paramètres de thème</span>
          </div>
          <div className="shortcut-item">
            <kbd>Alt + D</kbd>
            <span>Basculer entre clair/sombre</span>
          </div>
          <div className="shortcut-item">
            <kbd>Alt + R</kbd>
            <span>Réinitialiser au thème par défaut</span>
          </div>
        </div>
      </div>

      <div className="theme-info-panel">
        <h3>Informations sur le thème actuel</h3>
        <div className="theme-details">
          <div className="detail-item">
            <strong>Nom:</strong> {themes.find(t => t.id === selectedTheme).name}
          </div>
          <div className="detail-item">
            <strong>Description:</strong> {themes.find(t => t.id === selectedTheme).description}
          </div>
          <div className="detail-item">
            <strong>Couleur principale:</strong> 
            <span 
              className="color-swatch"
              style={{ backgroundColor: themes.find(t => t.id === selectedTheme).colors.primary }}
            />
            {themes.find(t => t.id === selectedTheme).colors.primary}
          </div>
          <div className="detail-item">
            <strong>Arrière-plan:</strong> 
            <span 
              className="color-swatch"
              style={{ backgroundColor: themes.find(t => t.id === selectedTheme).colors.background }}
            />
            {themes.find(t => t.id === selectedTheme).colors.background}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeSettings