import React, { useState, useEffect } from "react";
import "./VolunteerApp.css";
import { db, auth } from "../../../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FiArrowLeft } from "react-icons/fi";

function VolunteerApp({ onBack }) {   // ✅ onBack prop added
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    event: "",
    availability: "",
    skills: "",
    city: "",
    imageUrl: ""
  });

  const [volunteers, setVolunteers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEvent, setFilterEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [user, setUser] = useState(null);

  const volunteersRef = collection(db, "volunteers");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) alert("Please login first to access Volunteer System");
    });
    return () => unsubscribe();
  }, []);

  const fetchVolunteers = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }
    setLoading(true);
    try {
      const data = await getDocs(volunteersRef);
      setVolunteers(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error(error);
      alert(error.code === 'permission-denied' ? "Permission denied! Update Firestore rules." : "Error loading volunteers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && user) fetchVolunteers();
  }, [isAdmin, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "imageUrl") setImagePreview(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login first");
    if (!formData.name || !formData.email || !formData.phone || !formData.event || !formData.availability) {
      return alert("Please fill all required fields");
    }
    setLoading(true);
    try {
      if (editId) {
        await updateDoc(doc(db, "volunteers", editId), {
          ...formData,
          updatedOn: new Date().toLocaleString(),
          updatedBy: user.email
        });
        alert("Volunteer Updated Successfully!");
        setEditId(null);
        if (isAdmin) fetchVolunteers();
      } else {
        await addDoc(volunteersRef, {
          ...formData,
          registeredOn: new Date().toLocaleString(),
          registeredBy: user.email,
          userId: user.uid
        });
        alert("✅ Volunteer Registered Successfully! JazakAllah Khair!");
      }
      setFormData({ name: "", email: "", phone: "", event: "", availability: "", skills: "", city: "", imageUrl: "" });
      setImagePreview("");
      if (isAdmin) fetchVolunteers();
    } catch (error) {
      console.error(error);
      alert(error.code === 'permission-denied' ? "Permission Denied! Update Firestore rules." : "Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!user) return;
    if (window.confirm("Delete volunteer?")) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "volunteers", id));
        alert("Deleted");
        fetchVolunteers();
      } catch (error) {
        alert("Error: " + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (volunteer) => {
    setFormData({
      name: volunteer.name || "",
      email: volunteer.email || "",
      phone: volunteer.phone || "",
      event: volunteer.event || "",
      availability: volunteer.availability || "",
      skills: volunteer.skills || "",
      city: volunteer.city || "",
      imageUrl: volunteer.imageUrl || ""
    });
    setImagePreview(volunteer.imageUrl || "");
    setEditId(volunteer.id);
    setIsAdmin(false);
  };

  const handleClearForm = () => {
    setFormData({ name: "", email: "", phone: "", event: "", availability: "", skills: "", city: "", imageUrl: "" });
    setImagePreview("");
    setEditId(null);
  };

  const filteredVolunteers = volunteers.filter(vol => {
    const matchesSearch = 
      (vol.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (vol.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (vol.phone || "").includes(searchTerm);
    const matchesEvent = filterEvent ? vol.event === filterEvent : true;
    return matchesSearch && matchesEvent;
  });

  const uniqueEvents = [...new Set(volunteers.map(v => v.event).filter(Boolean))];
  const isValidUrl = (url) => { try { new URL(url); return true; } catch { return false; } };

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🔐 Please Login First</h2>
        <p>You need to be logged in to access Volunteer Management System.</p>
      </div>
    );
  }

  // ✅ Back button style (same as dashboard)
  const backButtonStyle = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '30px',
    cursor: 'pointer',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  return (
    // ✅ Outer div with paddingTop so fixed button doesn't overlap content
    <div style={{ paddingTop: '70px' }}>
      {onBack && (
        <button onClick={onBack} style={backButtonStyle}>
          <FiArrowLeft /> Back to Dashboard
        </button>
      )}
      {/* Your original component structure – unchanged */}
      <div className="volunteer-wrapper">
        <div className="volunteer-container">
          <div className="header-section">
            <div className="title-section">
              <h1>🤝 Saylani Welfare</h1>
              <h2>Volunteer Management System</h2>
              <p className="welcome-text">Welcome, {user.email}</p>
            </div>
            <div className="header-actions">
              <button
                className={`toggle-btn ${isAdmin ? 'admin-mode' : 'register-mode'}`}
                onClick={() => {
                  setIsAdmin(!isAdmin);
                  if (!isAdmin) handleClearForm();
                }}
              >
                {isAdmin ? "📝 Registration Form" : `👥 Admin Panel (${volunteers.length})`}
              </button>
            </div>
          </div>

          {!isAdmin ? (
            <form onSubmit={handleSubmit} className="volunteer-form">
              <div className="form-header">
                <h3>{editId ? "Edit Volunteer" : "Register as Volunteer"}</h3>
                {editId && (
                  <button type="button" className="cancel-edit-btn" onClick={handleClearForm}>
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="image-upload-section">
                <div className="image-preview-container">
                  {imagePreview && isValidUrl(imagePreview) ? (
                    <img src={imagePreview} alt="Preview" className="image-preview" 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/120?text=Invalid+URL'; }} />
                  ) : (
                    <div className="image-placeholder"><span>🖼️</span><p>No Image URL</p></div>
                  )}
                </div>
                <div className="image-upload-controls">
                  <input type="url" name="imageUrl" placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl} onChange={handleInputChange} className="image-url-input" />
                  {imagePreview && <button type="button" className="remove-image-btn" onClick={() => {
                    setFormData(prev => ({ ...prev, imageUrl: "" })); setImagePreview("");
                  }}>Clear URL</button>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" name="phone" placeholder="0300 1234567" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" placeholder="Your city" value={formData.city} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Event Name *</label>
                  <input type="text" name="event" placeholder="Event you want to volunteer for" value={formData.event} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Availability *</label>
                  <select name="availability" value={formData.availability} onChange={handleInputChange} required>
                    <option value="">Select Availability</option>
                    <option value="Morning">🌅 Morning (8AM - 12PM)</option>
                    <option value="Afternoon">☀️ Afternoon (12PM - 4PM)</option>
                    <option value="Evening">🌆 Evening (4PM - 8PM)</option>
                    <option value="Full Day">📅 Full Day</option>
                    <option value="Weekend">⭐ Weekends Only</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Skills/Expertise</label>
                <input type="text" name="skills" placeholder="e.g., Teaching, Medical, IT" value={formData.skills} onChange={handleInputChange} />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Processing..." : (editId ? "✏️ Update Registration" : "📝 Register as Volunteer")}
              </button>
            </form>
          ) : (
            <div className="admin-panel">
              <div className="admin-header">
                <h3>Volunteer Management</h3>
                <button onClick={fetchVolunteers} className="refresh-btn">🔄 Refresh</button>
              </div>
              <div className="filters-section">
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <select value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)}>
                  <option value="">All Events</option>
                  {uniqueEvents.map(event => <option key={event} value={event}>{event}</option>)}
                </select>
              </div>
              {loading ? <div>Loading...</div> : (
                <div className="table-responsive">
                  <table className="volunteer-table">
                    <thead>
                      <tr><th>Image</th><th>Name</th><th>Email</th><th>Phone</th><th>Event</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {filteredVolunteers.map(vol => (
                        <tr key={vol.id}>
                          <td>{vol.imageUrl ? <img src={vol.imageUrl} width="40" height="40" alt=""/> : "📷"}</td>
                          <td>{vol.name}</td>
                          <td>{vol.email}</td>
                          <td>{vol.phone}</td>
                          <td>{vol.event}</td>
                          <td>
                            <button onClick={() => handleEdit(vol)}>✏️</button>
                            <button onClick={() => handleDelete(vol.id)}>🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VolunteerApp;