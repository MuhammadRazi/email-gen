// place files you want to import through the `$lib` alias in this folder.
import { OPENAI_API_KEY } from '$env/static/private';
import { createEmailPrompt } from './utils/prompts';

/**
 * @param {string} prompt
 * @param {string} tone
 */
export async function generateEmailWithOpenAI(prompt, tone) {
  const systemMessage = `You are an assistant that writes realistic, helpful, and concise emails.`;
  const userMessage = createEmailPrompt(prompt, tone);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errBody}`);
    }

    const json = await response.json();
    const email = json.choices?.[0]?.message?.content?.trim();
    if (!email) {
      throw new Error('No content returned from OpenAI.');
    }

    return email;
  } catch (err) {
    console.error('Error generating email with OpenAI:', err);
    throw err; // Let the caller handle the error
  }
}