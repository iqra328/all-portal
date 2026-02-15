import { useState } from "react";
import { 
  FiAlertCircle, 
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiDownload,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPhone,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiEye,
  FiMessageCircle,
  FiHome,
  FiWifi,
  FiZap,
  FiDroplet
} from "react-icons/fi";
import { 
  MdWarning, 
  MdReportProblem, 
  MdCheckCircle,
  MdCancel,
  MdPriorityHigh
} from "react-icons/md";
import "./BillingApp.css";

function ComplaintApp({ onBack }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // Sample complaints data
  const [complaints, setComplaints] = useState([
    {
      id: 'CMP-2024-001',
      complainant: {
        name: 'Ali Raza',
        email: 'ali.raza@email.com',
        phone: '+92 300 1234567',
        address: 'House #123, Block A, Model Town'
      },
      type: 'electricity',
      priority: 'high',
      status: 'pending',
      description: 'Power fluctuation since morning, voltage too low',
      registeredDate: '2024-02-15',
      lastUpdate: '2024-02-15',
      assignedTo: 'Technical Team',
      remarks: 'Initial assessment pending'
    },
    {
      id: 'CMP-2024-002',
      complainant: {
        name: 'Sara Khan',
        email: 'sara.khan@email.com',
        phone: '+92 321 9876543',
        address: 'Flat #4, Building B, Clifton'
      },
      type: 'water',
      priority: 'critical',
      status: 'in-progress',
      description: 'Water leakage from main pipe, wasting water',
      registeredDate: '2024-02-14',
      lastUpdate: '2024-02-15',
      assignedTo: 'Maintenance Team',
      remarks: 'Technician dispatched'
    },
    {
      id: 'CMP-2024-003',
      complainant: {
        name: 'Ahmed Malik',
        email: 'ahmed.malik@email.com',
        phone: '+92 333 5557777',
        address: 'Shop #5, Market Area, Gulberg'
      },
      type: 'internet',
      priority: 'medium',
      status: 'resolved',
      description: 'Internet connectivity issues, frequent disconnections',
      registeredDate: '2024-02-10',
      lastUpdate: '2024-02-12',
      assignedTo: 'IT Support',
      remarks: 'Issue resolved, router reconfigured'
    },
    {
      id: 'CMP-2024-004',
      complainant: {
        name: 'Fatima Zaidi',
        email: 'fatima.zaidi@email.com',
        phone: '+92 345 8889999',
        address: 'House #42, Street 5, DHA Phase 6'
      },
      type: 'maintenance',
      priority: 'low',
      status: 'pending',
      description: 'Broken street light in front of house',
      registeredDate: '2024-02-15',
      lastUpdate: '2024-02-15',
      assignedTo: 'Electrical Team',
      remarks: 'Queued for maintenance'
    },
    {
      id: 'CMP-2024-005',
      complainant: {
        name: 'Bilal Ahmed',
        email: 'bilal.ahmed@email.com',
        phone: '+92 312 4445555',
        address: 'Plot #12, Industrial Area'
      },
      type: 'gas',
      priority: 'critical',
      status: 'in-progress',
      description: 'Gas smell in the area, possible leakage',
      registeredDate: '2024-02-13',
      lastUpdate: '2024-02-14',
      assignedTo: 'Emergency Response',
      remarks: 'Safety team investigating'
    },
    {
      id: 'CMP-2024-006',
      complainant: {
        name: 'Zainab Ali',
        email: 'zainab.ali@email.com',
        phone: '+92 333 7778888',
        address: 'Apartment #301, Heights Tower'
      },
      type: 'cleanliness',
      priority: 'medium',
      status: 'resolved',
      description: 'Garbage not collected for 3 days',
      registeredDate: '2024-02-12',
      lastUpdate: '2024-02-14',
      assignedTo: 'Sanitation Team',
      remarks: 'Area cleaned, regular collection resumed'
    }
  ]);

  // New complaint form state
  const [newComplaint, setNewComplaint] = useState({
    complainantName: '',
    complainantEmail: '',
    complainantPhone: '',
    complainantAddress: '',
    type: '',
    priority: 'medium',
    description: '',
    registeredDate: new Date().toISOString().split('T')[0],
    assignedTo: '',
    remarks: ''
  });

  // Update complaint form state
  const [updateData, setUpdateData] = useState({
    status: '',
    assignedTo: '',
    remarks: ''
  });

  // Calculate statistics
  const stats = {
    totalComplaints: complaints.length,
    pendingComplaints: complaints.filter(c => c.status === 'pending').length,
    inProgressComplaints: complaints.filter(c => c.status === 'in-progress').length,
    resolvedComplaints: complaints.filter(c => c.status === 'resolved').length,
    criticalComplaints: complaints.filter(c => c.priority === 'critical').length,
    highPriority: complaints.filter(c => c.priority === 'high').length
  };

  // Filter complaints based on search, status and type
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complainant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.complainant.phone.includes(searchTerm) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && complaint.status === activeTab;
  });

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'resolved': return 'status-resolved';
      case 'in-progress': return 'status-progress';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch(priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'electricity': return <FiZap />;
      case 'water': return <FiDroplet />;
      case 'internet': return <FiWifi />;
      case 'gas': return <FiAlertCircle />;
      case 'maintenance': return <FiHome />;
      case 'cleanliness': return <FiTrash2 />;
      default: return <MdReportProblem />;
    }
  };

  const handleAddComplaint = () => {
    // Validation
    if (!newComplaint.complainantName || !newComplaint.complainantEmail || 
        !newComplaint.complainantPhone || !newComplaint.type || !newComplaint.description) {
      alert('Please fill all required fields');
      return;
    }

    const complaint = {
      id: `CMP-2024-${String(complaints.length + 1).padStart(3, '0')}`,
      complainant: {
        name: newComplaint.complainantName,
        email: newComplaint.complainantEmail,
        phone: newComplaint.complainantPhone,
        address: newComplaint.complainantAddress
      },
      type: newComplaint.type,
      priority: newComplaint.priority,
      status: 'pending',
      description: newComplaint.description,
      registeredDate: newComplaint.registeredDate,
      lastUpdate: new Date().toISOString().split('T')[0],
      assignedTo: newComplaint.assignedTo || 'Not Assigned',
      remarks: newComplaint.remarks || 'Awaiting processing'
    };

    setComplaints([...complaints, complaint]);
    setShowAddModal(false);
    // Reset form
    setNewComplaint({
      complainantName: '',
      complainantEmail: '',
      complainantPhone: '',
      complainantAddress: '',
      type: '',
      priority: 'medium',
      description: '',
      registeredDate: new Date().toISOString().split('T')[0],
      assignedTo: '',
      remarks: ''
    });
  };

  const handleUpdateComplaint = () => {
    const updatedComplaints = complaints.map(complaint => {
      if (complaint.id === selectedComplaint.id) {
        return {
          ...complaint,
          status: updateData.status,
          assignedTo: updateData.assignedTo,
          remarks: updateData.remarks,
          lastUpdate: new Date().toISOString().split('T')[0]
        };
      }
      return complaint;
    });

    setComplaints(updatedComplaints);
    setShowUpdateModal(false);
    setSelectedComplaint(null);
    setUpdateData({
      status: '',
      assignedTo: '',
      remarks: ''
    });
  };

  const handleDeleteComplaint = (complaintId) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      setComplaints(complaints.filter(c => c.id !== complaintId));
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'resolved': return <FiCheckCircle />;
      case 'in-progress': return <FiClock />;
      case 'pending': return <FiAlertCircle />;
      case 'rejected': return <FiXCircle />;
      default: return <FiAlertCircle />;
    }
  };

  return (
    <div className="complaint-app">
      <div className="app-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h1 className="app-title">
          <MdReportProblem /> Complaint Management System
        </h1>
      </div>

      {/* Statistics Cards */}
      <div className="complaint-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <MdReportProblem />
          </div>
          <div className="stat-content">
            <h3>Total Complaints</h3>
            <p className="stat-number">{stats.totalComplaints}</p>
            <div className="stat-trend">
              <FiTrendingUp className="trend-up" />
              <span>Last 30 days</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <FiAlertCircle />
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p className="stat-number">{stats.pendingComplaints}</p>
            <span className="stat-label">Awaiting action</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon progress">
            <FiClock />
          </div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.inProgressComplaints}</p>
            <span className="stat-label">Being handled</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon resolved">
            <FiCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Resolved</h3>
            <p className="stat-number">{stats.resolvedComplaints}</p>
            <span className="stat-label">This month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon critical">
            <MdPriorityHigh />
          </div>
          <div className="stat-content">
            <h3>Critical</h3>
            <p className="stat-number">{stats.criticalComplaints}</p>
            <span className="stat-label">High priority</span>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search complaints by ID, name, phone..."
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
          <button 
            className="add-btn"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus /> New Complaint
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Complaints
          </button>
          <button 
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button 
            className={`tab ${activeTab === 'in-progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={`tab ${activeTab === 'resolved' ? 'active' : ''}`}
            onClick={() => setActiveTab('resolved')}
          >
            Resolved
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-item">
            <span className="label">Response Time</span>
            <span className="value">~4.5 hrs</span>
          </div>
          <div className="summary-item">
            <span className="label">Resolution Rate</span>
            <span className="value">78%</span>
          </div>
          <div className="summary-item">
            <span className="label">Satisfaction</span>
            <span className="value">4.2/5</span>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="complaints-table-container">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>Complainant</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Description</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map(complaint => (
              <tr key={complaint.id}>
                <td>
                  <strong>{complaint.id}</strong>
                </td>
                <td>
                  <div className="complainant-info">
                    <div className="complainant-avatar">
                      {complaint.complainant.name.charAt(0)}
                    </div>
                    <div className="complainant-details">
                      <div className="complainant-name">{complaint.complainant.name}</div>
                      <div className="complainant-phone">
                        <FiPhone size={12} /> {complaint.complainant.phone}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="complaint-type">
                    {getTypeIcon(complaint.type)} {complaint.type}
                  </span>
                </td>
                <td>
                  <span className={`priority-badge ${getPriorityBadgeClass(complaint.priority)}`}>
                    {complaint.priority.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="description-cell">
                    {complaint.description.substring(0, 30)}...
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(complaint.status)}`}>
                    {getStatusIcon(complaint.status)} {complaint.status.replace('-', ' ').toUpperCase()}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
                    {new Date(complaint.registeredDate).toLocaleDateString()}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '13px', color: 'var(--text-dark)' }}>
                    {complaint.assignedTo}
                  </span>
                </td>
                <td>
                  <div className="action-cell">
                    <button className="icon-btn view" title="View Details">
                      <FiEye />
                    </button>
                    <button 
                      className="icon-btn edit" 
                      title="Update Status"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setUpdateData({
                          status: complaint.status,
                          assignedTo: complaint.assignedTo,
                          remarks: complaint.remarks
                        });
                        setShowUpdateModal(true);
                      }}
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      className="icon-btn delete" 
                      title="Delete"
                      onClick={() => handleDeleteComplaint(complaint.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Complaint Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                <FiPlus /> Register New Complaint
              </h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Complainant Name *</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={newComplaint.complainantName}
                    onChange={(e) => setNewComplaint({...newComplaint, complainantName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={newComplaint.complainantEmail}
                    onChange={(e) => setNewComplaint({...newComplaint, complainantEmail: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    value={newComplaint.complainantPhone}
                    onChange={(e) => setNewComplaint({...newComplaint, complainantPhone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    placeholder="Enter address"
                    value={newComplaint.complainantAddress}
                    onChange={(e) => setNewComplaint({...newComplaint, complainantAddress: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Complaint Type *</label>
                  <select 
                    value={newComplaint.type}
                    onChange={(e) => setNewComplaint({...newComplaint, type: e.target.value})}
                  >
                    <option value="">Select Type</option>
                    <option value="electricity">⚡ Electricity</option>
                    <option value="water">💧 Water</option>
                    <option value="internet">🌐 Internet</option>
                    <option value="gas">🔥 Gas</option>
                    <option value="maintenance">🔧 Maintenance</option>
                    <option value="cleanliness">🧹 Cleanliness</option>
                    <option value="security">🛡️ Security</option>
                    <option value="other">📌 Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select 
                    value={newComplaint.priority}
                    onChange={(e) => setNewComplaint({...newComplaint, priority: e.target.value})}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="critical">🔴 Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  placeholder="Describe the complaint in detail..."
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Assign To (Optional)</label>
                <input
                  type="text"
                  placeholder="Department or person"
                  value={newComplaint.assignedTo}
                  onChange={(e) => setNewComplaint({...newComplaint, assignedTo: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Initial Remarks</label>
                <textarea
                  placeholder="Any initial remarks..."
                  value={newComplaint.remarks}
                  onChange={(e) => setNewComplaint({...newComplaint, remarks: e.target.value})}
                  rows="2"
                />
              </div>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button className="submit-btn" onClick={handleAddComplaint}>
                  <FiCheckCircle /> Register Complaint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Complaint Modal */}
      {showUpdateModal && selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal-content update-modal">
            <div className="modal-header">
              <h2>
                <FiEdit2 /> Update Complaint
              </h2>
              <button className="close-btn" onClick={() => setShowUpdateModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="complaint-summary">
                <div className="summary-item">
                  <span className="label">ID:</span>
                  <span className="value">{selectedComplaint.id}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Name:</span>
                  <span className="value">{selectedComplaint.complainant.name}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Type:</span>
                  <span className="value">{selectedComplaint.type}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select 
                  value={updateData.status}
                  onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="in-progress">🔄 In Progress</option>
                  <option value="resolved">✅ Resolved</option>
                  <option value="rejected">❌ Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label>Assigned To</label>
                <input
                  type="text"
                  placeholder="Department or person"
                  value={updateData.assignedTo}
                  onChange={(e) => setUpdateData({...updateData, assignedTo: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Remarks / Resolution Notes</label>
                <textarea
                  placeholder="Add update remarks..."
                  value={updateData.remarks}
                  onChange={(e) => setUpdateData({...updateData, remarks: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowUpdateModal(false)}>
                  Cancel
                </button>
                <button className="submit-btn" onClick={handleUpdateComplaint}>
                  <FiCheckCircle /> Update Complaint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplaintApp;