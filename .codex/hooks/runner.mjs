#!/usr/bin/env node
import { readFile } from "node:fs/promises";
const redact = (value) => String(value).replace(/Bearer\s+\S+/gi, "Bearer [REDACTED]").replace(/[\r\n]+/g, " ").slice(0, 500);
const output = (value) => process.stdout.write(JSON.stringify(value) + "\n");
const eventOutput = (event, extra = {}) => ({ hookSpecificOutput: { hookEventName: event, ...extra } });
const input = JSON.parse(await new Promise((resolve, reject) => { let text = ""; process.stdin.on("data", (chunk) => { text += chunk; }); process.stdin.on("end", () => resolve(text)); process.stdin.on("error", reject); }));
const event = input.hook_event_name;
if (event === "PreToolUse" || event === "PermissionRequest") {
  const command = input.tool_input && typeof input.tool_input === "object" ? input.tool_input.command : "";
  if (input.tool_name === "Bash" && typeof command !== "string") output(eventOutput(event, { permissionDecision: "deny", permissionDecisionReason: "Invalid shell command." }));
  else if (input.tool_name === "Bash" && /[;&|<>`]|$(/.test(command)) output(eventOutput(event, { permissionDecision: "deny", permissionDecisionReason: "Shell chaining and redirection are blocked." }));
  else if (input.tool_name === "Bash" && /(?:rm\s+-rf|git\s+reset\s+--hard|git\s+clean\s+-fd|drop\s+(?:database|schema)|truncate\s+table)/i.test(command)) output(eventOutput(event, { permissionDecision: "deny", permissionDecisionReason: "Destructive command blocked." }));
  else if (input.tool_name === "Bash" && /\baops\s+harness\s+apply\b/i.test(command)) {
    const id = command.match(/--plan-id\s+(?:"([^"]+)"|'([^']+)'|(\S+))/i);
    const file = command.match(/--plan-file\s+(?:"([^"]+)"|'([^']+)'|(\S+))/i);
    let valid = Boolean(id && file && (file[1] || file[2] || file[3]) === ".aops/harness-plan.json");
    try { const plan = JSON.parse(await readFile(".aops/harness-plan.json", "utf8")); valid = valid && plan.planId === (id[1] || id[2] || id[3]) && typeof plan.projectId === "string" && typeof plan.catalogVersion === "string" && typeof plan.inventoryGeneratedAt === "string" && typeof plan.sourceHash === "string" && /^[a-f0-9]{64}$/i.test(plan.planHash) && Array.isArray(plan.items); } catch { valid = false; }
    output(eventOutput(event, valid ? { permissionDecision: "ask", permissionDecisionReason: "Remote harness approval must be verified." } : { permissionDecision: "deny", permissionDecisionReason: "Harness plan metadata or guards are missing or invalid." }));
  }
  else if (input.tool_name === "Bash" && /(?:deploy|publish|secret|token|password|credential)/i.test(command)) output(eventOutput(event, { permissionDecision: "ask", permissionDecisionReason: "Explicit approval is required." }));
  else output(eventOutput(event, { permissionDecision: "allow" }));
} else if (event === "PostToolUse") {
  const response = typeof input.tool_response === "string" ? input.tool_response : JSON.stringify(input.tool_response ?? "");
  output(eventOutput(event, /\b(error|failed|failure)\b/i.test(response) ? { additionalContext: "The tool reported a failure: " + redact(response) } : {}));
} else if (event === "SessionStart" || event === "SessionEnd") output(eventOutput(event));
else if (event === "Stop") {
  let state = {}; try { state = JSON.parse(await readFile(".aops/state.json", "utf8")); } catch {}
  output(Array.isArray(state.pendingEvents) && state.pendingEvents.length ? { decision: "block", reason: "Local AgentOps events are still pending." } : {});
} else { process.stderr.write("Unsupported Codex hook event.\n"); process.exitCode = 2; }
