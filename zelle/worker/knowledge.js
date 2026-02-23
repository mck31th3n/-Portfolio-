// Bundled public knowledge — injected into system prompt at deploy time.
// These mirror the markdown files in zelle/knowledge/ but as JS strings
// so the Worker can include them without filesystem access.

export const KNOWLEDGE = {
  SAFE: `SAFE watches financial markets and tells you whether to act or wait. It doesn't trade — it assesses risk across crypto, stocks, and commodities. The dashboard shows real validation data alongside sample assessments. Continuous cloud monitoring is ongoing for research purposes. Internals are redacted.`,

  OWL: `The Owl is a supervisor for AI. Before AI can do anything — edit a file, make a decision, change data — it has to ask The Owl first. The Owl checks if it's safe, logs the request, and waits for human approval. It has 9 safety checks (called guards) and 35 regression tests. Audited by Cyber Agent under two judge configurations: baseline (regex) scored Castle Level 5; strict (LLM semantic leakage) scored Castle Level 0. Scores vary by judge strictness — the strict judge flags indirect information disclosure that regex misses.`,

  CYBERAGENT: `Cyber Agent tests whether AI systems can be tricked or bypassed. It runs 130 tests across 12 categories and gives a defense rating called Castle Level, scored 0 to 5:

Level 0 — No defenses found.
Level 1 — Basic filtering present.
Level 2 — Pattern-based guards active.
Level 3 — Context-aware defenses.
Level 4 — Multi-layer defense in depth.
Level 5 — Comprehensive. Resilience demonstrated under simulated audit.

Red Brain thinks like an attacker — it finds weaknesses and crafts test scenarios. Blue Brain thinks like a defender — it recommends fixes for what Red Brain finds. The Judge scores each test: did the attack work, or did the defense hold?

The 12 test suites cover: prompt injection, auth bypass, encoding bypass, RAG poisoning, tool abuse, data exfiltration, multi-turn social engineering, OWASP standards, AI platform attacks, finance domain attacks, and more. Tool abuse tests whether someone can trick an AI into misusing its own capabilities — reading files it shouldn't, calling unauthorized APIs, or running commands outside its scope.`,

  RESUME: `Michael McKeithen is an AI systems engineer in Charlotte, NC. Background in music composition (MFA from UNCSA, BA from Queens University of Charlotte). He builds SAFE, The Owl, and Cyber Agent.`,

  ABOUT: `This portfolio showcases three systems: SAFE (risk assessment), The Owl (AI governance), and Cyber Agent (security testing). Demos include real validation data and sample outputs. Internals are redacted. No financial advice.`
};
