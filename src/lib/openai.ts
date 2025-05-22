import { GROQ_API_KEY } from '$env/static/private';
import { createEmailPrompt } from './utils/prompts';

export async function generateEmailWithOpenAI(prompt: string, tone: string) {
  const systemMessage = `You are an assistant that writes realistic, helpful, and concise emails.`;
  const userMessage = createEmailPrompt(prompt, tone);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Groq's free model
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      console.error('Groq API Error:', response.status, responseBody);
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      throw new Error(responseBody?.error?.message || 'Failed to generate email');
    }

    const email = responseBody.choices?.[0]?.message?.content?.trim();
    if (!email) {
      throw new Error('No email content returned from Groq.');
    }

    return email;
  } catch (err) {
    console.error('Groq API Error:', err);
    throw err;
  }
}