import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'

// Composants principaux
import HomePage from './components/HomePage'
import UserManagement from './components/UserManagement'
import Counter from './components/Counter'
import ProductCatalog from './components/ProductCatalog'
import Dashboard from './components/Dashboard'
import ThemeSettings from './components/ThemeSettings'
import NotificationSystem from './components/NotificationSystem'

function App() {
  // BUG-024: Mode sombre par défaut au lieu du clair
  const [theme, setTheme] = useState('dark')
  const [notifications, setNotifications] = useState([])
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Données globales
  const [users, setUsers] = useState([
    { id: 1, name: 'Jean Dupont', email: 'jean@email.com', age: 30, createdAt: new Date('2024-01-15') },
    { id: 2, name: 'Marie Martin', email: 'marie@email.com', age: 25, createdAt: new Date('2024-01-16') },
    { id: 3, name: 'Pierre Durand', email: 'pierre@email.com', age: 35, createdAt: new Date('2024-01-17') }
  ])

  const [products] = useState([
    { id: 1, name: 'Ordinateur Portable', price: 999, category: 'Informatique', description: 'Ordinateur portable haute performance' },
    { id: 2, name: 'Smartphone', price: 599, category: 'Téléphonie', description: 'Smartphone dernière génération' },
    { id: 3, name: 'Casque Audio', price: 149, category: 'Audio', description: 'Casque audio sans fil' },
    { id: 4, name: 'Tablette', price: 349, category: 'Informatique', description: 'Tablette tactile 10 pouces' },
    { id: 5, name: 'Souris Gaming', price: 79, category: 'Gaming', description: 'Souris gaming haute précision' },
    { id: 6, name: 'Clavier Mécanique', price: 129, category: 'Gaming', description: 'Clavier mécanique RGB' },
    { id: 7, name: 'Écran 4K', price: 459, category: 'Informatique', description: 'Écran 4K 27 pouces' },
    { id: 8, name: 'Webcam HD', price: 89, category: 'Informatique', description: 'Webcam haute définition' }
  ])

  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [counterHistory, setCounterHistory] = useState([])

  // BUG-034: Sauvegarde automatique toutes les 60s au lieu de 30s
  useEffect(() => {
    const saveInterval = setInterval(() => {
      try {
        localStorage.setItem('qaApp_users', JSON.stringify(users))
        localStorage.setItem('qaApp_cart', JSON.stringify(cart))
        localStorage.setItem('qaApp_orders', JSON.stringify(orders))
        localStorage.setItem('qaApp_theme', theme)
        showNotification('Données sauvegardées automatiquement', 'success')
      } catch {
        showNotification('Erreur lors de la sauvegarde', 'error')
      }
    }, 60000) // BUG: Sauvegarde toutes les 60 secondes au lieu de 30

    return () => clearInterval(saveInterval)
  }, [users, cart, orders, theme])

  // BUG-035: Détection de connexion défaillante
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // BUG: Détection non basée sur navigator.onLine
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Récupération des données au chargement
  useEffect(() => {
    // BUG-018: Panier non persistant
    try {
      const savedUsers = localStorage.getItem('qaApp_users')
      // BUG-018: Ne charge pas le panier sauvegardé
      // const savedCart = localStorage.getItem('qaApp_cart')
      const savedOrders = localStorage.getItem('qaApp_orders')
      const savedTheme = localStorage.getItem('qaApp_theme')

      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers)
        // Convertir les chaînes createdAt en objets Date
        const usersWithDates = parsedUsers.map(user => ({
          ...user,
          createdAt: user.createdAt ? new Date(user.createdAt) : undefined
        }))
        setUsers(usersWithDates)
      }
      if (savedCart) setCart(JSON.parse(savedCart))
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders)
        // Convertir les chaînes createdAt en objets Date
        const ordersWithDates = parsedOrders.map(order => ({
          ...order,
          createdAt: order.createdAt ? new Date(order.createdAt) : undefined
        }))
        setOrders(ordersWithDates)
      }
      if (savedTheme) setTheme(savedTheme)
    } catch {
      showNotification('Erreur lors du chargement des données', 'error')
    }
  }, [])

  // BUG-032: Position incorrecte et durées non conformes
  const showNotification = (message, type = 'info', duration = 5000) => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    }

    // BUG: Durée uniforme de 5s au lieu de 3-5-7s selon le type
    setNotifications(prev => [...prev, notification])

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id))
    }, duration)
  }

  // Gestion du panier
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity }])
    }
    
    showNotification(`${product.name} ajouté au panier`, 'success')
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
    showNotification('Produit retiré du panier', 'info')
  }

  // BUG-018: Panier non persistant + BUG-019: Quantité zéro acceptée
  const updateCartQuantity = (productId, quantity) => {
    // BUG-019: Permet les quantités zéro
    if (quantity < 0) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: Math.min(quantity, 99) }
        : item
    ))
  }

  const clearCart = () => {
    setCart([])
    showNotification('Panier vidé', 'info')
  }

  // Processus d'achat
  const createOrder = (orderData) => {
    // BUG-020: Numéros de commande non uniques (problème de timing)
    const orderId = `CMD${Math.floor(Date.now() / 1000)}`
    const order = {
      id: orderId,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      customerInfo: orderData,
      createdAt: new Date(),
      status: 'confirmed'
    }

    setOrders([...orders, order])
    clearCart()
    showNotification(`Commande ${orderId} confirmée`, 'success', 5000)
    
    return orderId
  }

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'F1') {
        e.preventDefault()
        showNotification('Alt+U: Utilisateurs, Alt+C: Compteur, Alt+P: Produits, Alt+D: Dashboard, Alt+T: Thèmes', 'info', 7000)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <Router>
      <div className={`app theme-${theme}`}>
        <header className="header">
          <h1>Application QA Test</h1>
          <div className="header-actions">
            <div className="connection-status">
              <span className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
                {isOnline ? '🟢 En ligne' : '🔴 Hors ligne'}
              </span>
            </div>
            <button 
              className="help-button"
              onClick={() => showNotification('Appuyez sur F1 pour l\'aide', 'info')}
              title="Aide (F1)"
            >
              ?
            </button>
          </div>
        </header>

        <nav className="tabs">
          <Link to="/users" className="tab">
            Utilisateurs
            <span className="tab-count">({users.length})</span>
          </Link>
          <Link to="/counter" className="tab">
            Compteur
          </Link>
          <Link to="/products" className="tab">
            Produits
            <span className="tab-count">({cart.length})</span>
          </Link>
          <Link to="/dashboard" className="tab">
            Dashboard
          </Link>
          <Link to="/themes" className="tab">
            Thèmes
          </Link>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={
              <UserManagement
                users={users}
                setUsers={setUsers}
                showNotification={showNotification}
              />
            } />
            <Route path="/counter" element={
              <Counter
                counterHistory={counterHistory}
                setCounterHistory={setCounterHistory}
                showNotification={showNotification}
              />
            } />
            <Route path="/products" element={
              <ProductCatalog
                products={products}
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                updateCartQuantity={updateCartQuantity}
                clearCart={clearCart}
                createOrder={createOrder}
                showNotification={showNotification}
              />
            } />
            <Route path="/dashboard" element={
              <Dashboard
                users={users}
                products={products}
                orders={orders}
                counterHistory={counterHistory}
                showNotification={showNotification}
              />
            } />
            <Route path="/themes" element={
              <ThemeSettings
                theme={theme}
                setTheme={setTheme}
                showNotification={showNotification}
              />
            } />
          </Routes>
        </main>

        <NotificationSystem notifications={notifications} />
      </div>
    </Router>
  )
}

export default App