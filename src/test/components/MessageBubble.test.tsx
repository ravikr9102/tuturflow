import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MessageBubble } from '../../components/chat/MessageBubble';

describe('MessageBubble', () => {
  const mockMessage = {
    id: '1',
    content: '**Hello** world!',
    sender: 'user' as const,
    timestamp: new Date()
  };

  it('should render user message correctly', () => {
    render(<MessageBubble message={mockMessage} />);
    
    const messageElement = screen.getByText(/world!/);
    expect(messageElement).toBeInTheDocument();
    expect(messageElement.closest('div')).toHaveClass('user-message');
  });

  it('should render AI message correctly', () => {
    const aiMessage = { ...mockMessage, sender: 'ai' as const };
    render(<MessageBubble message={aiMessage} />);
    
    const messageElement = screen.getByText(/world!/);
    expect(messageElement).toBeInTheDocument();
    expect(messageElement.closest('div')).toHaveClass('ai-message');
  });

  it('should render markdown content correctly', () => {
    render(<MessageBubble message={mockMessage} />);
    
    const boldText = screen.getByText('Hello');
    expect(boldText.tagName).toBe('STRONG');
  });
});