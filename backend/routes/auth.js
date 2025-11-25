const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const app = express();
app.use(express.json());

// ------ singup api -------

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ------ validating inputs -------

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ------ checks whether the user exists or not -----------
    const userAccount = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userAccount.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashed_password = await bcrypt.hash(password, 10);

    // ------- Inserting user details into db ---------

    const result = await db.query(
      "INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashed_password]
    );
    return res.status(201).json({ message: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "server error" });
  }
});

// ----- login route -------

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // -------- validating fileds -------

    if (!email || !password) {
      return res.status(400).json({ message: "All Fields are  required" });
    }

    // -------- Checking password with hashed one in the db -------

    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid User Credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    // ------- token creation for user by using jsonwebtoken -------

    if (isMatch) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ message: "User Logged In" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

router.get("/check", authMiddleware, (req, res) => {
  res.json({ loggedIn: true });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
