const express = require("express");
const cors = require("cors");
const {
  QRCodeStyling,
} = require("qr-code-styling/lib/qr-code-styling.common.js");
const nodeCanvas = require("canvas");
const { JSDOM } = require("jsdom");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Person = require("./mongodb/models/person");
const { connectMongoDB } = require("./mongodb/mongodb");
require("dotenv").config();

const app = express();
const PORT = 5000;
const CLIENT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
];

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

const isValidObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

const normalizePersonPayload = (payload = {}) => {
  const normalized = {
    name: typeof payload.name === "string" ? payload.name.trim() : "",
    phone: typeof payload.phone === "string" ? payload.phone.trim() : "",
    email: typeof payload.email === "string" ? payload.email.trim() : "",
    birthday: payload.birthday || null,
    role: typeof payload.role === "string" ? payload.role.trim() : "user",
  };

  if (!normalized.phone) {
    delete normalized.phone;
  }

  if (!normalized.email) {
    delete normalized.email;
  }

  if (!normalized.birthday) {
    delete normalized.birthday;
  }

  return normalized;
};

const addLogoWithCutout = async (
  qrBuffer,
  imageSource,
  logoShape = "square",
) => {
  const qrImage = await nodeCanvas.loadImage(qrBuffer);

  const canvas = nodeCanvas.createCanvas(qrImage.width, qrImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(qrImage, 0, 0);

  const centerX = qrImage.width / 2;
  const centerY = qrImage.height / 2;
  const cutoutSize = Math.min(qrImage.width, qrImage.height) * 0.38;
  const logoSize = cutoutSize * 0.68;

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  if (logoShape === "circle") {
    ctx.arc(centerX, centerY, cutoutSize / 2, 0, Math.PI * 2);
  } else {
    ctx.rect(
      centerX - cutoutSize / 2,
      centerY - cutoutSize / 2,
      cutoutSize,
      cutoutSize,
    );
  }
  ctx.closePath();
  ctx.fill();

  try {
    const logoImage = await nodeCanvas.loadImage(imageSource);
    const sourceSize = Math.min(logoImage.width, logoImage.height);
    const sourceX = (logoImage.width - sourceSize) / 2;
    const sourceY = (logoImage.height - sourceSize) / 2;

    ctx.drawImage(
      logoImage,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      centerX - logoSize / 2,
      centerY - logoSize / 2,
      logoSize,
      logoSize,
    );
  } catch (logoError) {
    console.warn(
      "Logo image load failed, keeping cutout only:",
      logoError.message,
    );
  }

  return canvas.toBuffer("image/png");
};

connectMongoDB();

// Middleware
app.use(
  cors({
    origin: CLIENT_ORIGINS,
    credentials: true,
  }),
); // מאפשר לריאקט (שיושב על פורט אחר) לדבר עם השרת
app.use(express.json()); // מאפשר לשרת לקרוא מידע בפורמט JSON

// Configure session store - use MongoDB if available, fallback to memory store for development
let sessionStore;
if (process.env.MONGO_URI) {
  sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
  });
} else {
  console.log("⚠️  Using in-memory session store (development mode)");
  sessionStore = new session.MemoryStore();
}

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
    store: sessionStore,
  }),
);

// ה-Route הראשון שלנו - בדיקה שהשרת עובד
app.get("/", (req, res) => {
  res.send("The QR Server is UP and running! 🚀");
});

// ====== QR CODE GENERATION ENDPOINT ======
// מקבל: POST request עם text, color, bgColor, dotsType, cornersType
// מחזיר: QR Code כתמונה Base64 עם צורות מותאמות אישית
app.post("/api/generate-qr", async (req, res) => {
  const {
    text,
    color,
    bgColor,
    dotsType = "square",
    cornersType = "square",
    dotsGradient = null,
    bgGradient = null,
    image = null,
    logoShape = "square",
    errorCorrectionLevel = "Q",
  } = req.body;

  console.log("QR Request:", {
    text,
    color,
    bgColor,
    dotsType,
    cornersType,
    dotsGradient: !!dotsGradient,
    bgGradient: !!bgGradient,
    image: !!image,
    logoShape,
    errorCorrectionLevel,
  });

  if (!text) {
    console.log("Error: Text is empty");
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    // Build dotsOptions
    const dotsOptions = {
      color: color || "#000000",
      type: dotsType,
    };
    if (dotsGradient) {
      dotsOptions.gradient = dotsGradient;
    }

    // Build backgroundOptions
    const backgroundOptions = {
      color: bgColor === "transparent" ? "rgba(0,0,0,0)" : bgColor || "#FFFFFF",
    };
    if (bgGradient) {
      backgroundOptions.gradient = bgGradient;
    }

    // Build QR options object
    const options = {
      width: 400,
      height: 400,
      type: "png",
      data: text,
      margin: 10,
      jsdom: JSDOM,
      nodeCanvas: nodeCanvas,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: errorCorrectionLevel,
      },
      dotsOptions: dotsOptions,
      backgroundOptions: backgroundOptions,
      cornersSquareOptions: {
        color: color || "#000000",
        type: cornersType,
      },
      cornersDotOptions: {
        color: color || "#000000",
        type: cornersType,
      },
    };

    console.log("QRCodeStyling options created with all parameters");
    const qrCode = new QRCodeStyling(options);

    console.log("QRCodeStyling instance created with dotsType:", dotsType);
    const qrBuffer = await qrCode.getRawData("png");
    let finalBuffer = qrBuffer;

    if (image) {
      finalBuffer = await addLogoWithCutout(qrBuffer, image, logoShape);
    }

    console.log("PNG buffer generated, size:", finalBuffer.length, "bytes");

    const base64 = finalBuffer.toString("base64");
    const qrImage = `data:image/png;base64,${base64}`;

    console.log("QR Code generated successfully with all options applied");
    res.json({ qrImage });
  } catch (err) {
    console.error("QR Generation Error:", err.message);
    console.error("Full error:", err);
    res
      .status(500)
      .json({ error: "Failed to generate QR code", details: err.message });
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

// ====== PERSON CRUD ENDPOINTS ======
app.post("/api/persons", async (req, res) => {
  const personData = normalizePersonPayload(req.body);

  if (!personData.name) {
    return res.status(400).json({ error: "Name is required" });
  }

  if (personData.email && !isEmailValid(personData.email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (personData.phone && !isPhoneValid(personData.phone)) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  try {
    const person = await Person.create(personData);
    res.status(201).json({ person });
  } catch (err) {
    console.error("Create person error:", err);
    res.status(500).json({ error: "Failed to create person" });
  }
});

app.get("/api/persons", async (req, res) => {
  try {
    const persons = await Person.find().sort({ createdAt: -1 });
    res.json({ persons });
  } catch (err) {
    console.error("Get persons error:", err);
    res.status(500).json({ error: "Failed to fetch persons" });
  }
});

app.get("/api/persons/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid person id" });
  }

  try {
    const person = await Person.findById(id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }

    res.json({ person });
  } catch (err) {
    console.error("Get person error:", err);
    res.status(500).json({ error: "Failed to fetch person" });
  }
});

app.put("/api/persons/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid person id" });
  }

  const personData = normalizePersonPayload(req.body);

  if (!personData.name) {
    return res.status(400).json({ error: "Name is required" });
  }

  if (personData.email && !isEmailValid(personData.email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (personData.phone && !isPhoneValid(personData.phone)) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  try {
    const person = await Person.findByIdAndUpdate(id, personData, {
      new: true,
      runValidators: true,
    });

    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }

    res.json({ person });
  } catch (err) {
    console.error("Update person error:", err);
    res.status(500).json({ error: "Failed to update person" });
  }
});

app.delete("/api/persons/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid person id" });
  }

  try {
    const person = await Person.findByIdAndDelete(id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Delete person error:", err);
    res.status(500).json({ error: "Failed to delete person" });
  }
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    `POST http://localhost:${PORT}/api/generate-qr - Generate QR Code`,
  );
});
