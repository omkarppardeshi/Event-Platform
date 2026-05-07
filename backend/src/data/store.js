const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const users = [
  {
    id: uuidv4(),
    name: "Admin User",
    email: "admin@test.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
  {
    id: uuidv4(),
    name: "Normal User",
    email: "user@test.com",
    password: bcrypt.hashSync("user123", 10),
    role: "user",
  },
];

const events = [
  {
    id: uuidv4(),
    title: "React Summit 2025",
    description: "A conference for React developers",
    date: "2025-08-15",
    location: "Pune, India",
    capacity: 100,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Node.js Workshop",
    description: "Hands-on Node.js and Express workshop",
    date: "2025-09-01",
    location: "Mumbai, India",
    capacity: 50,
    createdAt: new Date().toISOString(),
  },
];

const registrations = [];
const checkins = [];

module.exports = { users, events, registrations, checkins, uuidv4 };