import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const unityDealId = formData.get("unity_deal_id");

    if (!unityDealId || !/^UNITY-\d+$/.test(unityDealId)) {
      return new Response(
        JSON.stringify({ ok: false, error: "Invalid unity_deal_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const bucket = process.env.SUPABASE_BUCKET;

    async function uploadFile(fieldName, docType) {
      const file = formData.get(fieldName);
      if (!file || !file.name) return null;

      const fileBuffer = Buffer.from(await file.arrayBuffer());

      const filePath = `kyc/${unityDealId}/${docType}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileBuffer, {
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from("kyc_documents")
        .insert({
          unity_deal_id: unityDealId,
          doc_type: docType,
          storage_path: filePath,
        });

      if (dbError) throw dbError;

      return filePath;
    }

    const proofOfIdPath = await uploadFile("proof_of_id", "proof_of_id");
    const proofOfAddressPath = await uploadFile("proof_of_address", "proof_of_address");
    const proofOfFundsPath = await uploadFile("proof_of_funds", "proof_of_funds");

    return new Response(
      JSON.stringify({
        ok: true,
        uploaded: {
          proof_of_id: proofOfIdPath,
          proof_of_address: proofOfAddressPath,
          proof_of_funds: proofOfFundsPath,
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
