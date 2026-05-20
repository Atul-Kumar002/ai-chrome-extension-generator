// backend/services/securityService.js
// This module provides a rule-based, scalable security inspection layer
// for generated Chrome extensions. It is designed to detect unsafe code,
// malicious manifest permissions, and dangerous browser APIs before packaging.

const dangerousChromeApiPatterns = [
  {
    id: "chrome-cookies",
    description: "Detects access to cookie APIs, which may expose private session data.",
    category: "chrome-api",
    severity: "critical",
    test: (content) => /chrome\.cookies\b/.test(content),
  },
  {
    id: "chrome-history",
    description: "Detects history access APIs, which may be abused for spying.",
    category: "chrome-api",
    severity: "critical",
    test: (content) => /chrome\.history\b/.test(content),
  },
  {
    id: "chrome-webrequest-blocking",
    description: "Detects blocking webRequest APIs with privacy and manipulation risks.",
    category: "chrome-api",
    severity: "critical",
    test: (content) => /chrome\.webRequest\b|chrome\.webRequestBlocking\b/.test(content),
  },
];

const suspiciousJavascriptPatterns = [
  {
    id: "eval-call",
    description: "Detects dynamic evaluation via eval(), which can execute attacker-controlled code.",
    category: "code-execution",
    severity: "critical",
    test: (content) => /\beval\s*\(/i.test(content),
  },
  {
    id: "function-constructor",
    description: "Detects Function() constructor usage, a dynamic code path equivalent to eval().",
    category: "code-execution",
    severity: "critical",
    test: (content) => /\bnew\s+Function\s*\(|\bFunction\s*\(/.test(content),
  },
  {
    id: "obfuscated-base64",
    description: "Detects unusually long Base64 strings that may hide obfuscated payloads.",
    category: "obfuscation",
    severity: "high",
    test: (content) => /[A-Za-z0-9+/]{80,}={0,2}/.test(content),
  },
  {
    id: "hex-escape-obfuscation",
    description: "Detects repeated hex escape sequences often used for obfuscated JavaScript.",
    category: "obfuscation",
    severity: "high",
    test: (content) => /\\x[0-9A-Fa-f]{2}/.test(content),
  },
  {
    id: "suspicious-fetch",
    description: "Detects fetch/XHR-based remote communication which may exfiltrate data.",
    category: "network",
    severity: "high",
    test: (content) => /\b(fetch\s*\(|XMLHttpRequest\b|axios\.|superagent\.|new\s+WebSocket\()/i.test(content),
  },
  {
    id: "data-collection-api",
    description: "Detects common browser APIs used for data collection or fingerprinting.",
    category: "privacy",
    severity: "high",
    test: (content) => /navigator\.(geolocation|credentials)|chrome\.identity\b|navigator\.userAgent|navigator\.language/i.test(content),
  },
];

const htmlInjectionPatterns = [
  {
    id: "remote-script-injection",
    description: "Detects remote script tags in HTML, which are forbidden in Chrome extensions.",
    category: "remote-content",
    severity: "critical",
    test: (content) => /<script[^>]+src=["']https?:\/\/[^"']+["'][^>]*>/i.test(content),
  },
  {
    id: "hidden-iframe-injection",
    description: "Detects hidden iframe patterns often used for stealthy redirection or clickjacking.",
    category: "iframe",
    severity: "high",
    test: (content) => /<iframe[^>]+(?:hidden|display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0)[^>]*>/i.test(content),
  },
];

const manifestPermissionBlacklist = [
  "cookies",
  "history",
  "webRequestBlocking",
  "webRequest",
  "nativeMessaging",
  "background",
  "declarativeNetRequestWithHostAccess",
  "proxy",
];

const blockedHostPermissions = [
  "*://*/*",
  "http://*/*",
  "https://*/*",
];

const manifestSecurityRules = [
  {
    id: "manifest-version",
    description: "Requires Manifest V3 for Chrome extensions.",
    category: "manifest",
    severity: "critical",
    test: (manifest) => manifest.manifest_version !== 3,
  },
  {
    id: "service-worker-required",
    description: "When a background section is declared, Manifest V3 requires background.service_worker.",
    category: "manifest",
    severity: "critical",
    test: (manifest) =>
      manifest.manifest_version === 3 &&
      manifest.background &&
      Object.keys(manifest.background).length > 0 &&
      !manifest.background.service_worker,
  },
  {
    id: "unsafe-content-security-policy",
    description: "Detects insecure content security policies that allow remote script execution or unsafe eval.",
    category: "manifest",
    severity: "critical",
    test: (manifest) => {
      const csp = String(manifest.content_security_policy || "");
      return /https?:\/\//i.test(csp) || /unsafe-eval|unsafe-inline/i.test(csp);
    },
  },
  {
    id: "malicious-permissions",
    description: "Detects blocked Manifest permissions that enable excessive data access.",
    category: "manifest",
    severity: "critical",
    test: (manifest) => {
      const permissions = Array.isArray(manifest.permissions) ? manifest.permissions : [];
      const hostPermissions = Array.isArray(manifest.host_permissions) ? manifest.host_permissions : [];
      return permissions.some((permission) => manifestPermissionBlacklist.includes(permission)) || hostPermissions.some((host) => blockedHostPermissions.includes(host));
    },
  },
];

function createIssue(rule, fileName, details = "") {
  return {
    ruleId: rule.id,
    file: fileName,
    severity: rule.severity,
    category: rule.category,
    message: `${rule.description}${details ? ` ${details}` : ""}`,
  };
}

function scanTextFile(fileName, content) {
  const normalized = String(content || "");
  const issues = [];

  dangerousChromeApiPatterns.forEach((rule) => {
    if (rule.test(normalized)) {
      issues.push(createIssue(rule, fileName));
    }
  });

  suspiciousJavascriptPatterns.forEach((rule) => {
    if (rule.test(normalized)) {
      issues.push(createIssue(rule, fileName));
    }
  });

  if (fileName.endsWith(".html")) {
    htmlInjectionPatterns.forEach((rule) => {
      if (rule.test(normalized)) {
        issues.push(createIssue(rule, fileName));
      }
    });
  }

  return issues;
}

function scanManifest(manifest, fileName = "manifest.json") {
  const issues = [];

  manifestSecurityRules.forEach((rule) => {
    if (rule.test(manifest)) {
      issues.push(createIssue(rule, fileName));
    }
  });

  if (manifest.permissions && !Array.isArray(manifest.permissions)) {
    issues.push(createIssue(
      {
        id: "permissions-array",
        description: "Manifest permissions must be provided as an array.",
        category: "manifest",
        severity: "critical",
      },
      fileName
    ));
  }

  return issues;
}

function runExtensionSecurityAudit(files) {
  console.log("[securityService] Starting security audit for extension files.");

  const report = {
    scannedAt: new Date().toISOString(),
    fileCount: Object.keys(files || {}).length,
    issues: [],
    passed: true,
    summary: "No security issues detected.",
  };

  if (!files || typeof files !== "object") {
    report.issues.push({
      ruleId: "missing-files",
      file: "global",
      severity: "critical",
      category: "validation",
      message: "Extension file collection is missing or invalid.",
    });
    report.passed = false;
    report.summary = "Extension security audit failed due to invalid file input.";
    console.error("[securityService] Invalid extension payload provided.");
    return report;
  }

  Object.entries(files).forEach(([filename, content]) => {
    report.issues.push(...scanTextFile(filename, content));
  });

  if (files["manifest.json"]) {
    try {
      const manifest = JSON.parse(files["manifest.json"]);
      report.issues.push(...scanManifest(manifest));
    } catch (error) {
      report.issues.push({
        ruleId: "manifest-parse-error",
        file: "manifest.json",
        severity: "critical",
        category: "manifest",
        message: `manifest.json could not be parsed: ${error.message}`,
      });
    }
  } else {
    report.issues.push({
      ruleId: "manifest-missing",
      file: "manifest.json",
      severity: "critical",
      category: "manifest",
      message: "manifest.json is required for every Chrome extension.",
    });
  }

  const criticalIssues = report.issues.filter((issue) => issue.severity === "critical");

  if (criticalIssues.length > 0) {
    report.passed = false;
    report.summary = `Security audit failed: ${criticalIssues.length} critical issue(s) detected.`;
    report.issues = criticalIssues;
    console.error("[securityService] Security audit failed:", report.issues);
  } else if (report.issues.length > 0) {
    report.passed = true;
    report.summary = `Security audit passed with ${report.issues.length} non-critical warning(s).`;
    console.warn("[securityService] Security audit warnings:", report.issues);
  } else {
    console.log("[securityService] Security audit passed.");
  }

  return report;
}



export function auditExtensionFiles(files) {
  return runExtensionSecurityAudit(files);
}
