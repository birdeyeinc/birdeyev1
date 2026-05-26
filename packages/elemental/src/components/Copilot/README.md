# Copilot Component

A fully-featured chat interface component with context-based state management.

## Features

- 📱 Modern chat interface with header, body, and footer
- 🔄 Context-based state management for chat data
- 💬 Real-time message display with user/bot differentiation
- ⌨️ Text input with send functionality
- 🔄 Loading states and typing indicators
- 🎨 Responsive design with modern styling
- 🗑️ Clear chat functionality
- ❌ Optional close handler

## Basic Usage

```jsx
import Copilot from './components/Copilot'

function App() {
  return (
    <Copilot 
      title="Customer Support"
      placeholder="How can we help you?"
      onClose={() => console.log('Chat closed')}
    />
  )
}
```

## Advanced Usage with External Context

If you need to access the chat context from outside the component:

```jsx
import { ChatProvider, useChat } from './components/Copilot/ChatContext'
import Copilot from './components/Copilot'

function ChatPage() {
  return (
    <ChatProvider>
      <div>
        <ChatControls />
        <Copilot title="Support Chat" />
      </div>
    </ChatProvider>
  )
}

function ChatControls() {
  const { messages, clearMessages, addMessage } = useChat()
  
  const handleAddSystemMessage = () => {
    addMessage({
      text: "System: How can I help you today?",
      sender: 'bot'
    })
  }
  
  return (
    <div>
      <p>Messages: {messages.length}</p>
      <button onClick={clearMessages}>Clear All</button>
      <button onClick={handleAddSystemMessage}>Add System Message</button>
    </div>
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Chat Assistant" | Title displayed in the chat header |
| `placeholder` | string | "Type your message..." | Placeholder text for the input field |
| `onClose` | function | undefined | Callback function when close button is clicked |
| `className` | string | "" | Additional CSS class name |

## Context API

The component uses React Context to manage chat state. The context provides:

### State
- `messages`: Array of chat messages
- `isLoading`: Boolean indicating if bot is responding
- `error`: Error message if any

### Actions
- `addMessage(message)`: Add a new message
- `setLoading(boolean)`: Set loading state
- `setError(error)`: Set error state
- `clearMessages()`: Clear all messages
- `sendBotMessage(userMessage)`: Trigger bot response

### Message Format
```javascript
{
  id: "unique_id",
  text: "Message content",
  sender: "user" | "bot",
  timestamp: "ISO_string"
}
```

## Styling

The component uses CSS modules for styling. You can override styles by:

1. Using the `className` prop
2. Creating custom CSS that targets the component classes
3. Modifying the `copilot.module.scss` file directly

## Customization

### Custom Bot Responses

You can customize the bot response logic by modifying the `generateBotResponse` function in `ChatContext.jsx`:

```jsx
const generateBotResponse = (userMessage) => {
  // Your custom logic here
  if (userMessage.toLowerCase().includes('hello')) {
    return "Hi there! How can I help you?"
  }
  // ... more logic
}
```

### Custom Styling

The component supports responsive design and can be easily customized through SCSS variables or CSS custom properties.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills for modern JavaScript features)

## Dependencies

- React 16.8+ (for hooks)
- CSS Modules support in your build system
