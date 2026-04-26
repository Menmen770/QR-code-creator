const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { requireAuth } = require("../middleware/requireAuth");
const { FRONTEND_URL } = require("../config/env");
const {
  signAccessToken,
  getUserIdFromRequest,
} = require("../utils/authToken");

const router = express.Router();

router.post("/auth/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
    });

    req.session.userId = user._id.toString();
    const token = signAccessToken(user._id.toString());
    res.status(201).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Failed to register" });
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.passwordHash) {
      return res.status(401).json({
        error:
          "החשבון נוצר עם גוגל/פייסבוק – השתמש בהתחברות חברתית",
      });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user._id.toString();
    const token = signAccessToken(user._id.toString());
    res.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

router.get("/auth/me", async (req, res) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const user = await User.findById(userId).select(
      "fullName email",
    );
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.put("/auth/profile", requireAuth, async (req, res) => {
  const { fullName } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { fullName: fullName || undefined },
      { new: true },
    ).select("fullName email");
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

router.get("/auth/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({ error: "התחברות עם גוגל אינה מופעלת" });
  }
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next,
  );
});

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${FRONTEND_URL}/login?error=google`,
  }),
  (req, res) => {
    req.session.userId = req.user._id.toString();
    res.redirect(FRONTEND_URL);
  },
);

router.get("/auth/facebook", (req, res, next) => {
  if (!process.env.FACEBOOK_APP_ID) {
    return res.status(503).json({ error: "התחברות עם פייסבוק אינה מופעלת" });
  }
  passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
});

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: `${FRONTEND_URL}/login?error=facebook`,
  }),
  (req, res) => {
    req.session.userId = req.user._id.toString();
    res.redirect(FRONTEND_URL);
  },
);

module.exports = router;
