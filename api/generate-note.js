export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // Parse body — handle both string and object
    let prompt;
    if (typeof req.body === "string") {
      const parsed = JSON.parse(req.body);
      prompt = parsed.prompt;
    } else if (req.body && typeof req.body === "object") {
      prompt = req.body.prompt;
    }

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt missing",
        bodyType: typeof req.body,
        bodyKeys: req.body ? Object.keys(req.body) : [],
        bodyPreview: JSON.stringify(req.body)?.slice(0, 200),
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}

