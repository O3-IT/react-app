import { Link } from 'react-router-dom'
import './HomePage.css'

function HomePage() {
  return (
    <div className="homepage">
      <div className="hero-section">
        <h1>Bienvenue dans l'Application QA Test</h1>
        <p className="hero-description">
          Une application de démonstration complète avec gestion d'utilisateurs, 
          catalogue de produits, tableau de bord et plus encore.
        </p>
      </div>

      <div className="features-grid">
        <Link to="/users" className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Gestion des Utilisateurs</h3>
          <p>Créez, modifiez et gérez les utilisateurs de l'application</p>
        </Link>

        <Link to="/products" className="feature-card">
          <div className="feature-icon">🛍️</div>
          <h3>Catalogue Produits</h3>
          <p>Parcourez les produits et gérez votre panier d'achat</p>
        </Link>

        <Link to="/counter" className="feature-card">
          <div className="feature-icon">🔢</div>
          <h3>Compteur</h3>
          <p>Testez les fonctionnalités de compteur avec historique</p>
        </Link>

        <Link to="/dashboard" className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Tableau de Bord</h3>
          <p>Visualisez les statistiques et métriques de l'application</p>
        </Link>

        <Link to="/themes" className="feature-card">
          <div className="feature-icon">🎨</div>
          <h3>Personnalisation</h3>
          <p>Changez l'apparence avec les thèmes disponibles</p>
        </Link>
      </div>

      <div className="quick-stats">
        <div className="stat-item">
          <span className="stat-label">Version</span>
          <span className="stat-value">0.0.0</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Framework</span>
          <span className="stat-value">React 19.1.0</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Build Tool</span>
          <span className="stat-value">Vite 7.0.4</span>
        </div>
      </div>
    </div>
  )
}

export default HomePage