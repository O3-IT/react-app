import { useEffect } from 'react'

const NotificationSystem = ({ notifications }) => {
  useEffect(() => {
    // BUG-032: File de 10 notifications au lieu de 5 max
    if (notifications.length > 10) {
      console.warn('Trop de notifications actives')
    }
  }, [notifications])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
      default:
        return 'ℹ️'
    }
  }

  const getNotificationClass = (type) => {
    return `notification notification-${type}`
  }

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={getNotificationClass(notification.type)}
        >
          <div className="notification-icon">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="notification-content">
            <div className="notification-message">
              {notification.message}
            </div>
            <div className="notification-time">
              {notification.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotificationSystem