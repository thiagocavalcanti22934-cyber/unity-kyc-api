const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  // Preflight response (required for cross-site POST)
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const unityDealId = formData.get("unity_deal_id");
    const proofOfId = formData.get("proof_of_id");
    const proofOfAddress = formData.get("proof_of_address");
    const proofOfFunds = formData.get("proof_of_funds");

    return new Response(
      JSON.stringify({
        ok: true,
        received: {
          unity_deal_id: unityDealId,
          proof_of_id: proofOfId?.name || null,
          proof_of_address: proofOfAddress?.name || null,
          proof_of_funds: proofOfFunds?.name || null,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}
