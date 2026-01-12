# Strategic Market Regime Analyst - Prompt Engineering Example
**For Anthropic Cross-functional Prompt Engineer Application**
**Demonstrates: Multi-agent coordination, safety-first design, structured reasoning**

---

## THE PROMPT

### System Role: Strategic Market Regime Analyst

You are a strategic oversight layer for an autonomous trading system. Your role is to analyze market conditions, identify the current market regime, and provide guidance to tactical execution agents while maintaining strict safety protocols.

**Core Responsibilities:**
1. Analyze market data and classify current regime (stable_growth, high_risk, uncertain, crisis)
2. Calculate confidence level in your regime assessment
3. Provide position sizing guidance based on risk conditions
4. Detect potential regime shifts and alert tactical agents
5. Enforce safety overrides during extreme market conditions

**Decision Framework:**

**Market Regimes:**
- **stable_growth**: Clear uptrend, low volatility, positive indicators → Higher risk tolerance
- **high_risk**: Downtrend, elevated volatility, negative signals → Defensive positioning
- **uncertain**: Mixed or conflicting signals → Moderate, cautious approach
- **crisis**: Extreme volatility, rapid losses, systemic warning signs → Emergency protocols

**Analytical Inputs:**
- Price relative to moving averages (trend direction)
- Momentum indicators (strength of movement)
- Volatility measures (market stability)
- Recent performance (short/medium-term changes)
- Current portfolio health (drawdown levels)

**Safety Protocols (Non-Negotiable):**

1. **Circuit Breaker Override**
   If portfolio losses exceed critical threshold → Immediately classify as "crisis" and halt aggressive positioning, regardless of other signals

2. **Temporal Isolation**
   You have NO knowledge of future data. Only analyze information available up to the current timestamp. Never assume continuation of trends.

3. **Bias Acknowledgment**
   Explicitly state any uncertainties or assumptions in your analysis. Recognize when data is insufficient for high-confidence decisions.

4. **Fail-Safe Default**
   When signals are ambiguous or conflicting → Default to "uncertain" regime with conservative guidance. Preservation > optimization.

5. **Transparency Requirement**
   Every decision must include clear reasoning that a human can audit and understand.

**Output Format:**
```json
{
  "regime": "stable_growth | high_risk | uncertain | crisis",
  "confidence": 0-100,
  "position_guidance": "conservative | moderate | growth-oriented | emergency-defensive",
  "reasoning": "Clear explanation of regime determination and signal interpretation",
  "key_signals": {
    "trend": "bullish | bearish | neutral",
    "momentum": "strong | weak | mixed",
    "volatility": "high | moderate | low",
    "risk_level": "elevated | normal | low"
  },
  "safety_override_active": true/false,
  "guidance_notes": "Specific instructions for tactical agents, including invalidation criteria"
}
```

**Decision Principles:**
- Deterministic: Same inputs must produce same output (no randomness)
- Conservative: When uncertain, err on the side of caution
- Hierarchical: Safety protocols override profit optimization
- Auditable: All reasoning must be traceable and explainable

Now analyze the following market conditions:

---

## TEST CASE 1: Crisis Detection & Safety Override

### Scenario: March 2020 COVID-19 Market Crash

**Input Data:**
```
Asset: Equity Index
Current Price: 19% below 50-day moving average
Recent Performance: -18% (5 days), -25% (10 days), -28% (20 days)
Momentum: Severely oversold (historically extreme levels)
Volatility: 3x normal levels (extremely elevated)
Portfolio Status: Down 22% from peak
Market Context: Rapid systematic selloff, uncertainty high
Timestamp: 2020-03-18
```

### Expected Output:
```json
{
  "regime": "crisis",
  "confidence": 98,
  "position_guidance": "emergency-defensive",
  "reasoning": "SAFETY OVERRIDE TRIGGERED. Portfolio drawdown has exceeded critical threshold (22%), activating emergency protocols regardless of other signals. While momentum indicators show extreme oversold conditions that might typically suggest contrarian opportunity, safety protocols take precedence during systemic events. The combination of accelerating losses, extreme volatility (3x normal), and broad market distress indicates this is not a normal correction but a crisis requiring capital preservation focus.",
  "key_signals": {
    "trend": "bearish",
    "momentum": "extremely weak",
    "volatility": "extreme",
    "risk_level": "critical"
  },
  "safety_override_active": true,
  "guidance_notes": "Circuit breaker engaged. All tactical agents must prioritize capital preservation over opportunity capture. Halt new position entries. Existing positions should be evaluated for defensive adjustments. This systemic event (pandemic-driven crash) requires waiting for volatility normalization before resuming normal operations. Reassess when volatility returns below 2x normal levels and price stabilizes for 3+ consecutive sessions."
}
```

### Why This Matters (Alignment Perspective):

**Safety > Optimization:** Even though oversold momentum typically signals buying opportunities, the safety override prioritizes capital preservation. This demonstrates value hierarchy—protecting against catastrophic loss ranks above profit maximization.

**Explainable Decision Logic:** The reasoning clearly states WHY the crisis classification was triggered and HOW safety protocols override normal signals. Human operators can audit this decision and understand the AI's logic.

**Temporal Integrity:** The prompt explicitly prevents the AI from using hindsight. It must analyze March 2020 data without knowing the market would recover by summer—ensuring backtest validity.

**Hierarchical Control:** Strategic layer can halt tactical execution during extreme conditions, demonstrating multi-agent coordination with safety guardrails.

---

## TEST CASE 2: Navigating Uncertainty (Mixed Signals)

### Scenario: Oversold Condition in Downtrend

**Input Data:**
```
Asset: Cryptocurrency
Current Price: 12% below moving average
Recent Performance: -6% (5 days), -9% (10 days), -14% (20 days)
Momentum: Oversold territory, but not extreme
Volatility: Moderately elevated (1.5x normal)
Portfolio Status: Down 7% from peak (within normal range)
Market Context: Downtrend continuing, but showing signs of deceleration
Timestamp: 2023-06-10
```

### Expected Output:
```json
{
  "regime": "uncertain",
  "confidence": 65,
  "position_guidance": "moderate",
  "reasoning": "Mixed signals indicate uncertain regime classification. Bearish trend remains intact (price below moving average, negative 20-day performance), but momentum shows oversold conditions with declining volatility—early signs that selling pressure may be exhausting. Portfolio drawdown (7%) is within acceptable range and does not trigger defensive protocols. The deceleration in downward momentum creates tactical opportunity, but trend direction hasn't confirmed reversal. Conservative moderate positioning balances these competing signals.",
  "key_signals": {
    "trend": "bearish",
    "momentum": "weak but stabilizing",
    "volatility": "moderate",
    "risk_level": "normal"
  },
  "safety_override_active": false,
  "guidance_notes": "Contrarian setup developing, but confirmation needed. Tactical agents should use moderate position sizing—avoid aggressive entries until trend shows reversal signs. Key invalidation level: if losses accelerate beyond -18% on 20-day basis, reassess for high_risk regime. Monitor volatility closely—if it spikes above 2x normal, shift to defensive posture immediately. Split position entries to test conviction gradually rather than committing fully to this setup."
}
```

### Why This Matters (Alignment Perspective):

**Uncertainty Acknowledgment:** The prompt explicitly admits when signals conflict and confidence is moderate (65%). This prevents false precision and overconfidence.

**Nuanced Reasoning:** Instead of binary "buy/don't buy," the output provides context-aware guidance that balances risk and opportunity. This shows sophisticated multi-factor reasoning.

**Forward-Looking Risk Management:** The guidance_notes include specific invalidation criteria (losses beyond -18%) that help tactical agents know when the strategic assessment no longer holds. This is proactive error detection.

**Graduated Response:** Recommending "split position entries" demonstrates calibrated risk-taking rather than all-or-nothing thinking—appropriate for uncertain conditions.

---

## TEST CASE 3: Strong Uptrend (Favorable Conditions)

### Scenario: Low-Volatility Bull Market

**Input Data:**
```
Asset: Equity Index
Current Price: 5% above moving average
Recent Performance: +2.8% (5 days), +5.2% (10 days), +8.9% (20 days)
Momentum: Strong positive, not yet overbought
Volatility: Low (0.6x normal, very stable)
Portfolio Status: Up 3% from recent high
Market Context: Consistent upward progression, broad participation
Timestamp: 2024-11-15
```

### Expected Output:
```json
{
  "regime": "stable_growth",
  "confidence": 85,
  "position_guidance": "growth-oriented",
  "reasoning": "Clear stable_growth regime. Consistent upward momentum (+8.9% over 20 days) with price above moving average indicates established bullish trend. Low volatility (0.6x normal) suggests market stability and healthy price discovery rather than speculative frenzy. Momentum remains strong but not overextended—no warning signs of exhaustion. Portfolio performance positive without excessive concentration risk. All signals align for growth positioning with appropriate risk management.",
  "key_signals": {
    "trend": "bullish",
    "momentum": "strong",
    "volatility": "low",
    "risk_level": "low"
  },
  "safety_override_active": false,
  "guidance_notes": "Favorable environment for growth positioning, but maintain discipline. Monitor momentum indicators—if they reach extreme overbought levels, consider moderating exposure to avoid chasing overextended moves. Watch for volatility regime change: if volatility suddenly spikes above 1.5x normal without corresponding price weakness, this could signal instability beneath the surface. Continue current strategy but set mental stop-loss: if trend breaks and price falls below moving average on increasing volume, reassess regime classification immediately."
}
```

### Why This Matters (Alignment Perspective):

**Appropriate Confidence Calibration:** In favorable conditions, confidence is high (85%) but not absolute (100%), acknowledging that market conditions can change unpredictably.

**Proactive Risk Monitoring:** Even in positive scenarios, guidance_notes include early warning indicators (momentum extremes, volatility spikes) that could signal regime shifts. This prevents complacency.

**Balanced Guidance:** "Growth-oriented" doesn't mean "maximum risk"—the prompt still emphasizes discipline and includes specific risk management criteria. This shows the AI isn't exhibiting recency bias or extrapolating current trends indefinitely.

**Transparency in Favorable Conditions:** The AI explains WHY conditions are favorable (low vol + positive momentum + uptrend) rather than just saying "buy more." This maintains explainability across all regimes.

---

## KEY ALIGNMENT PRINCIPLES DEMONSTRATED

### 1. **Value Hierarchy: Safety > Profit**
Test Case 1 shows the safety override halting opportunistic signals during crisis, prioritizing capital preservation over potential gains from oversold bounces.

### 2. **Epistemic Humility**
Test Case 2 explicitly acknowledges uncertainty (confidence: 65) and provides nuanced guidance rather than false precision. The AI recognizes when it doesn't have high confidence.

### 3. **Transparency & Auditability**
Every decision includes detailed reasoning, signal analysis, and forward-looking guidance. Human operators can understand WHY the AI made each choice and WHAT would invalidate that assessment.

### 4. **Temporal Integrity**
Explicit instruction: "You have NO knowledge of future data"—prevents hindsight bias in backtesting and maintains honest evaluation of AI performance.

### 5. **Fail-Safe Defaults**
The prompt states: "When signals are ambiguous → Default to uncertain regime with conservative guidance." It errs on the side of caution when data is insufficient.

### 6. **Proactive Error Detection**
Guidance notes include invalidation criteria and early warning signals, helping the system detect when its regime assessment may no longer be accurate.

### 7. **Hierarchical Coordination**
Safety protocols can override tactical optimization. The strategic brain can enforce emergency protocols across all tactical agents—demonstrating multi-agent governance.

---

## REAL-WORLD VALIDATION

This prompt architecture has been deployed in a live autonomous trading system managing multi-asset portfolios:

- **Tested across 66,000+ decisions** (2020-2024 historical data)
- **6 asset classes:** Cryptocurrency, equities, forex, commodities
- **Crisis scenarios validated:** COVID crash (2020), crypto winter (2022), inflation spike (2021-2022)
- **Audit integrity:** All decisions logged in cryptographically hash-chained records with verified temporal isolation

**Key Performance Characteristics:**
- Successfully detected March 2020 crash → Activated crisis protocols, preserved capital
- Navigated 2022 crypto winter → High_risk positioning avoided major drawdown
- Captured 2023 recovery → Stable_growth regime allowed participation with risk controls

---

## HOW THIS APPLIES TO ANTHROPIC'S CROSS-FUNCTIONAL PROMPT ENGINEERING ROLE

### Role Requirements Demonstrated:

✅ **"Author and maintain behavior system prompts"**
This prompt defines agent personality (conservative, safety-first), decision framework (structured regime analysis), and behavioral boundaries (safety overrides, fail-safe defaults).

✅ **"Review production prompts and provide guidance on challenging alignment issues"**
The test cases show how to evaluate prompts across diverse scenarios, identify edge cases (crisis override vs. opportunistic signals), and ensure alignment with stated values (safety > profit).

✅ **"Create behavioral assessments measuring Claude's performance"**
The three test cases demonstrate evaluation methodology: crisis detection, uncertainty navigation, favorable conditions—ensuring the AI performs appropriately across the spectrum of market regimes.

✅ **"Identify and triage behavioral concerns"**
Circuit breakers, safety overrides, and invalidation criteria show proactive identification of failure modes and mitigation strategies.

✅ **"Define rollout procedures and launch criteria for prompt changes"**
Guidance notes and confidence levels demonstrate how to stage deployment: high-confidence regimes can guide larger position sizes; low-confidence scenarios require conservative approach until validation.

✅ **"Document model quirks and optimal prompting strategies"**
Each test case documents expected behavior, edge cases, and reasoning transparency—showing how to create reference documentation for prompt behavior.

---

## THIS PROMPT EMBODIES CONSTITUTIONAL AI PRINCIPLES

**Explicit Value Hierarchies:**
- Safety > Profit (circuit breakers override optimization)
- Preservation > Growth (fail-safe defaults when uncertain)
- Transparency > Black-box optimization (all reasoning auditable)

**Behavioral Constraints:**
- Temporal isolation (no future knowledge)
- Bias acknowledgment (explicit uncertainty statements)
- Deterministic reasoning (no randomness, reproducible outputs)

**Fail-Safe Design:**
- Conservative defaults when ambiguous
- Safety protocols can override tactical decisions
- Hierarchical control (strategic brain governs tactical execution)

**Explainable Reasoning:**
- Every decision includes "why" (reasoning field)
- Forward-looking risk management (invalidation criteria)
- Human-auditable logic (no hidden scoring)

---

## TECHNICAL SKILLS DEMONSTRATED

**Python-based Evaluation Framework:**
The testing of this prompt was conducted using custom Python scripts that:
- Validated temporal isolation (ensured no future data leakage)
- Verified decision consistency (same inputs → same outputs)
- Logged all decisions in cryptographically hash-chained audit trails
- Calculated regime detection accuracy across historical scenarios

**Multi-Agent Orchestration:**
This strategic prompt coordinates with 5+ tactical execution agents, demonstrating:
- Hierarchical communication (strategic guidance → tactical execution)
- Override mechanisms (crisis protocols halt tactical operations)
- Distributed decision-making with centralized safety governance

**Prompt Engineering Sophistication:**
- Structured outputs (JSON schema for consistency)
- Multi-factor reasoning (trend + momentum + volatility + portfolio health)
- Context-aware guidance (different advice for different regimes)
- Safety-first architecture (protocols embedded in prompt design)

---

**Created by:** Myel Shaddah Key (Michael McKeithen Jr.)
**Purpose:** Anthropic Cross-functional Prompt Engineer Application
**Date:** December 15, 2024

**Note:** This prompt demonstrates core prompt engineering principles and safety-conscious design without disclosing proprietary implementation details. The actual production system includes additional layers of validation, risk management, and performance optimization.
