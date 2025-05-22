<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  let prompt = '';
  let tone = 'Professional';

  const dispatch = createEventDispatcher();

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (prompt.trim().length === 0) return;
    dispatch('generate', { prompt, tone });
  }
</script>

<form on:submit={handleSubmit} class="w-full max-w-md mx-auto mt-10 p-4 rounded-lg bg-white dark:bg-gray-900 shadow">
  <input
    bind:value={prompt}
    placeholder="Enter a topic or keyword..."
    class="w-full px-4 py-2 mb-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <select
    bind:value={tone}
    class="w-full px-4 py-2 mb-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option>Professional</option>
    <option>Friendly</option>
    <option>Apologetic</option>
    <option>Assertive</option>
  </select>

  <button
    type="submit"
    class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
  >
    Generate Email
  </button>
</form>
