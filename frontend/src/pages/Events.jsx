import { useState, useEffect } from "react";
import api from "../api/axios";
import EventCard from "../components/EventCard";
import Navbar from "../components/Navbar";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const res = await api.get("/register/my");
      setMyRegistrations(res.data.map((r) => r.eventId));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchEvents();
      await fetchMyRegistrations();
      setLoading(false);
    };
    load();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleRegister = async (eventId) => {
    try {
      await api.post("/register", { eventId });
      showMessage("✅ Registered successfully!");
      await fetchEvents();
      await fetchMyRegistrations();
    } catch (err) {
      showMessage(`❌ ${err.response?.data?.message || "Registration failed"}`);
    }
  };

  const handleCancel = async (eventId) => {
    try {
      await api.delete("/register", { data: { eventId } });
      showMessage("✅ Registration cancelled!");
      await fetchEvents();
      await fetchMyRegistrations();
    } catch (err) {
      showMessage(`❌ ${err.response?.data?.message || "Cancellation failed"}`);
    }
  };

  return (
    <div style={styles.container}>
      {/* <Navbar /> */}
      <div style={styles.content}>
        <h2 style={styles.heading}>Upcoming Events</h2>
        {message && <div style={styles.message}>{message}</div>}
        {loading ? (
          <p style={styles.info}>Loading events...</p>
        ) : events.length === 0 ? (
          <p style={styles.info}>No events available.</p>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isRegistered={myRegistrations.includes(event.id)}
              onRegister={handleRegister}
              onCancel={handleCancel}
            />
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#0f0f1a",
  },
  content: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "24px",
  },
  heading: {
    color: "white",
    marginBottom: "24px",
  },
  message: {
    padding: "12px",
    backgroundColor: "#16213e",
    borderRadius: "4px",
    color: "white",
    marginBottom: "16px",
    border: "1px solid #0f3460",
  },
  info: {
    color: "#a8a8b3",
  },
};

export default Events;