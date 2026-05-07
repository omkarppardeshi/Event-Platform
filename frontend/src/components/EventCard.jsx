const EventCard = ({ event, onRegister, onCancel, isRegistered }) => {
  const isFull = event.attendeeCount >= event.capacity;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{event.title}</h3>
        <span style={isFull ? styles.full : styles.available}>
          {isFull ? "Full" : `${event.capacity - event.attendeeCount} spots left`}
        </span>
      </div>
      <p style={styles.desc}>{event.description}</p>
      <div style={styles.meta}>
        <span>📅 {event.date}</span>
        <span>📍 {event.location}</span>
        <span>👥 {event.attendeeCount} / {event.capacity}</span>
      </div>
      <div style={styles.actions}>
        {isRegistered ? (
          <button onClick={() => onCancel(event.id)} style={styles.cancelBtn}>
            Cancel Registration
          </button>
        ) : (
          <button
            onClick={() => onRegister(event.id)}
            style={isFull ? styles.disabledBtn : styles.registerBtn}
            disabled={isFull}
          >
            {isFull ? "Event Full" : "Register"}
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#16213e",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "16px",
    border: "1px solid #0f3460",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  title: {
    color: "white",
    margin: 0,
    fontSize: "18px",
  },
  available: {
    backgroundColor: "#2ecc71",
    color: "white",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
  },
  full: {
    backgroundColor: "#e74c3c",
    color: "white",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
  },
  desc: {
    color: "#a8a8b3",
    fontSize: "14px",
    marginBottom: "12px",
  },
  meta: {
    display: "flex",
    gap: "16px",
    color: "#a8a8b3",
    fontSize: "13px",
    marginBottom: "16px",
  },
  actions: {
    display: "flex",
    gap: "10px",
  },
  registerBtn: {
    padding: "8px 20px",
    backgroundColor: "#e94560",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "8px 20px",
    backgroundColor: "#e67e22",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  disabledBtn: {
    padding: "8px 20px",
    backgroundColor: "#444",
    color: "#888",
    border: "none",
    borderRadius: "4px",
    cursor: "not-allowed",
  },
};

export default EventCard;