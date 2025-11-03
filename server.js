// server.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the frontend from /public
app.use(express.static(path.join(__dirname, "public")));

// POST route to handle form submission
app.post("/submit", async (req, res) => {
  const { clientPhone } = req.body;

  if (!clientPhone) {
    return res.status(400).json({ error: "Client phone is required." });
  }

  try {
    const url = `${process.env.API_BASE_URL}${encodeURIComponent(clientPhone)}`;
    const response = await axios.get(url);

    // Return the full JSON response from the API
    res.json({
      success: true,
      message: "Data submitted successfully!",
      fullResponse: response.data
    });
  } catch (error) {
    console.error("API Error:", error.message);

    // Include more debugging info if available
    res.status(500).json({
      success: false,
      error: "Failed to submit data to TLDCRM API.",
      details: error.response ? error.response.data : error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
