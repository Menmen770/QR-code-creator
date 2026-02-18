const express = require("express");
const cors = require("cors");
const QRCode = require("qrcode");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const app = express();
const PORT = 5000;
const CLIENT_ORIGINS = ["http://localhost:5173", "http://localhost:5174"];

const isPasswordValid = (password) => {
  if (typeof password !== "string") return false;
  if (password.length < 7) return false;
  if (!/^[A-Za-z0-9]+$/.test(password)) return false;
  if (!/[A-Za-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

const isEmailValid = (email) => {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isPhoneValid = (phone) => {
  if (typeof phone !== "string") return false;
  return /^[0-9]{9,11}$/.test(phone.replace(/\D/g, ""));
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(
  cors({
    origin: CLIENT_ORIGINS,
    credentials: true,
  }),
); // מאפשר לריאקט (שיושב על פורט אחר) לדבר עם השרת
app.use(express.json()); // מאפשר לשרת לקרוא מידע בפורמט JSON

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "lax",
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
    }),
  }),
);

// ה-Route הראשון שלנו - בדיקה שהשרת עובד
app.get("/", (req, res) => {
  res.send("The QR Server is UP and running! 🚀");
});

// ====== QR CODE GENERATION ENDPOINT ======
// מקבל: POST request עם text, color, bgColor
// מחזיר: QR Code כתמונה Base64
app.post("/api/generate-qr", async (req, res) => {
  const { text, color, bgColor } = req.body;

  // ✅ Validation - בדוק שהטקסט קיים
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    // יצירת ה-QR כ-Data URL (פורמט של תמונה בטקסט)
    const qrImage = await QRCode.toDataURL(text, {
      color: {
        dark: color || "#000000", // צבע הריבועים
        light: bgColor || "#FFFFFF", // צבע הרקע
      },
      width: 400,
      margin: 2,
    });

    res.json({ qrImage });
  } catch (err) {
    console.error("QR Generation Error:", err);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

// ====== AUTH ENDPOINTS ======
app.post("/api/auth/register", async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (!isPhoneValid(phone)) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  if (!isPasswordValid(password)) {
    return res.status(400).json({
      error:
        "Password must be 7+ chars, include letters and numbers, and use only letters/numbers",
    });
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
      phone,
      passwordHash,
    });

    req.session.userId = user._id.toString();
    res.status(201).json({
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Failed to register" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user._id.toString();
    res.json({
      user: { id: user._id, fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ ok: true });
  });
});

app.get("/api/auth/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.session.userId).select(
      "fullName email",
    );
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({ user });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    `POST http://localhost:${PORT}/api/generate-qr - Generate QR Code`,
  );
});
