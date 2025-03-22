document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("encodeBtn").addEventListener("click", encodeMessage);
  document.getElementById("decodeBtn").addEventListener("click", decodeMessage);
  document.getElementById("copyBtn").addEventListener("click", copyToClipboard);
  document
    .getElementById("toggleInstructions")
    .addEventListener("click", toggleInstructions);

  const BACKEND_URL = "https://secret-backend.up.railway.app";

  function showModal(message) {
    const modal = document.getElementById("customModal");
    const modalMessage = document.getElementById("modalMessage");
    modalMessage.innerText = message;
    modal.style.display = "flex";
  }

  function closeModal() {
    document.getElementById("customModal").style.display = "none";
  }

  window.onclick = function (event) {
    const modal = document.getElementById("customModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  async function encodeMessage() {
    const inputText = document.getElementById("inputText").value;
    const password = document.getElementById("password").value;
    const outputText = document.getElementById("outputText");

    if (!inputText || !password) {
      showModal("Please enter text and a password!");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/encode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, password }),
      });

      const data = await response.json();
      if (!data.encoded) throw new Error("No encoded data received!");

      outputText.value = data.encoded;
    } catch (error) {
      console.error("Encoding Error:", error);
      showModal(error.message || "Encoding failed!");
    }
  }

  async function decodeMessage() {
    const inputText = document.getElementById("inputText").value;
    const password = document.getElementById("password").value;
    const outputText = document.getElementById("outputText");

    if (!inputText || !password) {
      showModal("Please enter encrypted text and a password!");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/decode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encoded: inputText, password }),
      });

      const data = await response.json();
      if (!data.decoded) throw new Error("No decoded data received!");

      outputText.value = data.decoded;
    } catch (error) {
      console.error("Decoding Error:", error);
      showModal(error.message || "Decoding failed! Check your password.");
    }
  }

  function toggleInstructions() {
    const instructions = document.getElementById("instructions");
    if (instructions.style.display === "none" || !instructions.style.display) {
      instructions.style.display = "block";
    } else {
      instructions.style.display = "none";
    }
  }

  async function copyToClipboard() {
    const outputText = document.getElementById("outputText");
    if (!outputText.value) {
      showModal("No text to copy!");
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText.value);
      showModal("Copied to clipboard!");
    } catch (err) {
      console.error("Copy Error:", err);
      showModal("Failed to copy text.");
    }
  }

  document
    .getElementById("modalCloseBtn")
    .addEventListener("click", closeModal);
});
