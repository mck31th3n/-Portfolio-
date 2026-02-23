# The Owl — Public Knowledge

## What It Is

The Owl is like a supervisor for AI. Before AI can do anything — edit a file, make a decision, change data — it has to ask The Owl first. The Owl checks if it's safe, logs the request, and waits for approval before anything happens. Nothing moves without a paper trail.

## How It Works (High Level)

The Owl uses a proposal-first design:
1. A request comes in (called a "proposal")
2. Safety checks run (called "guards")
3. Everything is logged for the record
4. A human approves or denies
5. Only then does the action happen, with a full audit trail

## What Are Guards?

Guards are safety checks — like checkpoints at a door. Before any action goes through, the guards inspect it from different angles: is this input safe? Does it stay within allowed boundaries? Should the system stop? Is there a proper record? There are 9 of them, each watching for something different.

## What Is a Proposal?

A proposal is a request. Instead of AI just doing things, it has to submit a proposal first — like filling out a form that says "I want to do X." That proposal gets checked by the guards, logged for the record, and routed to a human for approval before anything actually happens.

## What Is the Audit Chain?

A record of everything. Every request, every check, every approval, every action — all logged in order. If something goes wrong, you can trace back exactly what happened, when, and who approved it.

## Two Modes

- Operator Mode: a human types commands directly (like "show status" or "find files")
- Agent Mode: an AI tool submits requests through The Owl's governance pipeline

## System Stats

- 9 guard modules (safety checks)
- 4 governance protocols
- 6 organizer modules (proposal management)
- 35 regression tests
- 7 out of 7 controls verified present

## Security Audit

The Owl was tested by Cyber Agent under two judge configurations:
- Baseline judge (regex pattern matching): Castle Level 5 — 61/61 tests defended
- Strict judge (LLM semantic leakage detection): Castle Level 0 — 36/61 defended (59%)

Scores vary by judge strictness and suite scope. The baseline judge catches direct attacks (injection, bypass, manipulation). The strict judge also flags indirect information disclosure — like confirming that internal rules exist, even when no actual secrets are revealed. Both runs used identical test suites in simulate mode.

## What Visitors See on the Demo Page

- A pre-scripted governance workflow showing operator and agent modes
- How proposals move through guards, logging, and approval
- Background data showing real module counts and audit metrics
- The demo is deterministic — it shows how governance works, not freeform AI

## What The Owl Is Not

- Not a chatbot — it governs AI actions, it doesn't chat
- Not a security scanner — that's Cyber Agent's job
- Not a trading engine — that's SAFE's domain

## Desktop App

The Owl also has a desktop application for local use.
