// In-memory database simulation (trong thực tế sẽ dùng PostgreSQL, MongoDB, v.v.)
let questionsDB: any[] = [
  {
    id: '1',
    question: 'Làm thế nào để liên hệ với support?',
    askedBy: 'Người dùng A',
    group: 'Hỗ trợ khách hàng',
    timestamp: new Date(Date.now() - 86400000),
    likes: 3,
    answered: true,
    answer: 'Bạn có thể liên hệ qua email support@example.com hoặc hotline 1900-xxxx'
  },
  {
    id: '2', 
    question: 'Website có hỗ trợ thanh toán online không?',
    askedBy: 'Người dùng B',
    group: 'Thanh toán',
    timestamp: new Date(Date.now() - 43200000),
    likes: 5,
    answered: true,
    answer: 'Có, chúng tôi hỗ trợ thanh toán qua Visa, Mastercard, và ví điện tử'
  },
  {
    id: '3',
    question: 'Làm sao để reset mật khẩu?',
    askedBy: 'Người dùng C',
    group: 'Tài khoản', 
    timestamp: new Date(Date.now() - 21600000),
    likes: 1,
    answered: false
  }
];

// Simulate real-time subscribers (trong thực tế sẽ dùng WebSocket)
let subscribers: ((data: any) => void)[] = [];

export function addSubscriber(callback: (data: any) => void) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter(sub => sub !== callback);
  };
}

export function notifySubscribers(type: string, data: any) {
  subscribers.forEach(callback => {
    callback({ type, data });
  });
}

export function getAllQuestions() {
  return questionsDB.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function addQuestion(question: any) {
  const newQuestion = {
    ...question,
    id: Date.now().toString(),
    timestamp: new Date(),
    likes: 0,
    answered: false
  };
  
  questionsDB.unshift(newQuestion);
  
  // Thông báo cho tất cả clients
  notifySubscribers('QUESTION_ADDED', newQuestion);
  
  return newQuestion;
}

export function likeQuestion(questionId: string) {
  const question = questionsDB.find(q => q.id === questionId);
  if (question) {
    question.likes += 1;
    
    // Thông báo cho tất cả clients
    notifySubscribers('QUESTION_LIKED', { questionId, likes: question.likes });
    
    return question;
  }
  return null;
}