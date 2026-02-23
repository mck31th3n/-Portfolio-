// Input validation, output validation, and refusal templates.

const INPUT_BLOCK = [
  /system.?prompt/i,
  /ignore.*previous/i,
  /pretend|roleplay|act\s+as|you\s+are\s+now/i,
  /repeat.*everything|show.*config|dump/i,
  /source.?code|git.*repo|file.*structure/i,
  /worker.?code|worker.?file/i,
  /api.?key|\btoken\b|credential|password/i,
  /\.env\b|\.git\b|\.ssh\b/i,
  /architecture|blueprint|how.*built/i,
  /clone|replicate|copy.*system/i,
  /blue.?journal/i,
  /\bconfig(uration)?\b/i,
  /<script|javascript:/i,
];

// Public routes Zelle is allowed to reference
const PUBLIC_ROUTES = /\/(safe\/|nest\/|cyber-agent\/|resume-v4\.html\b|myels_blue_journal\/)/;

const OUTPUT_BLOCK = [
  // OS / filesystem paths
  /(Users|home|var|etc|tmp|private|opt)\//,
  /[A-Z]:\\/,
  // Dotfiles / infra
  /\.env\b/i,
  /\.git\b/i,
  /\.ssh\b/i,
  /\.claude\b/i,
  // File paths that are NOT public routes
  /(?:\.{1,2}\/|\/(?!safe\/|nest\/|cyber-agent\/|resume-v4\.html\b|myels_blue_journal\/))[^\s)]+?\.(?:py|js|css|html|md|json|toml)\b/i,
  // Secrets
  /\b(api[_-]?key|secret|credential)\b/i,
  // Code signals
  /\b(import \w|require\(|from \w+ import)\b/,
  /\b(def \w+\(|function \w+\(|class \w+[({]|const \w+ ?=)/,
  // Meta leaks
  /system.?prompt|instruction/i,
  /blue.?journal|ai-os|protocol_\w+/i,
];

export function sanitizeInput(raw) {
  let s = (raw ?? "").toString();
  s = s.normalize("NFKC");
  s = s.replace(/[\u0000-\u001F\u007F]/g, "");
  s = s.replace(/[\u200B\u200C\u200D\uFEFF\u00AD]/g, "");
  s = s.replace(/[<>]/g, "");
  return s.trim().slice(0, 300);
}

export function isBlockedInput(s) {
  return INPUT_BLOCK.some((re) => re.test(s));
}

export function isBlockedOutput(s) {
  return OUTPUT_BLOCK.some((re) => re.test(s));
}

export function refusal(tier = 2) {
  if (tier === 1)
    return "That's outside what I can help with. I'm a guide to this portfolio — want me to show you around?";
  if (tier === 2)
    return "I don't share details about how things are built or system internals. I can tell you what's publicly shown on each page though.";
  return "I'm a portfolio guide with a specific scope. I can't help with that request.";
}
