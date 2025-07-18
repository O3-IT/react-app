import { useState } from 'react'

const Dashboard = ({ users, products, orders, counterHistory, showNotification }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7')
  const [showExport, setShowExport] = useState(false)

  const getMetrics = () => {
    const totalUsers = users.length
    const totalProducts = products.length
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    
    const recentUsers = users.filter(user => {
      const daysDiff = (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
      return daysDiff <= parseInt(selectedPeriod)
    }).length
    
    const recentOrders = orders.filter(order => {
      const daysDiff = (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60 * 24)
      return daysDiff <= parseInt(selectedPeriod)
    }).length
    
    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentUsers,
      recentOrders
    }
  }

  const metrics = getMetrics()

  const getTopCategories = () => {
    const categoryCount = {}
    orders.forEach(order => {
      order.items.forEach(item => {
        categoryCount[item.category] = (categoryCount[item.category] || 0) + item.quantity
      })
    })
    
    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
  }

  const getTopProducts = () => {
    const productCount = {}
    orders.forEach(order => {
      order.items.forEach(item => {
        productCount[item.name] = (productCount[item.name] || 0) + item.quantity
      })
    })
    
    return Object.entries(productCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
  }

  const exportData = (type) => {
    let csvContent = ''
    let filename = ''
    
    switch (type) {
      case 'users':
        csvContent = [
          ['ID', 'Nom', 'Email', 'Âge', 'Date création'],
          ...users.map(user => [
            user.id,
            user.name,
            user.email,
            user.age || '',
            user.createdAt?.toLocaleDateString() || ''
          ])
        ].map(row => row.join(';')).join('\n')
        filename = 'utilisateurs'
        break
        
      case 'orders':
        csvContent = [
          ['ID', 'Client', 'Email', 'Total', 'Date', 'Statut'],
          ...orders.map(order => [
            order.id,
            order.customerInfo.name,
            order.customerInfo.email,
            order.total,
            order.createdAt?.toLocaleDateString() || '',
            order.status
          ])
        ].map(row => row.join(';')).join('\n')
        filename = 'commandes'
        break
        
      case 'analytics':
        csvContent = [
          ['Métrique', 'Valeur'],
          ['Utilisateurs totaux', metrics.totalUsers],
          ['Produits totaux', metrics.totalProducts],
          ['Commandes totales', metrics.totalOrders],
          ['Revenus totaux', metrics.totalRevenue],
          ['Nouveaux utilisateurs (' + selectedPeriod + 'j)', metrics.recentUsers],
          ['Nouvelles commandes (' + selectedPeriod + 'j)', metrics.recentOrders]
        ].map(row => row.join(';')).join('\n')
        filename = 'analytics'
        break
        
      default:
        return
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    showNotification(`Export ${filename} généré`, 'success')
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Tableau de bord</h2>
        <div className="dashboard-actions">
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="90">90 derniers jours</option>
          </select>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowExport(true)}
          >
            Exporter
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Utilisateurs</h3>
          <div className="metric-value">{metrics.totalUsers}</div>
          <div className="metric-change">
            +{metrics.recentUsers} derniers {selectedPeriod}j
          </div>
        </div>

        <div className="metric-card">
          <h3>Produits</h3>
          <div className="metric-value">{metrics.totalProducts}</div>
          <div className="metric-change">
            Catalogue complet
          </div>
        </div>

        <div className="metric-card">
          <h3>Commandes</h3>
          <div className="metric-value">{metrics.totalOrders}</div>
          <div className="metric-change">
            +{metrics.recentOrders} derniers {selectedPeriod}j
          </div>
        </div>

        <div className="metric-card">
          <h3>Revenus</h3>
          <div className="metric-value">{metrics.totalRevenue.toFixed(2)}€</div>
          <div className="metric-change">
            Total cumulé
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Top Catégories</h3>
          <div className="chart-data">
            {getTopCategories().map(([category, count]) => (
              <div key={category} className="chart-item">
                <span className="chart-label">{category}</span>
                <div className="chart-bar">
                  <div 
                    className="chart-fill" 
                    style={{
                      width: `${(count / Math.max(...getTopCategories().map(([,c]) => c))) * 100}%`
                    }}
                  />
                </div>
                <span className="chart-value">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>Top Produits</h3>
          <div className="chart-data">
            {getTopProducts().map(([product, count]) => (
              <div key={product} className="chart-item">
                <span className="chart-label">{product}</span>
                <div className="chart-bar">
                  <div 
                    className="chart-fill" 
                    style={{
                      width: `${(count / Math.max(...getTopProducts().map(([,c]) => c))) * 100}%`
                    }}
                  />
                </div>
                <span className="chart-value">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-tables">
        <div className="table-container">
          <h3>Dernières commandes</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(-10).reverse().map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customerInfo.name}</td>
                    <td>{order.total.toFixed(2)}€</td>
                    <td>{order.createdAt?.toLocaleDateString()}</td>
                    <td>
                      <span className={`status status-${order.status}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-container">
          <h3>Derniers utilisateurs</h3>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Date création</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(-10).reverse().map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.createdAt?.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="activity-feed">
        <h3>Activité du compteur</h3>
        <div className="activity-list">
          {counterHistory.slice(-10).reverse().map(item => (
            <div key={item.id} className="activity-item">
              <span className="activity-time">
                {item.timestamp.toLocaleTimeString()}
              </span>
              <span className="activity-action">
                {item.action}
              </span>
              <span className="activity-value">
                → {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showExport && (
        <div className="modal-overlay" onClick={() => setShowExport(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Exporter les données</h3>
              <button 
                className="close-btn"
                onClick={() => setShowExport(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>Choisissez le type de données à exporter :</p>
              <div className="export-options">
                <button 
                  className="btn btn-primary btn-block" 
                  onClick={() => {
                    exportData('users')
                    setShowExport(false)
                  }}
                >
                  Utilisateurs ({users.length})
                </button>
                <button 
                  className="btn btn-primary btn-block" 
                  onClick={() => {
                    exportData('orders')
                    setShowExport(false)
                  }}
                >
                  Commandes ({orders.length})
                </button>
                <button 
                  className="btn btn-primary btn-block" 
                  onClick={() => {
                    exportData('analytics')
                    setShowExport(false)
                  }}
                >
                  Rapport analytique
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard