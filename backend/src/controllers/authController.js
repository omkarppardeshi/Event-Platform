const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { users, uuidv4 } = require("../data/store");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const signup = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    role: role === "admin" ? "admin" : "user",
  };

  users.push(newUser);

  const token = generateToken(newUser);

  res.status(201).json({
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(user);

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

module.exports = { signup, login };