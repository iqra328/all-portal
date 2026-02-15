import { useState } from "react";
import { 
  FiPackage,
  FiSearch,
  FiFilter,
  FiDownload,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiMapPin,
  FiTag,
  FiUser,
  FiCalendar,
  FiCamera,

} from "react-icons/fi";
import { 
  MdInventory, 
  MdWarning, 
  MdCheckCircle,
  MdQrCodeScanner,
  MdLocationOn,
  MdCategory
} from "react-icons/md";
import "./InventoryApp.css";
import { FaBarcode } from "react-icons/fa";

function InventoryApp({ onBack }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Sample inventory data
  const [products, setProducts] = useState([
    {
      id: 'PRD-001',
      name: 'Dell XPS 15 Laptop',
      category: 'Electronics',
      description: 'Core i7, 16GB RAM, 512GB SSD',
      foundStatus: 'found',
      quantity: 15,
      minStock: 5,
      location: 'Warehouse A - Shelf 3',
      lastUpdated: '2024-02-15',
      foundBy: 'Ali Raza',
      foundDate: '2024-02-15',
      tags: ['laptop', 'dell', 'electronics'],
      image: null,
      barcode: '123456789012'
    },
    {
      id: 'PRD-002',
      name: 'iPhone 13 Pro',
      category: 'Electronics',
      description: '256GB, Pacific Blue',
      foundStatus: 'found',
      quantity: 8,
      minStock: 3,
      location: 'Warehouse B - Shelf 1',
      lastUpdated: '2024-02-14',
      foundBy: 'Sara Khan',
      foundDate: '2024-02-14',
      tags: ['iphone', 'apple', 'mobile'],
      image: null,
      barcode: '123456789013'
    },
    {
      id: 'PRD-003',
      name: 'Wireless Mouse',
      category: 'Accessories',
      description: 'Logitech MX Master 3',
      foundStatus: 'low',
      quantity: 2,
      minStock: 5,
      location: 'Warehouse A - Shelf 5',
      lastUpdated: '2024-02-13',
      foundBy: 'Ahmed Malik',
      foundDate: '2024-02-13',
      tags: ['mouse', 'logitech', 'wireless'],
      image: null,
      barcode: '123456789014'
    },
    {
      id: 'PRD-004',
      name: 'USB-C Hub',
      category: 'Accessories',
      description: '7-in-1 Multiport Adapter',
      foundStatus: 'notfound',
      quantity: 0,
      minStock: 10,
      location: 'Unknown',
      lastUpdated: '2024-02-10',
      foundBy: 'Fatima Zaidi',
      foundDate: '2024-02-10',
      tags: ['hub', 'usb', 'adapter'],
      image: null,
      barcode: '123456789015'
    },
    {
      id: 'PRD-005',
      name: 'External Hard Drive',
      category: 'Storage',
      description: '2TB Seagate Portable',
      foundStatus: 'found',
      quantity: 12,
      minStock: 4,
      location: 'Warehouse C - Shelf 2',
      lastUpdated: '2024-02-12',
      foundBy: 'Bilal Ahmed',
      foundDate: '2024-02-12',
      tags: ['harddrive', 'storage', 'seagate'],
      image: null,
      barcode: '123456789016'
    },
    {
      id: 'PRD-006',
      name: 'Mechanical Keyboard',
      category: 'Accessories',
      description: 'RGB, Blue Switches',
      foundStatus: 'pending',
      quantity: 5,
      minStock: 3,
      location: 'Warehouse B - Shelf 4',
      lastUpdated: '2024-02-11',
      foundBy: 'Zainab Ali',
      foundDate: '2024-02-11',
      tags: ['keyboard', 'mechanical', 'gaming'],
      image: null,
      barcode: '123456789017'
    },
    {
      id: 'PRD-007',
      name: 'Monitor 24"',
      category: 'Electronics',
      description: 'Full HD, IPS Panel',
      foundStatus: 'found',
      quantity: 7,
      minStock: 2,
      location: 'Warehouse A - Shelf 8',
      lastUpdated: '2024-02-09',
      foundBy: 'Ali Raza',
      foundDate: '2024-02-09',
      tags: ['monitor', 'display', 'dell'],
      image: null,
      barcode: '123456789018'
    },
    {
      id: 'PRD-008',
      name: 'Webcam HD',
      category: 'Electronics',
      description: '1080p with Microphone',
      foundStatus: 'notfound',
      quantity: 0,
      minStock: 5,
      location: 'Unknown',
      lastUpdated: '2024-02-08',
      foundBy: 'Sara Khan',
      foundDate: '2024-02-08',
      tags: ['webcam', 'camera', 'video'],
      image: null,
      barcode: '123456789019'
    }
  ]);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electronics',
    description: '',
    foundStatus: 'found',
    quantity: 1,
    minStock: 1,
    location: '',
    tags: '',
    barcode: '',
    foundBy: 'Admin'
  });

  // Categories for filter
  const categories = ['all', 'Electronics', 'Accessories', 'Storage', 'Others'];

  // Calculate statistics
  const stats = {
    total: products.length,
    found: products.filter(p => p.foundStatus === 'found').length,
    notfound: products.filter(p => p.foundStatus === 'notfound').length,
    pending: products.filter(p => p.foundStatus === 'pending').length,
    lowStock: products.filter(p => p.quantity <= p.minStock && p.quantity > 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.quantity * 1000), 0) // Sample value calculation
  };

  // Filter products based on search, tab, category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || product.foundStatus === activeTab;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesTab && matchesCategory;
  });

  // Get low stock alerts
  const lowStockAlerts = products.filter(p => p.quantity <= p.minStock && p.quantity > 0);
  
  // Get not found alerts
  const notFoundAlerts = products.filter(p => p.foundStatus === 'notfound');

  const getStatusClass = (status) => {
    switch(status) {
      case 'found': return 'status-found';
      case 'notfound': return 'status-notfound';
      case 'pending': return 'status-pending';
      case 'low': return 'status-low';
      default: return '';
    }
  };

  const getStockClass = (quantity, minStock) => {
    if (quantity === 0) return 'critical';
    if (quantity <= minStock) return 'low';
    return 'normal';
  };

  const handleAddProduct = () => {
    const product = {
      id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
      ...newProduct,
      tags: newProduct.tags.split(',').map(tag => tag.trim()),
      lastUpdated: new Date().toISOString().split('T')[0],
      foundDate: new Date().toISOString().split('T')[0],
      image: null
    };

    setProducts([...products, product]);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      category: 'Electronics',
      description: '',
      foundStatus: 'found',
      quantity: 1,
      minStock: 1,
      location: '',
      tags: '',
      barcode: '',
      foundBy: 'Admin'
    });
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleStatusChange = (productId, newStatus) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          foundStatus: newStatus,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const handleScanQR = () => {
    // Simulate QR scan
    alert('Scanning QR Code...\n(Integration with QR scanner would go here)');
    setShowScanModal(false);
  };

  return (
    <div className="inventory-app">
      <div className="app-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h1 className="app-title">
          <MdInventory /> Found & Not Found Products
        </h1>
      </div>

      {/* Statistics Cards */}
      <div className="inventory-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FiPackage />
          </div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-number">{stats.total}</p>
            <div className="stat-trend">
              <FiTrendingUp className="trend-up" />
              <span>+8%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon found">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Found</h3>
            <p className="stat-number">{stats.found}</p>
            <span className="stat-label">In stock</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon notfound">
            <FiAlertCircle />
          </div>
          <div className="stat-content">
            <h3>Not Found</h3>
            <p className="stat-number">{stats.notfound}</p>
            <span className="stat-label">Missing</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <FiClock />
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-number">{stats.pending}</p>
            <span className="stat-label">Verification</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon lowstock">
            <MdWarning />
          </div>
          <div className="stat-content">
            <h3>Low Stock</h3>
            <p className="stat-number">{stats.lowStock}</p>
            <span className="stat-label">Below minimum</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon value">
            <FiTrendingUp />
          </div>
          <div className="stat-content">
            <h3>Est. Value</h3>
            <p className="stat-number">₨ {stats.totalValue.toLocaleString()}</p>
            <span className="stat-label">Total worth</span>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {(lowStockAlerts.length > 0 || notFoundAlerts.length > 0) && (
        <div className="alerts-section">
          {lowStockAlerts.map(alert => (
            <div key={`low-${alert.id}`} className="alert-card warning">
              <div className="alert-icon warning">
                <MdWarning />
              </div>
              <div className="alert-content">
                <div className="alert-title">Low Stock Alert</div>
                <div className="alert-desc">
                  {alert.name} - Only {alert.quantity} left (Min: {alert.minStock})
                </div>
              </div>
              <button className="alert-action">Order Now</button>
            </div>
          ))}

          {notFoundAlerts.map(alert => (
            <div key={`not-${alert.id}`} className="alert-card danger">
              <div className="alert-icon danger">
                <FiAlertCircle />
              </div>
              <div className="alert-content">
                <div className="alert-title">Product Not Found</div>
                <div className="alert-desc">
                  {alert.name} - Last seen: {new Date(alert.lastUpdated).toLocaleDateString()}
                </div>
              </div>
              <button className="alert-action">Investigate</button>
            </div>
          ))}
        </div>
      )}

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name, ID, barcode, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="action-buttons">
          <button className="filter-btn">
            <FiFilter /> Filter
          </button>
          <button className="export-btn">
            <FiDownload /> Export
          </button>
          <button className="scan-btn" onClick={() => setShowScanModal(true)}>
            <MdQrCodeScanner /> Scan QR
          </button>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <FiPlus /> Add Product
          </button>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Products
          </button>
          <button 
            className={`tab ${activeTab === 'found' ? 'active' : ''}`}
            onClick={() => setActiveTab('found')}
          >
            Found
          </button>
          <button 
            className={`tab ${activeTab === 'notfound' ? 'active' : ''}`}
            onClick={() => setActiveTab('notfound')}
          >
            Not Found
          </button>
          <button 
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button 
            className={`tab ${activeTab === 'low' ? 'active' : ''}`}
            onClick={() => setActiveTab('low')}
          >
            Low Stock
          </button>
        </div>

        {/* Category Filters */}
        <div className="filter-pills">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-pill ${categoryFilter === category ? 'active' : ''}`}
              onClick={() => setCategoryFilter(category)}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className={`product-card ${product.foundStatus}`}>
              <div className="product-header">
                <div className="product-avatar">
                  {product.name.charAt(0)}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-category">
                    <MdCategory /> {product.category}
                  </div>
                </div>
                <span className={`product-status ${getStatusClass(product.foundStatus)}`}>
                  {product.foundStatus.toUpperCase()}
                </span>
              </div>

              <div className="product-body">
                <div className="product-details">
                  <div className="detail-row">
                    <FiTag />
                    <span className="detail-label">ID:</span>
                    <span className="detail-value">{product.id}</span>
                  </div>
                  <div className="detail-row">
                  <FiPackage />
                    <span className="detail-label">Barcode:</span>
                    <span className="detail-value">{product.barcode}</span>
                  </div>
                  <div className="detail-row">
                    <FiPackage />
                    <span className="detail-label">Quantity:</span>
                    <span className={`detail-value ${
                      product.quantity === 0 ? 'notfound' : 
                      product.quantity <= product.minStock ? 'warning' : ''
                    }`}>
                      {product.quantity} units
                    </span>
                  </div>
                  <div className="detail-row">
                    <FiUser />
                    <span className="detail-label">Found By:</span>
                    <span className="detail-value">{product.foundBy}</span>
                  </div>
                  <div className="detail-row">
                    <FiCalendar />
                    <span className="detail-label">Found Date:</span>
                    <span className="detail-value">
                      {new Date(product.foundDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Stock Indicator */}
                {product.foundStatus === 'found' && (
                  <div className="stock-indicator">
                    <div className="stock-bar">
                      <div 
                        className={`stock-fill ${getStockClass(product.quantity, product.minStock)}`}
                        style={{ width: `${Math.min((product.quantity / product.minStock) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="stock-text">
                      <span>Min: {product.minStock}</span>
                      <span>Current: {product.quantity}</span>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="product-tags">
                  {product.tags.map((tag, index) => (
                    <span key={index} className={`tag ${product.foundStatus}`}>
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Location */}
                <div className="location-info">
                  <MdLocationOn />
                  <span>{product.location}</span>
                </div>

                {/* Description */}
                <p style={{ 
                  color: 'var(--text-light)', 
                  fontSize: '12px', 
                  marginTop: '10px',
                  padding: '8px',
                  background: 'var(--offwhite)',
                  borderRadius: '8px'
                }}>
                  {product.description}
                </p>
              </div>

              <div className="product-footer">
                <button className="product-action-btn edit">
                  <FiEdit2 /> Edit
                </button>
                {product.foundStatus !== 'found' && (
                  <button 
                    className="product-action-btn found"
                    onClick={() => handleStatusChange(product.id, 'found')}
                  >
                    <FiCheckCircle /> Mark Found
                  </button>
                )}
                {product.foundStatus !== 'notfound' && (
                  <button 
                    className="product-action-btn notfound"
                    onClick={() => handleStatusChange(product.id, 'notfound')}
                  >
                    <FiAlertCircle /> Mark Not Found
                  </button>
                )}
                <button 
                  className="product-action-btn delete"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FiPackage size={60} />
          <h3>No Products Found</h3>
          <p>Try adjusting your search or add a new product</p>
          <button onClick={() => setShowAddModal(true)}>
            <FiPlus /> Add New Product
          </button>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                <FiPlus /> Add New Product
              </h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    placeholder="Enter product name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Storage">Storage</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter product description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Stock</label>
                  <input
                    type="number"
                    min="1"
                    value={newProduct.minStock}
                    onChange={(e) => setNewProduct({...newProduct, minStock: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="e.g., Warehouse A - Shelf 3"
                  value={newProduct.location}
                  onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Barcode/QR</label>
                  <input
                    type="text"
                    placeholder="Enter barcode"
                    value={newProduct.barcode}
                    onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g., laptop, dell, electronics"
                    value={newProduct.tags}
                    onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <div className="status-options">
                  <label className="status-option found">
                    <input
                      type="radio"
                      name="status"
                      value="found"
                      checked={newProduct.foundStatus === 'found'}
                      onChange={(e) => setNewProduct({...newProduct, foundStatus: e.target.value})}
                    />
                    <span>Found</span>
                  </label>
                  <label className="status-option notfound">
                    <input
                      type="radio"
                      name="status"
                      value="notfound"
                      checked={newProduct.foundStatus === 'notfound'}
                      onChange={(e) => setNewProduct({...newProduct, foundStatus: e.target.value})}
                    />
                    <span>Not Found</span>
                  </label>
                  <label className="status-option pending">
                    <input
                      type="radio"
                      name="status"
                      value="pending"
                      checked={newProduct.foundStatus === 'pending'}
                      onChange={(e) => setNewProduct({...newProduct, foundStatus: e.target.value})}
                    />
                    <span>Pending</span>
                  </label>
                </div>
              </div>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button 
                  className="submit-btn" 
                  onClick={handleAddProduct}
                  disabled={!newProduct.name || !newProduct.location}
                >
                  <FiCheckCircle /> Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scan QR Modal */}
      {showScanModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>
                <MdQrCodeScanner /> Scan QR Code
              </h2>
              <button className="close-btn" onClick={() => setShowScanModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <div style={{
                width: '200px',
                height: '200px',
                background: 'var(--offwhite)',
                margin: '20px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                border: '2px dashed var(--border-light)'
              }}>
                <FiCamera size={50} color="var(--text-light)" />
              </div>
              <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
                Position QR code in front of camera
              </p>
              <button className="submit-btn" onClick={handleScanQR} style={{ width: '100%' }}>
                <FiCamera /> Start Scanning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryApp;