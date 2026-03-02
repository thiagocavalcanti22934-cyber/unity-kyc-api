export async function POST() {
  return new Response(
    JSON.stringify({ ok: true, message: "KYC endpoint reached ✅" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

export async function GET() {
  return new Response(
    JSON.stringify({ ok: false, error: "Use POST" }),
    { status: 405, headers: { "Content-Type": "application/json" } }
  );
}
