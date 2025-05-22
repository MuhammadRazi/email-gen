<script lang="ts">
  import PromptInput from '$lib/components/PromptInput.svelte';
  import EmailOutput from '$lib/components/EmailOutput.svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { EmailStorageService } from '$lib/services/EmailStorage';

  let prompt = '';
  let tone = '';
  let loading = false;
  let result = '';
  let error = '';

  const emailStorage = new EmailStorageService();

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
      
      
      if (result && browser) {
        const emailDetails = emailStorage.extractEmailDetails(result, prompt, tone);
        emailStorage.saveEmail(emailDetails);
        showSuccessNotification();
      }
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

  function viewGeneratedEmails() {
    goto('/emails');
  }

  function showSuccessNotification() {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      Email saved successfully!
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
</script>

<div class="max-w-2xl mx-auto p-4 space-y-4">
  <h1 class="text-2xl font-bold">Smart Email Writer</h1>

  <PromptInput on:generate={handleGenerate} />

  
  <div class="flex justify-center">
    <button 
      on:click={viewGeneratedEmails}
      class="view-emails-btn"
    >
      View Generated Emails
    </button>
  </div>

  <EmailOutput {loading} {error} emailText={result} />
</div>

<style>
  .view-emails-btn {
    background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    font-weight: 600;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 16px;
  }

  .view-emails-btn:hover {
    background: linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
  }

  :global(.success-notification) {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
    box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>