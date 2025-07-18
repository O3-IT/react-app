import { useState, useEffect } from 'react'

const UserManagement = ({ users, setUsers, showNotification }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState(10)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  })

  const [searchHistory, setSearchHistory] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const history = localStorage.getItem('userSearchHistory')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  const validateForm = () => {
    const errors = []
    
    if (!formData.name || formData.name.length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères')
    }
    
    if (formData.name && formData.name.length > 50) {
      errors.push('Le nom ne peut pas dépasser 50 caractères')
    }
    
    if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(formData.name)) {
      errors.push('Le nom ne peut contenir que des lettres, espaces et traits d\'union')
    }
    
    if (!formData.email) {
      errors.push('L\'email est obligatoire')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Format email invalide')
    }
    
    if (formData.age && (formData.age < 0 || formData.age > 150)) {
      errors.push('L\'âge doit être entre 0 et 150 ans')
    }
    
    const existingUser = users.find(user => 
      user.email === formData.email && user.id !== editingUser?.id
    )
    if (existingUser) {
      errors.push('Cet email est déjà utilisé')
    }
    
    if (users.length >= 1000 && !editingUser) {
      errors.push('Limite de 1000 utilisateurs atteinte')
    }
    
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const errors = validateForm()
    if (errors.length > 0) {
      errors.forEach(error => showNotification(error, 'error'))
      setIsLoading(false)
      return
    }

    setTimeout(() => {
      try {
        if (editingUser) {
          const updatedUsers = users.map(user =>
            user.id === editingUser.id
              ? { ...user, ...formData, updatedAt: new Date() }
              : user
          )
          setUsers(updatedUsers)
          showNotification('Utilisateur modifié avec succès', 'success')
          setEditingUser(null)
        } else {
          const newUser = {
            id: Date.now(),
            ...formData,
            age: formData.age || null,
            createdAt: new Date()
          }
          setUsers([...users, newUser])
          showNotification('Utilisateur ajouté avec succès', 'success')
        }
        
        setFormData({ name: '', email: '', age: '' })
        setShowForm(false)
      } catch {
        showNotification('Erreur lors de la sauvegarde', 'error')
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      age: user.age || ''
    })
    setShowForm(true)
  }

  const handleDelete = (userId) => {
    setDeleteConfirm(userId)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      const userToDelete = users.find(u => u.id === deleteConfirm)
      
      setTimeout(() => {
        setUsers(users.filter(user => user.id !== deleteConfirm))
        showNotification(`Utilisateur ${userToDelete.name} supprimé`, 'info')
        setDeleteConfirm(null)
      }, 5000)
      
      showNotification('Suppression programmée dans 5 secondes', 'warning')
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
    showNotification('Suppression annulée', 'info')
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
    
    if (value.length > 0 && !searchHistory.includes(value)) {
      const newHistory = [...searchHistory, value].slice(-10)
      setSearchHistory(newHistory)
      localStorage.setItem('userSearchHistory', JSON.stringify(newHistory))
    }
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase()
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    )
  })

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]
    
    let comparison = 0
    if (aValue < bValue) comparison = -1
    if (aValue > bValue) comparison = 1
    
    if (comparison === 0) {
      comparison = a.id - b.id
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage)

  const exportUsers = () => {
    const csvContent = [
      ['ID', 'Nom', 'Email', 'Âge', 'Date de création'],
      ...filteredUsers.map(user => [
        user.id,
        user.name,
        user.email,
        user.age || '',
        user.createdAt?.toLocaleDateString() || ''
      ])
    ].map(row => row.join(';')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    showNotification('Export CSV généré', 'success')
  }

  return (
    <div className="user-management">
      <div className="user-header">
        <h2>Gestion des Utilisateurs</h2>
        <div className="user-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(true)}
            disabled={users.length >= 1000}
          >
            Ajouter un utilisateur
          </button>
          <button className="btn btn-secondary" onClick={exportUsers}>
            Exporter CSV
          </button>
        </div>
      </div>

      <div className="user-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
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
            <option value="name">Nom</option>
            <option value="email">Email</option>
            <option value="age">Âge</option>
            <option value="createdAt">Date de création</option>
          </select>
          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        <div className="pagination-controls">
          <select 
            value={usersPerPage} 
            onChange={(e) => setUsersPerPage(Number(e.target.value))}
            className="per-page-select"
          >
            <option value={5}>5 par page</option>
            <option value={10}>10 par page</option>
            <option value={25}>25 par page</option>
            <option value={50}>50 par page</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  maxLength={50}
                  minLength={2}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Âge</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  min="0"
                  max="150"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => {
                  setShowForm(false)
                  setEditingUser(null)
                  setFormData({ name: '', email: '', age: '' })
                }}>
                  Annuler
                </button>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Sauvegarde...' : (editingUser ? 'Modifier' : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmer la suppression</h3>
            <p>Voulez-vous vraiment supprimer l'utilisateur {users.find(u => u.id === deleteConfirm)?.name} ?</p>
            <div className="form-actions">
              <button onClick={cancelDelete}>Annuler</button>
              <button onClick={confirmDelete} className="btn-danger">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="user-results">
        <p>{sortedUsers.length} utilisateur(s) trouvé(s)</p>
        {sortedUsers.length === 0 && searchTerm && (
          <p className="no-results">Aucun utilisateur ne correspond à votre recherche.</p>
        )}
      </div>

      <div className="user-list">
        {currentUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              {user.age && <p>Âge: {user.age} ans</p>}
              <small>Créé le: {user.createdAt?.toLocaleDateString()}</small>
            </div>
            <div className="user-actions">
              <button 
                className="btn btn-small btn-secondary" 
                onClick={() => handleEdit(user)}
              >
                Modifier
              </button>
              <button 
                className="btn btn-small btn-danger" 
                onClick={() => handleDelete(user.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span>Page {currentPage} sur {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}

export default UserManagement