import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 🟢 Root GET (for browser check)
app.get("/", (req, res) => {
    res.send("✅ Dialogue API is live! Use POST /dialogue with JSON { prompt: \"...\" }");
});

// 🟢 Optional GET /dialogue (for quick browser test)
app.get("/dialogue", async (req, res) => {
    try {
        const prompt = "Say something funny about Roblox NPCs";

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a chaotic Roblox NPC. Keep it short and funny." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 60,
                temperature: 0.9
            })
        });

        const data = await response.json();
        res.json({ text: data.choices[0].message.content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ text: "⚠️ Error in GET /dialogue" });
    }
});

// 🟢 Main POST /dialogue (Roblox calls this)
app.post("/dialogue", async (req, res) => {
    try {
        const prompt = req.body.prompt || "Say something funny about Roblox";

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a chaotic Roblox NPC. Keep it short and funny." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 60,
                temperature: 0.9
            })
        });

        const data = await response.json();
        res.json({ text: data.choices[0].message.content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ text: "⚠️ Error in POST /dialogue" });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Dialogue API running on port ${PORT}`));
