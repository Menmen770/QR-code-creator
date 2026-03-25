const express = require("express");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const {
  QRCodeStyling,
} = require("qr-code-styling/lib/qr-code-styling.common.js");
const nodeCanvas = require("canvas");
const { JSDOM } = require("jsdom");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const { connectMongoDB } = require("./mongodb/mongodb");
require("dotenv").config();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

// Configure session store
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
      secure: process.env.NODE_ENV === "production",
    },
    store: sessionStore,
  }),
);

connectMongoDB();

app.use(passport.initialize());

const oauthCallback = (provider) => async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value?.toLowerCase();
    const fullName = profile.displayName || profile.name?.givenName || "User";
    if (!email) return done(new Error("אימייל לא התקבל מהספק"));

    let user = await User.findOne({
      $or: [
        { email },
        { oauthProvider: provider, oauthId: profile.id },
      ],
    });

    if (user) {
      if (!user.oauthProvider) {
        user.oauthProvider = provider;
        user.oauthId = profile.id;
        await user.save();
      }
    } else {
      user = await User.create({
        fullName,
        email,
        phone: "",
        passwordHash: null,
        oauthProvider: provider,
        oauthId: profile.id,
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/google/callback`,
      },
      oauthCallback("google")
    )
  );
}

if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/facebook/callback`,
        profileFields: ["id", "displayName", "emails"],
      },
      oauthCallback("facebook")
    )
  );
}

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

app.get("/", (req, res) => {
  res.send("The QR Server is UP and running! 🚀");
});

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

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const dotsOptions = {
      color: color || "#000000",
      type: dotsType,
    };
    if (dotsGradient) {
      dotsOptions.gradient = dotsGradient;
    }

    const backgroundOptions = {
      color: bgColor === "transparent" ? "rgba(0,0,0,0)" : bgColor || "#FFFFFF",
    };
    if (bgGradient) {
      backgroundOptions.gradient = bgGradient;
    }

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

    const qrCode = new QRCodeStyling(options);
    const qrBuffer = await qrCode.getRawData("png");
    let finalBuffer = qrBuffer;

    if (image) {
      finalBuffer = await addLogoWithCutout(qrBuffer, image, logoShape);
    }

    const base64 = finalBuffer.toString("base64");
    const qrImage = `data:image/png;base64,${base64}`;
    res.json({ qrImage });
  } catch (err) {
    console.error("QR Generation Error:", err.message);
    res.status(500).json({ error: "Failed to generate QR code" });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !phone || !password) {
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
      phone,
      passwordHash,
    });

    req.session.userId = user._id.toString();
    res.status(201).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
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

    if (!user.passwordHash) {
      return res.status(401).json({ error: "החשבון נוצר עם גוגל/פייסבוק – השתמש בהתחברות חברתית" });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.session.userId = user._id.toString();
    res.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      },
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
      "fullName email phone",
    );
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.put("/api/auth/profile", requireAuth, async (req, res) => {
  const { fullName, phone } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { fullName: fullName || undefined, phone: phone || undefined },
      { new: true },
    ).select("fullName email phone");
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.get("/api/auth/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(503).json({ error: "התחברות עם גוגל אינה מופעלת" });
  }
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/login?error=google` }),
  (req, res) => {
    req.session.userId = req.user._id.toString();
    res.redirect(FRONTEND_URL);
  }
);

app.get("/api/auth/facebook", (req, res, next) => {
  if (!process.env.FACEBOOK_APP_ID) {
    return res.status(503).json({ error: "התחברות עם פייסבוק אינה מופעלת" });
  }
  passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
});

app.get(
  "/api/auth/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: `${FRONTEND_URL}/login?error=facebook` }),
  (req, res) => {
    req.session.userId = req.user._id.toString();
    res.redirect(FRONTEND_URL);
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
