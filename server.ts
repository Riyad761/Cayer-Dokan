import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Presence management for concurrent listeners
interface ActiveSession {
  id: string;
  lastSeen: number;
  ip?: string;
  userAgent?: string;
}

const activeSessions = new Map<string, ActiveSession>();
const sseClients = new Set<express.Response>();

// Simulated realistic base activity for tea-stall community + active real live connections
const BASELINE_LISTENERS = 480;

function getLivePresenceCount(): number {
  const now = Date.now();
  // Purge expired sessions older than 35 seconds
  for (const [id, session] of activeSessions.entries()) {
    if (now - session.lastSeen > 35000) {
      activeSessions.delete(id);
    }
  }
  const realCount = activeSessions.size;
  // Natural minute-by-minute diurnal fluctuation around the baseline + real connections
  const timeVariation = Math.floor(Math.sin(now / 45000) * 18);
  return Math.max(1, BASELINE_LISTENERS + timeVariation + realCount * 7);
}

function broadcastPresence() {
  const count = getLivePresenceCount();
  const realActive = activeSessions.size;
  const payload = JSON.stringify({
    count,
    realActive,
    timestamp: Date.now(),
  });

  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Periodic cleanup and broadcast every 10 seconds
setInterval(() => {
  broadcastPresence();
}, 10000);

// API Endpoints
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "buswala.online - Tea Stall Radio" });
});

// SSE Live Presence Stream
app.get("/api/presence/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const sessionId = (req.query.sessionId as string) || `session_${Math.random().toString(36).substring(2, 10)}`;
  activeSessions.set(sessionId, {
    id: sessionId,
    lastSeen: Date.now(),
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  sseClients.add(res);

  // Send initial state immediately
  res.write(
    `data: ${JSON.stringify({
      count: getLivePresenceCount(),
      realActive: activeSessions.size,
      sessionId,
      timestamp: Date.now(),
    })}\n\n`
  );

  broadcastPresence();

  req.on("close", () => {
    sseClients.delete(res);
    activeSessions.delete(sessionId);
    broadcastPresence();
  });
});

// Heartbeat ping from client
app.post("/api/presence/heartbeat", (req, res) => {
  const { sessionId } = req.body || {};
  if (sessionId) {
    activeSessions.set(sessionId, {
      id: sessionId,
      lastSeen: Date.now(),
    });
  }
  res.json({
    ok: true,
    count: getLivePresenceCount(),
    realActive: activeSessions.size,
  });
});

// Explicit Leave ping on page unload
app.post("/api/presence/leave", (req, res) => {
  const { sessionId } = req.body || {};
  if (sessionId) {
    activeSessions.delete(sessionId);
    broadcastPresence();
  }
  res.json({ ok: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Radio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
