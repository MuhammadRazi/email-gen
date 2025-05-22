export interface EmailData {
  id: number;
  subject: string;
  content: string;
  recipient: string;
  type: 'Professional' | 'Marketing' | 'Personal';
  timestamp: string;
  originalPrompt?: string;
  selectedTone?: string;
}

export class EmailStorageService {
  private readonly STORAGE_KEY = 'generatedEmails';
  private readonly MAX_EMAILS = 6;

  getEmails(): EmailData[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving emails from localStorage:', error);
      return [];
    }
  }

  saveEmail(emailData: Omit<EmailData, 'id' | 'timestamp'>): EmailData[] {
    try {
      const emails = this.getEmails();
      
      const newEmail: EmailData = {
        ...emailData,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
      
      emails.unshift(newEmail);
      const limitedEmails = emails.slice(0, this.MAX_EMAILS);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedEmails));
      return limitedEmails;
    } catch (error) {
      console.error('Error saving email to localStorage:', error);
      return this.getEmails();
    }
  }

  deleteEmail(emailId: number): EmailData[] {
    try {
      const emails = this.getEmails();
      const filteredEmails = emails.filter(email => email.id !== emailId);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredEmails));
      return filteredEmails;
    } catch (error) {
      console.error('Error deleting email from localStorage:', error);
      return this.getEmails();
    }
  }

  extractEmailDetails(emailContent: string, prompt: string, tone: string): Omit<EmailData, 'id' | 'timestamp'> {
    const subjectMatch = emailContent.match(/Subject:\s*(.+)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : this.generateSubjectFromPrompt(prompt);
    
    const content = emailContent.replace(/Subject:\s*(.+)\n?/i, '').trim();
    
    const recipient = this.extractRecipient(prompt);
    const type = this.determineEmailType(tone);
    
    return {
      subject,
      content,
      recipient,
      type,
      originalPrompt: prompt,
      selectedTone: tone
    };
  }

  private generateSubjectFromPrompt(prompt: string): string {
    const words = prompt.split(' ').slice(0, 6);
    return words.join(' ') + (words.length < prompt.split(' ').length ? '...' : '');
  }

  private extractRecipient(prompt: string): string {
    const emailMatch = prompt.match(/\S+@\S+/);
    if (emailMatch) return emailMatch[0];
    
    if (prompt.toLowerCase().includes('client')) return 'Client';
    if (prompt.toLowerCase().includes('boss') || prompt.toLowerCase().includes('manager')) return 'Manager';
    if (prompt.toLowerCase().includes('team')) return 'Team';
    
    return 'Recipient';
  }

  private determineEmailType(tone: string): 'Professional' | 'Marketing' | 'Personal' {
    const lowerTone = tone.toLowerCase();
    
    if (lowerTone.includes('professional') || lowerTone.includes('formal') || lowerTone.includes('assertive')) {
      return 'Professional';
    }
    
    if (lowerTone.includes('marketing') || lowerTone.includes('sales') || lowerTone.includes('promotional')) {
      return 'Marketing';
    }
    
    return 'Personal';
  }
}