import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiAlertCircle, FiCheckCircle, FiClock, FiArrowLeft, FiX, FiZap, FiDroplet } from "react-icons/fi";
import { MdReportProblem } from "react-icons/md";

function BillingApp({ onBack }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('billing_complaints');
    return saved ? JSON.parse(saved) : [
      { id: 'CMP-001', complainant: { name: 'Ali Raza', phone: '03001234567', email: 'ali@email.com' }, type: 'electricity', priority: 'high', status: 'pending', description: 'Power fluctuation', registeredDate: '2024-02-15' },
      { id: 'CMP-002', complainant: { name: 'Sara Khan', phone: '03219876543', email: 'sara@email.com' }, type: 'water', priority: 'critical', status: 'in-progress', description: 'Water leakage', registeredDate: '2024-02-14' }
    ];
  });
  const [newComplaint, setNewComplaint] = useState({ complainantName: '', complainantPhone: '', type: 'electricity', priority: 'medium', description: '' });

  useEffect(() => localStorage.setItem('billing_complaints', JSON.stringify(complaints)), [complaints]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };
  const filtered = complaints.filter(c => {
    const match = c.complainant.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const tabMatch = activeTab === 'all' || c.status === activeTab;
    return match && tabMatch;
  });
  const handleAdd = () => {
    if (!newComplaint.complainantName || !newComplaint.complainantPhone || !newComplaint.description) return alert('Fill required fields');
    const newId = `CMP-${String(complaints.length + 1).padStart(3, '0')}`;
    setComplaints([...complaints, { id: newId, complainant: { name: newComplaint.complainantName, phone: newComplaint.complainantPhone }, type: newComplaint.type, priority: newComplaint.priority, status: 'pending', description: newComplaint.description, registeredDate: new Date().toISOString().split('T')[0] }]);
    setShowAddModal(false);
    setNewComplaint({ complainantName: '', complainantPhone: '', type: 'electricity', priority: 'medium', description: '' });
    alert('Complaint registered');
  };
  const handleDelete = (id) => { if (confirm('Delete?')) setComplaints(complaints.filter(c => c.id !== id)); };

  const styles = {
    page: { minHeight: '100vh', paddingTop: '80px', background: '#f0f2f5', width: '100%' },
    backBtn: { position: 'fixed', top: '20px', left: '20px', background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: '15px', marginBottom: '20px' },
    statCard: { background: 'white', padding: '15px', borderRadius: '16px', textAlign: 'center' },
    searchBar: { display: 'flex', justifyContent: 'space-between', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' },
    search: { display: 'flex', alignItems: 'center', background: 'white', padding: '8px 16px', borderRadius: '30px', flex: 1 },
    addBtn: { background: '#10b981', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
    tabs: { display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' },
    tab: { padding: '6px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: 'transparent' },
    activeTab: { background: '#10b981', color: 'white' },
    table: { width: '100%', background: 'white', borderRadius: '20px', overflow: 'hidden', borderCollapse: 'collapse' },
    th: { padding: '12px', background: '#e2e8f0', textAlign: 'left' },
    td: { padding: '12px', borderBottom: '1px solid #e2e8f0' },
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
        <div style={{ marginBottom: '20px' }}><h1><MdReportProblem /> Complaint Management</h1></div>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>Total: {stats.total}</div>
          <div style={styles.statCard}>Pending: {stats.pending}</div>
          <div style={styles.statCard}>In Progress: {stats.inProgress}</div>
          <div style={styles.statCard}>Resolved: {stats.resolved}</div>
        </div>
        <div style={styles.searchBar}>
          <div style={styles.search}><FiSearch /><input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ border: 'none', flex: 1, marginLeft: '8px', outline: 'none' }} /></div>
          <button style={styles.addBtn} onClick={() => setShowAddModal(true)}><FiPlus /> New Complaint</button>
        </div>
        <div style={styles.tabs}>
          {['all','pending','in-progress','resolved'].map(tab => <button key={tab} style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }} onClick={() => setActiveTab(tab)}>{tab.toUpperCase()}</button>)}
        </div>
        <table style={styles.table}>
          <thead><tr>{['ID','Name','Type','Priority','Description','Status','Actions'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td style={styles.td}>{c.id}</td><td style={styles.td}>{c.complainant.name}<br/><small>{c.complainant.phone}</small></td>
                <td style={styles.td}>{c.type === 'electricity' ? <FiZap /> : <FiDroplet />} {c.type}</td>
                <td style={styles.td}>{c.priority}</td>
                <td style={styles.td}>{c.description.substring(0, 40)}...</td>
                <td style={styles.td}>{c.status}</td>
                <td style={styles.td}><button onClick={() => handleDelete(c.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '20px', cursor: 'pointer' }}><FiTrash2 /> Delete</button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No complaints found</td></tr>}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}><h2 style={{ margin: 0 }}>New Complaint</h2><button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}><FiX /></button></div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}><label>Name</label><input style={styles.input} value={newComplaint.complainantName} onChange={e => setNewComplaint({...newComplaint, complainantName: e.target.value})} /></div>
              <div style={styles.formGroup}><label>Phone</label><input style={styles.input} value={newComplaint.complainantPhone} onChange={e => setNewComplaint({...newComplaint, complainantPhone: e.target.value})} /></div>
              <div style={styles.formGroup}><label>Type</label><select style={styles.input} value={newComplaint.type} onChange={e => setNewComplaint({...newComplaint, type: e.target.value})}><option>electricity</option><option>water</option><option>internet</option></select></div>
              <div style={styles.formGroup}><label>Priority</label><select style={styles.input} value={newComplaint.priority} onChange={e => setNewComplaint({...newComplaint, priority: e.target.value})}><option>low</option><option>medium</option><option>high</option><option>critical</option></select></div>
              <div style={styles.formGroup}><label>Description</label><textarea style={styles.input} rows="3" value={newComplaint.description} onChange={e => setNewComplaint({...newComplaint, description: e.target.value})} /></div>
            </div>
            <div style={styles.modalFooter}><button style={styles.btnCancel} onClick={() => setShowAddModal(false)}>Cancel</button><button style={styles.btnSubmit} onClick={handleAdd}>Submit</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
export default BillingApp;