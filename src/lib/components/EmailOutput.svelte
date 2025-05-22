<script lang="ts">
  export let emailText: string;
  export let loading: boolean;
  export let error: string;

  let copied = false;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(emailText);
      copied = true;
      setTimeout(() => (copied = false), 2000); 
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
</script>

<div class="mt-6">
  {#if loading}
    <div class="text-blue-600 font-medium">Generating email...</div>
  {:else if error}
    <div class="text-red-600 font-medium">Error: {error}</div>
  {:else if emailText}
    <div class="border rounded p-4 bg-gray-50 dark:bg-gray-800 max-h-96 overflow-y-auto">
      <div class="flex justify-between items-center mb-2">
        <h2 class="font-semibold">Generated Email:</h2>
        <button
          on:click={copyToClipboard}
          class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
        >
          {copied ? 'Copied!' : 'Copy Email'}
        </button>
      </div>
      <p class="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{emailText}</p>
    </div>
  {:else}
    <div class="text-gray-500 italic">No email generated yet. Enter a prompt and tone to start!</div>
  {/if}
</div>