const { events, registrations, uuidv4 } = require("../data/store");

const getEvents = (req, res) => {
  const eventsWithCount = events.map((event) => {
    const attendeeCount = registrations.filter(
      (r) => r.eventId === event.id
    ).length;
    return { ...event, attendeeCount };
  });

  res.json(eventsWithCount);
};

const createEvent = (req, res) => {
  const { title, description, date, location, capacity } = req.body;

  if (!title || !description || !date || !location || !capacity) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newEvent = {
    id: uuidv4(),
    title,
    description,
    date,
    location,
    capacity: parseInt(capacity),
    createdAt: new Date().toISOString(),
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
};

const updateEvent = (req, res) => {
  const { id } = req.params;
  const { title, description, date, location, capacity } = req.body;

  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Event not found" });
  }

  events[index] = {
    ...events[index],
    title: title || events[index].title,
    description: description || events[index].description,
    date: date || events[index].date,
    location: location || events[index].location,
    capacity: capacity ? parseInt(capacity) : events[index].capacity,
  };

  res.json(events[index]);
};

const deleteEvent = (req, res) => {
  const { id } = req.params;

  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Event not found" });
  }

  events.splice(index, 1);
  res.json({ message: "Event deleted successfully" });
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };