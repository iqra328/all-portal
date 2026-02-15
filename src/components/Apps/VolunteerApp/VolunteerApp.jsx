import React, { useState, useEffect } from "react";
import "./VolunteerApp.css";
import { db } from "../../../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

function VolunteerApp() {
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

  const volunteersRef = collection(db, "volunteers");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fetch volunteers
  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const data = await getDocs(volunteersRef);
      const volunteersData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setVolunteers(volunteersData);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      alert("Error loading volunteers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchVolunteers();
    }
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.event || !formData.availability) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        // Update existing volunteer
        const volunteerDoc = doc(db, "volunteers", editId);
        
        await updateDoc(volunteerDoc, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          event: formData.event,
          availability: formData.availability,
          skills: formData.skills,
          city: formData.city,
          imageUrl: formData.imageUrl,
          updatedOn: new Date().toLocaleDateString()
        });
        
        alert("Volunteer Updated Successfully!");
        setEditId(null);
      } else {
        // Add new volunteer
        const newVolunteer = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          event: formData.event,
          availability: formData.availability,
          skills: formData.skills,
          city: formData.city,
          imageUrl: formData.imageUrl,
          registeredOn: new Date().toLocaleDateString()
        };
        
        await addDoc(volunteersRef, newVolunteer);
        alert("Volunteer Registered Successfully! JazakAllah Khair!");
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        event: "",
        availability: "",
        skills: "",
        city: "",
        imageUrl: ""
      });

      if (isAdmin) {
        fetchVolunteers();
      }
    } catch (error) {
      console.error(error);
      alert("Error " + (editId ? "updating" : "submitting") + " form");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this volunteer?")) {
      setLoading(true);
      try {
        await deleteDoc(doc(db, "volunteers", id));
        alert("Volunteer deleted successfully");
        fetchVolunteers();
      } catch (error) {
        console.error("Error deleting volunteer:", error);
        alert("Error deleting volunteer");
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
    setEditId(volunteer.id);
    setIsAdmin(false);
  };

  const handleClearForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      event: "",
      availability: "",
      skills: "",
      city: "",
      imageUrl: ""
    });
    setEditId(null);
  };

  // Filter volunteers
  const filteredVolunteers = volunteers.filter(vol => {
    const matchesSearch = 
      (vol.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (vol.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (vol.phone || "").includes(searchTerm);
    
    const matchesEvent = filterEvent ? vol.event === filterEvent : true;
    return matchesSearch && matchesEvent;
  });

  // Get unique events
  const uniqueEvents = [...new Set(volunteers.map(v => v.event).filter(Boolean))];

  return (
    <div className="volunteer-wrapper">
      <div className="volunteer-container">
        <div className="header-section">
          <div className="title-section">
            <h1>🤝 Saylani Welfare</h1>
            <h2>Volunteer Management System</h2>
          </div>
          <div className="header-actions">
            <button
              className={`toggle-btn ${isAdmin ? 'admin-mode' : 'register-mode'}`}
              onClick={() => {
                setIsAdmin(!isAdmin);
                if (!isAdmin) {
                  handleClearForm();
                }
              }}
            >
              {isAdmin ? (
                <>📝 Registration Form</>
              ) : (
                <>👥 Admin Panel ({volunteers.length})</>
              )}
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

            {/* Image URL Field */}
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={handleInputChange}
              />
              <small className="hint">Enter a direct link to an image (optional)</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="0300 1234567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Your city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Event Name *</label>
                <input
                  type="text"
                  name="event"
                  placeholder="Event you want to volunteer for"
                  value={formData.event}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Availability *</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  required
                >
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
              <input
                type="text"
                name="skills"
                placeholder="e.g., Teaching, Medical, IT, Event Management"
                value={formData.skills}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Processing..." : (editId ? "✏️ Update Registration" : "📝 Register as Volunteer")}
            </button>
          </form>
        ) : (
          <div className="admin-panel">
            <div className="admin-header">
              <h3>Volunteer Management</h3>
              <div className="admin-actions">
                <button onClick={fetchVolunteers} className="refresh-btn">
                  🔄
                </button>
                {volunteers.length > 0 && (
                  <button className="export-btn">
                    📥 Export
                  </button>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
              <div className="search-box">
                🔍
                <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                value={filterEvent}
                onChange={(e) => setFilterEvent(e.target.value)}
                className="filter-select"
              >
                <option value="">All Events</option>
                {uniqueEvents.map(event => (
                  <option key={event} value={event}>{event}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading volunteers...</p>
              </div>
            ) : filteredVolunteers.length === 0 ? (
              <div className="no-data">
                {volunteers.length === 0 ? (
                  <p>No volunteers registered yet.</p>
                ) : (
                  <p>No volunteers match your search.</p>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="volunteer-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Event</th>
                      <th>Availability</th>
                      <th>Skills</th>
                      <th>City</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVolunteers.map((vol) => (
                      <tr key={vol.id}>
                        <td>
                          <div className="volunteer-image-cell">
                            {vol.imageUrl ? (
                              <img 
                                src={vol.imageUrl} 
                                alt={vol.name} 
                                className="volunteer-thumbnail"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/50?text=No+Image';
                                }}
                              />
                            ) : (
                              <div className="volunteer-thumbnail-placeholder">
                                {vol.name?.charAt(0)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>{vol.name}</td>
                        <td>{vol.email}</td>
                        <td>{vol.phone}</td>
                        <td>{vol.event}</td>
                        <td>{vol.availability}</td>
                        <td>{vol.skills || "-"}</td>
                        <td>{vol.city || "-"}</td>
                        <td>
                          <div className="action-cell">
                            <button onClick={() => handleEdit(vol)} className="icon-btn edit" title="Edit">
                              ✏️
                            </button>
                            <button onClick={() => handleDelete(vol.id)} className="icon-btn delete" title="Delete">
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {!isAdmin && (
          <div className="footer-note">
            <p>Your contribution can change lives. JazakAllah Khair!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VolunteerApp;