import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PDFParserService } from '../../../services/pdf/parser.service';
import * as pdfParse from 'pdf-parse';

vi.mock('pdf-parse');

describe('PDFParserService', () => {
  let service: PDFParserService;
  let mockFile: File;

  beforeEach(() => {
    service = new PDFParserService();
    mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    
    vi.mocked(pdfParse).mockResolvedValue({
      text: 'Sample PDF content for testing',
      numpages: 1,
      info: {},
      metadata: {},
      version: '1.0'
    });
  });

  it('should parse PDF file successfully', async () => {
    const result = await service.parsePDF(mockFile);
    
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('title', 'test.pdf');
    expect(result).toHaveProperty('content');
    expect(result.chunks).toBeInstanceOf(Array);
    expect(result.metadata).toHaveProperty('pageCount', 1);
  });

  it('should handle PDF parsing errors', async () => {
    vi.mocked(pdfParse).mockRejectedValue(new Error('Parse error'));
    
    await expect(service.parsePDF(mockFile)).rejects.toThrow('Failed to parse PDF file');
  });
});