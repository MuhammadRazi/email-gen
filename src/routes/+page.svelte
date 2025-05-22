<script lang="ts">
  import PromptInput from '$lib/components/PromptInput.svelte';
  import EmailOutput from '$lib/components/EmailOutput.svelte';

  let prompt = '';
  let tone = '';
  let loading = false;
  let result = '';
  let error = '';

  async function generateEmail() {
    loading = true;
    result = '';
    error = '';

    try {
      const res = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, tone })
      });

      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 429 && errText.includes('insufficient_quota')) {
          throw new Error('OpenAI quota exceeded. Please try again later or contact support.');
        }
        throw new Error(errText || 'Failed to generate email.');
      }

      const data = await res.json();
      result = data.email;
    } catch (err) {
      if (err instanceof Error) {
        error = err.message;
      } else {
        error = 'Something went wrong';
      }
    } finally {
      loading = false;
    }
  }

  function handleGenerate(event: CustomEvent<{ prompt: string; tone: string }>) {
    const { prompt: p, tone: t } = event.detail;
    prompt = p;
    tone = t;
    generateEmail();
  }
</script>

<div class="max-w-2xl mx-auto p-4 space-y-4">
  <h1 class="text-2xl font-bold">Smart Email Writer</h1>

  <PromptInput on:generate={handleGenerate} />

  <EmailOutput {loading} {error} emailText={result} />
</div>
