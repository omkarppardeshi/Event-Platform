import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Checkin = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedEvent || !query) {
      showMessage("❌ Please select an event and enter a search query");
      return;
    }
    setSearching(true);
    try {
      const res = await api.get("/checkin/search", {
        params: { eventId: selectedEvent, query },
      });
      setResults(res.data);
      if (res.data.length === 0) showMessage("No attendees found");
    } catch (err) {
      showMessage(`❌ ${err.response?.data?.message || "Search failed"}`);
    } finally {
      setSearching(false);
    }
  };

  const handleCheckin = async (userId) => {
    try {
      await api.post("/checkin", { eventId: selectedEvent, userId });
      showMessage("✅ Check-in successful!");
      // Refresh results
      const res = await api.get("/checkin/search", {
        params: { eventId: selectedEvent, query },
      });
      setResults(res.data);
    } catch (err) {
      showMessage(`❌ ${err.response?.data?.message || "Check-in failed"}`);
    }
  };

  return (
    <div style={styles.container}>
      {/* <Navbar /> */}
      <div style={styles.content}>
        <h2 style={styles.heading}>Check-In Panel</h2>

        {message && <div style={styles.message}>{message}</div>}

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <select
            style={styles.input}
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            required
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
          <input
            style={styles.input}
            type="text"
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <button style={styles.searchBtn} type="submit" disabled={searching}>
            {searching ? "Searching..." : "Search"}
          </button>
        </form>

        {results.length > 0 && (
          <div style={styles.results}>
            <h3 style={styles.resultsTitle}>Attendees Found: {results.length}</h3>
            {results.map((attendee) => (
              <div key={attendee.userId} style={styles.attendeeCard}>
                <div style={styles.attendeeInfo}>
                  <p style={styles.attendeeName}>{attendee.name}</p>
                  <p style={styles.attendeeEmail}>{attendee.email}</p>
                  <p style={styles.attendeeMeta}>
                    Registered: {new Date(attendee.registeredAt).toLocaleDateString()}
                  </p>
                  {attendee.checkedIn && (
                    <p style={styles.checkedInTime}>
                      ✅ Checked in: {new Date(attendee.checkedInAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <div>
                  {attendee.checkedIn ? (
                    <span style={styles.checkedInBadge}>✅ Checked In</span>
                  ) : (
                    <button
                      style={styles.checkinBtn}
                      onClick={() => handleCheckin(attendee.userId)}
                    >
                      Mark Check-In
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#0f0f1a" },
  content: { maxWidth: "800px", margin: "0 auto", padding: "24px" },
  heading: { color: "white", marginBottom: "24px" },
  message: { padding: "12px", backgroundColor: "#16213e", borderRadius: "4px", color: "white", marginBottom: "16px", border: "1px solid #0f3460" },
  searchForm: { display: "flex", flexDirection: "column", gap: "12px", backgroundColor: "#16213e", padding: "24px", borderRadius: "8px", marginBottom: "24px", border: "1px solid #0f3460" },
  input: { width: "100%", padding: "10px 14px", backgroundColor: "#0f0f1a", border: "1px solid #0f3460", borderRadius: "4px", color: "white", fontSize: "14px", boxSizing: "border-box" },
  searchBtn: { padding: "10px 24px", backgroundColor: "#e94560", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", width: "fit-content" },
  results: { backgroundColor: "#16213e", borderRadius: "8px", padding: "24px", border: "1px solid #0f3460" },
  resultsTitle: { color: "white", marginTop: 0, marginBottom: "16px" },
  attendeeCard: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", backgroundColor: "#0f0f1a", borderRadius: "8px", marginBottom: "12px", border: "1px solid #0f3460" },
  attendeeInfo: { flex: 1 },
  attendeeName: { color: "white", margin: "0 0 4px", fontWeight: "bold" },
  attendeeEmail: { color: "#a8a8b3", margin: "0 0 4px", fontSize: "14px" },
  attendeeMeta: { color: "#a8a8b3", margin: 0, fontSize: "12px" },
  checkedInTime: { color: "#2ecc71", margin: "4px 0 0", fontSize: "12px" },
  checkinBtn: { padding: "8px 16px", backgroundColor: "#2ecc71", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" },
  checkedInBadge: { padding: "8px 16px", backgroundColor: "#1a6b3c", color: "#2ecc71", borderRadius: "4px", fontSize: "14px" },
};

export default Checkin;