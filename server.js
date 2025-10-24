import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend
app.use(express.static("public"));

// Simple proxy endpoint
app.get("/proxy", async (req, res) => {
  const target = req.query.url;

  if (!target) {
    return res.status(400).send("Missing ?url parameter");
  }

  try {
    const response = await fetch(target);
    let body = await response.text();

    // Optionally: remove CSP and frame restrictions
    res.set({
      "Content-Type": response.headers.get("content-type") || "text/html",
      "Access-Control-Allow-Origin": "*"
    });

    res.send(body);
  } catch (err) {
    res.status(500).send("Error fetching URL: " + err.message);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
