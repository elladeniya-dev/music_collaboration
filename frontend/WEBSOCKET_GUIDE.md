# WebSocket Real-Time Chat Guide

## Overview

The Harmonix Collaboration platform uses **WebSocket technology with STOMP protocol** for real-time chat messaging, replacing the previous HTTP polling approach. This provides instant message delivery, typing indicators, and reduced server load.

## Architecture

### Technology Stack

**Backend:**
- Spring Boot WebSocket (`spring-boot-starter-websocket`)
- STOMP messaging protocol
- SockJS fallback for compatibility
- Message broker with `/topic` (broadcast) and `/queue` (user-specific)

**Frontend:**
- `@stomp/stompjs` v7.0.0 - STOMP client library
- `sockjs-client` v1.6.1 - SockJS client for WebSocket fallback
- Custom `websocketService.js` - Singleton WebSocket service
- Custom `useWebSocket.js` React hook - Component-level integration

### Communication Flow

```
┌─────────────┐                  ┌─────────────┐                  ┌─────────────┐
│   User A    │                  │   Backend   │                  │   User B    │
│  (Browser)  │                  │   Server    │                  │  (Browser)  │
└──────┬──────┘                  └──────┬──────┘                  └──────┬──────┘
       │                                │                                │
       │  1. Connect to /ws             │                                │
       ├───────────────────────────────>│                                │
       │  2. Subscribe /topic/chat/{id} │                                │
       ├───────────────────────────────>│                                │
       │                                │  3. Connect to /ws             │
       │                                │<───────────────────────────────┤
       │                                │  4. Subscribe /topic/chat/{id} │
       │                                │<───────────────────────────────┤
       │                                │                                │
       │  5. Send message via           │                                │
       │     /app/chat                  │                                │
       ├───────────────────────────────>│                                │
       │                                │  6. Broadcast to subscribers   │
       │<───────────────────────────────┤───────────────────────────────>│
       │                                │                                │
       │  7. Typing indicator           │                                │
       │     /app/typing                │                                │
       ├───────────────────────────────>│                                │
       │                                │  8. Notify partner             │
       │                                │───────────────────────────────>│
```

## Backend Implementation

### 1. WebSocket Configuration

**File:** `backend/src/main/java/com/harmonix/config/WebSocketConfig.java`

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic", "/queue");
    }
}
```

**Endpoints:**
- `/ws` - WebSocket handshake endpoint with SockJS fallback
- `/app/*` - Application destination prefix for client messages
- `/topic/*` - Topic-based subscriptions (broadcast to all subscribers)
- `/queue/*` - User-specific queue subscriptions

### 2. Message Controller

**File:** `backend/src/main/java/com/harmonix/controller/WebSocketMessageController.java`

```java
@Controller
public class WebSocketMessageController {
    
    @MessageMapping("/chat")
    @SendTo("/topic/chat/{chatId}")
    public Message handleMessage(@Payload Message message, @DestinationVariable String chatId) {
        // Save to database and broadcast
        Message savedMessage = messageService.saveMessage(message);
        messagingTemplate.convertAndSend("/topic/chat/" + chatId, savedMessage);
        return savedMessage;
    }
    
    @MessageMapping("/typing")
    public void handleTyping(@Payload TypingIndicatorDTO typing) {
        // Notify partner that user is typing
        messagingTemplate.convertAndSend(
            "/topic/chat/" + typing.getChatId() + "/typing",
            typing
        );
    }
}
```

**Message Mappings:**
- `/app/chat` → Receives chat messages, saves to DB, broadcasts to `/topic/chat/{chatId}`
- `/app/typing` → Receives typing indicators, broadcasts to partners
- `/app/message/status` → Updates message read/delivered status

## Frontend Implementation

### 1. WebSocket Service (Singleton)

**File:** `frontend/src/services/websocketService.js`

The WebSocket service is a **singleton** that manages the global STOMP client connection.

**Key Features:**
- Single WebSocket connection shared across the app
- Automatic reconnection with exponential backoff
- Subscription management per chat room
- Typing indicator debouncing (500ms)
- Graceful fallback to HTTP when disconnected

**Usage Example:**
```javascript
import { websocketService } from '@/services';

// Connect (usually done once in app lifecycle)
websocketService.connect(token);

// Subscribe to a chat room
const subscription = websocketService.subscribeToChatRoom(
  chatId,
  (message) => {
    console.log('New message:', message);
    // Update UI
  },
  (typing) => {
    console.log('Partner is typing:', typing);
    // Show typing indicator
  }
);

// Send a message
websocketService.sendMessage({
  chatId,
  senderId: userId,
  receiverId: partnerId,
  message: 'Hello!',
});

// Send typing indicator
websocketService.sendTypingIndicator(chatId, userId, true);

// Unsubscribe when leaving chat
websocketService.unsubscribe(chatId);

// Disconnect when logging out
websocketService.disconnect();
```

### 2. useWebSocket Hook

**File:** `frontend/src/hooks/useWebSocket.js`

React hook that provides WebSocket functionality to components.

**Features:**
- Automatic connection on mount
- Automatic subscription to chat room
- Connection status tracking
- Typing indicator state management
- Cleanup on unmount

**Usage Example:**
```javascript
import { useWebSocket } from '@/hooks';

function ChatInterface() {
  const { 
    connected, 
    partnerTyping, 
    sendMessage, 
    handleTyping 
  } = useWebSocket({
    chatId,
    onMessageReceived: (msg) => {
      setMessages(prev => [...prev, msg]);
    }
  });

  return (
    <div>
      {connected ? '🟢 Connected' : '🔴 Disconnected'}
      {partnerTyping && <div>Partner is typing...</div>}
      
      <input 
        onChange={(e) => {
          setMessage(e.target.value);
          handleTyping(); // Send typing indicator
        }}
      />
      
      <button onClick={() => sendMessage(message)}>
        Send
      </button>
    </div>
  );
}
```

### 3. ChatInterface Integration

**File:** `frontend/src/pages/ChatInterface.jsx`

The main chat component uses the `useWebSocket` hook:

```javascript
const { 
  connected, 
  partnerTyping, 
  sendMessage: sendViaWebSocket, 
  handleTyping 
} = useWebSocket({
  chatId: activeChatId,
  onMessageReceived: handleMessageReceived,
});

// Send message via WebSocket (with HTTP fallback)
const sendMessage = async () => {
  if (!message.trim() || !partnerId) return;
  
  const newMessage = {
    chatId: activeChatId,
    senderId: getUserId(user),
    receiverId: partnerId,
    message: message.trim(),
    timestamp: new Date().toISOString(),
  };

  try {
    // Try WebSocket first
    if (connected) {
      await sendViaWebSocket(message.trim());
    } else {
      // Fallback to HTTP
      await chatService.sendMessage(newMessage);
    }
    setMessage('');
  } catch (error) {
    showAlert('Error sending message', 'error');
  }
};

// Input with typing indicator
<input
  value={message}
  onChange={(e) => {
    setMessage(e.target.value);
    handleTyping(); // Sends typing indicator via WebSocket
  }}
  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
/>
```

## Configuration

### Environment Variables

**File:** `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws
```

### Package Dependencies

**File:** `frontend/package.json`

```json
{
  "dependencies": {
    "@stomp/stompjs": "^7.0.0",
    "sockjs-client": "^1.6.1"
  }
}
```

Install dependencies:
```bash
cd frontend
npm install
```

## Benefits Over HTTP Polling

| Feature | HTTP Polling (Old) | WebSocket (New) |
|---------|-------------------|-----------------|
| **Latency** | 2-3 seconds delay | Instant (<50ms) |
| **Server Load** | High (requests every 2s) | Low (persistent connection) |
| **Bandwidth** | High (full HTTP headers each request) | Low (binary frames) |
| **Real-time** | ❌ Pseudo real-time | ✅ True real-time |
| **Typing Indicators** | ❌ Not possible | ✅ Supported |
| **Scalability** | ⚠️ Limited | ✅ Excellent |
| **Battery Usage** | ⚠️ High (mobile) | ✅ Low |

**Example Calculation:**
- **Polling:** 30 requests/minute × 500 bytes = 15 KB/min
- **WebSocket:** 1 connection + messages only = ~1 KB/min
- **Savings:** ~93% reduction in data transfer

## Troubleshooting

### Connection Issues

**Problem:** WebSocket connection fails

**Solutions:**
1. Check `VITE_WS_URL` in `.env` file
2. Verify backend is running on port 8080
3. Check CORS configuration in `WebSocketConfig.java`
4. Look for SockJS fallback activation (works over HTTP)

**Debug:**
```javascript
websocketService.connect(token, {
  debug: (str) => console.log('STOMP Debug:', str)
});
```

### Messages Not Receiving

**Problem:** Sent messages don't appear for other users

**Solutions:**
1. Verify both users are subscribed to the same chat ID
2. Check backend logs for message routing errors
3. Ensure `chatId` is consistent between users
4. Verify message controller `@SendTo` destination

**Debug:**
```javascript
// In ChatInterface.jsx
useEffect(() => {
  console.log('Subscribed to chat:', activeChatId);
}, [activeChatId]);
```

### Typing Indicators Not Working

**Problem:** Partner typing status not updating

**Solutions:**
1. Check debounce timing (500ms default)
2. Verify typing destination: `/topic/chat/{chatId}/typing`
3. Ensure `handleTyping()` is called on input change
4. Check `partnerTyping` state updates

**Debug:**
```javascript
// In useWebSocket.js - add console logs
const handleTyping = useCallback(() => {
  console.log('Typing indicator sent for chat:', chatId);
  websocketService.sendTypingIndicator(chatId, getUserId(user), true);
}, [chatId, user]);
```

### Reconnection Issues

**Problem:** WebSocket doesn't reconnect after disconnect

**Solutions:**
1. Check `reconnectDelay` configuration (starts at 1000ms)
2. Verify no manual `disconnect()` calls blocking reconnection
3. Look for `maxReconnectAttempts` limit (default: 5)
4. Check browser console for reconnection errors

**Debug:**
```javascript
// In websocketService.js
reconnect: false, // Disable auto-reconnect for testing
```

## Performance Optimization

### 1. Connection Pooling

WebSocket service uses a singleton pattern to prevent multiple connections:

```javascript
// ✅ Good - Single connection
const websocketService = new WebSocketService();
export default websocketService;

// ❌ Bad - Multiple connections
export default new WebSocketService(); // Creates new instance each import
```

### 2. Subscription Management

Unsubscribe from rooms when leaving:

```javascript
useEffect(() => {
  return () => {
    if (activeChatId) {
      websocketService.unsubscribe(activeChatId);
    }
  };
}, [activeChatId]);
```

### 3. Message Batching

For high-frequency updates, consider batching:

```javascript
const messageQueue = [];
const flushInterval = 100; // ms

const queueMessage = (msg) => {
  messageQueue.push(msg);
  if (messageQueue.length === 1) {
    setTimeout(() => {
      const batch = [...messageQueue];
      messageQueue.length = 0;
      sendBatch(batch);
    }, flushInterval);
  }
};
```

### 4. Typing Indicator Debouncing

Already implemented in `websocketService.js`:

```javascript
typingDebounce: null,
debounceTime: 500, // ms

sendTypingIndicator(chatId, userId, isTyping) {
  if (this.typingDebounce) {
    clearTimeout(this.typingDebounce);
  }
  
  this.typingDebounce = setTimeout(() => {
    this.stompClient.send('/app/typing', {}, JSON.stringify({
      chatId, userId, isTyping
    }));
  }, this.debounceTime);
}
```

## Security Considerations

### 1. Authentication

WebSocket connections are authenticated using JWT tokens:

```javascript
websocketService.connect(authToken);
```

The token is validated on the backend before establishing the connection.

### 2. Authorization

Users can only subscribe to chat rooms they're members of:

```java
@MessageMapping("/chat")
public Message handleMessage(@Payload Message message, Principal principal) {
    // Verify user is authorized to send to this chat
    if (!chatService.isUserInChat(principal.getName(), message.getChatId())) {
        throw new UnauthorizedException("Not authorized");
    }
    // ... send message
}
```

### 3. Message Validation

All messages are validated before broadcasting:

```java
@MessageMapping("/chat")
public Message handleMessage(@Valid @Payload Message message) {
    // @Valid annotation ensures message meets validation constraints
    // - Non-empty message
    // - Valid chat ID
    // - Valid user IDs
}
```

### 4. Rate Limiting

Implement rate limiting to prevent message spam:

```java
@Configuration
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new RateLimitInterceptor());
    }
}
```

## Testing

### Manual Testing

1. **Connection Test:**
   ```javascript
   // Open browser console
   websocketService.connect(token);
   // Check for "WebSocket Connected!" log
   ```

2. **Message Test:**
   - Open two browser windows with different users
   - Send message from User A
   - Verify User B receives instantly

3. **Typing Indicator Test:**
   - Start typing in User A's chat
   - Verify "is typing..." appears for User B within 500ms
   - Stop typing for 3 seconds
   - Verify typing indicator disappears

### Automated Testing

**Example test with Jest:**

```javascript
import { websocketService } from '@/services';

describe('WebSocket Service', () => {
  it('should connect successfully', async () => {
    const token = 'mock-jwt-token';
    await websocketService.connect(token);
    expect(websocketService.isConnected()).toBe(true);
  });

  it('should send message', async () => {
    const message = { chatId: '123', message: 'Test' };
    await websocketService.sendMessage(message);
    // Verify message sent
  });
});
```

## Migration from Polling

### Before (HTTP Polling)

```javascript
// ❌ Old polling approach
useEffect(() => {
  if (!activeChatId) return;
  
  const interval = setInterval(async () => {
    const msgs = await chatService.getMessages(activeChatId);
    setMessages(msgs);
  }, 2000); // Poll every 2 seconds
  
  return () => clearInterval(interval);
}, [activeChatId]);
```

**Issues:**
- 30 requests per minute per user
- 2-3 second message delay
- High server load
- Poor battery life on mobile
- No typing indicators

### After (WebSocket)

```javascript
// ✅ New WebSocket approach
const { connected, sendMessage } = useWebSocket({
  chatId: activeChatId,
  onMessageReceived: (msg) => {
    setMessages(prev => [...prev, msg]);
  }
});
```

**Benefits:**
- 1 persistent connection
- <50ms message delay
- Minimal server load
- Excellent battery life
- Typing indicators supported

## Best Practices

1. **Always clean up subscriptions:**
   ```javascript
   useEffect(() => {
     return () => websocketService.unsubscribe(chatId);
   }, [chatId]);
   ```

2. **Handle disconnections gracefully:**
   ```javascript
   if (connected) {
     sendViaWebSocket(message);
   } else {
     // Fallback to HTTP
     await chatService.sendMessage(message);
   }
   ```

3. **Debounce high-frequency events:**
   ```javascript
   const handleTyping = debounce(() => {
     websocketService.sendTypingIndicator(chatId, userId, true);
   }, 500);
   ```

4. **Show connection status to users:**
   ```jsx
   {connected ? '🟢 Connected' : '🔴 Disconnected'}
   ```

5. **Log errors for debugging:**
   ```javascript
   onError: (error) => {
     console.error('WebSocket error:', error);
     // Send to error tracking service
   }
   ```

## Additional Resources

- [STOMP Protocol Specification](https://stomp.github.io/)
- [Spring WebSocket Documentation](https://docs.spring.io/spring-framework/reference/web/websocket.html)
- [SockJS Client API](https://github.com/sockjs/sockjs-client)
- [@stomp/stompjs Documentation](https://stomp-js.github.io/stomp-websocket/)

## Support

For issues or questions:
1. Check backend logs: `backend/logs/spring.log`
2. Check browser console for WebSocket errors
3. Review this guide's Troubleshooting section
4. Contact the development team

---

**Last Updated:** January 2025
**Version:** 1.0.0
**Author:** Harmonix Development Team
