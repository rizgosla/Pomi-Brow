// Cloudflare Pages Function: POST /api/contact
// Forwards the contact form to FORM_WEBHOOK_URL (set as a Pages environment variable).
// Submissions never touch Sanity, whose free dataset is public.

interface Env {
  FORM_WEBHOOK_URL?: string;
}

interface Submission {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  message?: string;
  website?: string; // honeypot
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: Submission;
  try {
    const type = request.headers.get("content-type") ?? "";
    data = type.includes("application/json")
      ? await request.json()
      : (Object.fromEntries((await request.formData()).entries()) as Submission);
  } catch {
    return json({ ok: false, error: "bad-request" }, 400);
  }

  // Bots fill the hidden field; people never see it.
  if (data.website) return json({ ok: true });

  const name = (data.name ?? "").toString().trim().slice(0, 200);
  const phone = (data.phone ?? "").toString().trim().slice(0, 40);
  const email = (data.email ?? "").toString().trim().slice(0, 200);
  const service = (data.service ?? "").toString().trim().slice(0, 80);
  const message = (data.message ?? "").toString().trim().slice(0, 4000);

  if (!name || !phone || !message) return json({ ok: false, error: "missing-fields" }, 422);

  if (!env.FORM_WEBHOOK_URL) {
    // Not configured yet. Tell the visitor plainly; the page offers the phone number.
    return json({ ok: false, error: "not-configured" }, 503);
  }

  const payload = {
    name,
    phone,
    email,
    service,
    message,
    submittedAt: new Date().toISOString(),
    page: request.headers.get("referer") ?? "",
  };

  const upstream = await fetch(env.FORM_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => null);

  if (!upstream || !upstream.ok) return json({ ok: false, error: "upstream" }, 502);
  return json({ ok: true });
};

export const onRequest: PagesFunction<Env> = async ({ request }) => {
  if (request.method === "POST") return new Response(null, { status: 405 });
  return json({ ok: false, error: "method-not-allowed" }, 405);
};
