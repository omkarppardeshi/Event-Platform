import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
  });

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ title: "", description: "", date: "", location: "", capacity: "" });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.put(`/events/${editingEvent.id}`, form);
        showMessage("✅ Event updated!");
      } else {
        await api.post("/events", form);
        showMessage("✅ Event created!");
      }
      resetForm();
      fetchEvents();
    } catch (err) {
      showMessage(`❌ ${err.response?.data?.message || "Something went wrong"}`);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      capacity: event.capacity,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      showMessage("✅ Event deleted!");
      fetchEvents();
    } catch (err) {
      showMessage(`❌ ${err.response?.data?.message || "Delete failed"}`);
    }
  };

  return (
    <div style={styles.container}>
      {/* <Navbar /> */}
      <div style={styles.content}>
        <div style={styles.topBar}>
          <h2 style={styles.heading}>Admin Panel — Events</h2>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Create Event"}
          </button>
        </div>

        {message && <div style={styles.message}>{message}</div>}

        {showForm && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h3 style={styles.formTitle}>
              {editingEvent ? "Edit Event" : "Create New Event"}
            </h3>
            <input
              style={styles.input}
              name="title"
              placeholder="Event Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <textarea
              style={{ ...styles.input, height: "80px", resize: "vertical" }}
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />
            <input
              style={styles.input}
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
            <input
              style={styles.input}
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              required
            />
            <input
              style={styles.input}
              name="capacity"
              type="number"
              placeholder="Capacity"
              value={form.capacity}
              onChange={handleChange}
              required
            />
            <div style={styles.formActions}>
              <button style={styles.submitBtn} type="submit">
                {editingEvent ? "Update Event" : "Create Event"}
              </button>
              <button style={styles.cancelBtn} type="button" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p style={styles.info}>Loading events...</p>
        ) : events.length === 0 ? (
          <p style={styles.info}>No events yet. Create one!</p>
        ) : (
          events.map((event) => (
            <div key={event.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{event.title}</h3>
                <span style={styles.badge}>
                  👥 {event.attendeeCount} / {event.capacity}
                </span>
              </div>
              <p style={styles.cardDesc}>{event.description}</p>
              <div style={styles.cardMeta}>
                <span>📅 {event.date}</span>
                <span>📍 {event.location}</span>
              </div>
              <div style={styles.cardActions}>
                <button style={styles.editBtn} onClick={() => handleEdit(event)}>
                  Edit
                </button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(event.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#0f0f1a" },
  content: { maxWidth: "800px", margin: "0 auto", padding: "24px" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
  heading: { color: "white", margin: 0 },
  addBtn: { padding: "10px 20px", backgroundColor: "#e94560", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  message: { padding: "12px", backgroundColor: "#16213e", borderRadius: "4px", color: "white", marginBottom: "16px", border: "1px solid #0f3460" },
  form: { backgroundColor: "#16213e", padding: "24px", borderRadius: "8px", marginBottom: "24px", border: "1px solid #0f3460" },
  formTitle: { color: "white", marginTop: 0, marginBottom: "16px" },
  input: { width: "100%", padding: "10px 14px", marginBottom: "12px", backgroundColor: "#0f0f1a", border: "1px solid #0f3460", borderRadius: "4px", color: "white", fontSize: "14px", boxSizing: "border-box" },
  formActions: { display: "flex", gap: "10px" },
  submitBtn: { padding: "10px 24px", backgroundColor: "#e94560", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  cancelBtn: { padding: "10px 24px", backgroundColor: "#444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  card: { backgroundColor: "#16213e", borderRadius: "8px", padding: "20px", marginBottom: "16px", border: "1px solid #0f3460" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  cardTitle: { color: "white", margin: 0 },
  badge: { backgroundColor: "#0f3460", color: "white", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" },
  cardDesc: { color: "#a8a8b3", fontSize: "14px", marginBottom: "12px" },
  cardMeta: { display: "flex", gap: "16px", color: "#a8a8b3", fontSize: "13px", marginBottom: "16px" },
  cardActions: { display: "flex", gap: "10px" },
  editBtn: { padding: "6px 16px", backgroundColor: "#f39c12", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  deleteBtn: { padding: "6px 16px", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  info: { color: "#a8a8b3" },
};

export default AdminEvents;