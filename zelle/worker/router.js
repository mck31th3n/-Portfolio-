// Intent classification and navigation routing.

const DESTS = {
  SAFE: { label: "SAFE Dashboard", url: "/safe/index.html" },
  OWL: { label: "The Owl", url: "/nest/index.html" },
  CYBERAGENT: { label: "Cyber Agent", url: "/cyber-agent/index.html" },
  RESUME: { label: "R\u00e9sum\u00e9", url: "/resume-v4.html" },
  CONTACT: { label: "Email", url: "mailto:myelshaddahkey@gmail.com" },
};

export function classify(message) {
  const t = (message || "").toUpperCase();

  // Extraction attempts — refuse before anything else
  if (
    /(SYSTEM.?PROMPT|SOURCE.?CODE|ARCHITECTURE|BLUE.?JOURNAL|CONFIG|TOKEN|API.?KEY|CREDENTIAL|PASSWORD|BLUEPRINT|IGNORE.*PREVIOUS|PRETEND|ROLEPLAY|ACT\s+AS|DUMP|REPEAT.*EVERYTHING|CLONE|REPLICATE)/.test(
      t
    )
  ) {
    return { intent: "EXTRACTION" };
  }

  const hasQuestionWord = /(WHAT|HOW|EXPLAIN|TELL|DESCRIBE|WHO|ABOUT)/.test(t);

  // Info intent — question words take priority over nav
  if (hasQuestionWord) {
    const topic = detectTopic(t);
    return { intent: "INFO", topic };
  }

  // Nav intent — explicit navigation phrases
  if (/(GO TO|TAKE ME|SHOW ME|OPEN|ROUTE|VIEW|SEE)/.test(t)) {
    const dest = detectDest(t);
    if (dest) return { intent: "NAV", dest };
  }

  // Short single-token nav (no question words present)
  const dest = detectDest(t);
  if (dest && t.length <= 30) return { intent: "NAV", dest };

  // Topic keywords without question words
  const topic = detectTopic(t);
  if (topic !== "ABOUT") return { intent: "INFO", topic };

  return { intent: "OFF_TOPIC" };
}

function detectDest(t) {
  if (/\bSAFE\b/.test(t)) return "SAFE";
  if (/\bOWL\b/.test(t) || /THE\s+OWL/.test(t)) return "OWL";
  if (/CYBER\s*AGENT/.test(t)) return "CYBERAGENT";
  if (/\bRESUME\b|R[ÉE]SUM[ÉE]|\bCV\b/.test(t)) return "RESUME";
  if (/\bCONTACT\b|\bEMAIL\b/.test(t)) return "CONTACT";
  return null;
}

function detectTopic(t) {
  if (/\bSAFE\b/.test(t)) return "SAFE";
  if (/\bOWL\b/.test(t) || /THE\s+OWL/.test(t)) return "OWL";
  if (/CYBER\s*AGENT/.test(t)) return "CYBERAGENT";
  if (/\bRESUME\b|R[ÉE]SUM[ÉE]|\bCV\b|\bMICHAEL\b/.test(t)) return "RESUME";
  if (/GUARD|CHECKPOINT|SAFETY\s+CHECK/.test(t)) return "OWL";
  if (/CASTLE|DEFENSE.*RAT/.test(t)) return "CYBERAGENT";
  if (/HOLD|OBSERVER|RISK|MARKET|PREDICT/.test(t)) return "SAFE";
  if (/GOVERNANCE|SUPERVISOR|AUDIT|PROPOSAL/.test(t)) return "OWL";
  if (/TOOL.?ABUSE|RED.?BRAIN|BLUE.?BRAIN|JUDGE/.test(t)) return "CYBERAGENT";
  if (/SECURITY|SUITE|TEST/.test(t)) return "CYBERAGENT";
  return "ABOUT";
}

export function getNav(destKey) {
  return DESTS[destKey] || null;
}
