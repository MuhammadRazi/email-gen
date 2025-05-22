import type { RequestHandler } from '@sveltejs/kit';
import { GROQ_API_KEY } from '$env/static/private';
import { createEmailPrompt } from '$lib/utils/prompts';
import { generateEmailWithOpenAI } from '$lib/openai';

function generateFallbackEmail(prompt: string, tone: string): string {
  const toneMap = {
    'Professional': {
      greeting: 'Dear [Recipient],',
      closing: 'Best regards,\n[Your Name]'
    },
    'Friendly': {
      greeting: 'Hi there!',
      closing: 'Cheers,\n[Your Name]'
    },
    'Apologetic': {
      greeting: 'Dear [Recipient],',
      closing: 'Sincerely,\n[Your Name]'
    },
    'Assertive': {
      greeting: 'Hello,',
      closing: 'Best,\n[Your Name]'
    }
  };

  const toneSettings = toneMap[tone as keyof typeof toneMap] || toneMap['Professional'];
  
  return `${toneSettings.greeting}

I hope this message finds you well. I wanted to reach out regarding ${prompt.toLowerCase()}.

[This is a fallback email template since Groq API is currently unavailable. Please add your specific content here.]

Thank you for your time and consideration.

${toneSettings.closing}

---
Note: This email was generated using a fallback template due to API limitations.`;
}

export const POST: RequestHandler = async ({ request }) => {
  let body: { prompt?: string; tone?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON payload.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { prompt, tone } = body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return new Response(
      JSON.stringify({ error: 'The "prompt" field is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (!tone || typeof tone !== 'string' || !tone.trim()) {
    return new Response(
      JSON.stringify({ error: 'The "tone" field is required.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const email = await generateEmailWithOpenAI(prompt.trim(), tone);

    return new Response(
      JSON.stringify({ email }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Server error generating email:', err);
    
    // Check if it's a rate limit or API error and provide fallback
    if (err instanceof Error && (err.message.includes('Rate limit') || err.message.includes('Failed to generate'))) {
      console.log('Using fallback email due to API issue');
      const fallbackEmail = generateFallbackEmail(prompt.trim(), tone);
      
      return new Response(
        JSON.stringify({ 
          email: fallbackEmail,
          isFallback: true,
          message: 'API temporarily unavailable - using fallback template'
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Server error generating email.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};