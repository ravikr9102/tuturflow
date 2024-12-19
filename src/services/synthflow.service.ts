import { SynthFlowConfig } from '../types/synthflow';

export class SynthFlowService {
  private readonly baseUrl = 'https://widget.synthflow.ai/widget/v2';
  private readonly modelId = '1733572316435x603375888167539500';
  
  constructor(private readonly apiKey: string) {}

  getWidgetUrl(): string {
    return `${this.baseUrl}/${this.apiKey}/${this.modelId}`;
  }

  setupMessageListener(
    onCallStart: () => Promise<boolean>,
    onCallEnd: () => void
  ): () => void {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== 'https://widget.synthflow.ai') return;

      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'START_CALL') {
          const success = await onCallStart();
          if (!success) {
            event.source?.postMessage(JSON.stringify({ type: 'STOP_CALL' }), '*');
          }
        } else if (data.type === 'END_CALL') {
          onCallEnd();
        }
      } catch (error) {
        console.error('Error handling widget message:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }
}