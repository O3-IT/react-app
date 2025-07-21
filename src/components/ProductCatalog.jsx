import { useState, useEffect } from 'react'

const ProductCatalog = ({ 
  products, 
  cart, 
  addToCart, 
  removeFromCart, 
  updateCartQuantity, 
  clearCart, 
  createOrder,
  showNotification 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  // BUG-015: Filtre par défaut pas sur "Toutes"
  const [filterCategory, setFilterCategory] = useState('Informatique')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: ''
  })

  const [searchHistory, setSearchHistory] = useState([])

  useEffect(() => {
    const history = localStorage.getItem('productSearchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  const handleSearch = (value) => {
    // BUG-013: Crash avec certains caractères spéciaux
    try {
      if (value.includes('[') || value.includes(']') || value.includes('{') || value.includes('}')) {
        throw new Error('Caractères non supportés')
      }
      setSearchTerm(value)
      
      if (value.length > 0 && !searchHistory.includes(value)) {
        const newHistory = [...searchHistory, value].slice(-10)
        setSearchHistory(newHistory)
        localStorage.setItem('productSearchHistory', JSON.stringify(newHistory))
      }
    } catch (error) {
      showNotification('Erreur de recherche avec ces caractères', 'error')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy === 'price') {
      return a.price - b.price
    }
    return 0
  })

  const categories = ['all', ...new Set(products.map(p => p.category))]
  const getCategoryCount = (category) => {
    if (category === 'all') return products.length
    return products.filter(p => p.category === category).length
  }

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  const handleAddToCart = (product) => {
    // BUG-043: Limite panier dépassée (60 au lieu de 50)
    if (cart.length >= 60) {
      showNotification('Panier plein (50 articles max)', 'error')
      return
    }
    addToCart(product)
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    
    if (cart.length === 0) {
      showNotification('Panier vide', 'error')
      return
    }

    if (!customerInfo.name || !customerInfo.email) {
      showNotification('Nom et email requis', 'error')
      return
    }

    const orderId = createOrder(customerInfo)
    setShowCheckout(false)
    setShowCart(false)
    setCustomerInfo({ name: '', email: '', address: '' })
    showNotification(`Commande ${orderId} créée`, 'success')
  }

  return (
    <div className="product-catalog">
      <div className="catalog-header">
        <h2>Catalogue Produits</h2>
        <div className="catalog-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowCart(true)}
          >
            Panier ({cart.length})
          </button>
        </div>
      </div>

      <div className="catalog-filters">
        <div className="search-container">
          {/* BUG-012: Champ masqué sur mobile */}
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input mobile-hidden"
            maxLength={100}
          />
          {searchHistory.length > 0 && (
            <div className="search-history">
              <small>Recherches récentes:</small>
              {searchHistory.slice(-5).map((term, index) => (
                <button
                  key={index}
                  className="history-item"
                  onClick={() => handleSearch(term)}
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="sort-controls">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Tri par nom</option>
            {/* BUG-014: Option prix croissant manquante */}
            <option value="price">Tri par prix (décroissant)</option>
          </select>
        </div>

        <div className="filter-controls">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Toutes catégories' : category} ({getCategoryCount(category)})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="catalog-results">
        <p>{sortedProducts.length} produit(s) trouvé(s)</p>
        {sortedProducts.length === 0 && searchTerm && (
          <p className="no-results">Aucun produit ne correspond à votre recherche.</p>
        )}
      </div>

      <div className="product-grid">
        {sortedProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-info" onClick={() => handleProductClick(product)}>
              <h3>{product.name}</h3>
              <p className="product-price">{product.price}€</p>
              <p className="product-category">{product.category}</p>
              <p className="product-description">{product.description}</p>
            </div>
            <div className="product-actions">
              <button 
                className="btn btn-primary btn-small" 
                onClick={() => handleAddToCart(product)}
                disabled={cart.length >= 50}
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="modal-overlay">
          {/* BUG-016 & BUG-017: ESC et clic extérieur non fonctionnels */}
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedProduct.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedProduct(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p><strong>Prix:</strong> {selectedProduct.price}€</p>
              <p><strong>Catégorie:</strong> {selectedProduct.category}</p>
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <div className="modal-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    handleAddToCart(selectedProduct)
                    setSelectedProduct(null)
                  }}
                  disabled={cart.length >= 50}
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <div className="modal-overlay" onClick={() => setShowCart(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Panier ({cart.length} articles)</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCart(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              {cart.length === 0 ? (
                <p>Votre panier est vide</p>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <p>{item.price}€</p>
                        </div>
                        <div className="item-quantity">
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="qty-btn"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="qty-btn"
                            disabled={item.quantity >= 99}
                          >
                            +
                          </button>
                        </div>
                        <div className="item-total">
                          {(item.price * item.quantity).toFixed(2)}€
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="btn btn-danger btn-small"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-total">
                    <strong>Total: {cartTotal.toFixed(2)}€</strong>
                  </div>
                  <div className="cart-actions">
                    <button 
                      className="btn btn-secondary" 
                      onClick={clearCart}
                    >
                      Vider le panier
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setShowCheckout(true)}
                    >
                      Passer commande
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showCheckout && (
        <div className="modal-overlay">
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Finaliser la commande</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCheckout(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <form onSubmit={handleCheckout}>
                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Adresse</label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="checkout-summary">
                  <h4>Récapitulatif</h4>
                  <p>Articles: {cart.length}</p>
                  <p><strong>Total: {cartTotal.toFixed(2)}€</strong></p>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowCheckout(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Confirmer la commande
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductCatalog