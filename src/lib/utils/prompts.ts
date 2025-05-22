export function createEmailPrompt(scenario: string, tone: string): string {
  const formattedTone = tone.toLowerCase();
  return `Write a ${formattedTone} email for the following situation: "${scenario}"`;
}