// backend/routes/ai.js

const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    const message = response.data.choices[0].message.content;
    res.json({ message });
  } catch (error) {
    console.error("Error in /generate route:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
