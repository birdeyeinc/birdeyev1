# Copilot Component Context Guide

This document provides comprehensive context for the Copilot chat component system for GitHub Copilot assistance.

## Component Architecture

### Main Components
- **Copilot** (index.jsx) - Main wrapper component with provider
- **CopilotContent** - Core content component handling initialization and Firebase
- **CopilotHeader** - Header with title, new chat, history controls
- **CopilotBody** - Message display area with chat history
- **CopilotFooter** - Input area for user messages
- **MessageComponents** - Various message type renderers

### Directory Structure
```
src/components/Copilot/
├── index.jsx                    # Main component and provider wrapper
├── components/
│   ├── CopilotHeader.jsx       # Header with controls
│   ├── CopilotBody.jsx         # Message display area
│   ├── CopilotFooter.jsx       # Input area
│   ├── MessageComponents.jsx   # Message type components
│   └── ChatHistory.jsx         # Chat history view
├── context/
│   └── CopilotContext.jsx      # React context for state management
├── styles/
│   └── copilot.module.scss     # Component styles
├── utils/
│   └── commonStorage.js        # IndexedDB utilities
└── assets/
    ├── icons/                  # Avatar and UI icons
    └── gif/                    # Loading animations
```

## Core Functionality

### Message Types
The component supports various message types through MessageComponents:

```jsx
// Message type components available
const messageTypes = {
  text: TextBlock,           // Markdown text content
  error: ErrorBlock,         // Error messages with red styling
  heading: HeadingBlock,     // H1-H6 headings
  image: ImageBlock,         // Image display
  card: CardBlock,           // Card with title/content/highlights
  suggestions: SuggestionButtons,  // Clickable suggestion buttons
  actions: ActionButtons,    // Accept/Reject buttons
  fileHandle: FileHandleBlock,     // File upload/selection
  inputLabel: InputLabelBlock,     // Input form
  select: SelectComponent,         // Dropdown selection
  divider: Divider,               // Visual separator
  "custom-field-mapping": CustomFieldSelectComponent
};
```

### Key Props

#### Main Copilot Component Props
```jsx
<Copilot
  // UI Configuration
  title="Copilot"
  placeholder="Enter a prompt here"
  secondaryPlaceholder="Ask anything"  // Shown after first message
  className=""
  maintainHistory={false}
  showHeader={true}
  showCloseIcon={true}
  emptyStateText="How can I help you today?"

  // Event Handlers
  onClose={() => {}}
  onNewChat={() => {}}
  onViewHistory={() => {}}
  onInit={() => ({})}          // Returns initial context
  onAccept={(payload) => {}}
  onReject={(payload) => {}}
  promptCallBack={(prompt) => {}}
  onFileHandleClick={(action, callback) => {}}
  selectRenderer={(options) => options}
  imageS3Callback={(data) => Promise<string>}
  onApplyChanges={(data) => {}}
  onItemClick={(action, callback) => {}}

  // API Configuration
  apiHelper={beAPIResource}    // API helper instance
  apiEndPoints={{
    init: { method: 'post', url: '/api/init' }
  }}
  payloadPreprocessor={(payload) => payload}

  // Firebase Configuration
  firebaseHelper={() => Promise<database>}  // Returns Firebase database
  userId="user123"
  accountId="account456"
  sessionId="session789"
  uniqueSessionId="unique123"

  // Storage Configuration
  indexDbName="copilotStore"
  loadingTimeoutDuration={90000}  // 90 seconds
/>
```

### Message Structure

#### Single Message
```jsx
const message = {
  id: "msg_123",
  type: "text",               // Message type
  content: "Hello world",     // Text content
  sender: "bot" | "user",     // Message sender
  timestamp: Date.now(),
  
  // Optional for bot messages
  blocks: [                   // Multiple content blocks
    { type: "text", content: "First block" },
    { type: "suggestions", options: ["Option 1", "Option 2"] }
  ]
};
```

#### Firebase Response Structure
```jsx
const firebaseResponse = {
  status: {
    processing: boolean,      // Loading state
    label: string,           // Loading message
    error: {                 // Error object (optional)
      code: number,
      message: string
    }
  },
  blocks: [                  // Message content blocks
    {
      type: "text",
      content: "Response text"
    },
    {
      type: "suggestions",
      options: [
        { label: "Option 1", prompt: "Send this to API" },
        "Simple option"
      ]
    }
  ]
};
```

### State Management

#### Context State
```jsx
const contextState = {
  messages: [],              // Array of message objects
  isLoading: boolean,        // Global loading state
  loadingMessage: string,    // Loading text
  showHistory: boolean,      // History view toggle
  chatHistory: [],          // Previous chat sessions
  shouldClearDivider: boolean, // New message divider control
};
```

#### Message State Management
Messages have persistent state for interactive components:
- `suggestionState` - Selected suggestion tracking
- `actionState` - Accept/reject button state
- `fileHandleState` - File upload completion
- `inputLabelState` - Form submission tracking
- `selectState` - Dropdown selection tracking

### Key Features

#### Loading States
- Global loading with custom messages
- Loading GIF animation (Pre-comp.gif)
- 90-second timeout handling
- Firebase real-time status updates

#### Message Interaction
- Suggestion buttons with one-time selection
- Accept/reject actions with payload callbacks
- File upload handling with S3 integration
- Form inputs with submission tracking
- Disabled state for used components

#### Chat History
- IndexedDB persistence
- Session-based storage
- History view toggle
- Chat restoration on reload

#### Input Handling
- ContentEditable input with rich text
- Enter to send, Shift+Enter for new line
- Auto-focus after sending
- Dynamic placeholder text
- Multi-line message support

### Styling Classes

#### Key SCSS Classes
```scss
.copilotWrapper          // Main container
.chatContainer          // Chat box container
.chatHeader             // Header section
.chatBody               // Message area
.chatFooter             // Input area
.messageWrapper         // Individual message container
.userMessage            // User message styling
.botMessage             // Bot message styling
.messageContent         // Message content area
.chatText               // Text message content
.chatError              // Error message styling (#FEECEB background)
.chatSuggestions        // Suggestion buttons container
.chatActions            // Accept/reject buttons
.loadingMessage         // Loading state
.loadingContent         // Loading container
.loadingGif             // Loading animation
.newMessageDivider      // New message separator
.emptyState             // Empty chat state
```

#### Error Message Styling
```scss
.chatError {
  background: #FEECEB;     // Light red background
  border-radius: 4px;
  padding: 8px;
  color: #721C24;          // Dark red text
  line-height: 1.5;
}
```

### Common Patterns

#### Adding New Message Types
1. Create component in MessageComponents.jsx
2. Add to getComponentRegistry function
3. Add corresponding SCSS styles
4. Update this context document

#### Handling Firebase Responses
```jsx
// Standard success response
{
  status: { processing: false },
  blocks: [
    { type: "text", content: "Success message" },
    { type: "suggestions", options: ["Next step"] }
  ]
}

// Error response
{
  status: {
    processing: false,
    error: { code: 400, message: "Error details" }
  },
  blocks: []
}

// Loading response
{
  status: {
    processing: true,
    label: "Processing your request..."
  }
}
```

#### Custom Component Integration
```jsx
// In parent component
const handleFileUpload = (action, callback) => {
  // Handle file selection
  const fileUrl = await uploadToS3(file);
  callback(fileUrl); // Triggers prompt with file URL
};

const handleImageS3 = async (data) => {
  const s3Url = await processImageUpload(data);
  return s3Url;
};

<Copilot
  onFileHandleClick={handleFileUpload}
  imageS3Callback={handleImageS3}
  // ... other props
/>
```

### Best Practices

1. **Message IDs**: Always provide unique message IDs for state tracking
2. **Error Handling**: Use error type messages for user-facing errors
3. **Loading States**: Provide meaningful loading messages
4. **Accessibility**: Include proper alt text and ARIA labels
5. **Performance**: Minimize Firebase listener updates
6. **State Persistence**: Use IndexedDB for chat history
7. **User Experience**: Auto-focus input, show loading states
8. **Responsive Design**: Handle mobile/desktop layouts

### Integration Examples

#### Basic Chat
```jsx
<Copilot
  title="Assistant"
  placeholder="How can I help you?"
  apiHelper={apiService}
  apiEndPoints={{ init: { method: 'post', url: '/chat/init' } }}
  firebaseHelper={getFirebaseDB}
  userId={currentUser.id}
  accountId={currentAccount.id}
  sessionId={chatSession.id}
/>
```

#### With Custom Handlers
```jsx
<Copilot
  onAccept={(payload) => applyChanges(payload)}
  onReject={(payload) => rejectChanges(payload)}
  promptCallBack={(prompt) => logUserPrompt(prompt)}
  selectRenderer={(options) => transformOptions(options)}
  imageS3Callback={(data) => uploadImage(data)}
/>
```

This context should provide GitHub Copilot with comprehensive understanding of the component structure, usage patterns, and implementation details.
