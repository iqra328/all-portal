import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import VolunteerApp from "../Apps/VolunteerApp/VolunteerApp";
import BillingApp from "../Apps/BillingApp/BillingApp";
import InventoryApp from "../Apps/InventoryApp/InventoryApp";
import { 
  FiUsers, 
  FiDollarSign, 
  FiPackage,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiCalendar,
  FiBell,
  FiChevronDown,
  FiUserPlus,
  FiCreditCard,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiSettings,
  FiLogOut,
  FiUser,
  FiMoon,
  FiSun,
  FiLock,
  FiMail,
  FiPhone,
  FiX,
  FiCheck,
  FiTrash2,
  FiBellOff
} from "react-icons/fi";
import { 
  MdVolunteerActivism, 
  MdReceipt, 
  MdInventory,
  MdWarning,
  MdCheckCircle,
  MdNotificationsActive,
  MdNotificationsNone,
  MdNotificationsPaused,
  MdDoneAll
} from "react-icons/md";
import "./Dashboard.css";

function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeApp, setActiveApp] = useState('overview');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@saylani.com",
    phone: "+92 300 1234567",
    role: "Super Admin",
    avatar: "A"
  });

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'volunteer',
      title: 'New Volunteer Registration',
      message: 'Ali Raza registered as a new volunteer',
      time: '2 minutes ago',
      read: false,
      icon: <MdVolunteerActivism />,
      color: '#66B032',
      action: 'view',
      actionLink: 'volunteer'
    },
    {
      id: 2,
      type: 'billing',
      title: 'Payment Received',
      message: 'Payment of ₨ 5,000 received from Sara Khan',
      time: '15 minutes ago',
      read: false,
      icon: <MdReceipt />,
      color: '#0057A8',
      action: 'view',
      actionLink: 'billing'
    },
    {
      id: 3,
      type: 'inventory',
      title: 'Low Stock Alert',
      message: 'Dell XPS Laptops are running low (only 2 left)',
      time: '25 minutes ago',
      read: false,
      icon: <MdInventory />,
      color: '#FF6B35',
      action: 'view',
      actionLink: 'inventory'
    },
    {
      id: 4,
      type: 'volunteer',
      title: 'Volunteer Completed Training',
      message: 'Fatima Zaidi completed the volunteer training program',
      time: '45 minutes ago',
      read: true,
      icon: <MdVolunteerActivism />,
      color: '#66B032',
      action: 'view',
      actionLink: 'volunteer'
    },
    {
      id: 5,
      type: 'billing',
      title: 'New Invoice Created',
      message: 'Invoice #INV-2024-001 created for ₨ 15,000',
      time: '1 hour ago',
      read: true,
      icon: <MdReceipt />,
      color: '#0057A8',
      action: 'view',
      actionLink: 'billing'
    },
    {
      id: 6,
      type: 'inventory',
      title: 'New Stock Arrived',
      message: '50 new items added to inventory',
      time: '2 hours ago',
      read: true,
      icon: <MdInventory />,
      color: '#FF6B35',
      action: 'view',
      actionLink: 'inventory'
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    sound: true,
    desktop: true,
    email: true,
    volunteer: true,
    billing: true,
    inventory: true
  });

  const [stats, setStats] = useState({
    volunteer: {
      total: 345,
      active: 280,
      pending: 45,
      newToday: 12,
      trend: '+15%'
    },
    billing: {
      totalRevenue: '₨ 2.4M',
      pendingPayments: '₨ 345K',
      completedTransactions: 1234,
      dueToday: 23,
      trend: '+8%'
    },
    inventory: {
      totalProducts: 567,
      inStock: 423,
      lowStock: 89,
      outOfStock: 55,
      trend: '-3%'
    }
  });

  // Calculate unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Real-time updates simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const interval = setInterval(() => {
      setStats(prev => ({
        volunteer: {
          ...prev.volunteer,
          active: prev.volunteer.active + Math.floor(Math.random() * 3) - 1,
          pending: prev.volunteer.pending + Math.floor(Math.random() * 2)
        },
        billing: {
          ...prev.billing,
          totalRevenue: `₨ ${(parseInt(prev.billing.totalRevenue.replace(/[₨\sM]/g, '')) + Math.random() * 0.1).toFixed(1)}M`,
          pendingPayments: `₨ ${(parseInt(prev.billing.pendingPayments.replace(/[₨\sK]/g, '')) + Math.floor(Math.random() * 10) - 5)}K`
        },
        inventory: prev.inventory
      }));
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, []);

  // Check for saved dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Load saved notification settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setNotificationSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save notification settings
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  // Request notification permission
  useEffect(() => {
    if (notificationSettings.desktop && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [notificationSettings.desktop]);

  // Play notification sound
  const playNotificationSound = () => {
    if (!notificationSettings.sound) return;
    const audio = new Audio('/notification-sound.mp3');
    audio.play().catch(e => console.log('Sound play failed:', e));
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    if (notification.action === 'view' && notification.actionLink) {
      setActiveApp(notification.actionLink);
      setShowNotifications(false);
    }
  };

  // Add new notification
  const addNotification = (type, title, message, actionLink) => {
    if (!notificationSettings[type]) return;

    const newNotification = {
      id: Date.now(),
      type,
      title,
      message,
      time: 'Just now',
      read: false,
      icon: type === 'volunteer' ? <MdVolunteerActivism /> : 
            type === 'billing' ? <MdReceipt /> : 
            <MdInventory />,
      color: type === 'volunteer' ? '#66B032' : 
             type === 'billing' ? '#0057A8' : 
             '#FF6B35',
      action: 'view',
      actionLink
    };

    setNotifications(prev => [newNotification, ...prev]);
    playNotificationSound();

    // Show desktop notification if enabled
    if (notificationSettings.desktop && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.clear();
      window.location.href = '/login';
    }
  };

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedProfile = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      role: profile.role,
      avatar: profile.name.charAt(0)
    };
    setProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    alert("Profile updated successfully!");
    setShowSettings(false);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    alert("Password changed successfully!");
    e.target.reset();
    setShowSettings(false);
  };

  // Load saved profile
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };

  const recentActivities = [
    { 
      id: 1, 
      app: 'volunteer', 
      user: 'Ali Raza', 
      action: 'Registered as Volunteer', 
      time: '2 minutes ago',
      icon: <MdVolunteerActivism />,
      color: '#66B032'
    },
    { 
      id: 2, 
      app: 'billing', 
      user: 'Sara Khan', 
      action: 'Payment Received - ₨ 5,000', 
      time: '15 minutes ago',
      icon: <MdReceipt />,
      color: '#0057A8'
    },
    { 
      id: 3, 
      app: 'inventory', 
      user: 'Ahmed Malik', 
      action: 'Low Stock Alert - Laptops', 
      time: '25 minutes ago',
      icon: <MdInventory />,
      color: '#FF6B35'
    },
    { 
      id: 4, 
      app: 'volunteer', 
      user: 'Fatima Zaidi', 
      action: 'Completed Training', 
      time: '45 minutes ago',
      icon: <MdVolunteerActivism />,
      color: '#66B032'
    },
    { 
      id: 5, 
      app: 'billing', 
      user: 'Bilal Ahmed', 
      action: 'Invoice #INV-2024-001 Created', 
      time: '1 hour ago',
      icon: <MdReceipt />,
      color: '#0057A8'
    },
    { 
      id: 6, 
      app: 'inventory', 
      user: 'System', 
      action: 'New Stock Arrived - 50 Items', 
      time: '2 hours ago',
      icon: <MdInventory />,
      color: '#FF6B35'
    },
  ];

  const alerts = [
    { id: 1, type: 'warning', message: '15 volunteers pending approval', app: 'volunteer' },
    { id: 2, type: 'danger', message: '23 bills overdue payment', app: 'billing' },
    { id: 3, type: 'warning', message: '89 products low in stock', app: 'inventory' },
    { id: 4, type: 'info', message: '55 products out of stock', app: 'inventory' },
  ];

  // Render different apps based on activeApp state
  const renderApp = () => {
    switch(activeApp) {
      case 'volunteer':
        return <VolunteerApp onBack={() => setActiveApp('overview')} />;
      case 'billing':
        return <BillingApp onBack={() => setActiveApp('overview')} />;
      case 'inventory':
        return <InventoryApp onBack={() => setActiveApp('overview')} />;
      default:
        return (
          <div className="dashboard-main">
            {/* Header */}
            <div className="dashboard-header">
              <div className="header-left">
                <h2>Saylani Mass IT Dashboard</h2>
                <p>
                  <FiCalendar /> {formatDate(currentTime)} | <FiClock /> {formatTime(currentTime)}
                </p>
              </div>
              <div className="header-right">
                <button 
                  className="settings-icon-btn"
                  onClick={() => setShowSettings(true)}
                  title="Settings"
                >
                  <FiSettings size={20} />
                </button>
                
                {/* Enhanced Notification Bell */}
                <div className="notification-container">
                  <button 
                    className="notification-bell"
                    onClick={() => setShowNotifications(!showNotifications)}
                    title="Notifications"
                  >
                    <FiBell size={22} />
                    {unreadCount > 0 && (
                      <span className="notification-badge">{unreadCount}</span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="notifications-dropdown">
                      <div className="notifications-header">
                        <h3>
                          <MdNotificationsActive /> Notifications
                          {unreadCount > 0 && (
                            <span className="unread-count">{unreadCount} new</span>
                          )}
                        </h3>
                        <div className="notifications-actions">
                          {notifications.length > 0 && (
                            <>
                              <button 
                                onClick={markAllAsRead}
                                className="notifications-action-btn"
                                title="Mark all as read"
                                disabled={unreadCount === 0}
                              >
                                <MdDoneAll />
                              </button>
                              <button 
                                onClick={clearAllNotifications}
                                className="notifications-action-btn"
                                title="Clear all"
                              >
                                <FiTrash2 />
                              </button>
                            </>
                          )}
                          <button 
                            className="notifications-action-btn close"
                            onClick={() => setShowNotifications(false)}
                            title="Close"
                          >
                            <FiX />
                          </button>
                        </div>
                      </div>

                      <div className="notifications-list">
                        {notifications.length === 0 ? (
                          <div className="no-notifications">
                            <MdNotificationsNone size={40} />
                            <p>No notifications</p>
                            <span>You're all caught up!</span>
                          </div>
                        ) : (
                          <>
                            {notifications.map(notification => (
                              <div 
                                key={notification.id} 
                                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                onClick={() => handleNotificationClick(notification)}
                              >
                                <div 
                                  className="notification-icon"
                                  style={{ background: `${notification.color}20`, color: notification.color }}
                                >
                                  {notification.icon}
                                </div>
                                <div className="notification-content">
                                  <div className="notification-title">
                                    {notification.title}
                                    {!notification.read && (
                                      <span className="unread-dot"></span>
                                    )}
                                  </div>
                                  <div className="notification-message">
                                    {notification.message}
                                  </div>
                                  <div className="notification-time">
                                    <FiClock size={10} /> {notification.time}
                                  </div>
                                </div>
                                <div className="notification-actions">
                                  {!notification.read && (
                                    <button 
                                      className="notification-mark-read"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        markAsRead(notification.id);
                                      }}
                                      title="Mark as read"
                                    >
                                      <FiCheck />
                                    </button>
                                  )}
                                  <button 
                                    className="notification-delete"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteNotification(notification.id);
                                    }}
                                    title="Delete"
                                  >
                                    <FiX />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>

                      {notifications.length > 0 && (
                        <div className="notifications-footer">
                          <button 
                            className="view-all-btn"
                            onClick={() => setShowNotifications(false)}
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="profile-menu" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                  <div className="profile-avatar">{profile.avatar}</div>
                  <div className="profile-info">
                    <div className="profile-name">{profile.name}</div>
                    <div className="profile-role">{profile.role}</div>
                  </div>
                  <FiChevronDown />
                  
                  {/* Profile Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="profile-dropdown">
                      <div className="dropdown-header">
                        <div className="dropdown-avatar">{profile.avatar}</div>
                        <div className="dropdown-user-info">
                          <div className="dropdown-name">{profile.name}</div>
                          <div className="dropdown-email">{profile.email}</div>
                        </div>
                      </div>
                      <div className="dropdown-menu">
                        <button onClick={() => setShowSettings(true)} className="dropdown-item">
                          <FiSettings /> Settings
                        </button>
                        <button onClick={toggleDarkMode} className="dropdown-item">
                          {darkMode ? <FiSun /> : <FiMoon />} 
                          {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                        <button onClick={handleLogout} className="dropdown-item logout">
                          <FiLogOut /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Alerts Section */}
            {alerts.length > 0 && (
              <div className="alerts-section">
                {alerts.map(alert => (
                  <div key={alert.id} className={`alert-card alert-${alert.type}`}>
                    {alert.type === 'warning' && <FiAlertCircle />}
                    {alert.type === 'danger' && <FiAlertCircle />}
                    {alert.type === 'info' && <FiCheckCircle />}
                    <span>{alert.message}</span>
                    <button className="alert-action">View</button>
                  </div>
                ))}
              </div>
            )}

            {/* App Cards */}
            <div className="apps-grid">
              {/* Volunteer App Card */}
              <div 
                className="app-card"
                onClick={() => setActiveApp('volunteer')}
              >
                <div className="app-card-header" style={{ background: 'linear-gradient(135deg, #66B032, #4CAF50)' }}>
                  <MdVolunteerActivism className="app-icon" />
                  <h3>Volunteer Registration</h3>
                </div>
                <div className="app-card-body">
                  <div className="app-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Volunteers</span>
                      <span className="stat-value">{stats.volunteer.total}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Active Today</span>
                      <span className="stat-value">{stats.volunteer.active}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Pending Approval</span>
                      <span className="stat-value pending">{stats.volunteer.pending}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">New Today</span>
                      <span className="stat-value success">{stats.volunteer.newToday}</span>
                    </div>
                  </div>
                  <div className="trend-indicator">
                    <FiTrendingUp className="trend-up" />
                    <span>{stats.volunteer.trend} from last week</span>
                  </div>
                </div>
                <div className="app-card-footer">
                  <button className="app-action-btn">
                    Manage Volunteers <FiArrowRight />
                  </button>
                </div>
              </div>

              {/* Billing App Card */}
              <div 
                className="app-card"
                onClick={() => setActiveApp('billing')}
              >
                <div className="app-card-header" style={{ background: 'linear-gradient(135deg, #0057A8, #003D7A)' }}>
                  <MdReceipt className="app-icon" />
                  <h3>Billing Issues</h3>
                </div>
                <div className="app-card-body">
                  <div className="app-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Revenue</span>
                      <span className="stat-value">{stats.billing.totalRevenue}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Pending</span>
                      <span className="stat-value pending">{stats.billing.pendingPayments}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Transactions</span>
                      <span className="stat-value">{stats.billing.completedTransactions}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Due Today</span>
                      <span className="stat-value warning">{stats.billing.dueToday}</span>
                    </div>
                  </div>
                  <div className="trend-indicator">
                    <FiTrendingUp className="trend-up" />
                    <span>{stats.billing.trend} revenue growth</span>
                  </div>
                </div>
                <div className="app-card-footer">
                  <button className="app-action-btn">
                    Manage Billing <FiArrowRight />
                  </button>
                </div>
              </div>

              {/* Inventory App Card */}
              <div 
                className="app-card"
                onClick={() => setActiveApp('inventory')}
              >
                <div className="app-card-header" style={{ background: 'linear-gradient(135deg, #66B032, #0057A8)' }}>
                  <MdInventory className="app-icon" />
                  <h3>Found & Not Found</h3>
                </div>
                <div className="app-card-body">
                  <div className="app-stats">
                    <div className="stat-item">
                      <span className="stat-label">Total Products</span>
                      <span className="stat-value">{stats.inventory.totalProducts}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">In Stock</span>
                      <span className="stat-value success">{stats.inventory.inStock}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Low Stock</span>
                      <span className="stat-value warning">{stats.inventory.lowStock}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Out of Stock</span>
                      <span className="stat-value danger">{stats.inventory.outOfStock}</span>
                    </div>
                  </div>
                  <div className="trend-indicator">
                    <FiTrendingDown className="trend-down" />
                    <span>{stats.inventory.trend} stock decrease</span>
                  </div>
                </div>
                <div className="app-card-footer">
                  <button className="app-action-btn">
                    Manage Inventory <FiArrowRight />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activities & Quick Actions */}
            <div className="dashboard-bottom">
              <div className="recent-activities">
                <h3>Recent Activities</h3>
                <div className="activities-list">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon" style={{ background: `${activity.color}20`, color: activity.color }}>
                        {activity.icon}
                      </div>
                      <div className="activity-details">
                        <div className="activity-title">
                          <strong>{activity.user}</strong> {activity.action}
                        </div>
                        <div className="activity-time">
                          <FiClock size={12} /> {activity.time}
                        </div>
                      </div>
                      <span className={`activity-badge ${activity.app}`}>
                        {activity.app}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="quick-stats">
                <h3>Quick Overview</h3>
                <div className="stats-summary">
                  <div className="summary-card">
                    <div className="summary-icon volunteer">
                      <MdVolunteerActivism />
                    </div>
                    <div className="summary-info">
                      <span className="summary-label">Volunteers</span>
                      <span className="summary-value">{stats.volunteer.active}</span>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon billing">
                      <MdReceipt />
                    </div>
                    <div className="summary-info">
                      <span className="summary-label">Pending Bills</span>
                      <span className="summary-value">{stats.billing.dueToday}</span>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon inventory">
                      <MdInventory />
                    </div>
                    <div className="summary-info">
                      <span className="summary-label">Low Stock</span>
                      <span className="summary-value">{stats.inventory.lowStock}</span>
                    </div>
                  </div>
                  <div className="summary-card">
                    <div className="summary-icon alert">
                      <MdWarning />
                    </div>
                    <div className="summary-info">
                      <span className="summary-label">Out of Stock</span>
                      <span className="summary-value">{stats.inventory.outOfStock}</span>
                    </div>
                  </div>
                </div>

                <div className="quick-actions">
                  <h4>Quick Actions</h4>
                  <div className="action-buttons">
                    <button className="quick-action-btn">
                      <FiUserPlus /> New Volunteer
                    </button>
                    <button className="quick-action-btn">
                      <FiCreditCard /> Create Invoice
                    </button>
                    <button className="quick-action-btn">
                      <FiSearch /> Check Stock
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      <Sidebar activeApp={activeApp} setActiveApp={setActiveApp} />
      {renderApp()}

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content settings-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><FiSettings /> Settings</h2>
              <button className="close-btn" onClick={() => setShowSettings(false)}>×</button>
            </div>
            
            <div className="modal-body">
              {/* Profile Settings */}
              <div className="settings-section">
                <h3>Profile Information</h3>
                <form onSubmit={handleProfileUpdate} className="settings-form">
                  <div className="form-group">
                    <label><FiUser /> Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      defaultValue={profile.name}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label><FiMail /> Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      defaultValue={profile.email}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label><FiPhone /> Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      defaultValue={profile.phone}
                      placeholder="Enter your phone"
                      required
                    />
                  </div>
                  <button type="submit" className="save-btn">Save Changes</button>
                </form>
              </div>

              {/* Notification Settings */}
              <div className="settings-section">
                <h3>Notification Settings</h3>
                <div className="settings-form">
                  <div className="preference-item">
                    <span><FiBell /> Sound Notifications</span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.sound}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev, sound: e.target.checked
                        }))}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  
                  <div className="preference-item">
                    <span><FiBell /> Desktop Notifications</span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.desktop}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev, desktop: e.target.checked
                        }))}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  
                  <div className="preference-item">
                    <span><FiMail /> Email Notifications</span>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.email}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev, email: e.target.checked
                        }))}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="settings-section">
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordChange} className="settings-form">
                  <div className="form-group">
                    <label><FiLock /> Current Password</label>
                    <input 
                      type="password" 
                      name="currentPassword"
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label><FiLock /> New Password</label>
                    <input 
                      type="password" 
                      name="newPassword"
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label><FiLock /> Confirm Password</label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  <button type="submit" className="save-btn">Update Password</button>
                </form>
              </div>

              {/* Preferences */}
              <div className="settings-section">
                <h3>Preferences</h3>
                <div className="preference-item">
                  <span>Dark Mode</span>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={darkMode}
                      onChange={toggleDarkMode}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;