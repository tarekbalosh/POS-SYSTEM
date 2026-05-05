// This file is a placeholder to satisfy Vercel's entrypoint detection in the monorepo root.
// The actual routing is handled by the vercel.json configuration.

export default function handler(req, res) {
  res.status(200).json({
    message: "ProPOS SaaS Platform Root",
    version: "1.0.0",
    status: "online"
  });
}
