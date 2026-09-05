const express = require("express");
const path = require("path");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 3005;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json({ limit: "20kb" }));

app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    service: "Equilibrio Records Backend",
    version: "1.0.0"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Mensaje inválido"
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message
    });

    res.json({
      reply: response.text
    });

  } catch (error) {
    console.error("ERROR GEMINI:", error);

    res.status(500).json({
      error: "No se pudo obtener respuesta de la IA"
    });
  }
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "127.0.0.1", () => {
  console.log("");
  console.log("EQUILIBRIO RECORDS");
  console.log("WEB + BACKEND + AI ONLINE");
  console.log("");
  console.log(`Web: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/status`);
  console.log("");
});