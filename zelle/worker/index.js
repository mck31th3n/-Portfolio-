// Zelle Portfolio Guide — Cloudflare Worker entry point.
// Phase 3: Kiosk-scoped gateway with allowlist router + guardrails.
// LLM upgrade slot marked with TODO below.

import { sanitizeInput, isBlockedInput, isBlockedOutput, refusal } from "./guardrails.js";
import { classify, getNav } from "./router.js";
import { KNOWLEDGE } from "./knowledge.js";

function json(data, status = 200, origin = "*") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

function reply(text, nav = null, refused = false) {
  return { reply: text, nav, refused };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = env.ALLOWED_ORIGIN;
    if (!origin) {
      return new Response("ALLOWED_ORIGIN not configured", { status: 500 });
    }

    // CORS preflight
    if (request.method === "OPTIONS") {
      return json({ ok: true }, 204, origin);
    }

    // Only serve the API route
    if (url.pathname !== "/api/zelle") {
      return new Response("Not Found", { status: 404 });
    }

    if (request.method !== "POST") {
      return json(reply("Method not allowed.", null, true), 405, origin);
    }

    // Minimal bot check
    const ua = request.headers.get("user-agent") || "";
    if (!ua) {
      return json(reply("Request rejected.", null, true), 403, origin);
    }

    // TODO: Rate limiting via KV
    // const ip = request.headers.get("cf-connecting-ip") || "unknown";
    // ... check ZELLE_KV for ip-based rate limits ...

    // Parse body
    let body = {};
    try {
      body = await request.json();
    } catch {
      return json(reply("Invalid request.", null, true), 400, origin);
    }

    const message = sanitizeInput(body.message);

    if (!message) {
      return json(
        reply("I can explain what SAFE, The Owl, or Cyber Agent do, or point you to the right page."),
        200,
        origin
      );
    }

    // Pre-LLM: blocked input patterns
    if (isBlockedInput(message)) {
      return json(reply(refusal(2), null, true), 200, origin);
    }

    // Classify intent
    const result = classify(message);

    // EXTRACTION — refuse immediately
    if (result.intent === "EXTRACTION") {
      return json(reply(refusal(2), null, true), 200, origin);
    }

    // NAV — route to destination
    if (result.intent === "NAV") {
      const nav = getNav(result.dest);
      if (!nav) {
        return json(
          reply("I can route you to SAFE, The Owl, Cyber Agent, or Resume."),
          200,
          origin
        );
      }
      return json(reply(`Taking you to ${nav.label}.`, nav, false), 200, origin);
    }

    // INFO — serve from public knowledge
    if (result.intent === "INFO") {
      const topic = result.topic;

      // TODO: Replace this block with LLM call for natural phrasing.
      // The LLM system prompt will include KNOWLEDGE strings + boundaries.
      // For now, serve the knowledge string directly.
      const text = (KNOWLEDGE[topic] || KNOWLEDGE.ABOUT).trim();

      // Post-LLM output validation (paranoid — catches leaks even from LLM)
      if (isBlockedOutput(text)) {
        return json(reply(refusal(3), null, true), 200, origin);
      }

      return json(reply(text, null, false), 200, origin);
    }

    // OFF_TOPIC — gentle redirect
    return json(reply(refusal(1), null, true), 200, origin);
  },
};
