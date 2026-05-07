const { registrations, events, uuidv4 } = require("../data/store");

const registerForEvent = (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Prevent duplicate registration
  const alreadyRegistered = registrations.find(
    (r) => r.eventId === eventId && r.userId === userId
  );
  if (alreadyRegistered) {
    return res.status(400).json({ message: "Already registered for this event" });
  }

  // Prevent overbooking
  const attendeeCount = registrations.filter((r) => r.eventId === eventId).length;
  if (attendeeCount >= event.capacity) {
    return res.status(400).json({ message: "Event is fully booked" });
  }

  const newRegistration = {
    id: uuidv4(),
    userId,
    eventId,
    registeredAt: new Date().toISOString(),
  };

  registrations.push(newRegistration);
  res.status(201).json({ message: "Registered successfully", registration: newRegistration });
};

const cancelRegistration = (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  const index = registrations.findIndex(
    (r) => r.eventId === eventId && r.userId === userId
  );

  if (index === -1) {
    return res.status(404).json({ message: "Registration not found" });
  }

  registrations.splice(index, 1);
  res.json({ message: "Registration cancelled successfully" });
};

const getMyRegistrations = (req, res) => {
  const userId = req.user.id;

  const myRegistrations = registrations
    .filter((r) => r.userId === userId)
    .map((r) => {
      const event = events.find((e) => e.id === r.eventId);
      return { ...r, event };
    });

  res.json(myRegistrations);
};

module.exports = { registerForEvent, cancelRegistration, getMyRegistrations };