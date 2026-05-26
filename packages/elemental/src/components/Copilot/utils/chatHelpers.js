// Utility functions for Copilot chat logic

/**
 * Build a new message object for chat
 * @param {Object} message - The message input (text, content, type, sender, etc.)
 * @returns {Object} - The constructed message object
 */
export function buildMessageObject(message) {
  
  if (message?.sender === 'bot') {
    let blockArray = message?.blocks || message?.block || [];
    let uniqueMessageComponentId = Date.now() + Math.random()
    blockArray.map((block, index) => {
      if(!block.componentId){
        block.componentId = uniqueMessageComponentId + "-block-" + index;
      }
    })
  }

  return {
    id: Date.now() + Math.random(),
    text: message.text,
    content: message.content, // For complex message types
    type: message.type || "text", // Message type (text, heading, card, etc.)
    sender: message.sender, // 'user' or 'bot'
    timestamp: new Date().toISOString(),
    ...message, // Spread other properties for complex message types
  };
}
