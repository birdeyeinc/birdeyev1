// Mock data for development and testing purposes
// This file contains dummy chat history data used during development

/**
 * Dummy chat history data for testing the Copilot component
 * @type {Array<Object>} Array of chat objects with messages
 */
export const dummyChatHistory = [
  {
    id: "chat_1",
    date: "2025-07-14",
    dateFormatted: "14 July 2025",
    title: "Q2 Marketing Analysis",
    messages: [
      {
        id: 1,
        text: "Can you provide a summary of Q2 marketing performance?",
        sender: "user",
        timestamp: "2025-07-14T10:30:00Z"
      },
      {
        id: 2,
        type: "text",
        blocks: [
          {
            type: "text",
            content: `**Q2 Marketing Performance Summary:**

1. **Campaign Performance:** 15% increase in engagement
2. **Lead Generation:** 230 new qualified leads
3. **ROI:** 2.3x return on ad spend

Overall, Q2 showed strong performance across all channels.`
          }
        ],
        sender: "bot",
        timestamp: "2025-07-14T10:30:30Z"
      }
    ]
  },
  {
    id: "chat_2",
    date: "2025-07-13",
    dateFormatted: "13 July 2025",
    title: "Sales Dashboard Insights",
    messages: [
      {
        id: 1,
        text: "What insights can you provide from the sales dashboard?",
        sender: "user",
        timestamp: "2025-07-13T14:20:00Z"
      },
      {
        id: 2,
        type: "text",
        blocks: [
          {
            type: "text",
            content: `**Sales Dashboard Insights:**

• **Top Performing Region:** North America (45% of total sales)
• **Growth Trend:** 12% MoM increase
• **Key Products:** Software licenses leading with 60% revenue share

The dashboard shows consistent growth patterns.`
          }
        ],
        sender: "bot",
        timestamp: "2025-07-13T14:20:45Z"
      }
    ]
  },
  {
    id: "chat_3", 
    date: "2025-07-12",
    dateFormatted: "12 July 2025",
    title: "Customer Feedback Analysis",
    messages: [
      {
        id: 1,
        text: "Analyze the latest customer feedback trends",
        sender: "user",
        timestamp: "2025-07-12T09:15:00Z"
      },
      {
        id: 2,
        type: "text",
        blocks: [
          {
            type: "text",
            content: `**Customer Feedback Analysis:**

**Positive Trends:**
- 87% satisfaction rate (up 5% from last month)
- Improved response time ratings
- Strong product feature appreciation

**Areas for Improvement:**
- Mobile app performance (23% of complaints)
- Documentation clarity

Customer sentiment is generally positive with clear improvement areas identified.`
          }
        ],
        sender: "bot",
        timestamp: "2025-07-12T09:15:25Z"
      }
    ]
  }
];
