const jwt = require("jsonwebtoken");

// ----- checking user is whether authorized -------

function authMiddleware(req, res, next) {
  //  Try getting token from cookie
  const token = req.cookies?.token;

  // OR fallback to Authorization header
  const headerToken = req.headers.authorization?.split(" ")[1];

  const finalToken = token || headerToken;

  if (!finalToken) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
