'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  attachments?: string[];
}

interface FileData {
  data: string | null;
  mime_type: string | null;
}

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào 👋\nTôi có thể giúp gì cho bạn hôm nay?',
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [fileData, setFileData] = useState<FileData>({ data: null, mime_type: null });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [kbDocuments, setKbDocuments] = useState<any[]>([]);
  const [kbStats, setKbStats] = useState({ totalDocuments: 0 });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Initialize knowledge base when component mounts
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadScript = (src: string, id: string) => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        if (document.getElementById(id)) {
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    // Load scripts in sequence
    const loadScripts = async () => {
      try {
        await loadScript('/service/knowledge-base.js', 'knowledge-base-script');
        await loadScript('/service/kb-ui.js', 'kb-ui-script');
        console.log('Knowledge base scripts loaded successfully');
        
        // Initialize KB data after scripts are loaded
        setTimeout(() => {
          loadKnowledgeBaseData();
        }, 500);
      } catch (error) {
        console.error('Error loading knowledge base scripts:', error);
      }
    };

    loadScripts();
  }, []);

  // Load Knowledge Base data for display
  const loadKnowledgeBaseData = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const knowledgeBase = (window as any).knowledgeBase;
      if (knowledgeBase) {
        const docs = knowledgeBase.getAllDocuments();
        const stats = knowledgeBase.getStats();
        setKbDocuments(docs);
        setKbStats(stats);
        
        // Update the documents list in the UI
        updateKbDocumentsList(docs);
        updateKbStats(stats);
      }
    } catch (error) {
      console.error('Error loading knowledge base data:', error);
    }
  };

  // Update KB documents list in the UI
  const updateKbDocumentsList = (documents: any[]) => {
    const container = document.getElementById('kb-documents-list');
    if (!container) return;

    if (documents.length === 0) {
      container.innerHTML = `
        <div class="text-center text-gray-500 text-sm py-4">
          Chưa có document nào trong knowledge base
        </div>
      `;
      return;
    }

    container.innerHTML = documents.map(doc => `
      <div class="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <h5 class="font-medium text-sm text-gray-900 truncate">${doc.title}</h5>
            <span class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mt-1">
              ${doc.category}
            </span>
            <p class="text-xs text-gray-600 mt-1 line-clamp-2">${doc.content.substring(0, 100)}${doc.content.length > 100 ? '...' : ''}</p>
          </div>
          <div class="flex space-x-1 ml-2">
            <button onclick="editKbDocument('${doc.id}')" class="text-blue-600 hover:text-blue-800 text-xs p-1 rounded">
              ✏️
            </button>
            <button onclick="deleteKbDocument('${doc.id}')" class="text-red-600 hover:text-red-800 text-xs p-1 rounded">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `).join('');
  };

  // Update KB stats
  const updateKbStats = (stats: any) => {
    const statsElement = document.getElementById('kb-stats');
    if (statsElement) {
      statsElement.textContent = `${stats.totalDocuments} documents`;
    }
  };

  // Refresh KB data when settings panel opens
  useEffect(() => {
    if (isSettingsOpen) {
      setTimeout(() => {
        loadKnowledgeBaseData();
      }, 100);
    }
  }, [isSettingsOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedFile) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
      attachments: selectedFile ? [URL.createObjectURL(selectedFile)] : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsThinking(true);

    // Simulate API call with knowledge base integration
    try {
      await generateBotResponse(inputValue, fileData);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Đã xảy ra lỗi khi xử lý tin nhắn của bạn.',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
      setSelectedFile(null);
      setFileData({ data: null, mime_type: null });
    }
  };

  const generateBotResponse = async (userMessage: string, file: FileData) => {
    // API configuration from environment variables
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    
    if (!API_KEY) {
      throw new Error('Google API Key not found. Please check your .env.local file.');
    }
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    let enhancedMessage = userMessage;
    let knowledgeContext = '';

    // Try to integrate with knowledge base
    if (typeof window !== 'undefined' && (window as any).knowledgeBase) {
      try {
        const relevantDocs = (window as any).knowledgeBase.searchRelevantDocuments(userMessage, 3);
        if (relevantDocs.length > 0) {
          knowledgeContext = (window as any).knowledgeBase.createContextForPrompt(relevantDocs);
          enhancedMessage = knowledgeContext + 'USER QUESTION: ' + userMessage;
          console.log('Knowledge Base Context Added:', relevantDocs.length, 'documents found');
        }
      } catch (error) {
        console.error('Error searching knowledge base:', error);
      }
    }

    const chatHistory = [
      {
        role: "user",
        parts: [
          { text: enhancedMessage },
          ...(file.data ? [{ inline_data: file }] : [])
        ],
      }
    ];

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: chatHistory
      })
    };

    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error.message);

    const apiResponseText = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();

    const botMessage: Message = {
      id: (Date.now() + 2).toString(),
      text: apiResponseText,
      isBot: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      alert('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = (e.target?.result as string)?.split(',')[1];
      setFileData({
        data: base64String,
        mime_type: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const BotIcon = () => (
    <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
      <path
        fill="currentColor"
        d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"
      />
    </svg>
  );

  const ThinkingIndicator = () => (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );

  // Add global functions for KB management
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).editKbDocument = (docId: string) => {
        if ((window as any).settingsUI) {
          (window as any).settingsUI.editDocument(docId);
        }
      };
      
      (window as any).deleteKbDocument = (docId: string) => {
        if ((window as any).settingsUI) {
          (window as any).settingsUI.deleteDocument(docId);
          // Refresh the list after deletion
          setTimeout(() => {
            loadKnowledgeBaseData();
          }, 100);
        }
      };
    }
  }, []);

  return (
    <>
      {/* Chatbot Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 bg-blue-600 hover:bg-blue-700"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </Button>

      {/* Chatbot Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-lg shadow-2xl border z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <BotIcon />
              <h2 className="font-semibold text-lg">Chatbot</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="text-white hover:bg-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Enhanced Settings Panel */}
          {isSettingsOpen && (
            <Card className="absolute top-16 left-0 right-0 bg-white z-10 max-h-80 overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">⚙️ Cài đặt & Knowledge Base</h3>
                  <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(false)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="knowledge" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
                    <TabsTrigger value="preferences">Tùy chọn</TabsTrigger>
                  </TabsList>
                  
                  {/* Knowledge Base Tab */}
                  <TabsContent value="knowledge" className="space-y-4">
                    <div className="flex space-x-2">
                      <input
                        id="kb-search-input"
                        type="text"
                        placeholder="Tìm kiếm trong knowledge base..."
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                      />
                      <Button 
                        size="sm"
                        onClick={() => {
                          const query = (document.getElementById('kb-search-input') as HTMLInputElement)?.value || '';
                          if (typeof window !== 'undefined' && (window as any).settingsUI) {
                            (window as any).settingsUI.loadKnowledgeBase(query);
                          }
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="enable-kb-checkbox"
                          defaultChecked 
                          className="rounded"
                        />
                        <label htmlFor="enable-kb-checkbox" className="text-sm">Bật Knowledge Base injection</label>
                      </div>
                      <span id="kb-stats" className="text-sm text-gray-600">8 documents</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Max documents:</span>
                      <select id="max-docs-select" className="px-2 py-1 border rounded text-sm" defaultValue="3">
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                      </select>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          if (typeof window !== 'undefined' && (window as any).settingsUI) {
                            (window as any).settingsUI.showAddDocumentForm();
                          }
                        }}
                      >
                        + Thêm
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          if (typeof window !== 'undefined' && (window as any).settingsUI) {
                            (window as any).settingsUI.exportKB();
                          }
                        }}
                      >
                        📤 Export
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          if (typeof window !== 'undefined' && (window as any).settingsUI) {
                            (window as any).settingsUI.importKB();
                          }
                        }}
                      >
                        📥 Import
                      </Button>
                    </div>

                    {/* Knowledge Base Documents List */}
                    <div id="kb-documents-list" className="max-h-40 overflow-y-auto space-y-2">
                      <div className="text-center text-gray-500 text-sm py-4">
                        Đang tải knowledge base...
                      </div>
                    </div>

                    {/* Hidden file input for import */}
                    <input
                      type="file"
                      id="kb-import-file"
                      accept=".json"
                      className="hidden"
                      onChange={(e) => {
                        if (typeof window !== 'undefined' && (window as any).settingsUI) {
                          (window as any).settingsUI.handleImportFile(e);
                        }
                      }}
                    />

                    <div className="border-t pt-3">
                      <Button 
                        size="sm" 
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          if (typeof window !== 'undefined' && (window as any).settingsUI) {
                            (window as any).settingsUI.clearKB();
                          }
                        }}
                      >
                        🗑️ Xóa tất cả dữ liệu
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Preferences Tab */}
                  <TabsContent value="preferences" className="space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Hiển thị</h4>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Hiển thị typing indicator</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Tự động cuộn xuống</span>
                      </label>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Cài đặt nâng cao</h4>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Lưu lịch sử chat</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Chế độ debug</span>
                      </label>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex items-start space-x-2 max-w-xs ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                  {message.isBot && (
                    <div className="text-blue-600 mt-1">
                      <BotIcon />
                    </div>
                  )}
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                    {message.attachments && (
                      <div className="mt-2">
                        {message.attachments.map((attachment, index) => (
                          <img
                            key={index}
                            src={attachment}
                            alt="Attachment"
                            className="max-w-full h-auto rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-xs">
                  <div className="text-blue-600 mt-1">
                    <BotIcon />
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-gray-100">
                    <ThinkingIndicator />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            {selectedFile && (
              <div className="mb-2 flex items-center space-x-2">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected file"
                  className="w-10 h-10 object-cover rounded"
                />
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setFileData({ data: null, mime_type: null });
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            )}
            <div className="flex items-end space-x-2">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message..."
                className="flex-1 min-h-[40px] max-h-24 resize-none"
                rows={1}
              />
              <div className="flex space-x-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </Button>
                <Button onClick={handleSendMessage} size="sm" disabled={isThinking}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbox;