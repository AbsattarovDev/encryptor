const express = require("express");
const cors = require("cors");
const path = require("path");

const { encodeText, decodeText } = require("./crypto");

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Encoding Route
app.post("/encode", async (req, res) => {
  try {
    const { text, password } = req.body;

    if (!text || !password) {
      return res.status(400).json({ error: "Missing text or password" });
    }

    const encoded = encodeText(text, password);
    res.json({ encoded });
  } catch (error) {
    console.error("Encoding error:", error);
    res.status(500).json({ error: "Encoding failed" });
  }
});

// Decoding Route
app.post("/decode", async (req, res) => {
  try {
    const { encoded, password } = req.body;

    if (!encoded || !password) {
      return res
        .status(400)
        .json({ error: "Missing encoded text or password" });
    }

    const decoded = decodeText(encoded, password);
    res.json({ decoded });
  } catch (error) {
    console.error("Decoding error:", error);
    res.status(500).json({ error: "Incorrect password or corrupted data!" });
  }
});

app.get("/", (res) => {
  res.send("Backend is running!");
});

// Start Server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
