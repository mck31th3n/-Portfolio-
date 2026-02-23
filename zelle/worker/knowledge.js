// Bundled public knowledge — injected into system prompt at deploy time.
// These mirror the markdown files in zelle/knowledge/ but as JS strings
// so the Worker can include them without filesystem access.

export const KNOWLEDGE = {
  SAFE: `SAFE watches financial markets and tells you whether to act or wait. It doesn't trade — it assesses risk across crypto, stocks, and commodities. The dashboard shows real validation data alongside sample assessments. Continuous cloud monitoring is ongoing for research purposes. Internals are redacted.`,

  OWL: `The Owl is a supervisor for AI. Before AI can do anything — edit a file, make a decision, change data — it has to ask The Owl first. The Owl checks if it's safe, logs the request, and waits for human approval. It has 9 safety checks (called guards), 35 regression tests, and scored Castle Level 5 — the highest security rating.`,

  CYBERAGENT: `Cyber Agent tests whether AI systems can be tricked or bypassed. It runs 130 tests across 12 categories and gives a defense rating called Castle Level, scored 0 to 5:

Level 0 — No defenses found.
Level 1 — Basic filtering present.
Level 2 — Pattern-based guards active.
Level 3 — Context-aware defenses.
Level 4 — Multi-layer defense in depth.
Level 5 — Comprehensive. Resilience demonstrated under simulated audit.

It has a Red Brain that thinks like an attacker and a Blue Brain that thinks like a defender. A Judge decides if each attack worked or the defense held.`,

  RESUME: `Michael McKeithen is an AI systems engineer in Charlotte, NC. Background in music composition (MFA from UNCSA, BA from Queens University of Charlotte). He builds SAFE, The Owl, and Cyber Agent.`,

  ABOUT: `This portfolio showcases three systems: SAFE (risk assessment), The Owl (AI governance), and Cyber Agent (security testing). Demos include real validation data and sample outputs. Internals are redacted. No financial advice.`
};
