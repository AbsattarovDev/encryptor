const crypto = require("crypto");
const zlib = require("zlib");

// Generate a 256-bit key from password
function deriveKey(password) {
  return crypto.pbkdf2Sync(password, "salty", 100000, 32, "sha256");
}

// Encrypt with ChaCha20-Poly1305 + Gzip + Base64
function encodeText(text, password) {
  try {
    const key = deriveKey(password);
    const nonce = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("chacha20-poly1305", key, nonce);

    // Compress text before encryption
    const compressed = zlib.gzipSync(text);
    const encrypted = Buffer.concat([
      cipher.update(compressed),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag(); // Get authentication tag

    // Return nonce + authTag + encryptedData
    return Buffer.concat([nonce, authTag, encrypted]).toString("base64");
  } catch (error) {
    console.error("❌ Encoding error:", error);
    return null;
  }
}

// Decrypt with ChaCha20-Poly1305 + Gzip + Base64
function decodeText(encryptedText, password) {
  try {
    const key = deriveKey(password);
    const decoded = Buffer.from(encryptedText, "base64");

    if (decoded.length < 29) {
      throw new Error("Invalid encrypted text format!");
    }

    const nonce = decoded.subarray(0, 12);
    const authTag = decoded.subarray(12, 28);
    const encryptedData = decoded.subarray(28);

    const decipher = crypto.createDecipheriv("chacha20-poly1305", key, nonce);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    return zlib.gunzipSync(decrypted).toString();
  } catch (error) {
    console.error("❌ Decoding error:", error);
    return null;
  }
}

module.exports = { encodeText, decodeText };
