
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { SendIcon } from './icons/SendIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { WordPressIcon } from './icons/WordPressIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (prompt: string, image: string | null) => void;
  onExportHtml: () => void;
  onExportWordPress: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  chatHistory,
  isLoading,
  error,
  onSendMessage,
  onExportHtml,
  onExportWordPress
}) => {
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatHistory]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        if(!prompt) {
          setPrompt(`Analyze this image and build a website based on it.`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (prompt.trim() || uploadedImage) {
      onSendMessage(prompt, uploadedImage);
      setPrompt('');
      setUploadedImage(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-1/3 flex flex-col bg-gray-800 border-r border-gray-700 h-full">
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md p-4 rounded-xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.image && (
                <img src={msg.image} alt="User upload" className="mt-3 rounded-lg max-w-full h-auto" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-800">
        {error && <div className="text-red-400 mb-2 text-sm">{error}</div>}
        {uploadedImage && (
          <div className="mb-2 relative w-24">
            <img src={uploadedImage} alt="Preview" className="rounded-lg w-full h-auto"/>
            <button
              onClick={() => {
                setUploadedImage(null);
                if(fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs"
            >
              &times;
            </button>
          </div>
        )}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 pr-24 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            rows={2}
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              disabled={isLoading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full hover:bg-gray-600 disabled:opacity-50"
              disabled={isLoading}
            >
              <UploadIcon />
            </button>
            <button
              onClick={handleSend}
              className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
              disabled={isLoading || (!prompt.trim() && !uploadedImage)}
            >
              {isLoading ? <SpinnerIcon /> : <SendIcon />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 mt-3">
          <button onClick={onExportHtml} className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md">
            <DownloadIcon />
            <span>Export HTML</span>
          </button>
          <button onClick={onExportWordPress} className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded-md">
            <WordPressIcon />
            <span>Export WordPress</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
