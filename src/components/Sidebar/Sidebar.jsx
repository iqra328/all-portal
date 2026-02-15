import { useState } from "react";
import { 
  FiHome, 
  FiUsers, 
  FiDollarSign, 
  FiPackage,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { 
  MdVolunteerActivism, 
  MdReceipt, 
  MdInventory 
} from "react-icons/md";
import "./Sidebar.css";

function Sidebar({ activeApp, setActiveApp }) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'overview', icon: <FiHome />, label: 'Overview', app: 'overview' },
    { id: 'volunteer', icon: <MdVolunteerActivism />, label: 'Volunteers', app: 'volunteer', color: '#66B032' },
    { id: 'billing', icon: <MdReceipt />, label: 'Billing', app: 'billing', color: '#0057A8' },
    { id: 'inventory', icon: <MdInventory />, label: 'Inventory', app: 'inventory', color: '#FF6B35' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          {!collapsed ? (
            <>
              <div className="logo-icon">SMI</div>
              <h2>Saylani Mass IT</h2>
            </>
          ) : (
            <div className="logo-icon">S</div>
          )}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeApp === item.app ? 'active' : ''}`}
            onClick={() => setActiveApp(item.app)}
          >
            <span className="nav-icon" style={{ color: item.color }}>
              {item.icon}
            </span>
            {!collapsed && (
              <>
                <span className="nav-label">{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item settings">
          <FiSettings />
          {!collapsed && <span>Settings</span>}
        </button>
        <button className="nav-item logout">
          <FiLogOut />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;