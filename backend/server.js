const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "root",
  database: "postgres",
  port: 5432,
});

/* ---------- JWT MIDDLEWARE ---------- */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

/* ---------- REGISTER ---------- */
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1,$2,$3,$4)`,
      [name, email, hashedPassword, role || "USER"]
    );

    res.json({ message: "User registered successfully" });
  } catch {
    res.status(400).json({ message: "Email already exists" });
  }
});

/* ---------- LOGIN ---------- */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!result.rows.length) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/* ---------- PROFILE (PROTECTED) ---------- */
app.get("/api/profile", authenticate, async (req, res) => {
  const result = await pool.query(
    "SELECT id, name, email, role FROM users WHERE id=$1",
    [req.user.id]
  );

  res.json(result.rows[0]);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
