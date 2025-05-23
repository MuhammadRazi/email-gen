<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let email: {
    id: number;
    subject: string;
    content: string;
    recipient: string;
    type: string;
    timestamp: string;
    originalPrompt?: string;
    selectedTone?: string;
  };
  export let isPopular = false;
  export let animationDelay = 0;

  const dispatch = createEventDispatcher();

  function handleView() {
    dispatch('view', email);
  }
</script>

<div 
  class="email-card" 
  style="animation-delay: {animationDelay}ms"
>
  <div class="card-content">
    <div class="card-header">
      <h3 class="card-title">{email.subject}</h3>
    </div>
    <div class="details-list">
      <div class="detail-item">
        <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span class="detail-name">Recipient</span>
        <span class="detail-value">{email.recipient}</span>
      </div>
      <div class="detail-item">
        <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span class="detail-name">Type</span>
        <span class="detail-value type-{email.type.toLowerCase()}">{email.type}</span>
      </div>
      <div class="detail-item">
        <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span class="detail-name">Generated</span>
        <span class="detail-value">{new Date(email.timestamp).toLocaleDateString()}</span>
      </div>
    </div>

    <button class="action-button" on:click={handleView}>
      View Email
    </button>
  </div>
</div>

<style>
  .email-card {
    width: 320px; 
    height: 400px; 
    background: linear-gradient(to top, #d4e157 0%, #000000 50%, #000000 100%);
    border-radius: 16px;
    padding: 24px;
    position: relative;
    border: 1px solid #060606;
    transition: all 0.3s ease;
    animation: slideInUp 0.5s ease-out forwards;
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    overflow: hidden; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .email-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }

  .email-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at center, rgba(212, 225, 87, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  @keyframes slideInUp {
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .popular-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: #84cc16;
    color: #000;
    font-size: 11px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
  }

  .card-header {
    flex-shrink: 0;
    margin-bottom: 16px;
  }

  .card-title {
    content: attr(data-first-word);
    font-size: 20px;
    font-weight: 700;
    color: #fff;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tag-bar {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .tag {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 12px;
    background: #333;
    color: #d4e157;
    white-space: nowrap;
  }

  .tone-tag {
    background-color: #0ea5e9;
    color: #fff;
  }

  .prompt-tag {
    background-color: #f59e0b;
    color: #000;
  }

  .details-list {
    flex-grow: 1;
    overflow-y: auto;
    margin-top: 60px;
  }

  .detail-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    font-size: 14px;
    color: #9ca3af;
  }

  .detail-item:last-child {
    margin-bottom: 0;
  }

  .check-icon {
    width: 16px;
    height: 16px;
    color: #84cc16;
    margin-right: 8px;
    flex-shrink: 0;
  }

  .detail-name {
    color: #9ca3af;
    font-weight: 500;
    flex: 1;
  }

  .detail-value {
    color: #fff;
    font-size: 14px;
    text-align: right;
  }

  .type-professional { color: #3b82f6; }
  .type-marketing { color: #f59e0b; }
  .type-personal { color: #84cc16; }

  .action-button {
    width: 100%;
    background: #d4e157;
    color: #000;
    font-weight: 600;
    font-size: 16px;
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .action-button:hover {
    background: #c0ca33;
    transform: translateY(-1px);
  }
</style>