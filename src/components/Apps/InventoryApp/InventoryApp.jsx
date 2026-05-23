import { useState, useEffect } from "react";
import { FiPackage, FiSearch, FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiCheckCircle, FiArrowLeft, FiX } from "react-icons/fi";
import { MdInventory, MdWarning } from "react-icons/md";

function InventoryApp({ onBack }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('inventory_products');
    return saved ? JSON.parse(saved) : [
      { id: 'PRD-001', name: 'Dell XPS 15', category: 'Electronics', foundStatus: 'found', quantity: 15, minStock: 5, location: 'Warehouse A', foundBy: 'Ali', foundDate: '2024-02-15', description: 'Core i7 laptop' },
      { id: 'PRD-002', name: 'iPhone 13', category: 'Electronics', foundStatus: 'found', quantity: 8, minStock: 3, location: 'Warehouse B', foundBy: 'Sara', foundDate: '2024-02-14', description: '256GB' }
    ];
  });
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Electronics', quantity: 1, minStock: 1, location: '', description: '', foundStatus: 'found' });

  useEffect(() => localStorage.setItem('inventory_products', JSON.stringify(products)), [products]);

  const stats = {
    total: products.length,
    found: products.filter(p => p.foundStatus === 'found').length,
    notfound: products.filter(p => p.foundStatus === 'notfound').length,
    lowStock: products.filter(p => p.quantity <= p.minStock && p.quantity > 0).length
  };

  const filtered = products.filter(p => {
    const match = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const tabMatch = activeTab === 'all' || p.foundStatus === activeTab;
    return match && tabMatch;
  });

  const handleAdd = () => {
    if (!newProduct.name) return alert('Name required');
    const newId = `PRD-${String(products.length + 1).padStart(3, '0')}`;
    setProducts([...products, { ...newProduct, id: newId, foundDate: new Date().toISOString().split('T')[0] }]);
    setShowAddModal(false);
    setNewProduct({ name: '', category: 'Electronics', quantity: 1, minStock: 1, location: '', description: '', foundStatus: 'found' });
    alert('Product added');
  };
  const handleDelete = (id) => { if (confirm('Delete?')) setProducts(products.filter(p => p.id !== id)); };

  const styles = {
    page: { minHeight: '100vh', paddingTop: '80px', background: '#f0f2f5', width: '100%' },
    backBtn: { position: 'fixed', top: '20px', left: '20px', background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: '15px', marginBottom: '20px' },
    statCard: { background: 'white', padding: '15px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' },
    searchBar: { display: 'flex', justifyContent: 'space-between', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' },
    search: { display: 'flex', alignItems: 'center', background: 'white', padding: '8px 16px', borderRadius: '30px', flex: 1 },
    addBtn: { background: '#10b981', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' },
    tab: { padding: '6px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: 'transparent' },
    activeTab: { background: '#10b981', color: 'white' },
    productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '20px' },
    productCard: { background: 'white', borderRadius: '20px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
    status: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 },
    modal: { background: 'white', borderRadius: '28px', width: '90%', maxWidth: '500px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    modalBody: { padding: '20px', overflowY: 'auto' },
    modalFooter: { padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', justifyContent: 'flex-end' },
    formGroup: { marginBottom: '16px' },
    input: { width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '16px' },
    btnCancel: { padding: '8px 20px', background: '#e2e8f0', border: 'none', borderRadius: '30px', cursor: 'pointer' },
    btnSubmit: { padding: '8px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer' }
  };

  return (
    <div style={styles.page}>
      {onBack && <button onClick={onBack} style={styles.backBtn}><FiArrowLeft /> Back to Dashboard</button>}
      <div style={styles.container}>
        <div style={styles.header}><h1><MdInventory /> Inventory</h1></div>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}><div>Total</div><strong>{stats.total}</strong></div>
          <div style={styles.statCard}><div>Found</div><strong>{stats.found}</strong></div>
          <div style={styles.statCard}><div>Not Found</div><strong>{stats.notfound}</strong></div>
          <div style={styles.statCard}><div>Low Stock</div><strong>{stats.lowStock}</strong></div>
        </div>
        <div style={styles.searchBar}>
          <div style={styles.search}><FiSearch /><input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: 'none', flex: 1, marginLeft: '8px', outline: 'none' }} /></div>
          <button style={styles.addBtn} onClick={() => setShowAddModal(true)}><FiPlus /> Add Product</button>
        </div>
        <div style={styles.tabs}>
          {['all','found','notfound'].map(tab => <button key={tab} style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }} onClick={() => setActiveTab(tab)}>{tab.toUpperCase()}</button>)}
        </div>
        <div style={styles.productGrid}>
          {filtered.map(p => (
            <div key={p.id} style={styles.productCard}>
              <div style={styles.cardHeader}><strong>{p.name}</strong><span style={{ ...styles.status, background: p.foundStatus === 'found' ? '#dcfce7' : '#fee2e2', color: p.foundStatus === 'found' ? '#166534' : '#991b1b' }}>{p.foundStatus}</span></div>
              <div>Category: {p.category}</div>
              <div>Quantity: {p.quantity} (Min: {p.minStock})</div>
              <div>Location: {p.location}</div>
              <div style={{ marginTop: '12px' }}><button onClick={() => handleDelete(p.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer' }}><FiTrash2 /> Delete</button></div>
            </div>
          ))}
          {filtered.length === 0 && <div>No products found</div>}
        </div>
      </div>

      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}><h2 style={{ margin: 0 }}>Add Product</h2><button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}><FiX /></button></div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}><label>Name</label><input style={styles.input} value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} /></div>
              <div style={styles.formGroup}><label>Category</label><select style={styles.input} value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}><option>Electronics</option><option>Accessories</option></select></div>
              <div style={styles.formGroup}><label>Quantity</label><input type="number" style={styles.input} value={newProduct.quantity} onChange={e => setNewProduct({...newProduct, quantity: +e.target.value})} /></div>
              <div style={styles.formGroup}><label>Min Stock</label><input type="number" style={styles.input} value={newProduct.minStock} onChange={e => setNewProduct({...newProduct, minStock: +e.target.value})} /></div>
              <div style={styles.formGroup}><label>Location</label><input style={styles.input} value={newProduct.location} onChange={e => setNewProduct({...newProduct, location: e.target.value})} /></div>
              <div style={styles.formGroup}><label>Description</label><textarea style={styles.input} rows="3" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} /></div>
            </div>
            <div style={styles.modalFooter}><button style={styles.btnCancel} onClick={() => setShowAddModal(false)}>Cancel</button><button style={styles.btnSubmit} onClick={handleAdd}>Add Product</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
export default InventoryApp;