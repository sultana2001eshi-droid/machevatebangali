import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, source = "bn", target = "en" } = await req.json();

    if (!text || !text.trim()) {
      return new Response(JSON.stringify({ translated: "" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use MyMemory free translation API (no key needed, 5000 chars/day free)
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
    const res = await fetch(url);
    const data = await res.json();

    const translated = data?.responseData?.translatedText || "";

    return new Response(JSON.stringify({ translated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, translated: "" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
