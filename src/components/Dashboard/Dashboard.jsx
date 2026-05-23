import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiBell, FiSettings, FiLogOut, FiUser, FiMoon, FiSun, FiChevronDown,
  FiCalendar, FiClock, FiAlertCircle, FiArrowRight, FiUserPlus,
  FiCreditCard, FiSearch, FiTrendingUp, FiTrendingDown, FiTrash2
} from "react-icons/fi";
import { 
  MdVolunteerActivism, MdReceipt, MdInventory, MdWarning,
  MdNotificationsActive, MdNotificationsNone, MdDoneAll
} from "react-icons/md";
import "./Dashboard.css";
import Sidebar from "../Sidebar/Sidebar";  // ✅ Import Sidebar component
import VolunteerApp from "../Apps/VolunteerApp/VolunteerApp";
import BillingApp from "../Apps/BillingApp/BillingApp";
import InventoryApp from "../Apps/InventoryApp/InventoryApp";

function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeApp, setActiveApp] = useState('overview');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [profile, setProfile] = useState({ name: "Admin User", email: "admin@saylani.com", role: "Admin", avatar: "A" });

  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Volunteer", message: "Ali Raza registered", time: "2m ago", read: false, link: "volunteer" },
    { id: 2, title: "Payment Received", message: "₨5,000 from Sara", time: "15m ago", read: false, link: "billing" },
    { id: 3, title: "Low Stock Alert", message: "Laptops only 2 left", time: "25m ago", read: false, link: "inventory" },
  ]);

  const [stats] = useState({
    volunteer: { total: 345, active: 280, pending: 45, newToday: 12, trend: '+15%' },
    billing: { totalRevenue: '₨2.4M', pendingPayments: '₨345K', completedTransactions: 1234, dueToday: 23, trend: '+8%' },
    inventory: { totalProducts: 567, inStock: 423, lowStock: 89, outOfStock: 55, trend: '-3%' }
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) navigate('/login', { replace: true });
  }, [navigate]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAsRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);
  const handleLogout = () => { localStorage.removeItem('user'); navigate('/login', { replace: true }); };
  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const formatDate = (d) => d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formatTime = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const recentActivities = [
    { id: 1, user: 'Ali Raza', action: 'Registered as Volunteer', time: '2m ago', icon: 'volunteer', color: '#10b981' },
    { id: 2, user: 'Sara Khan', action: 'Payment Received - ₨5,000', time: '15m ago', icon: 'billing', color: '#3b82f6' },
    { id: 3, user: 'Ahmed Malik', action: 'Low Stock Alert - Laptops', time: '25m ago', icon: 'inventory', color: '#f59e0b' },
  ];

  const alerts = [
    { id: 1, type: 'warning', message: '15 volunteers pending approval', app: 'volunteer' },
    { id: 2, type: 'danger', message: '23 bills overdue payment', app: 'billing' },
    { id: 3, type: 'warning', message: '89 products low in stock', app: 'inventory' },
  ];

  const renderApp = () => {
    switch(activeApp) {
      case 'volunteer': return <VolunteerApp onBack={() => setActiveApp('overview')} />;
      case 'billing': return <BillingApp onBack={() => setActiveApp('overview')} />;
      case 'inventory': return <InventoryApp onBack={() => setActiveApp('overview')} />;
      default: return null;
    }
  };

  if (activeApp !== 'overview') {
    return <div className={darkMode ? 'dark-mode' : ''}>{renderApp()}</div>;
  }

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* ✅ Using Sidebar component with all props */}
      <Sidebar 
        activeApp={activeApp} 
        setActiveApp={setActiveApp}
        onSettingsClick={() => setShowSettings(true)}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h2>Saylani Mass IT Dashboard</h2>
            <p><FiCalendar /> {formatDate(currentTime)} | <FiClock /> {formatTime(currentTime)}</p>
          </div>
          <div className="header-right">
            <button className="icon-btn" onClick={() => setShowSettings(true)}><FiSettings size={20} /></button>
            <div className="notification-container">
              <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                <FiBell size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <span>Notifications</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-btn" onClick={markAllAsRead}><MdDoneAll size={16} /></button>
                      <button className="icon-btn" onClick={clearAll} style={{ color: '#ef4444' }}><FiTrash2 size={16} /></button>
                      <button className="icon-btn" onClick={() => setShowNotifications(false)}>✕</button>
                    </div>
                  </div>
                  <div className="notifications-list">
                    {notifications.length === 0 ? (
                      <div style={{ padding: '1rem', textAlign: 'center' }}>No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`} onClick={() => { markAsRead(n.id); setActiveApp(n.link); setShowNotifications(false); }}>
                          <div className="notification-title">{n.title}</div>
                          <div className="notification-message">{n.message}</div>
                          <div className="notification-time">{n.time}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div className="profile-avatar">{profile.avatar}</div>
              <div className="profile-info">
                <div className="profile-name">{profile.name}</div>
                <div className="profile-role">{profile.role}</div>
              </div>
              <FiChevronDown size={16} />
              {showProfileMenu && (
                <div className="dropdown">
                  <button className="dropdown-item" onClick={() => setShowSettings(true)}><FiUser /> Settings</button>
                  <button className="dropdown-item" onClick={toggleDarkMode}>{darkMode ? <FiSun /> : <FiMoon />} {darkMode ? 'Light Mode' : 'Dark Mode'}</button>
                  <button className="dropdown-item logout" onClick={handleLogout}><FiLogOut /> Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="alerts-section">
          {alerts.map(alert => (
            <div key={alert.id} className={`alert-card alert-${alert.type}`}>
              <FiAlertCircle />
              <span>{alert.message}</span>
              <button className="alert-action" onClick={() => setActiveApp(alert.app)}>View</button>
            </div>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="cards-grid">
          <div className="app-card" onClick={() => setActiveApp('volunteer')}>
            <div className="app-card-header" style={{ background: '#10b981' }}>
              <MdVolunteerActivism size={24} /><h3>Volunteer Registration</h3>
            </div>
            <div className="app-card-body">
              <div className="app-stats">
                <div className="stat-item"><span className="stat-label">Total</span><span className="stat-value">{stats.volunteer.total}</span></div>
                <div className="stat-item"><span className="stat-label">Active</span><span className="stat-value">{stats.volunteer.active}</span></div>
                <div className="stat-item"><span className="stat-label">Pending</span><span className="stat-value pending">{stats.volunteer.pending}</span></div>
                <div className="stat-item"><span className="stat-label">New Today</span><span className="stat-value success">{stats.volunteer.newToday}</span></div>
              </div>
              <div className="trend-indicator"><FiTrendingUp color="#10b981" /> {stats.volunteer.trend} from last week</div>
            </div>
            <div className="app-card-footer"><button>Manage <FiArrowRight /></button></div>
          </div>
          <div className="app-card" onClick={() => setActiveApp('billing')}>
            <div className="app-card-header" style={{ background: '#3b82f6' }}>
              <MdReceipt size={24} /><h3>Billing Issues</h3>
            </div>
            <div className="app-card-body">
              <div className="app-stats">
                <div className="stat-item"><span className="stat-label">Revenue</span><span className="stat-value">{stats.billing.totalRevenue}</span></div>
                <div className="stat-item"><span className="stat-label">Pending</span><span className="stat-value pending">{stats.billing.pendingPayments}</span></div>
                <div className="stat-item"><span className="stat-label">Transactions</span><span className="stat-value">{stats.billing.completedTransactions}</span></div>
                <div className="stat-item"><span className="stat-label">Due Today</span><span className="stat-value danger">{stats.billing.dueToday}</span></div>
              </div>
              <div className="trend-indicator"><FiTrendingUp color="#10b981" /> {stats.billing.trend} revenue growth</div>
            </div>
            <div className="app-card-footer"><button>Manage <FiArrowRight /></button></div>
          </div>
          <div className="app-card" onClick={() => setActiveApp('inventory')}>
            <div className="app-card-header" style={{ background: '#f59e0b' }}>
              <MdInventory size={24} /><h3>Found & Not Found</h3>
            </div>
            <div className="app-card-body">
              <div className="app-stats">
                <div className="stat-item"><span className="stat-label">Total</span><span className="stat-value">{stats.inventory.totalProducts}</span></div>
                <div className="stat-item"><span className="stat-label">In Stock</span><span className="stat-value success">{stats.inventory.inStock}</span></div>
                <div className="stat-item"><span className="stat-label">Low Stock</span><span className="stat-value pending">{stats.inventory.lowStock}</span></div>
                <div className="stat-item"><span className="stat-label">Out of Stock</span><span className="stat-value danger">{stats.inventory.outOfStock}</span></div>
              </div>
              <div className="trend-indicator"><FiTrendingDown color="#ef4444" /> {stats.inventory.trend} stock decrease</div>
            </div>
            <div className="app-card-footer"><button>Manage <FiArrowRight /></button></div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="dashboard-bottom">
          <div className="recent-activities">
            <h3>Recent Activities</h3>
            {recentActivities.map(act => (
              <div key={act.id} className="activity-item">
                <div className="activity-icon" style={{ background: `${act.color}20`, color: act.color }}>
                  {act.icon === 'volunteer' && <MdVolunteerActivism />}
                  {act.icon === 'billing' && <MdReceipt />}
                  {act.icon === 'inventory' && <MdInventory />}
                </div>
                <div className="activity-details">
                  <div className="activity-title"><strong>{act.user}</strong> {act.action}</div>
                  <div className="activity-time"><FiClock size={12} /> {act.time}</div>
                </div>
                <span className="activity-badge">{act.icon}</span>
              </div>
            ))}
          </div>
          <div className="quick-stats">
            <h3>Quick Overview</h3>
            <div className="stats-summary">
              <div className="summary-card"><div className="summary-icon" style={{ background: '#10b98120', color: '#10b981' }}><MdVolunteerActivism /></div><div className="summary-info"><span className="summary-label">Volunteers</span><span className="summary-value">{stats.volunteer.active}</span></div></div>
              <div className="summary-card"><div className="summary-icon" style={{ background: '#3b82f620', color: '#3b82f6' }}><MdReceipt /></div><div className="summary-info"><span className="summary-label">Pending Bills</span><span className="summary-value">{stats.billing.dueToday}</span></div></div>
              <div className="summary-card"><div className="summary-icon" style={{ background: '#f59e0b20', color: '#f59e0b' }}><MdInventory /></div><div className="summary-info"><span className="summary-label">Low Stock</span><span className="summary-value">{stats.inventory.lowStock}</span></div></div>
              <div className="summary-card"><div className="summary-icon" style={{ background: '#ef444420', color: '#ef4444' }}><MdWarning /></div><div className="summary-info"><span className="summary-label">Out of Stock</span><span className="summary-value">{stats.inventory.outOfStock}</span></div></div>
            </div>
            <div className="quick-actions">
              <h4>Quick Actions</h4>
              <button className="quick-action-btn" onClick={() => setActiveApp('volunteer')}><FiUserPlus /> New Volunteer</button>
              <button className="quick-action-btn" onClick={() => setActiveApp('billing')}><FiCreditCard /> Create Invoice</button>
              <button className="quick-action-btn" onClick={() => setActiveApp('inventory')}><FiSearch /> Check Stock</button>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="modal-overlay" onClick={() => setShowSettings(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Settings</h2>
                <button className="close-btn" onClick={() => setShowSettings(false)}>×</button>
              </div>
              <div className="settings-section">
                <h3>Profile</h3>
                <div className="form-group"><label>Name</label><input type="text" defaultValue={profile.name} /></div>
                <div className="form-group"><label>Email</label><input type="email" defaultValue={profile.email} /></div>
              </div>
              <div className="settings-section">
                <h3>Preferences</h3>
                <div className="preference-item"><span>Dark Mode</span><label className="switch"><input type="checkbox" checked={darkMode} onChange={toggleDarkMode} /><span className="slider"></span></label></div>
              </div>
              <button className="save-btn" onClick={() => setShowSettings(false)}>Close</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;