
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  image?: string | null; // base64 encoded image
}
