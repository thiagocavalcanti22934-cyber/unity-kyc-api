export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Use POST" });
  }

  // For now, just return success so we can test the connection.
  return res.status(200).json({
    ok: true,
    message: "KYC endpoint reached ✅",
    received: {
      contentType: req.headers["content-type"] || null,
    },
  });
}
