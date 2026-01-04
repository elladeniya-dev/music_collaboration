import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, IconButton, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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

  if (loadingUser) return <div className="text-center mt-10">Loading...</div>;
  if (!getUserId(user)) return <div className="text-center mt-10 text-red-600">Login required</div>;

  return (
    <div className="w-full h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-gray-200 overflow-y-auto">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold">Chats</h2>
          <button
            onClick={startNewChat}
            title="Start New Chat"
            className="text-blue-600 text-lg font-bold hover:scale-110"
          >
            +
          </button>
        </div>
        <ul>
          {chatHeads.map((chat) => {
            const uid = getUserId(user);
            const pid = chat.participants.find(p => p !== uid);
            const partner = userMap[pid];

            return (
              <li
                key={chat._id || chat.id}
                className="px-4 py-3 hover:bg-gray-100 flex items-center justify-between transition w-full"
              >
                <div
                  onClick={() => navigate(`/chat/${pid}`)}
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                >
                  <Avatar src={partner?.profileImage} className="w-10 h-10">{partner?.name?.[0]}</Avatar>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">{partner?.name}</div>
                    <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
                  </div>
                </div>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(pid);
                  }}
                  className="ml-2"
                  sx={{ minWidth: 'auto' }}
                  title="Delete chat"
                >
                  <DeleteIcon fontSize="small" className="text-red-600 hover:text-red-800" />
                </IconButton>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Chat Area */}
      <section className="max-w-[100%] flex-1 flex flex-col bg-gray-50">
        <header className="h-16 px-6 flex items-center justify-between border-b border-gray-200 bg-white">
          <h2 className="text-base font-bold text-gray-800">{partner?.name || 'Select a conversation'}</h2>
          {partnerId && (
            <Chip 
              label={connected ? '🟢 Connected' : '🔴 Disconnected'} 
              size="small" 
              color={connected ? 'success' : 'default'}
              variant="outlined"
            />
          )}
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar bg-gray-50">
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
                <div className={`max-w-[100%] px-5 py-3 rounded-2xl text-[1rem] shadow-sm leading-relaxed ${
                  isSender ? 'bg-[#072d3a] text-white' : 'bg-white text-gray-800 border border-gray-200'
                }`}>
                  <div>{msg.message}</div>
                  <div className="text-[0.7rem] text-right mt-2 text-gray-400">{timeStr}</div>
                </div>
              </div>
            );
          })}
          {partnerTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-600 px-5 py-3 rounded-2xl text-sm border border-gray-200">
                <span className="italic">{partner?.name} is typing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <footer className="px-6 py-3 border-t border-gray-200 bg-white">
          {!connected && (
            <div className="text-xs text-amber-600 mb-2">
              ⚠️ WebSocket disconnected. Messages will be sent via HTTP.
            </div>
          )}
          <div className="flex items-center w-full bg-gray-100 rounded-full px-4 py-2">
            <input
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
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
              className="ml-4 text-blue-600 font-bold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
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
