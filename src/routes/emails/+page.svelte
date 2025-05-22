<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import EmailCard from '$lib/components/EmailCard.svelte';
  import { EmailStorageService, type EmailData } from '$lib/services/EmailStorage';

  let emails: EmailData[] = [];
  let selectedEmail: EmailData | null = null;
  let showModal = false;
  let isLoading = true;

  const emailStorage = new EmailStorageService();

  onMount(() => {
    loadEmails();
  });

  function loadEmails() {
    if (!browser) return;
    
    setTimeout(() => {
      emails = emailStorage.getEmails();
      isLoading = false;
    }, 300);
  }

  function handleViewEmail(event: CustomEvent<EmailData>) {
    selectedEmail = event.detail;
    showModal = true;
  }

  function handleCopyEmail(event: CustomEvent<EmailData>) {
    const email = event.detail;
    const emailText = `Subject: ${email.subject}\n\n${email.content}`;
    
    navigator.clipboard.writeText(emailText).then(() => {
      showNotification('Email copied to clipboard!', 'success');
    }).catch(() => {
      showNotification('Failed to copy email', 'error');
    });
  }

  function handleDeleteEmail(event: CustomEvent<number>) {
    const emailId = event.detail;
    
    if (!confirm('Are you sure you want to delete this email?')) return;
    
    emails = emailStorage.deleteEmail(emailId);
    showNotification('Email deleted successfully', 'success');
  }

  function closeModal() {
    showModal = false;
    selectedEmail = null;
  }

  function showNotification(message: string, type: 'success' | 'error' = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }

  function goBack() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Generated Emails</title>
</svelte:head>

<div class="page-container">
  <div class="container">
    
    <header class="page-header">
      <div class="header-content">
        <h1 class="page-title">Generated Emails</h1>
        <p class="page-subtitle">View and manage your emails</p>
      </div>
      <button class="back-button" on:click={goBack}>
        ← Generate New Email
      </button>
    </header>
    
    {#if isLoading}
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Loading your emails...</p>
      </div>
    {:else if emails.length === 0}
      <div class="empty-state">
        <div class="empty-icon">📧</div>
        <h2 class="empty-title">No emails generated yet</h2>
        <p class="empty-description">Create your first AI-powered email to see it displayed here</p>
        <button class="cta-button" on:click={goBack}>
          Generate Your First Email
        </button>
      </div>
    {:else}
      <div class="cards-grid">
        {#each emails as email, index (email.id)}
          <EmailCard
            {email}
            isPopular={index === 0}
            animationDelay={index * 100}
            on:view={handleViewEmail}
            on:copy={handleCopyEmail}
            on:delete={handleDeleteEmail}
          />
        {/each}
      </div>
    {/if}
  </div>
</div>


{#if showModal && selectedEmail}
  <div class="modal-overlay" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      <div class="modal-header">
        <h3 class="modal-title">Email Details</h3>
        <button class="modal-close" on:click={closeModal}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="modal-field">
          <label class="field-label">Subject:</label>
          <div class="field-value">{selectedEmail.subject}</div>
        </div>
        
        <div class="modal-field">
          <label class="field-label">Recipient:</label>
          <div class="field-value">{selectedEmail.recipient}</div>
        </div>
        
        <div class="modal-field">
          <label class="field-label">Content:</label>
          <div class="field-value content-field">{selectedEmail.content}</div>
        </div>
        
        {#if selectedEmail.originalPrompt}
          <div class="modal-field">
            <label class="field-label">Original Prompt:</label>
            <div class="field-value">{selectedEmail.originalPrompt}</div>
          </div>
        {/if}
        
        {#if selectedEmail.selectedTone}
          <div class="modal-field">
            <label class="field-label">Tone:</label>
            <div class="field-value tone-value">{selectedEmail.selectedTone}</div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  :global(.notification) {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 8px;
    color: #fff;
    font-weight: 500;
    z-index: 1000;
    animation: slideInRight 0.3s ease-out;
  }

  :global(.notification.success) {
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  }

  :global(.notification.error) {
    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
  }

  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .page-container {
    min-height: 100vh;
    background: radial-gradient(ellipse at center, #1a1a1a 0%, #0d0d0d 100%);
    color: #fff;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 24px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 48px;
  }

  .header-content {
    text-align: center;
    flex: 1;
  }

  .page-title {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #fff; 
  }

  .page-subtitle {
    font-size: 18px;
    color: #9ca3af;
  }

  .back-button, .cta-button {
    font-weight: 600;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .back-button {
    background: #d4e157; 
    color: #000;
  }

  .back-button:hover {
    background: #c0ca33;
    transform: translateY(-1px);
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80px 20px;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #374151;
    border-top: 4px solid #84cc16;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-text, .empty-description {
    color: #9ca3af;
    font-size: 16px;
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;
  }

  .empty-icon {
    font-size: 64px;
    margin-bottom: 24px;
  }

  .empty-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 16px;
    color: #fff;
  }

  .empty-description {
    margin-bottom: 32px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-button {
    background: #d4e157; 
    color: #000;
    font-size: 16px;
    padding: 16px 32px;
  }

  .cta-button:hover {
    background: #c0ca33;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
  }

  .cards-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 32px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    z-index: 50;
    backdrop-filter: blur(4px);
  }

  .modal-content {
    background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
    border-radius: 16px;
    padding: 32px;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    border: 1px solid #404040;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .modal-title {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
  }

  .modal-close {
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: color 0.2s ease;
  }

  .modal-close:hover {
    color: #fff;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .modal-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .field-label {
    font-size: 14px;
    font-weight: 600;
    color: #d1d5db;
  }

  .field-value {
    background: #374151;
    padding: 12px 16px;
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    line-height: 1.5;
  }

  .content-field {
    white-space: pre-wrap;
    min-height: 100px;
  }

  .tone-value {
    text-transform: capitalize;
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      gap: 24px;
    }

    .page-title {
      font-size: 36px;
    }

    .cards-grid {
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .container {
      padding: 24px 16px;
    }
  }
</style>