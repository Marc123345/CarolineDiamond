import { createClient } from 'npm:@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface TranslateRequest {
  text: string;
  source: string;
  target: string;
  context?: string;
}

interface TranslateResponse {
  translatedText: string;
  cached: boolean;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { text, source, target, context }: TranslateRequest = await req.json();

    if (!text || !source || !target) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: text, source, target' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (source === target) {
      return new Response(
        JSON.stringify({ translatedText: text, cached: false }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: cached, error: cacheError } = await supabase
      .from('translations')
      .select('id, translated_text')
      .eq('source_text', text)
      .eq('source_lang', source)
      .eq('target_lang', target)
      .maybeSingle();

    if (cached && !cacheError) {
      await supabase.rpc('increment_translation_usage', {
        translation_id: cached.id,
      });

      return new Response(
        JSON.stringify({
          translatedText: cached.translated_text,
          cached: true,
        } as TranslateResponse),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const googleApiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');

    // If no API key is configured, return the original text
    if (!googleApiKey) {
      console.warn('Google Translate API key not configured, returning original text');
      return new Response(
        JSON.stringify({
          translatedText: text,
          cached: false,
        } as TranslateResponse),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const googleTranslateUrl = `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`;

    const translateResponse = await fetch(googleTranslateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source,
        target,
        format: 'text',
      }),
    });

    if (!translateResponse.ok) {
      const errorText = await translateResponse.text();
      console.error('Google Translate API error:', errorText);
      // Return original text instead of error
      return new Response(
        JSON.stringify({
          translatedText: text,
          cached: false,
        } as TranslateResponse),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const translateData = await translateResponse.json();
    const translatedText = translateData.data.translations[0].translatedText;

    const { error: insertError } = await supabase.from('translations').insert({
      source_text: text,
      source_lang: source,
      target_lang: target,
      translated_text: translatedText,
      context: context || null,
    });

    if (insertError) {
      console.error('Error caching translation:', insertError);
    }

    return new Response(
      JSON.stringify({
        translatedText,
        cached: false,
      } as TranslateResponse),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});