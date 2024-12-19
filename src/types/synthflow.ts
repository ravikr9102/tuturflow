export interface SynthFlowConfig {
  apiKey: string;
  modelId: string;
}

export interface SynthFlowMessage {
  type: 'START_CALL' | 'END_CALL' | 'STOP_CALL';
  data?: any;
}