"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Heart, Clock, Wifi, WifiOff } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  askedBy: string;
  group: string;
  timestamp: Date;
  likes: number;
  answer?: string;
  answered: boolean;
}

const QAPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [askerName, setAskerName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Load initial questions and setup polling
  useEffect(() => {
    fetchQuestions();
    setIsConnected(true);
    
    // Setup polling every 2 seconds to check for new questions
    const interval = setInterval(fetchQuestions, 2000);
    
    // Listen for localStorage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'qa-questions-update') {
        fetchQuestions();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fetch questions from API
  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/qna/questions');
      const data = await response.json();
      
      if (data.success) {
        const questionsWithDates = data.questions.map((q: any) => ({
          ...q,
          timestamp: new Date(q.timestamp)
        }));
        setQuestions(questionsWithDates);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setIsConnected(false);
    }
  };

  // Trigger update across tabs
  const triggerCrossTabUpdate = () => {
    localStorage.setItem('qa-questions-update', Date.now().toString());
    // Remove the item immediately so it can trigger again
    localStorage.removeItem('qa-questions-update');
  };

  // Submit new question via API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !askerName.trim() || !groupName.trim()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/qna/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: newQuestion.trim(),
          askedBy: askerName.trim(),
          group: groupName.trim()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setNewQuestion('');
        setAskerName('');
        setGroupName('');
        
        // Immediately fetch new questions and trigger cross-tab update
        await fetchQuestions();
        triggerCrossTabUpdate();
      } else {
        alert('Có lỗi xảy ra khi gửi câu hỏi!');
      }
    } catch (error) {
      console.error('Failed to submit question:', error);
      alert('Có lỗi xảy ra khi gửi câu hỏi!');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like a question via API
  const handleLike = async (questionId: string) => {
    try {
      const response = await fetch(`/api/qna/questions/${questionId}/like`, {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        // Immediately update local state
        setQuestions(prev => prev.map(q => 
          q.id === questionId 
            ? { ...q, likes: q.likes + 1 }
            : q
        ));
        
        // Trigger cross-tab update
        triggerCrossTabUpdate();
      } else {
        alert('Có lỗi xảy ra khi like câu hỏi!');
      }
    } catch (error) {
      console.error('Failed to like question:', error);
      alert('Có lỗi xảy ra khi like câu hỏi!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 mr-3 text-blue-600" />
            Hỏi & Đáp
          </h1>
          <p className="text-gray-600 mt-2">Đặt câu hỏi và nhận câu trả lời</p>
        </div>

        {/* Question Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Đặt câu hỏi mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Tên của bạn"
                  value={askerName}
                  onChange={(e) => setAskerName(e.target.value)}
                  required
                />
                <Input
                  placeholder="Tên nhóm "
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Câu hỏi của bạn..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting || !isConnected}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Đang gửi...' : 'Gửi câu hỏi'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Questions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Câu hỏi từ cộng đồng ({questions.length})
            </h2>
            <div className="flex items-center space-x-2">
              <Badge className={isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3 mr-1" />
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    Live
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 mr-1" />
                    Offline
                  </>
                )}
              </Badge>
            </div>
          </div>
          
          {questions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Đang tải câu hỏi từ cộng đồng...</p>
              </CardContent>
            </Card>
          ) : (
            questions.map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{question.askedBy}</h3>
                        <Badge variant="outline" className="text-xs">
                          {question.group}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {question.timestamp.toLocaleDateString('vi-VN')} • {question.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <Badge variant={question.answered ? "default" : "secondary"}>
                      {question.answered ? "Đã trả lời" : "Chờ trả lời"}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{question.question}</p>
                  
                  {question.answer && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                      <h4 className="font-medium text-blue-900 mb-2">Câu trả lời:</h4>
                      <p className="text-blue-800">{question.answer}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                      onClick={() => handleLike(question.id)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-red-600"
                    >
                      <Heart className="w-4 h-4 mr-1" />
                      {question.likes}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QAPage;