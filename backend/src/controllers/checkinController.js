const { checkins, registrations, users, events, uuidv4 } = require("../data/store");

const searchAttendee = (req, res) => {
  const { eventId, query } = req.query;

  if (!eventId || !query) {
    return res.status(400).json({ message: "eventId and query are required" });
  }

  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Get all registrations for this event
  const eventRegistrations = registrations.filter((r) => r.eventId === eventId);

  // Find matching users
  const results = eventRegistrations
    .map((r) => {
      const user = users.find((u) => u.id === r.userId);
      if (!user) return null;
      const checkedIn = checkins.find(
        (c) => c.eventId === eventId && c.userId === user.id
      );
      return {
        userId: user.id,
        name: user.name,
        email: user.email,
        registeredAt: r.registeredAt,
        checkedIn: !!checkedIn,
        checkedInAt: checkedIn ? checkedIn.checkedInAt : null,
      };
    })
    .filter(
      (u) =>
        u &&
        (u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()))
    );

  res.json(results);
};

const markCheckin = (req, res) => {
  const { eventId, userId } = req.body;

  if (!eventId || !userId) {
    return res.status(400).json({ message: "eventId and userId are required" });
  }

  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // Must be registered
  const registration = registrations.find(
    (r) => r.eventId === eventId && r.userId === userId
  );
  if (!registration) {
    return res.status(400).json({ message: "User is not registered for this event" });
  }

  // Prevent duplicate checkin
  const alreadyCheckedIn = checkins.find(
    (c) => c.eventId === eventId && c.userId === userId
  );
  if (alreadyCheckedIn) {
    return res.status(400).json({ message: "User already checked in" });
  }

  const newCheckin = {
    id: uuidv4(),
    userId,
    eventId,
    checkedInAt: new Date().toISOString(),
  };

  checkins.push(newCheckin);

  const user = users.find((u) => u.id === userId);

  res.status(201).json({
    message: "Check-in successful",
    checkin: {
      ...newCheckin,
      userName: user ? user.name : "Unknown",
    },
  });
};

module.exports = { searchAttendee, markCheckin };