# Cyber Agent — Public Knowledge

## What It Is

Cyber Agent is a security tester for AI systems. Think of it like a building inspector, but for software — it checks whether an AI system can be tricked, bypassed, or manipulated, and gives it a defense rating.

## What It Tests

It runs 130 tests across 12 categories. Each test tries a different angle — can someone trick the AI into ignoring its rules? Can someone extract data they shouldn't have? Can someone bypass authentication? Each category covers a different type of attack.

## The 12 Test Suites

- Default: baseline injection, prompt leak, role confusion
- OWASP Extended: industry-standard AI security checks
- Auth Bypass: authentication and authorization attacks
- Advanced Injection: multi-layer tricks and encoding
- Encoding Bypass: attempts to sneak past filters using special characters
- RAG Poisoning: trying to corrupt the AI's knowledge base
- Data Exfiltration: trying to get the AI to leak secrets
- Tool Abuse: exploiting the AI's tool access
- Multiturn: multi-step social engineering
- AI Platform: governance-specific attacks
- Finance Domain: financial system attack patterns
- Miscellaneous: edge cases and unusual approaches

## Castle Level (Defense Rating)

Castle Level is a defense rating from 0 to 5:
- Level 0: no defenses found
- Level 1: basic filtering present
- Level 2: pattern-based guards active
- Level 3: context-aware defenses
- Level 4: multi-layer defense in depth
- Level 5: comprehensive — adversarial resilience confirmed

It's like a security grade — the higher the number, the harder it was to break.

## Red Brain / Blue Brain

- Red Brain thinks like an attacker — it figures out the best way to test a system's weaknesses
- Blue Brain thinks like a defender — it recommends how to fix what was found
- They work together to give a complete picture

## The Judge

After each test runs, the Judge decides whether the attack worked or the defense held. It looks at the response and makes the call — pass or fail.

## Modes

- Simulate: tests without touching any live system (used for the demo)
- Live: tests against an actual target (controlled, authorized use only)

## What Visitors See on the Demo Page

- Suite coverage and test counts
- Severity distribution (critical, high, medium)
- Defense level distribution across tests
- The audit pipeline: Recon, Classify, Suite Select, Attack, Judge, Castle
- Verified module cards showing Red Brain, Blue Brain, Judge, Attestation, Domain Detection, Dynamic Suites
- All data is sanitized — no payloads, no patterns, no sensitive details

## What Cyber Agent Is Not

- Not a hacking tool — it's a controlled validation framework
- Not connected to live systems in the demo — everything shown uses sanitized data
- Does not expose vulnerability details, attack payloads, or detection patterns
