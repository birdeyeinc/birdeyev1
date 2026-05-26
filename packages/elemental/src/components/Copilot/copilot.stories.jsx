import React from "react";
import Copilot from "./index";

export default {
  title: "Component/Copilot",
  component: Copilot,
  argTypes: {
    title: {
      control: { type: "text" },
      description: "Title displayed in the chat header",
    },
    module: {
      control: { type: "text" },
      description: "Module identifier for the copilot instance (e.g., 'reports', 'dashboard')",
    },
    placeholder: {
      control: { type: "text" },
      description: "Primary placeholder text for the input field",
    },
    secondaryPlaceholder: {
      control: { type: "text" },
      description: "Secondary placeholder text shown as fallback when primary placeholder is not provided",
    },
    uniqueSessionId: {
      control: { type: "text" },
      description: "Unique session identifier for the user session (format: 'chat/{module}-{sessionToken}')",
    },
    userId: {
      control: { type: "text" },
      description: "User ID from BE.user.id (Number)",
    },
    accountId: {
      control: { type: "text" },
      description: "Account/Business ID from BE.business.id (Number)",
    },
    sessionId: {
      control: { type: "text" },
      description: "Session token from BE.user.sessionToken",
    },
    uniqueId: {
      control: { type: "text" },
      description: "Unique ID for Firebase path generation",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS class name",
    },
    maintainHistory: {
      control: { type: "boolean" },
      description: "Whether to maintain chat history in memory",
    },
    showHeader: {
      control: { type: "boolean" },
      description: "Whether to show the chat header",
    },
    showCloseIcon: {
      control: { type: "boolean" },
      description: "Whether to show the close icon in header",
    },
    emptyStateText: {
      control: { type: "text" },
      description: "Text to display when there are no messages (e.g., 'Reportmate is your AI copilot for smart chart summaries...')",
    },
    indexDbName: {
      control: { type: "text" },
      description: "Name for IndexedDB storage (e.g., 'reportmateCopilotDB')",
    },
    loadingTimeoutDuration: {
      control: { type: "number" },
      description: "Loading timeout duration in milliseconds (defaults to 90000)",
    },
    currentContext: {
      description: "Current context object with reports, filters, user info passed to API calls",
    },
    apiHelper: {
      description: "API resource object (beAPIResource) with methods like get, post, etc.",
    },
    apiEndPoints: {
      description: "Configuration object for API endpoints with init and sendPrompt methods pointing to '/copilots/reportmate/chat'",
    },
    payloadPreprocessor: {
      description: "Function to preprocess API payloads before sending - adds context, userId, accountId, uniqueSessionId, requestTimeout, timestamp, and prompt",
    },
    firebaseHelper: {
      description: "Function that returns Firebase database instance (getDbInstance)",
    },
    indexDbHelper: {
      description: "Object with IndexedDB methods: get, set, delete, getAllKeys, deleteStore",
    },
    onClose: {
      action: "onClose",
      description: "Callback function when close button is clicked - typically hides copilot and updates layout",
    },
    onOpen: {
      action: "onOpen",
      description: "Callback function when copilot is opened",
    },
    onNewChat: {
      action: "onNewChat",
      description: "Callback function when new chat button is clicked",
    },
    onViewHistory: {
      action: "onViewHistory",
      description: "Callback function when view history button is clicked",
    },
    onInit: {
      action: "onInit",
      description: "Callback function when copilot initializes - returns context with reports, filters, user info",
    },
    onAccept: {
      action: "onAccept",
      description: "Callback function when user accepts a suggestion - receives payload to apply on UI side from LLM",
    },
    onReject: {
      action: "onReject",
      description: "Callback function when user rejects a suggestion",
    },
    onSuggestionSelect: {
      action: "onSuggestionSelect",
      description: "Callback function when user selects a suggestion (alias for promptCallBack)",
    },
    promptCallBack: {
      action: "promptCallBack",
      description: "Callback function when user selects any component which has to return a prompt",
    },
    selectRenderer: {
      control: { type: "function" },
      description: "Custom select renderer for list components",
    },
    imageS3Callback: {
      action: "imageS3Callback",
      description: "Callback function when a file is selected from an external source and returns an image URL",
    },
    onApplyChanges: {
      action: "onApplyChanges",
      description: "Callback function to apply changes after user interaction",
    },
    onFileHandleClick: {
      action: "onFileHandleClick",
      description: "Callback function when file handle actions are clicked",
    },
    shouldShowPortal: {
      control: { type: "boolean" },
      description: "Whether to show the copilot portal (controlled by showCopilot state)",
    },
    showModelSelector: {
      control: { type: "boolean" },
      description: "Whether to show the model selector dropdown in the copilot footer",
    },
    showDesignSelector: {
      control: { type: "boolean" },
      description: "Whether to show the design selector dropdown in the copilot footer",
    },
    modelSelectorOptions: {
      control: { type: "array" },
      description: "Options for the model selector dropdown in the copilot footer - array of { value, label } objects",
    },
    designSelectorOptions: {
      control: { type: "array" },
      description: "Options for the design selector dropdown in the copilot footer - array of { value, label } objects",
    },
  },
};

export const Default = (args) => <Copilot {...args} />;

Default.args = {
  title: "Chat Assistant",
  placeholder: "Type your message...",
  userId: "default_user",
  accountId: "default_account",
  uniqueSessionId: "default_session",
  maintainHistory: true,
  
  apiHelper: {
    post: async (url, payload, options) => {
      console.log("Mock POST API called:", url, payload, options);
      return {
        success: true,
        message: "API call successful",
        data: {
          responseId: `resp_${Date.now()}`,
          firebasePath: "mock/firebase/path"
        }
      };
    }
  },
  
  apiEndPoints: {
    init: {
      method: "post",
      url: "/api/copilot/init"
    },
    sendPrompt: {
      method: "post", 
      url: "/api/copilot/send"
    }
  },
  
  firebaseHelper: async () => ({
    ref: () => ({
      on: (event, callback) => {
        setTimeout(() => {
          callback({
            val: () => ({
              messages: [
                {
                  type: "text",
                  content: "Hello! How can I help you today?",
                  sender: "bot"
                }
              ]
            })
          });
        }, 1000);
      },
      off: () => console.log("Firebase off")
    })
  }),
  
  indexDbHelper: {
    get: () => Promise.resolve(null),
    set: () => Promise.resolve(),
    delete: () => Promise.resolve(),
    getAllKeys: () => Promise.resolve([]),
    deleteStore: () => Promise.resolve()
  },
  
  onApplyChanges: (data) => {
    console.log("Applying changes with data:", data);
  }
};

export const CustomTitle = (args) => <Copilot {...args} />;

CustomTitle.args = {
  title: "Customer Support",
  placeholder: "How can we help you today?",
  userId: "support_user",
  accountId: "support_account",
  uniqueSessionId: "support_session",
  
  apiHelper: { post: async () => ({ success: true }) },
  apiEndPoints: { 
    init: { method: "post", url: "/api/init" },
    sendPrompt: { method: "post", url: "/api/send" }
  },
  
  firebaseHelper: async () => ({
    ref: () => ({
      on: (event, callback) => {},
      off: () => {}
    })
  }),
  
  indexDbHelper: {
    get: () => Promise.resolve(null),
    set: () => Promise.resolve(),
    delete: () => Promise.resolve(),
    getAllKeys: () => Promise.resolve([]),
    deleteStore: () => Promise.resolve()
  }
};

export const WithAllActions = (args) => <Copilot {...args} />;

WithAllActions.args = {
  title: "Help Center",
  placeholder: "Ask me anything...",
  userId: "help_user",
  accountId: "help_account",
  uniqueSessionId: "help_session",
  
  apiHelper: { post: async () => ({ success: true }) },
  apiEndPoints: { 
    init: { method: "post", url: "/api/init" },
    sendPrompt: { method: "post", url: "/api/send" }
  },
  
  firebaseHelper: async () => ({
    ref: () => ({
      on: (event, callback) => {},
      off: () => {}
    })
  }),
  
  indexDbHelper: {
    get: () => Promise.resolve(null),
    set: () => Promise.resolve(),
    delete: () => Promise.resolve(),
    getAllKeys: () => Promise.resolve([]),
    deleteStore: () => Promise.resolve()
  },
  
  onClose: () => alert("Chat closed!"),
  onNewChat: () => alert("Starting new chat!"),
  onViewHistory: () => alert("Opening chat history!"),
};

export const Compact = (args) => (
  <div style={{ width: "300px", height: "400px" }}>
    <Copilot {...args} />
  </div>
);

Compact.args = {
  title: "Copilot",
  placeholder: "Quick question?",
  userId: "compact_user",
  accountId: "compact_account",
  uniqueSessionId: "compact_session",
  
  apiHelper: { post: async () => ({ success: true }) },
  apiEndPoints: { 
    init: { method: "post", url: "/api/init" },
    sendPrompt: { method: "post", url: "/api/send" }
  },
  
  firebaseHelper: async () => ({
    ref: () => ({
      on: (event, callback) => {},
      off: () => {}
    })
  }),
  
  indexDbHelper: {
    get: () => Promise.resolve(null),
    set: () => Promise.resolve(),
    delete: () => Promise.resolve(),
    getAllKeys: () => Promise.resolve([]),
    deleteStore: () => Promise.resolve()
  }
};

// Story demonstrating different loading timeout configurations
export const CustomLoadingTimeout = (args) => <Copilot {...args} />;

CustomLoadingTimeout.args = {
  title: "Fast Response Copilot",
  placeholder: "Quick responses expected...",
  userId: "timeout_user",
  accountId: "timeout_account",
  uniqueSessionId: "timeout_session",
  maintainHistory: false,
  loadingTimeoutDuration: 30000, // 30-second timeout for fast responses
  
  apiHelper: {
    post: async (url, payload) => {
      console.log("Mock API with custom timeout:", payload);
      // Simulate a longer delay to test timeout
      await new Promise(resolve => setTimeout(resolve, 35000)); // 35 seconds
      return { success: true };
    }
  },
  
  apiEndPoints: {
    init: {
      method: "post",
      url: "/api/init"
    },
    sendPrompt: {
      method: "post",
      url: "/api/send"
    }
  },
  
  firebaseHelper: async () => ({
    ref: () => ({
      on: (event, callback) => {
        // Simulate processing status that takes longer than timeout
        setTimeout(() => {
          callback({
            val: () => ({
              status: { processing: true, label: "Analyzing your request..." },
              initial: false
            })
          });
        }, 1000);
        
        // Never send completion to test timeout
      },
      off: () => console.log("Firebase off")
    })
  }),
  
  indexDbHelper: {
    get: () => Promise.resolve(null),
    set: () => Promise.resolve(),
    delete: () => Promise.resolve(),
    getAllKeys: () => Promise.resolve([]),
    deleteStore: () => Promise.resolve()
  },
  
  onInit: () => ({
    fastResponse: true,
    timeout: "30s"
  })
};

// Full Report Mate Configuration Story
export const ReportMateFullConfig = (args) => <Copilot {...args} />;

ReportMateFullConfig.args = {
  title: "Report mate",
  module: "reports",
  placeholder: "Ask me anything about your reports",
  uniqueSessionId: "user123-business456-session789",
  userId: "user123",
  maintainHistory: true,
  accountId: "account456",
  shouldShowPortal: true,
  showModelSelector: false,
  showDesignSelector: false,
  modelSelectorOptions: [],
  designSelectorOptions: [],
  currentContext: {
    reportFilters: {
      dateRange: { start: "2024-01-01", end: "2024-12-31" },
      reportType: "analytics",
      department: "sales"
    },
    businessMetrics: {
      revenue: 485000,
      growth: 23,
      customers: 89
    }
  },
  payloadPreprocessor: (payload) => {
    console.log("Processing payload:", payload);
    // Mock filter data and reports config
    const mockFilterData = {
      dateRange: { start: "2024-01-01", end: "2024-12-31" },
      reportType: "analytics",
      department: "sales",
    };
    const mockReportsConfig = {
      salesReport: { type: "chart", data: "sales_data" },
      analyticsReport: { type: "table", data: "analytics_data" },
    };

    return {
      ...payload,
      filterData: mockFilterData,
      reportsConfig: mockReportsConfig,
      headerLabel: "Sales Dashboard",
      module: "reports", // ✅ Use the hardcoded value instead of args.module
      currentRoute: "/dashboard/reports",
    };
  },
  apiHelper: {
    post: async (url, payload, options) => {
      console.log("Mock POST API called:", url, payload, options);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { type: "heading", level: 2, content: "👋 Welcome to Reports!" },
            {
              type: "text",
              content:
                "Hi! I’m here to make reporting easier. How can I help you today?",
            },
            {
              type: "suggestions",
              options: [
                {
                  label: "Why is there a dip in rating since June?",
                  prompt: "generate negative review analysis for June ratings dip"
                },
                {
                  label: "Show review sentiment for Jun to Aug",
                  prompt: "generate survey score analysis for June to August period"
                },
                {
                  label: "Do you want to show report from aug to sep?",
                  prompt: "generate report for August to September period"
                }
              ],
            },
          ]);
        }, 1000);
      });
    }
  },
  
  apiEndPoints: {
    init: {
      method: "post",
      url: "/api/copilot/init"
    },
    sendPrompt: {
      method: "post", 
      url: "/api/copilot/send"
    }
  },
  indexDbHelper: {
    get: (key) => {
      console.log("IndexDB get:", key);
      return Promise.resolve(null);
    },
    set: (key, value) => {
      console.log("IndexDB set:", key, value);
      return Promise.resolve();
    },
    delete: (key) => {
      console.log("IndexDB delete:", key);
      return Promise.resolve();
    },
    getAllKeys: () => {
      console.log("IndexDB getAllKeys");
      return Promise.resolve([]);
    },
    deleteStore: () => {
      console.log("IndexDB deleteStore");
      return Promise.resolve();
    },
  },
  firebaseHelper: {},
  onOpen: () => {
    console.log("Copilot opened from story");
  },
  onClose: () => {
    console.log("Copilot closed from story");
  },
  onInit: () => {
    console.log("Copilot initialized");
    // Return mock initial context
    return {
      currentFilters: {
        dateRange: { start: "2024-01-01", end: "2024-12-31" },
        reportType: "analytics",
      },
      availableReports: ["salesReport", "analyticsReport", "performanceReport"],
      currentModule: "reports",
      businessInfo: {
        businessId: "business456",
        businessName: "Demo Business",
        businessType: "enterprise",
      },
      userInfo: {
        userId: "user123",
        userRole: "admin",
      },
    };
  },
  onAccept: (suggestion) => {
    console.log("Action accepted:", suggestion);
  },
  onReject: (suggestion) => {
    console.log("Action rejected:", suggestion);
  },
  promptCallBack: (prompt) => {
    console.log("Suggestion selected:", prompt);
  },
  selectRenderer: (items) => {
    console.log("List rendered with items:", items);
  },
  imageS3Callback: (action) => {
    console.log("Image selected from S3:", action);
  },
  onApplyChanges: (changes) => {
    console.log("Changes applied:", changes);
  },
  loadingTimeoutDuration: 60000, // Custom 60-second timeout for reports
};

// New story demonstrating Firebase/beAPIResource integration
export const WithFirebaseIntegration = (args) => <Copilot {...args} />;

WithFirebaseIntegration.args = {
  title: "ReportMate AI Assistant",
  placeholder: "Ask me about your business metrics...",
  userId: "user123",
  accountId: "account456",
  uniqueId: "unique789",
  uniqueSessionId: "session_abc123",
  maintainHistory: true,
  currentContext: {
    module: "dashboard",
    currentFilters: { dateRange: "Q3_2024" },
    businessInfo: {
      businessId: "business456",
      businessName: "Demo Business",
      businessType: "enterprise"
    }
  },
  
  // Mock apiHelper (beAPIResource)
  apiHelper: {
    post: async (url, payload) => {
      console.log("Mock API call to:", url, "with payload:", payload);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        sessionId: "mock_session_123",
        message: "API call successful"
      };
    },
    get: async (url) => {
      console.log("Mock GET request to:", url);
      return { data: "mock response" };
    }
  },
  
  // Mock API endpoints
  apiEndPoints: {
    init: {
      method: "post",
      url: "https://api.example.com/copilot/init",
      payload: {
        currentFilters: { dateRange: "Q3_2024" },
        availableReports: ["sales", "marketing", "finance"],
        currentModule: "dashboard",
        businessInfo: {
          businessId: "business456",
          businessName: "Demo Business", 
          businessType: "enterprise"
        },
        userInfo: {
          userId: "user123",
          userRole: "admin"
        }
      }
    },
    sendPrompt: {
      method: "post", 
      url: "https://api.example.com/copilot/send"
    }
  },
  
  // Mock Firebase database instance
  firebaseHelper: async () => {
    console.log("Mock: Getting Firebase database instance");
    
    // Mock Firebase ref object
    const mockRef = {
      ref: (path) => {
        console.log("Mock: Creating Firebase ref for path:", path);
        
        return {
          on: (event, callback) => {
            console.log("Mock: Setting up Firebase listener for event:", event);
            
            // Simulate Firebase messages after a delay
            setTimeout(() => {
              console.log("Mock: Simulating Firebase message");
              callback({
                val: () => ([
                  {
                    type: "heading",
                    level: 2,
                    content: "📊 Business Analytics Summary"
                  },
                  {
                    type: "text",
                    content: "Based on your current filters and available reports, here's what I found:"
                  },
                  {
                    type: "text",
                    content: "• **Q3 Performance**: Revenue increased by 18% compared to Q2\n• **Top Products**: Software subscriptions leading with 65% of revenue\n• **Customer Growth**: 156 new customers acquired this quarter"
                  },
                  {
                    type: "suggestions",
                    options: [
                      {
                        label: "Show detailed sales breakdown",
                        prompt: "generate Q3 sales analysis by region and product"
                      },
                      {
                        label: "Analyze customer acquisition trends", 
                        prompt: "analyze customer acquisition patterns for Q3"
                      },
                      {
                        label: "Compare with previous quarters",
                        prompt: "compare Q3 performance with Q1 and Q2"
                      }
                    ]
                  }
                ])
              });
            }, 2000);
          },
          off: () => {
            console.log("Mock: Turning off Firebase listener");
          }
        };
      }
    };
    
    return mockRef;
  },
  
  onInit: () => {
    console.log("Copilot initialization with Firebase integration");
    return {
      module: "dashboard",
      currentFilters: { dateRange: "Q3_2024" }
    };
  },
  
  payloadPreprocessor: (payload) => {
    console.log("Processing payload:", payload);
    return {
      ...payload,
      timestamp: new Date().toISOString(),
      version: "2.0"
    };
  },
  
  loadingTimeoutDuration: 120000, // Extended 2-minute timeout for Firebase integration
};

// ========== MESSAGE TYPE EXAMPLES ==========

// Story demonstrating all message block types
export const AllMessageTypes = (args) => <Copilot {...args} />;

AllMessageTypes.args = {
  title: "Message Types Demo",
  placeholder: "See all message types in action...",
  userId: "demo_user",
  accountId: "demo_account", 
  uniqueSessionId: "demo_session",
  maintainHistory: false,
  
  apiHelper: {
    post: async (url, payload) => {
      console.log("Mock API call for message types demo");
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    }
  },
  
  apiEndPoints: {
    init: {
      method: "post",
      url: "/api/init"
    }
  },
  
  firebaseHelper: async () => {
    const mockRef = {
      ref: (path) => ({
        on: (event, callback) => {
          // Simulate comprehensive message with all block types
          setTimeout(() => {
            callback({
              val: () => ([
                // 1. Heading Block
                {
                  type: "heading",
                  level: 1,
                  content: "🎯 Complete Message Types Demo"
                },
                
                // 2. Text Block with Markdown
                {
                  type: "text", 
                  content: "Welcome to the **complete message types demonstration**! This showcases all supported message block types:\n\n• Headings\n• Text with *markdown* support\n• Suggestions with actions\n• Cards with nested content\n• Action buttons\n• File upload handlers\n• Dividers"
                },
                
                // 3. Divider
                {
                  type: "divider"
                },
                
                // 4. Heading Level 2
                {
                  type: "heading",
                  level: 2,
                  content: "📊 Analytics Summary"
                },
                
                // 5. Card Block with nested content
                {
                  type: "card",
                  title: "Q3 Performance Report",
                  content: [
                    {
                      type: "text",
                      content: "**Key Metrics:**\n- Revenue: $2.4M (+18%)\n- Customers: 1,250 (+156 new)\n- Conversion Rate: 12.8% (+2.1%)"
                    },
                    {
                      type: "suggestions",
                      options: [
                        {
                          label: "View detailed breakdown",
                          prompt: "show detailed Q3 revenue breakdown by product"
                        },
                        {
                          label: "Compare with Q2",
                          prompt: "compare Q3 vs Q2 performance metrics"
                        }
                      ]
                    }
                  ],
                  highlights: [
                    "Highest quarterly revenue to date",
                    "Record customer acquisition",
                    "Improved conversion rates across all channels"
                  ]
                },
                
                // 6. Action Buttons
                {
                  type: "actions",
                  prompts: {
                    accept: "generate full quarterly report with these metrics",
                    reject: "show different time period analysis"
                  },
                  payload: {
                    reportType: "quarterly",
                    period: "Q3_2024",
                    metrics: ["revenue", "customers", "conversion"]
                  }
                },
                
                // 7. Another Divider
                {
                  type: "divider"
                },
                
                // 8. File Handle Block
                {
                  type: "fileHandle",
                  label: "Add supporting documents",
                  actions: [
                    {
                      type: "upload",
                      source: "system",
                      label: "Upload from computer"
                    },
                    {
                      type: "upload", 
                      source: "library",
                      label: "Choose from library"
                    },
                    {
                      type: "generate",
                      source: "ai",
                      label: "Generate with AI"
                    }
                  ]
                },
                
                // 9. Suggestions Block
                {
                  type: "suggestions",
                  options: [
                    {
                      label: "Generate sales forecast",
                      prompt: "create Q4 sales forecast based on Q3 trends"
                    },
                    {
                      label: "Customer segmentation analysis", 
                      prompt: "analyze customer segments and behavior patterns"
                    },
                    {
                      label: "Marketing campaign recommendations",
                      prompt: "suggest marketing campaigns for Q4 based on Q3 performance"
                    },
                    {
                      label: "Export this report",
                      prompt: "export Q3 performance report as PDF"
                    }
                  ]
                },
                
                // 10. Final Text Block
                {
                  type: "text",
                  content: "💡 **Tip**: Click any suggestion above to see how the selection state is preserved. Other suggestions will be eliminated once you make a choice!"
                }
              ])
            });
          }, 2000);
        },
        off: () => console.log("Mock Firebase listener off")
      })
    };
    return mockRef;
  },
  
  indexDbHelper: {
    get: () => Promise.resolve(null),
    set: (key, value) => {
      console.log("💾 Saving to IndexedDB:", key, value);
      return Promise.resolve();
    },
    delete: () => Promise.resolve(),
    getAllKeys: () => Promise.resolve([]),
    deleteStore: () => Promise.resolve()
  },
  
  onInit: () => ({
    module: "demo",
    showAllTypes: true
  }),
  
  onAccept: (payload) => {
    console.log("✅ Action accepted:", payload);
    return true; // Allows the action to proceed
  },
  
  onReject: (payload) => {
    console.log("❌ Action rejected:", payload);
  },
  
  promptCallBack: (prompt) => {
    console.log("🎯 Suggestion selected:", prompt);
  },

  selectRenderer: (items) => {
    console.log("🎯 list renderer:", items);
  },

  imageS3Callback: (action) => {
    console.log("�️ Image selected from S3:", action);
  },

  onApplyChanges: (changes) => {
    console.log("Changes applied:", changes);
  },

  onFileHandleClick: (action) => {
    console.log("📁 File action:", action);
    alert(`File action: ${action.label} (${action.type} from ${action.source})`);
  }
};

// Story demonstrating text and markdown variations
export const TextAndMarkdown = (args) => <Copilot {...args} />;

TextAndMarkdown.args = {
  title: "Text & Markdown Demo", 
  placeholder: "See text formatting examples...",
  userId: "text_demo_user",
  accountId: "text_demo_account",
  uniqueSessionId: "text_demo_session",
  
  apiHelper: { post: async () => ({ success: true }) },
  apiEndPoints: { 
    init: { method: "post", url: "/api/init" },
    sendPrompt: { method: "post", url: "/api/send" }
  },
  
  firebaseHelper: async () => ({
    ref: () => ({
      on: (event, callback) => {
        setTimeout(() => {
          callback({
            val: () => ([
              {
                type: "heading",
                level: 1,
                content: "📝 Text & Markdown Examples"
              },
              {
                type: "text",
                content: "**Bold text** and *italic text* work perfectly!"
              },
              {
                type: "text", 
                content: "Here's a list:\n\n1. First item\n2. Second item\n3. Third item\n\n• Bullet point\n• Another bullet\n• Last bullet"
              },
              {
                type: "text",
                content: "Code examples: `console.log('Hello')` and links: [Click here](https://example.com)"
              },
              {
                type: "text",
                content: "## Subheading in text\n\nParagraphs can contain **multiple formatting options** and even `inline code` mixed with *emphasis*."
              }
            ])
          });
        }, 1000);
      },
      off: () => {}
    })
  }),
  
  indexDbHelper: {
    get: () => Promise.resolve(null),
    set: () => Promise.resolve(),
    delete: () => Promise.resolve(),
    getAllKeys: () => Promise.resolve([]),
    deleteStore: () => Promise.resolve()
  },
  
  onInit: () => ({ textDemo: true })
};

// Story demonstrating suggestion variations
export const SuggestionVariations = (args) => <Copilot {...args} />;

SuggestionVariations.args = {
  title: "Suggestion Patterns",
  placeholder: "Try different suggestion patterns...",
  userId: "suggestion_user",
  accountId: "suggestion_account", 
  uniqueSessionId: "suggestion_session",
  
  apiHelper: { post: async () => ({ success: true }) },
  apiEndPoints: { 
    init: { method: "post", url: "/api/init" },
    sendPrompt: { method: "post", url: "/api/send" }
  },
  
  firebaseHelper: async () => ({
    ref: () => ({
      on: (event, callback) => {
        setTimeout(() => {
          callback({
            val: () => ([
              {
                type: "heading",
                level: 2,
                content: "🎯 Different Suggestion Patterns"
              },
              {
                type: "text",
                content: "**Simple text suggestions:**"
              },
              {
                type: "suggestions",
                options: [
                  "Show sales data",
                  "Generate report", 
                  "View analytics",
                  "Export results"
                ]
              },
              {
                type: "divider"
              },
              {
                type: "text",
                content: "**Object-based suggestions with custom prompts:**"
              },
              {
                type: "suggestions",
                options: [
                  {
                    label: "Quick sales overview",
                    prompt: "generate concise sales summary for last 30 days"
                  },
                  {
                    label: "Detailed financial analysis",
                    prompt: "create comprehensive financial analysis with charts and trends"
                  },
                  {
                    label: "Customer insights",
                    prompt: "analyze customer behavior patterns and segmentation"
                  }
                ]
              },
              {
                type: "divider"
              },
              {
                type: "text",
                content: "**Mixed format suggestions:**"
              },
              {
                type: "suggestions",
                options: [
                  "Simple option 1",
                  {
                    label: "Complex option with prompt",
                    prompt: "execute complex analysis with detailed parameters"
                  },
                  "Another simple option",
                  {
                    label: "Custom analytics request",
                    prompt: "run custom analytics query with user-defined filters"
                  }
                ]
              }
            ])
          });
        }, 1000);
      },
      off: () => {}
    })
  }),
  
  indexDbHelper: {
    get: () => Promise.resolve(null),
    set: () => Promise.resolve(),
    delete: () => Promise.resolve(), 
    getAllKeys: () => Promise.resolve([]),
    deleteStore: () => Promise.resolve()
  },
  
  onInit: () => ({ suggestionDemo: true }),
  
  promptCallBack: (prompt) => {
    console.log("🎯 Selected suggestion prompt:", prompt);
    alert(`Selected: ${prompt}`);
  }
};

// Story demonstrating card and action combinations
export const CardsAndActions = (args) => <Copilot {...args} />;

CardsAndActions.args = {
  title: "Cards & Actions Demo",
  placeholder: "Interactive cards and actions...",
  userId: "cards_user",
  accountId: "cards_account",
  uniqueSessionId: "cards_session",
  
  apiHelper: { post: async () => ({ success: true }) },
  apiEndPoints: { 
    init: { method: "post", url: "/api/init" },
    sendPrompt: { method: "post", url: "/api/send" }
  },
  
  firebaseHelper: async () => ({
    ref: () => ({
      on: (event, callback) => {
        setTimeout(() => {
          callback({
            val: () => ([
              {
                type: "heading",
                level: 2,
                content: "📋 Cards with Nested Content"
              },
              {
                type: "card",
                title: "Sales Performance Card",
                content: [
                  {
                    type: "text",
                    content: "**Current Month Performance:**\n- Revenue: $485K\n- Growth: +23%\n- New Customers: 89"
                  },
                  {
                    type: "suggestions",
                    options: [
                      {
                        label: "See monthly breakdown",
                        prompt: "show detailed monthly sales breakdown"
                      },
                      {
                        label: "Compare with last month",
                        prompt: "compare current month with previous month"
                      }
                    ]
                  }
                ],
                highlights: [
                  "Best performing month this quarter",
                  "Exceeded target by 15%",
                  "Highest customer acquisition rate"
                ]
              },
              {
                type: "actions",
                prompts: {
                  accept: "schedule automated monthly report with these metrics",
                  reject: "show different metrics or time period"
                },
                payload: {
                  reportType: "monthly",
                  metrics: ["revenue", "growth", "customers"],
                  period: "current_month"
                }
              },
              {
                type: "divider"
              },
              {
                type: "card",
                title: "Marketing Campaign Results",
                content: "**Campaign Performance:**\n\n📧 Email Campaign: 4.2% CTR\n📱 Social Media: 12K engagements\n🎯 PPC Ads: $2.30 CPC\n\n*Overall ROI: 340%*",
                highlights: [
                  "Email CTR above industry average",
                  "Social engagement increased 45%",
                  "PPC costs reduced by 18%"
                ]
              }
            ])
          });
        }, 1000);
      },
      off: () => {}
    })
  }),
  
  indexDbHelper: {
    get: () => Promise.resolve(null),
    set: () => Promise.resolve(),
    delete: () => Promise.resolve(),
    getAllKeys: () => Promise.resolve([]),
    deleteStore: () => Promise.resolve()
  },
  
  onInit: () => ({ cardsDemo: true }),
  
  onAccept: (payload) => {
    console.log("✅ Card action accepted:", payload);
    alert(`Accepted action for ${payload.reportType} report`);
    return true;
  },
  
  onReject: (payload) => {
    console.log("❌ Card action rejected:", payload);
    alert(`Rejected action for ${payload.reportType} report`);
  }
};

// Story demonstrating file handling and image blocks
export const FilesAndImages = (args) => <Copilot {...args} />;

FilesAndImages.args = {
  title: "Files & Images Demo",
  placeholder: "File upload and image examples...", 
  userId: "files_user",
  accountId: "files_account",
  uniqueSessionId: "files_session",
  
  apiHelper: { post: async () => ({ success: true }) },
  apiEndPoints: { 
    init: { method: "post", url: "/api/init" },
    sendPrompt: { method: "post", url: "/api/send" }
  },
  
  firebaseHelper: async () => ({
    ref: () => ({
      on: (event, callback) => {
        setTimeout(() => {
          callback({
            val: () => ([
              {
                type: "heading",
                level: 2,
                content: "📁 File Handling & Images"
              },
              {
                type: "text",
                content: "**File Upload Options:**"
              },
              {
                type: "fileHandle",
                label: "Upload supporting documents",
                actions: [
                  {
                    type: "upload",
                    source: "system", 
                    label: "Upload from computer"
                  },
                  {
                    type: "upload",
                    source: "library",
                    label: "Choose from media library"
                  },
                  {
                    type: "generate",
                    source: "ai",
                    label: "Generate with AI"
                  }
                ]
              },
              {
                type: "divider"
              },
              {
                type: "text",
                content: "**Specialized File Actions:**"
              },
              {
                type: "fileHandle",
                label: "Document processing",
                actions: [
                  {
                    type: "scan",
                    source: "camera",
                    label: "Scan document"
                  },
                  {
                    type: "import",
                    source: "cloud",
                    label: "Import from cloud storage"
                  },
                  {
                    type: "create",
                    source: "template",
                    label: "Create from template"
                  }
                ]
              },
              {
                type: "divider"
              },
              {
                type: "text",
                content: "**Image Display:**"
              },
              {
                type: "image",
                src: "https://picsum.photos/400/200?random=1",
                alt: "Sample image from Picsum",
                caption: "This is a sample image with caption"
              },
              {
                type: "text",
                content: "Images can also be embedded inline with content for richer messaging experiences."
              }
            ])
          });
        }, 1000);
      },
      off: () => {}
    })
  }),
  
  indexDbHelper: {
    get: () => Promise.resolve(null),
    set: () => Promise.resolve(),
    delete: () => Promise.resolve(),
    getAllKeys: () => Promise.resolve([]),
    deleteStore: () => Promise.resolve()
  },
  
  onInit: () => ({ filesDemo: true }),
  
  onFileHandleClick: (action) => {
    console.log("📁 File action clicked:", action);
    alert(`File action: ${action.label}\nType: ${action.type}\nSource: ${action.source}`);
  }
};

// Story demonstrating edge cases and fallback
export const EdgeCasesAndFallback = (args) => <Copilot {...args} />;

EdgeCasesAndFallback.args = {
  title: "Edge Cases & Fallback",
  placeholder: "Testing edge cases and unknown types...",
  userId: "edge_user", 
  accountId: "edge_account",
  uniqueSessionId: "edge_session",
  
  apiHelper: { post: async () => ({ success: true }) },
  apiEndPoints: { 
    init: { method: "post", url: "/api/init" },
    sendPrompt: { method: "post", url: "/api/send" }
  },
  
  firebaseHelper: async () => ({
    ref: () => ({
      on: (event, callback) => {
        setTimeout(() => {
          callback({
            val: () => ([
              {
                type: "heading",
                level: 2,
                content: "🧪 Edge Cases & Fallback Handling"
              },
              {
                type: "text",
                content: "**Testing various edge cases and unknown message types:**"
              },
              {
                type: "divider"
              },
              // Empty content
              {
                type: "text",
                content: ""
              },
              // Unknown type - should trigger fallback
              {
                type: "unknown_type",
                content: "This is an unknown message type that should be handled by FallbackBlock",
                someCustomProp: "custom value"
              },
              // Heading with very long content
              {
                type: "heading",
                level: 3,
                content: "This is a very long heading that tests how the component handles lengthy heading text that might wrap across multiple lines"
              },
              // Suggestions with empty options
              {
                type: "suggestions",
                options: []
              },
              // Actions with missing prompts
              {
                type: "actions",
                payload: { incomplete: "data" }
              },
              // Card with mixed content types
              {
                type: "card",
                title: "Mixed Content Card",
                content: [
                  {
                    type: "text",
                    content: "Regular text content"
                  },
                  {
                    type: "unknown_nested_type",
                    content: "Unknown nested type"
                  },
                  {
                    type: "heading",
                    level: 4,
                    content: "Nested heading"
                  }
                ],
                highlights: [
                  "Testing nested unknown types",
                  "Verifying fallback behavior",
                  "Mixed content handling"
                ]
              },
              // File handle with missing actions
              {
                type: "fileHandle",
                label: "File handle without actions"
              },
              // Another unknown type
              {
                type: "custom_widget",
                widget_type: "chart",
                data: { x: [1, 2, 3], y: [4, 5, 6] },
                config: { responsive: true }
              }
            ])
          });
        }, 1000);
      },
      off: () => {}
    })
  }),
  
  indexDbHelper: {
    get: () => Promise.resolve(null),
    set: () => Promise.resolve(),
    delete: () => Promise.resolve(),
    getAllKeys: () => Promise.resolve([]),
    deleteStore: () => Promise.resolve()
  },
  
  onInit: () => ({ edgeDemo: true }),
  
  onFileHandleClick: (action) => {
    console.log("📁 File action (edge case):", action);
  }
};

// Story demonstrating error message handling
export const ErrorHandling = (args) => <Copilot {...args} />;

ErrorHandling.args = {
  title: "Error Handling Demo",
  placeholder: "Test error scenarios...",
  userId: "error_user",
  accountId: "error_account", 
  uniqueSessionId: "error_session",
  maintainHistory: false,
  
  apiHelper: {
    post: async (url, payload) => {
      console.log("Mock API call for error demo");
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true };
    }
  },
  
  apiEndPoints: {
    init: {
      method: "post",
      url: "/api/init"
    }
  },
  
  firebaseHelper: async () => {
    const mockRef = {
      ref: (path) => ({
        on: (event, callback) => {
          // Simulate a successful response first
          setTimeout(() => {
            callback({
              val: () => ({
                status: {
                  processing: false,
                  label: ""
                },
                blocks: [
                  {
                    type: "heading",
                    level: 2,
                    content: "🚨 Error Handling Examples"
                  },
                  {
                    type: "text",
                    content: "This demo shows how different types of errors are handled in the Copilot interface. Below you'll see examples of error messages with proper styling."
                  },
                  {
                    type: "divider"
                  },
                  {
                    type: "text",
                    content: "**Example 1: Regular error message**"
                  },
                  {
                    type: "error",
                    content: "An error occurred while processing your request. Please try again later."
                  },
                  {
                    type: "text",
                    content: "**Example 2: API error message**"
                  },
                  {
                    type: "error", 
                    content: "Failed to connect to the server. Please check your internet connection and try again."
                  },
                  {
                    type: "text",
                    content: "**Example 3: Validation error message**"
                  },
                  {
                    type: "error",
                    content: "Invalid input format. Please ensure your data follows the required format and try again."
                  },
                  {
                    type: "text",
                    content: "**Example 4: Permission error message**"
                  },
                  {
                    type: "error",
                    content: "You don't have permission to access this resource. Please contact your administrator for assistance."
                  },
                  {
                    type: "divider"
                  },
                  {
                    type: "text",
                    content: "Notice how error messages are displayed with:\n\n• Light red background (#FEECEB)\n• Dark red text (#721C24)\n• Rounded corners (4px border-radius)\n• Proper padding (8px)\n\nThis styling helps users quickly identify and understand error conditions."
                  },
                  {
                    type: "suggestions",
                    options: [
                      {
                        label: "Trigger API error",
                        prompt: "simulate a server error response"
                      },
                      {
                        label: "Trigger timeout error", 
                        prompt: "simulate a request timeout"
                      },
                      {
                        label: "Trigger validation error",
                        prompt: "simulate invalid data format"
                      }
                    ]
                  }
                ]
              })
            });
          }, 1000);
          
          // Then simulate an error response after 5 seconds
          setTimeout(() => {
            callback({
              val: () => ({
                status: {
                  processing: false,
                  label: "",
                  error: {
                    code: 400,
                    message: "This is a simulated Firebase error for demonstration purposes"
                  }
                },
                blocks: []
              })
            });
          }, 5000);
        },
        off: () => console.log("Mock Firebase listener off")
      })
    };
    return mockRef;
  },
  
  indexDbHelper: {
    get: () => Promise.resolve(null),
    set: (key, value) => {
      console.log("💾 Saving to IndexedDB:", key, value);
      return Promise.resolve();
    },
    delete: () => Promise.resolve(),
    getAllKeys: () => Promise.resolve([]),
    deleteStore: () => Promise.resolve()
  },
  
  onInit: () => ({
    module: "error_demo",
    showErrorExamples: true
  }),
  
  promptCallBack: (prompt) => {
    console.log("🎯 Error demo suggestion selected:", prompt);
    
    // Simulate different error responses based on selection
    if (prompt.includes("server error")) {
      console.log("💥 Simulating server error...");
    } else if (prompt.includes("timeout")) {
      console.log("⏰ Simulating timeout error...");
    } else if (prompt.includes("validation")) {
      console.log("⚠️ Simulating validation error...");
    }
  }
};
