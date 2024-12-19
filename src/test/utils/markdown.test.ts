import { describe, it, expect } from 'vitest';
import { formatMarkdown } from '../../utils/markdown.utils';

describe('formatMarkdown', () => {
  it('should format basic markdown text', () => {
    const input = '**Bold** and *italic*';
    const output = formatMarkdown(input);
    expect(output).toContain('<strong>Bold</strong>');
    expect(output).toContain('<em>italic</em>');
  });

  it('should handle code blocks', () => {
    const input = '```javascript\nconst x = 1;\n```';
    const output = formatMarkdown(input);
    expect(output).toContain('<pre><code>');
    expect(output).toContain('const x = 1;');
  });

  it('should format lists correctly', () => {
    const input = '- Item 1\n- Item 2';
    const output = formatMarkdown(input);
    expect(output).toContain('<ul>');
    expect(output).toContain('<li>Item 1</li>');
    expect(output).toContain('<li>Item 2</li>');
  });
});