<script lang="ts">
  export let idea: { title: string; description: string };
</script>

<div class="bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 shadow-md">
  <h2 class="text-xl font-semibold mb-2">{idea.title}</h2>
  <p>{idea.description}</p>
</div>