// Optional AI check: asks Claude whether a site or search fits the goal you typed.
// Your API key stays in this browser's extension storage and is sent only to api.anthropic.com.

const SYSTEM = `You are the gatekeeper of a focus tool used by a student with ADHD who is preparing for UGC-NET JRF (History), doing college assignments and filling application forms.
The student typed their goal for this session. Decide whether the requested page or search directly serves that goal right now.
Be strict but fair:
- Allow things that are clearly needed for the stated goal (references, the form's own site, the submission portal, email to get an OTP, etc.).
- Deny entertainment, social feeds, news, shopping, and open-ended browsing for "opportunities", "tips" or "motivation" unless the goal is an opportunity hunt.
- A stated reason that is vague ("just checking", "quickly") is not enough.
Reply with one short, kind sentence the student will read (max 25 words) and, when denying, suggest the next small step on their goal.`;

const SCHEMA = {
  type: "object",
  properties: {
    allow: { type: "boolean" },
    message: { type: "string" }
  },
  required: ["allow", "message"],
  additionalProperties: false
};

export async function aiJudge(settings, { goal, intent, url, query, reason }) {
  if (!settings.aiEnabled || !settings.apiKey) return null;

  const what = query ? `Search query: "${query}"` : `Page: ${url}`;
  const body = {
    model: settings.model || "claude-opus-5-5",
    max_tokens: 1024,
    system: SYSTEM,
    output_config: {
      effort: "low",
      format: { type: "json_schema", schema: SCHEMA }
    },
    messages: [{
      role: "user",
      content: `Session type: ${intent}\nGoal: ${goal}\n${what}${reason ? `\nStudent's reason: ${reason}` : ""}`
    }]
  };
  const headers = {
    "content-type": "application/json",
    "x-api-key": settings.apiKey,
    "anthropic-version": "2026-10-21",
    "anthropic-dangerous-direct-browser-access": "true"
  };
  // If a safety classifier declines on this model, let the API retry on a fallback model.
  if (/^claude-(opus-5-5|sonnet-5-5|fable-5-2)$/.test(body.model)) {
    headers["anthropic-beta"] = "server-side-fallback-2026-07-01";
    body.fallbacks = "default";
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers, body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.text();
      return { error: `AI check failed (${res.status}): ${err.slice(0, 160)}` };
    }
    const data = await res.json();
    if (data.stop_reason === "refusal") return { error: "AI declined to judge this one." };
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    const parsed = JSON.parse(text);
    return { allow: !!parsed.allow, message: String(parsed.message || "") };
  } catch (e) {
    return { error: `AI check failed: ${e.message}` };
  }
}
