const express = require("express");
const { isValidCode, generateCode } = require("../utils");
const db = require("../db");
const router = express.Router();
const validurl = require("valid-url");
const authMiddleware = require("../middleware/authMiddleware");

function mapRow(row) {
  return {
    code: row.code,
    longUrl: row.long_url,
    clicks: row.clicks,
    lastClicked: row.last_clicked,
    createdAt: row.created_at,
  };
}

/*--------- POST API TO CREATE CUSTOM CODE --------- */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { long_url, custom_code } = req.body;

    if (
      !long_url ||
      typeof long_url !== "string" ||
      !validurl.isWebUri(long_url)
    ) {
      return res.status(400).json({ message: "Invalid long_url" });
    }
    //---------- Checking Whether the url already been assigned or not -------------
    const result = await db.query(
      "SELECT * FROM links WHERE long_url = $1 AND user_id = $2",
      [long_url, req.user.id]
    );

    if (result.rows.length > 0) {
      return res.status(404).json({ message: "URL already exists" });
    }

    let code = custom_code && String(custom_code).trim();

    if (code) {
      if (!isValidCode(code)) {
        return res
          .status(400)
          .json({ message: "custom_code must match [A-Za-z0-9]{6,8}" });
      }
    }

    // -------- checks if code already exists --------

    const { rows } = await db.query("SELECT * FROM links WHERE code = $1", [
      code,
    ]);

    if (rows.length > 0) {
      return res.status(400).json({ message: "code already exists" });
    } else {
      //  -------- generating the unquie code to shortern the url --------

      for (i = 0; i < 5; i++) {
        code = generateCode();
        const { rows } = await db.query("SELECT * FROM links WHERE code = $1", [
          code,
        ]);
        if (rows.length === 0) break;
      }

      // ------- last fallback to ensure code is generated -------

      if (!code) code = generateCode();

      // ------- here we are inserting the code and url into db -------

      await db.query(
        "INSERT INTO links(code, long_url, user_id) VALUES($1, $2, $3)",
        [code, long_url, req.user.id]
      );

      return res.send({
        code,
        short_url: `${process.env.BASE_URL.replace(/\/$/, "")}/${code}`,
        long_url,

        last_clicked: null,
        created_at: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
});

//GET /api/links  -> list all links

router.get("/", authMiddleware, async (req, res) => {
  try {
    const { user } = req;
    const { rows } = await db.query(
      "SELECT * FROM links WHERE user_id = $1 ORDER BY created_at DESC",
      [user.id]
    );
    const mapped = rows.map(mapRow);
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server error" });
  }
});

// DELETE /api/links/:code

router.delete("/:code", authMiddleware, async (req, res) => {
  try {
    const { user } = req;
    const { code } = req.params;
    const { rowCount } = await db.query(
      "DELETE FROM links WHERE code = $1 AND user_id = $2",
      [code, user.id]
    );
    if (rowCount === 0) return res.status(404).json({ message: "not found" });
    res.status(201).json({ message: "Shorten_Url is removed" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error" });
  }
});

router.post("/getcode", async (req, res) => {
  try {
    const { long_url } = req.body;

    if (!long_url) {
      return res.status(400).json({ message: "Invalid Url" });
    }

    const result = await db.query("SELECT * FROM links WHERE long_url = $1", [
      long_url,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "URL not found" });
    }

    const row = mapRow(result.rows[0]);
    return res.status(200).json(row);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
