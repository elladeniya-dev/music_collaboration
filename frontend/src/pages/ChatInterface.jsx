import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { chatService, userService } from '../services';
import { showError, showInputDialog, showConfirmation, showSuccess, getUserId } from '../utils';
import { useWebSocket } from '../hooks';

const ChatInterface = () => {
  const { id: partnerId } = useParams();
  const { user, loadingUser } = useUser();
  const navigate = useNavigate();

  const [chatHeads, setChatHeads] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const getChatId = () => [getUserId(user), partnerId].sort().join('_');

  // WebSocket hook for real-time messaging
  const handleMessageReceived = useCallback((newMessage) => {
    console.log('📨 Received WebSocket message:', newMessage);
    setMessages((prev) => {
      // Prevent duplicate messages
      if (prev.some(msg => msg.id === newMessage.id)) {
        return prev;
      }
      const updated = [...prev, newMessage];
      return updated.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });
    scrollToBottom();
  }, []);

  const { connected, sendMessage: sendWsMessage, sendTypingIndicator } = useWebSocket(
    partnerId ? getChatId() : null,
    getUserId(user),
    handleMessageReceived,
    !!partnerId && !!user
  );

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    const userId = getUserId(user);
    if (!userId) return;

    chatService.getChatHeads()
      .then(async (data) => {
        setChatHeads(data);

        const partnerIds = data.map(chat => chat.participants.find(p => p !== userId));
        if (!partnerIds.length) return;

        const users = await userService.getBulkUsers(partnerIds);

        const map = {};
        users.forEach(u => { map[u._id || u.id] = u; });
        setUserMap(map);
      })
      .catch(err => console.error('Failed to fetch chat heads:', err));
  }, [user]);

  // Load initial messages when chat opens
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !partnerId) return;
      try {
        const data = await chatService.getMessages(getChatId());
        const sorted = data.sort((a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        setMessages(sorted);
        scrollToBottom();
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };

    if (user && partnerId) {
      fetchMessages();
    }
  }, [user, partnerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const msgObj = {
      chatId: getChatId(),
      senderId: getUserId(user),
      receiverId: partnerId,
      message: message.trim(),
      type: 'text',
      status: 'sent',
    };

    try {
      // Send via WebSocket if connected, otherwise use HTTP
      if (connected) {
        sendWsMessage(msgObj);
        setMessage('');
        // Stop typing indicator
        if (isTyping) {
          sendTypingIndicator(false, user.name);
          setIsTyping(false);
        }
      } else {
        // Fallback to HTTP if WebSocket not connected
        const newMessage = await chatService.sendMessage(msgObj);
        setMessages((prev) => [...prev, newMessage]);
        setMessage('');
      }
      scrollToBottom();
    } catch (err) {
      console.error('Send message error:', err);
      showError('Failed to send message');
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!connected) return;

    if (!isTyping) {
      setIsTyping(true);
      sendTypingIndicator(true, user.name);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of no input
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTypingIndicator(false, user.name);
    }, 2000);
  };

  const startNewChat = async () => {
    const email = await showInputDialog(
      'Start New Chat',
      'Enter Gmail of the user',
      'email',
      'example@gmail.com'
    );

    if (email) {
      try {
        const receiver = await userService.getUserByEmail(email);

        if (!receiver || !getUserId(receiver)) {
          showError('User not found');
          return;
        }

        const receiverId = getUserId(receiver);

        await chatService.createChatHead(receiverId);

        navigate(`/chat/${receiverId}`);
      } catch (err) {
        console.error(err);
        showError('Error', 'Could not create or find user.');
      }
    }
  };

  const handleDeleteChat = async (partnerId) => {
    const chatId = [getUserId(user), partnerId].sort().join('_');

    const confirmed = await showConfirmation(
      'Delete Chat?',
      'This will permanently delete all messages in this conversation.'
    );

    if (confirmed) {
      try {
        await chatService.deleteChat(chatId);

        setChatHeads((prev) =>
          prev.filter((chat) =>
            chat.participants.find((p) => p !== getUserId(user)) !== partnerId
          )
        );

        if (partnerId === partner?.id) navigate('/chat');

        showSuccess('Deleted!', 'Chat has been deleted.');
      } catch (err) {
        console.error(err);
        showError('Error', 'Failed to delete chat.');
      }
    }
  };

  const partner = userMap[partnerId];

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!getUserId(user)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-red-400">Login required</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-64px)] flex overflow-hidden bg-slate-900">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Messages</h2>
          <button
            onClick={startNewChat}
            title="Start New Chat"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <ul className="flex-1 overflow-y-auto">
          {chatHeads.map((chat) => {
            const uid = getUserId(user);
            const pid = chat.participants.find(p => p !== uid);
            const chatPartner = userMap[pid];
            const isActive = pid === partnerId;

            return (
              <li
                key={chat._id || chat.id}
                className={`px-4 py-3 hover:bg-slate-700 flex items-center justify-between transition cursor-pointer ${
                  isActive ? 'bg-slate-700' : ''
                }`}
                onClick={() => navigate(`/chat/${pid}`)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {chatPartner?.profileImage ? (
                    <img
                      src={chatPartner.profileImage}
                      alt={chatPartner?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                      {chatPartner?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm text-white truncate">
                      {chatPartner?.name || 'Unknown'}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      {chat.lastMessage || 'No messages yet'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(pid);
                  }}
                  className="ml-2 p-1 text-slate-400 hover:text-red-400 transition-colors"
                  title="Delete chat"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Chat Area */}
      <section className="flex-1 flex flex-col bg-slate-900">
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-between border-b border-slate-700 bg-slate-800">
          <h2 className="text-base font-semibold text-white">
            {partner?.name || 'Select a conversation'}
          </h2>
          {partnerId && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              connected 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-slate-700 text-slate-400 border border-slate-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-slate-400'}`}></span>
              {connected ? 'Connected' : 'Disconnected'}
            </div>
          )}
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-6 py-4 space-y-3 bg-slate-900">
          {messages.map((msg, index) => {
            const isSender = msg.senderId === getUserId(user);
            const timeStr = new Date(msg.timestamp).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            });

            return (
              <div key={msg._id || msg.id || index} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
                  isSender 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}>
                  <div className="text-sm leading-relaxed">{msg.message}</div>
                  <div className={`text-xs text-right mt-1 ${
                    isSender ? 'text-indigo-200' : 'text-slate-500'
                  }`}>
                    {timeStr}
                  </div>
                </div>
              </div>
            );
          })}
          
          {partnerTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-400 px-4 py-3 rounded-2xl text-sm border border-slate-700">
                <span className="italic">{partner?.name} is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Input Footer */}
        <footer className="px-6 py-4 border-t border-slate-700 bg-slate-800">
          {!connected && (
            <div className="flex items-center gap-2 text-xs text-amber-400 mb-3 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              WebSocket disconnected. Messages will be sent via HTTP.
            </div>
          )}
          <div className="flex items-center gap-3 bg-slate-700 rounded-lg px-4 py-3">
            <input
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-slate-400"
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default ChatInterface;
