export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  id?: string;
}

export interface ChatRequest {
  message: string;
  conversation_history: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  conversation_id?: string;
}

export interface ApiError {
  detail: string;
} 