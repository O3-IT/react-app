import { useEffect } from 'react'

const NotificationSystem = ({ notifications }) => {
  useEffect(() => {
    if (notifications.length > 5) {
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