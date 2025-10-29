import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ✅ Root check (browser GET)
app.get("/", (req, res) => {
  res.send("✅ Dialogue API is live! Use POST /dialogue with JSON { prompt: \"...\" }");
});

// ✅ POST /dialogue (main endpoint for Roblox)
app.post("/dialogue", async (req, res) => {
  try {
    const prompt = req.body.prompt || "Say something funny about Roblox";

    // Send request to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // or gpt-4o-mini if your account supports it
        messages: [
          { role: "system", content: "You are a chaotic Roblox NPC. Keep it short and funny." },
          { role: "user", content: prompt }
        ],
        max_tokens: 60,
        temperature: 0.9
      })
    });

    if (!response.ok) {
      // log raw error body for debugging
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return res.status(500).json({ text: "⚠️ OpenAI error: " + errText });
    }

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ text: data.choices[0].message.content });
    } else {
      console.error("Invalid OpenAI response:", data);
      res.status(500).json({ text: "⚠️ NPC got no response" });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ text: "⚠️ Internal server error" });
  }
});

// ✅ Optional GET /dialogue (quick browser test)
app.get("/dialogue", async (req, res) => {
  res.json({ text: "Use POST /dialogue with JSON { prompt: \"...\" }" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Dialogue API running on port ${PORT}`));
