export default async function handler(req, res) {
  try {
    const response = await fetch(
      "http://3.106.130.203:5678/webhook/5ba0bfaf-086a-491f-b31d-9c1a78c229ff",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error" });
  }
}
