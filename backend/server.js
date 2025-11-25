require("dotenv").config();
const express = require("express");
const path = require("path");
const db = require("./db");
const cors = require("cors");
const linksRouter = require("./routes/links");
const authRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json());

// ----- health check --------

app.get("/healthz", (req, res) => {
  res.json({ ok: true, version: "1.0" });
});

//  ------ registering auth routes ----------

app.use("/api/auth", authRouter);

//  ------ linkRoutes will be registered --------

app.use("/api/links", linksRouter);

// ------ redirect the shortern url to actual url -------

app.get("/:code", async (req, res) => {
  const { code } = req.params;
  try {
    const result = await db.query("SELECT * FROM links WHERE code = $1", [
      code,
    ]);
    if (result.rows.length === 0) return res.status(400).send("Not Found");
    const row = result.rows[0];
    // update clicks and last_clicked
    await db.query(
      "UPDATE links SET clicks = clicks + 1 ,last_clicked = now() WHERE code = $1",
      [code]
    );
    // 302 redirect
    res.redirect(302, row.long_url);
  } catch {
    console.error(err);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
