import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Endpoint Roblox will call
app.post("/dialogue", async (req, res) => {
    try {
        const prompt = req.body.prompt || "Say something funny about Roblox";

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // read from env vars
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

        if (data.choices && data.choices.length > 0) {
            res.json({ text: data.choices[0].message.content });
        } else {
            res.json({ text: "⚠️ NPC forgot what to say..." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ text: "Server error, NPC crashed." });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Dialogue API running on port ${PORT}`));
